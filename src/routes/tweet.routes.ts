import {Router} from 'express'
import TweetController from '../controllers/tweet.controller';

const routes = () => {
    const router = Router();
    const controller = new TweetController();

    router.get('/', controller.list);
    
    router.post('/', controller.create);

    router.get('/:id', controller.show);

    router.put('/:id', controller.update);

    router.delete('/:id', controller.delete);

    return router;
};

export default routes;