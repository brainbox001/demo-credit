import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";

interface Body {
    name : string;
    email : string;
    password : string;
}

export default async function register(req:Request, res:Response) {
    const body : Body = req.body;
    const name : string = body.name;
    const email : string = body.email;
    const password : string = body.password

    if (!name || !email || !password) return res.status(400).json({error : 'Invalid credentials provided'});
    const userExists = await db('users').where({ email }).first();
    if(userExists) return res.status(400).json({error : 'User with email address already exists'});

    const newUser = {
        name,
        email,
        password, // For the purpose of testing, passwords are not hashed
        created_at : new Date(),
        updated_at : new Date()
    };
    try {
        await db('users').insert(newUser)
        
    } catch (error) {
        return res.status(500).json({error : 'An error occured while trying to signup user'});
    }

    const user = {name, email}
    res.cookie('session', JSON.stringify(user));

    res.status(201).json({
        ...user,
        balance : 0
    });
}