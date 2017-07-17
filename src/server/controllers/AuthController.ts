import * as express from "express";

import { Request, Response } from "express";
import { Controller, Get } from "~/server/decorators/Controller";

const router = express.Router();

@Controller("/auth")
export class AuthController{
  
  @Get("/login")
  login(req:Request, res:Response){
    res.json({'data':true})
  }

  @Get("/error")
  async error(req:Request, res:Response){
    res.json({'data':false})
    throw new Error("ups")
  }
}