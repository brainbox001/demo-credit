import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";

//Assumes frontend has communicated with the third party and returns an approved status

interface Fund{
    transType : string;
    sender : number;
    amount : number;
    created_at : Date
}

interface Body {
    status : string;
    accountNo : number;
    amount : number;
}

async function fundAccount(req:Request, res:Response) : Promise<any> {
    let body : Body = req.body;
    let {status, accountNo, amount} = body;

    if (!status || !accountNo || !amount) return res.status(400).json({error : 'Invalid credentials provided'});
    if(status !== 'approved') return res.status(401).json({error : 'Account funding not approved'});

    const accountNoExists = await db('users').where({accountNumber : accountNo}).first();
    if (!accountNoExists) return res.status(404).json({error : 'User with this account number not found'});
    let fund : Fund;
    let balance : number;
    try {
        balance = accountNoExists.balance + amount;
        await db('users').where({accountNumber : accountNo})
        .first()
        .update({balance});
        fund = {
            transType : 'fund',
            sender : accountNo,
            amount,
            created_at : new Date()
        }
        await db('transactions').insert(fund);
        
    } catch (error) {
        return res.status(500).json({error : 'An error occured while trying to process payments'});
    }
    res.status(200).json({
        status : "success",
        type : 'credit',
        amount,
        balance,
        accountNo
    });
};
export default fundAccount;