import { Task } from '@tscommon/task';
import { describe, expect, it, vi } from 'vitest';
import { AbstractBatchResolver } from './AbstractBatchResolver';
import { RedundantTaskError } from './RedundantTaskError';

interface User {
  readonly id: number;
  readonly name: string;
}

describe('AbstractBatchResolver', () => {
  it('resolves tasks', async () => {
    class FetchUserById extends AbstractBatchResolver<number, User> {
      static readonly #db = new Map<number, User>([
        [1, { id: 1, name: 'User1' }],
        [2, { id: 2, name: 'User2' }],
      ]);

      public override getKey(userId: number): number {
        return userId;
      }

      protected override async onResolve(tasks: Map<number, Task<number, User>>): Promise<void> {
        tasks.forEach((task, userId) => {
          const user = FetchUserById.#db.get(userId);
          if (user) task.resolve(user);
          else task.reject(new Error(`User with id ${userId} not found`));
          tasks.delete(this.getKey(task.input));
        });
      }
    }

    const users = new FetchUserById();
    // @ts-expect-error testing private field
    const onResolve = vi.spyOn(users, 'onResolve');

    await expect(
      Promise.allSettled([users.resolve(1), users.resolve(2), users.resolve(3), users.resolve(1)]),
    ).resolves.toStrictEqual([
      { status: 'rejected', reason: new RedundantTaskError() },
      { status: 'fulfilled', value: { id: 2, name: 'User2' } },
      { status: 'rejected', reason: new Error('User with id 3 not found') },
      { status: 'fulfilled', value: { id: 1, name: 'User1' } },
    ]);

    expect(onResolve).toHaveBeenCalledOnce();
  });

  it('rejects unresolved tasks', async () => {
    class FetchUserById extends AbstractBatchResolver<number, User> {
      public override getKey(userId: number): number {
        return userId;
      }

      protected override async onResolve(_tasks: Map<number, Task<number, User>>): Promise<void> {
        // do nothing
      }
    }

    const users = new FetchUserById();
    // @ts-expect-error testing private field
    const onResolve = vi.spyOn(users, 'onResolve');
    await expect(users.resolve(1)).rejects.toThrowError(new Error('Task not resolved'));
    expect(onResolve).toHaveBeenCalledOnce();
  });
});
