// REPL Command
export default interface Command {
  name(): string
  execute(query?: string): void | Promise<void>
  complete(
    line: string,
    cb: (err: Error | undefined, hits: [string[], string]) => void,
    query?: string
  ): void | Promise<void>
  help(): string
}
