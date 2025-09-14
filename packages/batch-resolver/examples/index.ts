import type { Task } from '@tscommon/task';
import { AbstractBatchResolver } from '../src';

type Document = {
  id: number;
  name: string;
};

type DocumentEvent =
  | { kind: 'create'; id: number; name: string }
  | { kind: 'update'; id: number; name: string }
  | { kind: 'delete'; id: number };

class EventHandler extends AbstractBatchResolver<DocumentEvent, void, string> {
  readonly #database: Map<number, Document>;

  public constructor(database: Map<number, Document>) {
    super();
    this.#database = database;
  }

  public override getKey(event: DocumentEvent): string {
    return `${event.kind}:${event.id}`;
  }

  protected override async onResolve(tasks: Map<string, Task<DocumentEvent, void>>): Promise<void> {
    tasks.forEach((task) => {
      const { input: event } = task;
      switch (event.kind) {
        case 'create': {
          if (this.#database.has(event.id)) {
            task.reject(new Error(`Document with id ${event.id} already exists`));
            tasks.delete(this.getKey(event));
            break;
          }
          this.#database.set(event.id, { id: event.id, name: event.name });
          task.resolve();
          tasks.delete(this.getKey(event));
          break;
        }
        case 'update': {
          const doc = this.#database.get(event.id);
          if (!doc) {
            task.reject(new Error(`Document with id ${event.id} not found`));
            tasks.delete(this.getKey(event));
            break;
          }
          doc.name = event.name;
          task.resolve();
          tasks.delete(this.getKey(event));
          break;
        }
        case 'delete': {
          if (!this.#database.has(event.id)) {
            task.reject(new Error(`Document with id ${event.id} not found`));
            tasks.delete(this.getKey(event));
            break;
          }
          this.#database.delete(event.id);
          task.resolve();
          tasks.delete(this.getKey(event));
          break;
        }
      }
    });
  }
}

const events: DocumentEvent[] = [
  { kind: 'create', id: 1, name: 'Document 1' },
  // @code/highlight
  { kind: 'update', id: 1, name: 'Document 1 - New' }, // will be deduplicated
  { kind: 'create', id: 2, name: 'Document 2' },
  { kind: 'update', id: 1, name: 'Document 1 - Latest' },
  { kind: 'delete', id: 2 },
];

async function main() {
  // @code/highlight
  const database = new Map<number, Document>(); // In-memory database

  const handler = new EventHandler(database);

  await Promise.allSettled(events.map((e) => handler.resolve(e)));

  console.table(Object.fromEntries(database));

  // ┌─────────┬────┬───────────────────────┐
  // │ (index) │ id │ name                  │
  // ├─────────┼────┼───────────────────────┤
  // │ 1       │ 1  │ 'Document 1 - Latest' │
  // └─────────┴────┴───────────────────────┘
}

void main();
