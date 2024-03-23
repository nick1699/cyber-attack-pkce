import {Router} from 'express';
import {requiresAuth} from "../auth/auth";
import {InformationController} from "../controllers/information.controller";

const router: Router = Router();
const informationController: InformationController = new InformationController();

router.get('/api/information', requiresAuth(), informationController.getInformation);

export default router;