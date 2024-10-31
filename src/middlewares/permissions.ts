import { Request, Response, NextFunction } from "express";
import db from "../dbConfig/dbConfig";

export async function isAuthenticated(req:Request, res:Response, next:NextFunction) : Promise<any> {
    const cookies = req.cookies;
    const session = cookies.session;
    if(!session) return res.status(401).json({error : 'Unauthorized request'});
    const {email, password} = JSON.parse(session);
    const user = await db('users').where({ email }).first().select('password', 'accountNumber');
    if(!user || password !== user.password) return res.status(401).json({error : 'Unauthorized request'});
    req.accNo = user.accountNumber;
    next();
};

export async function isAuthorized(req:Request, res:Response, next:NextFunction) : Promise<any> {
    const {sender, userAcc} = req.body;
    const accNo = req.accNo;

    if ((sender && sender !== accNo) || (userAcc && userAcc !== accNo)) { 
        return res.status(401).json({error : 'Unauthorized request'})
    }
    next();
}