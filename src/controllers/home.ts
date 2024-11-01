import { Request, Response } from "express";
import db from "../dbConfig/dbConfig";

interface Body {
    email : string;
    password : string;
}

export default async function home(req:Request, res:Response) : Promise<any> {
    const cookies = req.cookies;
    const session = cookies.session;
    let userAgent: string | undefined;
    if(session) {
        const {email, password} = JSON.parse(session);
        try {
            const user = await db('users').where({email}).first().select('name', 'email', 'balance', 'accountNumber', 'password');
            if(user && user.password === password) {
                return res.status(200).json({
                    ...user
                });
            };
        } catch (error) {      
            console.log(error); 
        }
        
    };
    userAgent = req.headers['user-agent'];
    return res.status(200).json({
        welcome: `Welcome to demo credit ${userAgent}`
    })
};