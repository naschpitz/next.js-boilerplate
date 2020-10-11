import UsersDAO from '../../../lib/users/server/dao';

export default async function resetPassword(req, res) {
  if (req.method === "GET") {
    const { token } = req.query;

    const user = await UsersDAO.getByPasswordRecoveryToken(token);

    if (user)
      res.writeHead(302, { Location: '/?resetPassword={"status":"open","token":"' + token + '"}' });

    if (!user)
      res.writeHead(302, { Location: '/?resetPassword={"status":"invalidToken"}' });

    return res.end();
  }

  if (req.method === "POST") {
    const { password, token } = req.body;

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

    return res.status(201).send("");
  }

  return res.status(405).send({ message: "Method not allowed." });
}