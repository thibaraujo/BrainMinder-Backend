'use strict';
import { Router, Response, NextFunction } from 'express';
import { FormatedMemoryController } from '../controllers/formatedMemory';
import authentication from '../services/authentication';
import { AuthRequest } from '../services/authentication';
import FormatedMemoryValidator from '../commons/validator/formatedMemory';
import validate from '../services/validator';


const router = Router();

//* Cadastro de usuário (Admin)
router.post('/', [validate(FormatedMemoryValidator.create), authentication.adminMiddleware], FormatedMemoryController.create);

//* Listagem e busca de usuários
router.get('/', [validate(FormatedMemoryValidator.get), authentication.userMiddleware], (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.query.id) return FormatedMemoryController.read(req, res, next);
  return FormatedMemoryController.list(req, res, next);
});

//* Remoção de usuário
router.delete('/', [validate(FormatedMemoryValidator.delete), authentication.adminMiddleware], FormatedMemoryController.delete);

//* Edição de usuário
router.put('/', [validate(FormatedMemoryValidator.update), authentication.adminMiddleware], FormatedMemoryController.update);

//* Ativar e Desativar usuário
router.put('/activate', [validate(FormatedMemoryValidator.activate), authentication.adminMiddleware], FormatedMemoryController.activate);


export default router;




