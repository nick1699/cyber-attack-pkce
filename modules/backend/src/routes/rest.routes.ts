import {Router} from 'express';
import {requiresAuth} from "../auth/auth";
import {AccountsController} from "../controllers/accountsController";

const router: Router = Router();
const accountsController: AccountsController = new AccountsController();

router.get('/api/accounts', requiresAuth(), accountsController.getAccounts);

export default router;