import db from "../../dbConfig/dbConfig";
import { Request, Response } from "express";
import fundAccount from "../../controllers/transactions/fundAccount";

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementationOnce(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({balance : 20}),
    })).mockImplementation(() => ({
        insert: jest.fn().mockResolvedValue(true),
        where: jest.fn().mockReturnThis(),
        update : jest.fn().mockResolvedValue(1),
        first: jest.fn().mockReturnThis(),
    }));
});

afterAll(() => {
    jest.clearAllMocks();
});

test("can succesfully fund a user's account", async () => {
    let req: Request, res: Response;
    const status : string = 'approved';
    let accountNo = 8322138484;
    let amount = 500;

    req = {
        body : {
            status,
            accountNo,
            amount
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

    } as unknown as Response;

    await fundAccount(req, res);
    let balance = 520;
    expect(res.json).toHaveBeenCalledWith({
        status : "success",
        type : 'credit',
        amount,
        balance,
        accountNo
    });
    expect(res.status).toHaveBeenCalledWith(200);
});

test("when status is not approved", async () => {
    let req: Request, res: Response;
    const status : string = 'unapproved';
    let accountNo = 8322138484;
    let amount = 500;

    req = {
        body : {
            status,
            accountNo,
            amount
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

    } as unknown as Response;

    await fundAccount(req, res);
 
    expect(res.json).toHaveBeenCalledWith({error : 'Account funding not approved'});
    expect(res.status).toHaveBeenCalledWith(401);
});

test('returns an error message if user with account number does not exists', async () => {

    let req: Request, res: Response;
    const status : string = 'approved';
    const accountNo = 8322138484;
    const amount = 500;

    req = {
        body : {
            status,
            accountNo,
            amount
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

    } as unknown as Response;

    (db as unknown as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(0),
      }));

      await fundAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({error : 'User with this account number not found'});
});