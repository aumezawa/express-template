import express from "express"
import { Request, Response, NextFunction } from "express"

const router = express.Router()

router.route("*")
.all((req: Request, res: Response) => {
  // Not Found
  return res.status(404).json({
    msg: "No resource found."
  })
})

export default router
