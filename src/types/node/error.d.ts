interface NodeSystemError extends Error {
  address?: string
  code: string
  dest: string
  errno: number
  info?: Object
  message: string
  path?: string
  port?: number
  syscall: string
}
