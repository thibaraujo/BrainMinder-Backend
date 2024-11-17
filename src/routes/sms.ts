'use strict';
import { Router, Response, NextFunction } from 'express';
import authentication from '../services/authentication';
import { AuthRequest } from '../services/authentication';
import validate from '../services/validator';
import { SmsController } from '../controllers/sms';


const router = Router();

//* Cadastro de usuário (Admin)
router.post('/', [authentication.adminMiddleware], SmsController.create);

//* Listagem e busca de usuários
router.get('/', [authentication.userMiddleware], (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.query.id) return SmsController.read(req, res, next);
  return SmsController.list(req, res, next);
});

//* Remoção de usuário
router.delete('/', [authentication.adminMiddleware], SmsController.delete);

//* Edição de usuário
router.put('/', [authentication.adminMiddleware], SmsController.update);

//* Ativar e Desativar usuário
router.put('/activate', [authentication.adminMiddleware], SmsController.activate);


export default router;




