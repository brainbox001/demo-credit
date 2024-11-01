import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";

interface Body {
    userAcc : number;
    amount : number;
};

interface Withdrawal{
    transType : string;
    amount : number;
    receiver : number;
    created_at : Date;
};

export default async function withdraw(req:Request, res:Response) : Promise<any>{
    let body : Body = req.body;
    let {userAcc, amount} = body

    if(!userAcc || !amount) return res.status(400).json({error : 'Invalid credentials provided'});

    let balance : number;
    let withdrawal : Withdrawal;
    try {
        const user = await db('users').where({accountNumber : userAcc}).first().select('balance');
        if (!user || amount > user.balance) {
            return !user ? res.status(404).json({notFound : 'User with this account not found'}) :
            res.status(400).json({message : 'Insufficient fund'});
        };

        //Api handles the payment process here

        balance = user.balance - amount;
        await db('users').where({accountNumber : userAcc})
        .first()
        .update({balance});

        withdrawal = {
            transType : 'withdrawal',
            receiver: userAcc,
            amount,
            created_at : new Date()
        };
        await db('transactions').insert(withdrawal);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error : 'An error occured while trying to process payments'});
    }
    res.status(200).json({
        status : 'success',
        type : 'debit',
        receiver : userAcc,
        amount,
        balance
    });
};