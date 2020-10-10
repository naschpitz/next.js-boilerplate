import Cookies from 'cookies'
import Tokens from 'csrf'

import UsersDAO from './users/dao'

export default class Session {
  constructor(req, res) {
    this.cookies = new Cookies(req, res);
    this.tokens = new Tokens();
  }

  getObject() {
    const session = this.cookies.get('session');

    if (session)
      return JSON.parse(session);
  }

  async genSecret(userId) {
    const secret = await this.tokens.secret();

    await UsersDAO.setSecret(userId, secret);
  }

  async genToken(userId) {
    const user = await UsersDAO.getById(userId);

    if (!user)
      return;

    const token = this.tokens.create(user.session.secret);

    this.cookies.set('session', JSON.stringify({ userId, token }));
  }

  async isValid() {
    const sessionObj = this.getObject();

    if (!sessionObj)
      return false;

    const userId = sessionObj.userId;
    const token = sessionObj.token;

    const user = await UsersDAO.getById(userId);

    if (!user)
      return false;

    const secret = user.session.secret;

    return this.tokens.verify(secret, token)
  }

  invalidate() {
    this.cookies.set('session');
  }
}