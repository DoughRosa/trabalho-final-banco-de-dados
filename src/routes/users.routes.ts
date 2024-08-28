import {Router} from 'express'
import UserController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const routes = () => {
    const router = Router();
    const controller = new UserController();

    router.get('/', authMiddleware, controller.list);
    
    router.post('/', controller.create);

    router.get('/:id', authMiddleware, controller.show);

    router.put('/:id', authMiddleware, controller.update);

    router.delete('/:id', authMiddleware, controller.delete);

    return router;
};

export default routes;