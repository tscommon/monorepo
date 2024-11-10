/**
 * Additional data to be logged.
 *
 * **Example:**
 *
 * ```typescript
 * { port: 3000 }
 * { error: new Error('Something went wrong.') }
 * { status: 500, error: new Error('Something went wrong.') }
 * ```
 *
 * **Deeply nested data:**
 *
 * ```typescript
 * { user: { id: 1, name: 'Alice', friends: [{ id: 2, name: 'Bob' }] } }
 * // If maximum depth of the data to collect is 2.
 * { user: { id: 1, name: 'Alice', friends: '[[Truncated]]' } }
 * ```
 */
export type LogPayload = Record<string, unknown>;
