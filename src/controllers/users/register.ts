import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";
import axios from 'axios';

interface Body {
    name : string;
    email : string;
    password : string;
    phoneNumber : string;
}

interface Karma {
    error : string
}

interface RegisterObj {
    karmaValidate : (email : string) => Promise<number | Karma>
    register : (req:Request, res:Response) => Promise<any>
}

const registerObj : RegisterObj = {
    karmaValidate,
    register
}

async function register(req:Request, res:Response) : Promise<any> {
    const body : Body = req.body;
    const name : string = body.name;
    const email : string = body.email;
    const password : string = body.password;
    const accountNumber: number = parseInt(body.phoneNumber);

    if (!name || !email || !password) return res.status(400).json({error : 'Invalid credentials provided'});

    const karmaResponse = await registerObj.karmaValidate(email);
    if (karmaResponse !== 404) {
        return karmaResponse === 200 ? res.status(400).json({error : "Signup can't be completed user data not accepted"}) : res.status(500).json({error : "signup can't be processed, please try again after few moments"})
    };

    const userExists = await db('users').where({ email }).first();
    if(userExists) return res.status(400).json({error : 'User with email address already exists'});

    const newUser = {
        name,
        email,
        password, // For the purpose of testing, passwords are not hashed
        accountNumber,
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

async function karmaValidate(email:string) : Promise<number | Karma> {
    let status : number;
    try {
        const response = await axios.get(`https://adjutor.lendsqr.com/v2/verification/karma/${email}`, {
            headers : {
                "Authorization" : "Bearer sk_live_kMsDJ3vqPz6wr3MlOrus1bNC2c8gHKgIimIHV4zR"
            }
        });
        status = response.status
      } catch (error : any) {
        const err = {error : 'error from server'}
        status = error.status
        return status 
      }
    return status
}
export default registerObj;