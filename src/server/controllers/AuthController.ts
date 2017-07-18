import * as express from "express";
import * as passport from 'passport';
import { Request, Response, Express } from "express";
import { Controller, Get } from "~/server/decorators/Controller";
import {oauthCallback} from "~/server/config/passport/passport";

@Controller("/auth")
export class AuthController{
  constructor(){
    
     }


  
  @Get("/logout")
  logout(req:Request, res:Response){
    console.log('logout');
  }

  @Get("/error")
  async error(req:Request, res:Response){
    res.json({'data':false})
    throw new Error("ups")
  }
}