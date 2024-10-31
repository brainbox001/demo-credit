import { Request, Response, NextFunction } from "express";

export default async function parser(req:Request, res:Response, next:NextFunction) {
    for (let val in req.body) {
        if (val === 'status' || val === 'email' || val === 'name' || val === 'password') continue;
        else req.body[val] = parseInt(req.body[val]);
    }
    next();
};