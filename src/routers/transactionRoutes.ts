import express from 'express';
import { isAuthenticated, isAuthorized } from '../middlewares/permissions';
import fundAccount from '../controllers/transactions/fundAccount';
import handleTransfer from '../controllers/transactions/handleTransfer';
import withdraw from '../controllers/transactions/withdraw';

const transactionRoutes = express.Router();
transactionRoutes.use(express.json());
transactionRoutes.use(isAuthenticated);

transactionRoutes.post('/fund', fundAccount);

transactionRoutes.use(isAuthorized);
transactionRoutes.post('/transfer', handleTransfer);
transactionRoutes.post('/withdraw', withdraw);

export default transactionRoutes;