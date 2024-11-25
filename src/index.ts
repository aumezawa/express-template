import app from "./lib/app"
import config from "./config/project"
import fs from "fs"
import http from "http"
import https from "https"
import logger from "./lib/logger"
import path from "path"

/**
 * Get root directory.
 */

const rootPath = process.cwd()

/**
 * Create HTTP server.
 */

if (config.http.enable) {
  const http_server = http.createServer(app)
  const http_port = config.http.port
  http_server.timeout = config.http.timeout
  http_server.listen(http_port)
  http_server.on("error", (err: NodeSystemError) => {
    if (err.syscall !== "listen") {
      throw err
    }

    // handle specific listen errors with friendly messages
    switch (err.code) {
      case "EACCES":
        console.log(`Error: port ${ http_port } requires elevated privileges`)
        process.exit(-1)
      case "EADDRINUSE":
        console.log(`Error: port ${ http_port } is already in use`)
        process.exit(-1)
      default:
        throw err
    }
  })
  http_server.on("listening", () => {
    const address = http_server.address() || "Unknown"
    const port = (typeof address === "string") ? address : address.port
    logger.info(`HTTP server is listening on port ${ port }`)
  })
}

/**
 * Create HTTPS server.
 */

if (config.https.enable) {
  const https_server = https.createServer({
    key : fs.readFileSync(path.join(rootPath, config.https.privateKey)),
    cert: fs.readFileSync(path.join(rootPath, config.https.certification))
  }, app)
  const https_port = config.https.port
  https_server.timeout = config.https.timeout
  https_server.listen(https_port)
  https_server.on("error", (err: NodeSystemError) => {
    if (err.syscall !== "listen") {
      throw err
    }

    // handle specific listen errors with friendly messages
    switch (err.code) {
      case "EACCES":
        console.log(`Error: port ${ https_port } requires elevated privileges`)
        process.exit(1)
      case "EADDRINUSE":
        console.log(`Error: port ${ https_port } is already in use`)
        process.exit(1)
      default:
        throw err
    }
  })
  https_server.on("listening", () => {
    const address = https_server.address() || "Unknown"
    const port = (typeof address === "string") ? address : address.port
    logger.info(`HTTPS server is listening on port ${ port }`)
  })
}
