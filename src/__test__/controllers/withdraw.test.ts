import db from "../../dbConfig/dbConfig";
import { Request, Response } from "express";
import withdraw from "../../controllers/transactions/withdraw";

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementation(() => ({
        insert: jest.fn().mockResolvedValue(true),
        where: jest.fn().mockReturnThis(),
        update : jest.fn().mockResolvedValue(1),
        first: jest.fn().mockReturnThis(),
        select : jest.fn().mockResolvedValue({balance : 200})
    }));
});

afterAll(() => {
    jest.clearAllMocks();
});

test('a user can withdraw funds successfully', async () => {
    let req: Request, res: Response;

    req = {
        body : {
            userAcc : 9041113838,
            amount : 100
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

    } as unknown as Response;
    await withdraw(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        status : 'success',
        type : 'debit',
        receiver : 9041113838,
        amount : 100,
        balance : 100
    });
});

test('throws an insufficient fund error if amount > user balance', async () => {
    let req: Request, res: Response;

    req = {
        body : {
            userAcc : 9041113838,
            amount : 300
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

    } as unknown as Response;
    await withdraw(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message : 'Insufficient fund'});
});
