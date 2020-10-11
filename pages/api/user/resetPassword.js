import Cookies from 'cookies';

import UsersDAO from '../../../lib/users/server/dao';

export default async function resetPassword(req, res) {
  if (req.method === "GET") {
    const { token } = req.query;

    const cookies = new Cookies(req, res);
    cookies.set('passwordRecovery', JSON.stringify({ token }));

    res.writeHead(302, { Location: '/' });

    return res.end();
  }

  if (req.method === "POST") {
    const { password } = req.body;

    const cookies = new Cookies(req, res);
    const passwordRecovery = cookies.get('passwordRecovery');

    let token;

    if (passwordRecovery)
      token = JSON.parse(passwordRecovery).token;

    const user = await UsersDAO.getByPasswordRecoveryToken(token);

    if (!user)
      return res.status(404).send({ message: "Invalid token." });

    const userId = user._id;

    await UsersDAO.unsetPasswordRecoveryToken(userId);

    try {
      await UsersDAO.setPassword(userId, password);
    }

    catch (error) {
      return res.status(400).send({ message: error.message });
    }

    cookies.set('passwordRecovery');
    return res.status(201).send("");
  }

  return res.status(405).send({ message: "Method not allowed." });
}