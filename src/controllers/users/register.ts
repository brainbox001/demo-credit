import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";
import axios from 'axios';

interface Body {
    name : string;
    email : string;
    password : string;
    phoneNumber : number;
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
    const {name, email, password, phoneNumber} = body;
    
    if (!name || !email || !password || !phoneNumber) return res.status(400).json({error : 'Invalid credentials provided'});

    const karmaResponse = await registerObj.karmaValidate(email);
    if (karmaResponse !== 404) {
        return karmaResponse === 200 ? res.status(400).json({error : "Signup can't be completed user data not accepted"}) : res.status(500).json({error : "signup can't be processed, please try again after few moments"})
    };

    const userExists = await db('users').where({ email }).orWhere({accountNumber : phoneNumber}).first();
    
    if(userExists) {   
        let _which = 'email address';
        if (userExists.accountNumber === phoneNumber) _which = 'phone number';
        return res.status(400).json({error : `User with ${_which} already exists`});
    };
        
    const newUser = {
        name,
        email,
        password, // For the purpose of testing, passwords are not hashed
        phoneNumber,
        created_at : new Date(),
        updated_at : new Date()
    };
    try {
        await db('users').insert(newUser);
        
    } catch (error) {
        return res.status(500).json({error : 'An error occured while trying to signup user'});
    }

    const user = {email, password}
    res.cookie('session', JSON.stringify(user), {
        httpOnly : true,
    });

    res.status(201).json({
        email,
        name,
        balance : 0,
        phoneNumber
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