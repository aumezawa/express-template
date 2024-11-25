import { Request, Response } from "express"
import log4js from "log4js"
import logger from "./logger"

export default () => {
  return log4js.connectLogger(logger, {
    level: "auto",
    format: (req: Request, res: Response, formatter: ((str: string) => string)) => (
      formatter(`${ req.protocol.toUpperCase() }/:http-version :method :status [${ req.token?.usr || "unknown" } (:remote-addr)] :url - :user-agent - :response-time ms`)
    )
  })
}
