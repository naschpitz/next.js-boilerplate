import uuid from 'uuid-random'

import UsersDAO from './dao'

export default class Users {
  static async checkEmailExists(email) {
    const user = await UsersDAO.getByEmail(email);

    return !!user;
  }

  static async genResetPasswordToken(email) {
    const token = uuid();

    UsersDAO.setPasswordResetToken(email, token);

    return token;
  }
}