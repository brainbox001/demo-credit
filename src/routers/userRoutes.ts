import express from 'express';
import registerObj from '../controllers/users/register';
import login from '../controllers/users/login';
import logout from '../controllers/users/logout';

const {register} = registerObj;

const userRoutes = express.Router()
userRoutes.use(express.json());

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.post('/logout', logout);

export default userRoutes;
