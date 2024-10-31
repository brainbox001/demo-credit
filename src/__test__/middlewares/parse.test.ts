import { Request, NextFunction, Response } from "express";
import parser from "../../middlewares/parser";

describe('testing and logging the parsed values by the parser middleware', () => {
    it('ignores supposed string and parses supposed numbers', async () => {
        let req : Request, res : Response;
        req = {
            body : {
                status : 'approved',
                email : 'test@eg.com',
                name : 'tested',
                phoneNumber : '89283474',
                amount : 200,
                userAcc : '34757566',
                password : 12345
            }
        } as unknown as Request;
            
            res = {
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

        let next : NextFunction = jest.fn();

        await parser(req, res, next);
        expect(typeof req.body.phoneNumber).toEqual('number');
        expect(typeof req.body.userAcc).toEqual('number');
        expect(typeof req.body.password).toEqual('string');
    });
})
