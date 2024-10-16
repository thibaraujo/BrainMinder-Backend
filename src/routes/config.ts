'use strict';
import { Router } from 'express';
import {ConfigController} from '../controllers/config';
import authentication from '../services/authentication';
import { errorHandler } from '../services/errorHandler';
import validate from '../services/validator';
import ConfigValidator from '../commons/validator/config';


const router = Router();

//* Cadastro/edição de configuração
router.post('/',[validate(ConfigValidator.create), authentication.adminMiddleware, errorHandler], ConfigController.create);

//* Leitura de configuração
router.get('/',[validate(ConfigValidator.get), authentication.userMiddleware, errorHandler], ConfigController.index);



export default router;
