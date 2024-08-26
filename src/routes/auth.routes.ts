import {Router} from 'express'
import AuthController from '../controllers/auth.controller';

const routes = () => {
    const router = Router();
    const controller = new AuthController();

    router.post('/', controller.store);

    return router;
};

export default routes;