import { isAuthenticated, isAuthorized } from "../../middlewares/permissions";
import { Request, Response, NextFunction } from "express";
import db from "../../dbConfig/dbConfig";

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        select : jest.fn().mockResolvedValue({password : 'string 123', accountNumber : 904113838, email : 'test@gmail.com'})
    }));
});



test('can authenticate user', async () => {
    let req: Request, res: Response, next : NextFunction;
    let session = JSON.stringify({email : 'test@gmail.com', password : 'string 123'});
    req = {
        cookies : {
            session
        }
    } as unknown as Request;
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),

        } as unknown as Response;
    next = jest.fn();
    await isAuthenticated(req, res, next);
    expect(next).toHaveBeenCalled();
});

test("returns an error if user password doesn't match", async () => {
    let req: Request, res: Response, next : NextFunction;
    let session = JSON.stringify({email : 'test@gmail.com', password : 'string 12'});
    req = {
        cookies : {
            session
        }
    } as unknown as Request;
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),

        } as unknown as Response;
    next = jest.fn();
    await isAuthenticated(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect (res.json).toHaveBeenCalledWith({error : 'Unauthorized request'});
});

test("returns an error if session not available", async () => {
    let req: Request, res: Response, next : NextFunction;
    req = {
        cookies : {
        }
    } as unknown as Request;
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),

        } as unknown as Response;
    next = jest.fn();
    await isAuthenticated(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect (res.json).toHaveBeenCalledWith({error : 'Unauthorized request'});
});

// ########  Testing isAuthorized middleware #######
test("returns an error if sender !== accNo", async () => {
    let req: Request, res: Response, next : NextFunction;
    req = {
        body : {
            sender : 8751828384,
        },
        accNo : 9041113838
    } as unknown as Request;
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),

        } as unknown as Response;
    next = jest.fn();
    await isAuthorized(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect (res.json).toHaveBeenCalledWith({error : 'Unauthorized request'});
});

test("returns an error if userAcc !== accNo", async () => {
    let req: Request, res: Response, next : NextFunction;
    req = {
        body : {
            userAcc : 8751828384,
        },
        accNo : 9041113838
    } as unknown as Request;
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),

        } as unknown as Response;
    next = jest.fn();
    await isAuthorized(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect (res.json).toHaveBeenCalledWith({error : 'Unauthorized request'});
});

test("function passes on if none is available", async () => {
    let req: Request, res: Response, next : NextFunction;
    req = {
        body : {
            
        },
        accNo : 9041113838
    } as unknown as Request;
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),

        } as unknown as Response;
    next = jest.fn();
    await isAuthorized(req, res, next);
    expect(next).toHaveBeenCalled();
});