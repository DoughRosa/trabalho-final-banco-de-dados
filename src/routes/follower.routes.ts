import {Router} from 'express'
import FollowerController from '../controllers/follower.controller';
import authMiddleware from '../middlewares/auth.middleware';

const routes = () => {
    const router = Router();
    const controller = new FollowerController();

    router.get('/', authMiddleware, controller.list);
    
    router.post('/', authMiddleware, controller.create);

    router.get('/:id', authMiddleware, controller.show);

    router.put('/:id', authMiddleware, controller.update);

    router.delete('/:id', authMiddleware, controller.delete);

    return router;
};

export default routes;