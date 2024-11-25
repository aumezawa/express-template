import config from "../config/project"
import log4js from "log4js"
import path from "path"

const rootPath = process.cwd()

log4js.configure({
  appenders: {
    console: {
      type: "console",
      layout: {
        type: "pattern",
        pattern: "[%d] [%p] - [%z]: %m"
      },
    },
    file: {
      type: "file",
      filename: path.join(rootPath, config.logger.file),
      maxLogSize: 1 * 1024 * 1024 * 1024,
      backups: 100,
      layout: {
        type: "pattern",
        pattern: "[%d] [%p] - [%z]: %m"
      },
      compress: false,
      keepFileExt: true,
      encoding: "utf-8"
    }
  },
  categories: {
    default: {
      appenders: ["file"],
      level: process.env.LOGLEVEL || "info",
      enableCallStack: false
    },
    console: {
      appenders: ["console"],
      level: process.env.LOGLEVEL || "info",
      enableCallStack: false
    }
  }
})

export default log4js.getLogger(process.env.LOGOUT || "default")
