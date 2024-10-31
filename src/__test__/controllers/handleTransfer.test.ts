import db from "../../dbConfig/dbConfig";
import { Request, Response } from "express";
import handleTransfer from "../../controllers/transactions/handleTransfer";

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementation(() => ({
        insert: jest.fn().mockResolvedValue(true),
        where: jest.fn().mockReturnThis(),
        whereIn: jest.fn().mockReturnThis(),
        first : jest.fn().mockReturnThis(),
        select : jest.fn().mockResolvedValue([{
            accountNumber : 9041113838,
            balance : 200
        },
        {
            accountNumber : 8168958556,
            balance : 400
        }
        ]),
        update : jest.fn().mockResolvedValue(1),
    }));
});

afterAll(() => {
    jest.clearAllMocks();
});

test('can transfer funds to another user successfully', async () => {
    let req: Request, res: Response;
    let sender = 9041113838;
    let receiver = 8168958556;
    let amount = 100;

    req = {
        body : {
            sender,
            receiver,
            amount
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

    } as unknown as Response;

    await handleTransfer(req, res);
  
    expect(res.json).toHaveBeenCalledWith({
        status : "success",
        type : 'transfer debit',
        balance : 100,
        amount,
        sender,
    });
    expect(res.status).toHaveBeenCalledWith(200);
});

test('returns Insufficient fund message when amount is greater than current balance of sender', async () => {
    let req: Request, res: Response;
    let sender = 9041113838;
    let receiver = 8168958556;
    let amount = 600;

    req = {
        body : {
            sender,
            receiver,
            amount
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

    } as unknown as Response;

    await handleTransfer(req, res);
  
    expect(res.json).toHaveBeenCalledWith({message : 'Insufficient fund'});
    expect(res.status).toHaveBeenCalledWith(400);
});

test('returns an error if either the sender or receiver is not found', async () => {
    let req: Request, res: Response;
    let sender = 9041113838;
    let receiver = 8168958556;
    let amount = 100;

    req = {
        body : {
            sender,
            receiver,
            amount
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

    } as unknown as Response;

    (db as unknown as jest.Mock).mockImplementation(() => ({
        whereIn: jest.fn().mockReturnThis(),
        select : jest.fn().mockResolvedValue([{
            accountNumber : 9041113838,
            balance : 200
        }
        ]),
      }));

    await handleTransfer(req, res);
  
    expect(res.json).toHaveBeenCalledWith({error : `user with account ${receiver} not found`});
    expect(res.status).toHaveBeenCalledWith(404);
});
