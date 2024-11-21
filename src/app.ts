'use strict';
import 'dotenv/config';
import express from 'express';
import routes from './routes';
import cors from 'cors';
import { setupSchedule } from './services/scheduler';
import { celebrateErrorHandler } from './validators/errors';
import { errorHandler } from './services/errorHandler';
import database from './services/database';
import { User } from './classes/user';
import { File } from './classes/file';

import { UserType } from './commons/interfaces/user';
import { UserModel } from './models/user';
import { FileModel } from './models/file';

//* EXPRESS
const app: express.Express = express();

//* DATABASE
function connectionMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  database.connect()
    .then(() => {
      console.log('Database connected');
      next();
    })
    .catch((error) => {
      console.error('Error connecting to database: ', error);
      next(error);
    });
}

app.use(connectionMiddleware);

//* CLOUDINARY
// cloudinary.config();

//* CORS
const options: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'Referer', 'User-Agent', 'X-KL-Ajax-Request', 'Authorization', 'X-Requested-With', 'Content-Type', 'Access-Control-Allow-Origin', 'Accept'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: '*',
};
app.use(cors(options));

//* JSON
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
});
app.use(express.json());

//* ROUTES
app.use('/api', routes);

//* TESTE SENTRY
app.get('/debug-sentry', function mainHandler() {
  throw new Error('My first Sentry error!');
});

//* DESABILITANDE O X-POWERED-BY DO EXPRESS
app.disable('x-powered-by');

//* CRON SCHEDULE
setupSchedule();

//* CELEBRATE VALIDATION
app.use(celebrateErrorHandler);
app.use(errorHandler);

setTimeout(async () => {
  database.connect()
    .then(() => {
      console.log('Database connected');
    })

  // const user = new User({
  //   firstName: 'Admin',
  //   lastName: 'Admin',
  //   cpf: '12345678901',
  //   type: UserType.ADMIN,
  //   email: 'thiagobatistaaraujo06@gmail.com',
  //   password: "123",
  // });

  // await UserModel.create(user);

}, 1000);

export default app;