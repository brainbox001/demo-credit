import express from 'express';
import registerObj from '../controllers/users/register';

const {register} = registerObj;

const userRoutes = express.Router()
userRoutes.use(express.json());

userRoutes.post('/register', register);

export default userRoutes;