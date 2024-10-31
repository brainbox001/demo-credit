import login from "../../controllers/users/login";
import db from "../../dbConfig/dbConfig";
import { Request, Response } from "express";

jest.mock('../../dbConfig/dbConfig', () => {
    return jest.fn().mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        select : jest.fn().mockResolvedValue({password : 'string123'})
    }));
});

afterAll(() => {
    jest.clearAllMocks();
});

test('can successfully login user', async () => {
    let req: Request, res: Response;

    const email : string = 'test@example.com';
    const password : string = 'string123';

    req = {
        body : {
            email,
            password,
  
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

        cookie: jest.fn(),
    } as unknown as Response;

    await login(req, res);

    expect(res.cookie).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        status : 'Logged in'
    });
});

test('returns an error if user password is not correct', async () => {
    let req: Request, res: Response;

    const email : string = 'test@example.com';
    const password : string = 'string12';

    req = {
        body : {
            email,
            password,
  
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

        cookie: jest.fn(),
    } as unknown as Response;

    await login(req, res);

    expect(res.cookie).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error : 'Incorrect email or password'});
});

test('returns an error if the expected credential is imcomplete', async () => {
    let req: Request, res: Response;

    const email : string = 'test@example.com';

    req = {
        body : {
            email,
  
        }
    } as unknown as Request;
    
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),

        cookie: jest.fn(),
    } as unknown as Response;

    await login(req, res);

    expect(res.cookie).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error : 'Invalid credentials provided'});
});
