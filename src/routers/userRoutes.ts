import express from 'express';
import registerObj from '../controllers/users/register';
import login from '../controllers/users/login';

const {register} = registerObj;

const userRoutes = express.Router()
userRoutes.use(express.json());

userRoutes.post('/register', register);
userRoutes.post('/login', login);

export default userRoutes;
