import { Request } from "express"

declare module "express" {
  interface Request {
    token?: {
      iss: string,
      sub: string,
      iat: number,
      exp: number,
      usr: string,
      als: string,
      prv: string
    }
  }
}
