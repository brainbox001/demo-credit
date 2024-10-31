import { Request, Response } from "express";
import db from "../../dbConfig/dbConfig";

interface Body {
    sender : number;
    receiver : number;
    amount : number;
}

interface Transfer{
    transType : string;
    sender : number;
    amount : number;
    receiver : number;
    created_at : Date;
}


export default async function handleTransfer(req:Request, res:Response) : Promise<any> {
    let body : Body = req.body;
    let {sender, receiver, amount} = body;
    let senderBalance : number;
    let receiverBalance : number;
    let transfer : Transfer;

    try{
        if (!sender || !receiver || !amount) return res.status(400).json({error : 'Invalid credentials provided'});

        const queryArr = [sender, receiver];
        const results = await db('users').whereIn('accountNumber', queryArr).select('accountNumber', 'balance');

        /*
        The following two lines of code are always gonna run in constant time regardless
         The ratio would always be 2 : 2, _ie_ 2 inputs, 2 operations each at worse case.
         A more optimal approach would've been used for varying inputs instead.
        */
        const senderExists = results.find(user => user.accountNumber === sender);
        const receiverExists = results.find(user => user.accountNumber === receiver);
        
        if (!senderExists || !receiverExists){
            let _who : number;
            !senderExists ? _who = sender : _who = receiver;
            return res.status(404).json({error : `user with account ${_who} not found`});
        };

        if (amount > senderExists.balance) return res.status(400).json({message : 'Insufficient fund'});
        
        senderBalance = senderExists.balance - amount;
        receiverBalance = receiverExists.balance + amount;
        await db('users').where({accountNumber : sender})
        .first()
        .update({balance : senderBalance});
        
        await db('users').where({accountNumber : receiver})
        .first()
        .update({balance : receiverBalance});

        transfer = {
            transType : 'transfer',
            sender,
            receiver,
            amount,
            created_at : new Date()
        }
        await db('transactions').insert(transfer);
            
    } catch (error) {
        return res.status(500).json({error : 'An error occured while trying to process payments'});
    }

    res.status(200).json({
        status : "success",
        type : 'transfer debit',
        balance : senderBalance,
        amount,
        sender,
    });
};