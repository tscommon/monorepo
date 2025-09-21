import { AbstractAsyncBatchResolver, type Task } from '../src/index.js';

interface User {
  readonly id: number;
  readonly name: string;
}

class UserLoader extends AbstractAsyncBatchResolver<number, User> {
  private readonly _db: Record<number, User> = {
    1: { id: 1, name: 'Alice' },
    2: { id: 2, name: 'Bob' },
    3: { id: 3, name: 'Charlie' },
  };

  protected override getKey(userId: number): number {
    return userId;
  }

  protected override async onResolve(tasks: Map<number, Task<number, User>>): Promise<void> {
    tasks.forEach((task) => {
      console.log('Loading user', task.input);
      const user = this._db[task.input];
      if (user) task.resolve(user);
      else task.reject(new Error('User not found'));
      tasks.delete(this.getKey(task.input));
    });
  }
}

const loader = new UserLoader();

const events = [
  { userId: 1, action: 'view' },
  { userId: 2, action: 'edit' },
  { userId: 3, action: 'delete' },
  { userId: 4, action: 'create' },
  { userId: 1, action: 'logout' },
  { userId: 2, action: 'login' },
  { userId: 3, action: 'signup' },
];

await Promise.all(
  events.map(async (event) => {
    try {
      const user = await loader.get(event.userId);
      console.log(`User ${user.name} performed ${event.action}`);
    } catch (error) {
      console.log(`User with ID ${event.userId} not found`);
    }
  }),
);
