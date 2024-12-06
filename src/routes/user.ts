'use strict';
import { Router, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user';
import { AuthRequest } from '../services/authentication';
import UserValidator from '../commons/validator/user';
import validate from '../services/validator';


const router = Router();

//* Cadastro de usuário (Admin)
router.post('/', [validate(UserValidator.create)], UserController.create);
//* Registro de usuário (Próprio usuário)
router.post('/me', validate(UserValidator.createMe), UserController.createMe);

//* Listagem e busca de usuários
router.get('/', [validate(UserValidator.get)], (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.query.id) return UserController.read(req, res, next);
  return UserController.list(req, res, next);
});

//* Remoção de usuário
router.delete('/', [validate(UserValidator.delete)], UserController.delete);
//* Remoção do próprio usuário
router.delete('/me', UserController.deleteMe);

//* Edição de usuário
router.put('/', [validate(UserValidator.update)], UserController.update);
router.patch('/', [validate(UserValidator.update)], UserController.patch);

//* Edição do próprio usuário
router.put('/me', [validate(UserValidator.updateMe)], UserController.updateMe);
router.patch('/me', [validate(UserValidator.updateMe)], UserController.patchMe);

//* Ativar e Desativar usuário
router.put('/activate', [validate(UserValidator.activate)], UserController.activate);

//* Autenticação de usuário
router.get('/login', validate(UserValidator.login), UserController.login);

//* Requisição de e-mail para definição de senha de usuário
router.post('/password-definition', validate(UserValidator.validatorPasswordDefinition), UserController.passwordDefinition);
//* Definição de senha de usuário
router.get('/password-definition', validate(UserValidator.validatorPasswordDefinitionRequest), UserController.passwordDefinitionRequest);

//* Requisição de e-mail para validação do e-mail do usuário
router.get('/email-validation', validate(UserValidator.validatorPasswordDefinitionRequest), UserController.emailValidationRequest);
//* Validação do e-mail do usuário
router.post('/email-validation', validate(UserValidator.validatorEmailValidation), UserController.emailValidation);


export default router;




