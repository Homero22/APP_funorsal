import Router from 'express';

import loginController from '../../controllers/seguridad/login.controllers.js';

const router = Router();

router.post('/', loginController.login);

export default router;