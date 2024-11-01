import { Request, Response, NextFunction } from "express";

export default async function parser(req:Request, res:Response, next:NextFunction) {
    for (let val in req.body) {
        if (val === 'status' || val === 'email' || val === 'name') {
            let newVal : string = req.body[val];
            req.body[val] = newVal.toLowerCase();

        } 
        else if (val === 'password') {
            let newVal = req.body[val];
            req.body[val] = newVal.toString();
        }
        else {
            req.body[val] = parseInt(req.body[val]);
            if(val === 'phoneNumber') {
                let number = req.body[val];
                let accNo = Math.floor(number/10);
                req.body[val] = accNo;
            }
        }
    }
    next();
};