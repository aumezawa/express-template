import express from "express"

import config from "../config/project"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"
import hpp from "hpp"
import logger from "../lib/express-logger"

import rootRouter from "../routes/root"
import authRouter from "../routes/auth"

import apiV1Router from "../routes/api-v1"

const app = express()

app.use(logger())
app.use(cors(config.cors))
app.use(hpp())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/v1", authRouter)
app.use("/api/v1", apiV1Router)
app.use("/", rootRouter)

export default app
