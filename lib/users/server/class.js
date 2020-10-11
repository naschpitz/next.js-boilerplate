import uuid from 'uuid-random';

import UsersClient from '../client/class';
import UsersDAO from './dao';

export default class UsersServer extends UsersClient {
  static async checkEmailExists(email) {
    const user = await UsersDAO.getByEmail(email);

    return !!user;
  }

  static async genPasswordRecoveryToken(email) {
    const token = uuid();

    await UsersDAO.setPasswordRecoveryToken(email, token);

    return token;
  }
}