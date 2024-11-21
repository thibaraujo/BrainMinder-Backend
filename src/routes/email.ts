'use strict';
import { Router, Response, NextFunction } from 'express';
import authentication from '../services/authentication';
import { AuthRequest } from '../services/authentication';
import { EmailController } from '../controllers/email';


const router = Router();

//* Cadastro de usuário (Admin)
router.post('/', [authentication.adminMiddleware], EmailController.create);

//* Listagem e busca de usuários
router.get('/', [authentication.userMiddleware], (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.query.id) return EmailController.read(req, res, next);
  return EmailController.list(req, res, next);
});

//* Remoção de usuário
router.delete('/', [authentication.adminMiddleware], EmailController.delete);

//* Edição de usuário
router.put('/', [authentication.adminMiddleware], EmailController.update);

//* Ativar e Desativar usuário
router.put('/activate', [authentication.adminMiddleware], EmailController.activate);


export default router;




