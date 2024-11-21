'use strict';
import { Router, Response, NextFunction } from 'express';
import authentication from '../services/authentication';
import { AuthRequest } from '../services/authentication';
import { FileController } from '../controllers/file';


const router = Router();

//* Cadastro de usuário (Admin)
router.post('/', [authentication.adminMiddleware], FileController.create);

//* Listagem e busca de usuários
router.get('/', [authentication.userMiddleware], (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.query.id) return FileController.read(req, res, next);
  return FileController.list(req, res, next);
});

//* Remoção de usuário
router.delete('/', [authentication.adminMiddleware], FileController.delete);

//* Edição de usuário
router.put('/', [authentication.adminMiddleware], FileController.update);

//* Ativar e Desativar usuário
router.put('/activate', [authentication.adminMiddleware], FileController.activate);


export default router;




