import db from "../../dbConfig/dbConfig";
import registerObj from "../users/register";
import { Request, Response } from "express";

const {register} = registerObj;

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementation(() => ({
        insert: jest.fn().mockResolvedValue(true),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
    }));
});

afterAll(() => {
    jest.clearAllMocks();
});

test('can register new users successfully', async () => {
    const karmaSpy = jest.spyOn(registerObj, 'karmaValidate').mockResolvedValue(404);

    let req: Request, res: Response;
    const name : string = 'tested';
    const email : string = 'test@example.com';
    const password : string = 'string123';
    const accountNumber : string = '0812345555'

    req = {
        body : {
            name,
            email,
            password,
            accountNumber
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

        cookie: jest.fn(),
    } as unknown as Response;

    await register(req, res);
    const user = {name, email}
    expect(res.json).toHaveBeenCalledWith({
        ...user,
        balance : 0
    });
    expect(karmaSpy).toHaveBeenCalled()
});

test('returns an error message for incomplete data', async () => {
    jest.spyOn(registerObj, 'karmaValidate').mockResolvedValue(404);
    let req: Request, res: Response;
    const name : string = 'tested';
    const email : string = 'test@example.com';
    const accountNumber : string = '0812345555'
    req = {
        body : {
            name,
            email,
            accountNumber
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

        cookie: jest.fn(),
    } as unknown as Response;

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error : 'Invalid credentials provided'})
});

test('returns an error if user is found in the karma blacklist', async() => {
    const karmaSpy = jest.spyOn(registerObj, 'karmaValidate').mockResolvedValue(200);
    let req: Request, res: Response;
    const name : string = 'tested';
    const email : string = 'test@example.com';
    const password : string = 'string123'
    const accountNumber : string = '0812345555'
    req = {
        body : {
            name,
            email,
            password,
            accountNumber
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

        cookie: jest.fn(),
    } as unknown as Response;

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error : "Signup can't be completed user data not accepted"});
    expect(karmaSpy).toHaveBeenCalledWith(email);
});

test('returns an error message if user exists', async () => {
    jest.spyOn(registerObj, 'karmaValidate').mockResolvedValue(404);
    let req: Request, res: Response;
    const name : string = 'tested';
    const email : string = 'test@example.com';
    const password : string = 'string123'
    const accountNumber : string = '0812345555'
    req = {
        body : {
            name,
            email,
            password,
            accountNumber
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

        cookie: jest.fn(),
    } as unknown as Response;

    (db as unknown as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue('1'),
      }))

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error : 'User with email address already exists'})
});
