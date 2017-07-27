import * as express from 'express';
import * as passport from 'passport';
import { Request, Response, Express } from "express";
import { Controller, Get } from "~/server/decorators/Controller";
import {oauthCallback} from "~/server/config/passport/passport";
import * as jwtMiddleware from '~/server/config/middleware/jwtMiddleware';

@Controller("/auth")
export class AuthController{
  constructor(){

     }



  @Get("/token")
  token(req:Request, res:Response){
    console.log('token');
    const user = req.user;
    const token = jwtMiddleware.generateToken(user);
    res.json({
      user,
      token
    });
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