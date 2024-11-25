import express from "express"
import { Request, Response, NextFunction } from "express"

import config from "../config/project"
import crypto from "crypto"
import fs from "fs"
import jwt from "jsonwebtoken"
import { JwtPayload, VerifyErrors } from "jsonwebtoken"
import logger from "../lib/logger"
import path from "path"

const rootPath = process.cwd()

const router = express.Router()

router.route("/public-key")
.get((req: Request, res: Response) => {
  let publicKey: string
  try {
    publicKey = fs.readFileSync(path.join(rootPath, config.https.publicKey), "utf8")
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`${ err.name }: ${ err.message }`)
    }
    // Internal Server Error
    return res.status(500).json({
      msg: "Contact an administrator."
    })
  }

  // OK
  return res.status(200).json({
    msg: "Use the public key for encryption.",
    key: publicKey
  })
})
.all((req: Request, res: Response) => {
  // Method Not Allowed
  return res.status(405).json({
    msg: "GET method is only supported."
  })
})


router.route("/login")
.post((req: Request, res: Response) => {
  if (req.body.username === undefined || req.body.password === undefined) {
    // Bad Request
    return res.status(400).json({
      msg: "Username and password are required. (param name: username, password)"
    })
  }

  const username = String(req.body.username)
  let password = String(req.body.password)

  if (!!req.body.encrypted) {
    let privateKey: string
    try {
      privateKey = fs.readFileSync(path.join(rootPath, config.https.privateKey), "utf8")
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`${ err.name }: ${ err.message }`)
      }
      // Internal Server Error
      return res.status(500).json({
        msg: "Contact an administrator."
      })
    }
    password = crypto.privateDecrypt(privateKey, Buffer.from(password, "base64")).toString()
  }

  // TODO: Add your user authentication logic
  /*
  if (password) {
    // Unauthorized
    return res.status(401).json({
      msg: "Username or password is incorrect."
    })
  }
  */

  // OK
  const token = jwt.sign({
    iss: config.project.name,
    sub: "token-" + config.project.name,
    usr: username,
    als: username,
    prv: "root"
  }, config.project.name, { expiresIn: config.auth.tokenAlivePeriod })
  return res.status(200).json({
    msg: "Authentication successfully.",
    token: token
  })
})
.all((req: Request, res: Response) => {
  // Method Not Allowed
  return res.status(405).json({
    msg: "POST method is only supported."
  })
})


router.use((req: Request, res: Response, next: NextFunction) => {
  if (config.auth.allowWithoutToken) {
    req.token = {
      iss: config.project.name,
      sub: "token-" + config.project.name,
      iat: 0,
      exp: 0,
      usr: "anonymous",
      als: "anonymous",
      prv: "anonymous"
    }
    return next()
  }

  const token = String(req.query.token) || String(req.body.token) || String(req.header("X-Access-Token"))
  if (!token) {
    // Unauthorized
    return res.status(401).json({
      msg: "Access token is required. (param name: token)"
    })
  }

  jwt.verify(token, config.project.name, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
    if (err) {
      if (err instanceof Error) {
        logger.error(`${ err.name }: ${ err.message }`)
      }
      // Unauthorized
      return res.status(401).json({
        msg: `Access token is invalid. (reason: ${ err.message })`
      })
    }

    if (typeof decoded !== "string" || decoded === undefined) {
      req.token = {
        iss: decoded?.iss || "unknown",
        sub: decoded?.sub || "unknown",
        iat: decoded?.iat || 0,
        exp: decoded?.exp || 0,
        usr: decoded?.usr || "anonymous",
        als: decoded?.als || "anonymous",
        prv: decoded?.prv || "anonymous"
      }
    }
    return next()
  })

  return
})


router.route("/token")
.get((req: Request, res: Response) => {
  // OK
  return res.status(200).json({
    msg: "You get your token information.",
    iss: req.token?.iss || "unknown",
    sub: req.token?.sub || "unknown",
    iat: req.token?.iat || 0,
    exp: req.token?.exp || 0,
    issuedDate: (new Date((req.token?.iat || 0) * 1000)).toLocaleString("ja"),
    expirationDate: (new Date((req.token?.exp || 0) * 1000)).toLocaleString("ja")
  })
})
.all((req: Request, res: Response) => {
  // Method Not Allowed
  return res.status(405).json({
    msg: "GET method is only supported."
  })
})


router.route("/hello")
.get((req: Request, res: Response) => {
  // OK
  return res.status(200).json({
    msg: `Hello ${ req.token?.usr || "someone" }!`
  })
})
.all((req: Request, res: Response) => {
  // Method Not Allowed
  return res.status(405).json({
    msg: "GET method is only supported."
  })
})

export default router
