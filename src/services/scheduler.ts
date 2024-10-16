'use strict';

import 'dotenv/config';
import {UserModel} from '../models/user';
import { scheduleJob } from 'node-schedule';
import { IUser } from '../commons/interfaces/user';


export async function testSchedule(): Promise<void> {
  try {
    const user = await UserModel.find({ email: { $ne: null} });
    const userIdToEmailMap = new Map(user.map((user: IUser) => [user._id?.toString(), user.email]));

    if (user.length > 0) {
      userIdToEmailMap.forEach(async(email) => {
        if(email){
          console.log('Enviando e-mail a: ', email);
        }
      });
    }

  } catch (error) {
    console.error('Erro no testSchedule: ', error);
  }
}

export function setupSchedule(): void {
  scheduleJob('1 0 1 1 *', async () => {
    await testSchedule();
  });
}
