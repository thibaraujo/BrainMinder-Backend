'use strict';
import { Router } from 'express';

const router = Router();

import userRouter from './user';
router.use('/users', userRouter);

import formatedMemoryRouter from './formatedMemory';
router.use('/formatedMemories', formatedMemoryRouter);

import configRouter from './config';
router.use('/configs', configRouter);

import smsRouter from './sms';
router.use('/smss', smsRouter);

import emailRouter from './email';
router.use('/emails', emailRouter);

import fileRouter from './file';
router.use('/files', fileRouter);

export default router;

