import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";

interface Body {
    email : string;
    password : string;
}

export default async function login(req:Request, res:Response) {
    const body = req.body;
    const {email, password} = body;
    if (!email || !password) return res.status(400).json({error : 'Invalid credentials provided'});
    try {
        const user = await db('users').where({email}).first().select('password');
        if(!user || password !== user.password) return res.status(400).json({error : 'Incorrect email or password'});

    } catch (error) {
        console.log(error);
        return res.status(500).json({error : 'An error occured while trying to login user'});
    }
    
    const session = {email, password};
    res.cookie('session', JSON.stringify(session), {
        httpOnly : true,
    });
    res.status(200).json({
        status : 'Logged in'
    });
};