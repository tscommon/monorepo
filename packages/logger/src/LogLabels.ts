/**
 * A map of key-value pairs that provides additional context to a log entry.
 *
 * **Example:**
 *
 * ```typescript
 * { requestId: '12345', userId: '54321' }
 * ```
 */
export type LogLabels = Record<string, string | undefined>;
