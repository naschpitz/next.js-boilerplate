import UsersDAO from '../../../lib/users/server/dao';

export default async function resetPassword(req, res) {
  if (req.method === "GET") {
    const { token } = req.query;

    const user = await UsersDAO.getByPasswordRecoveryToken(token);

    if (user)
      return res.redirect(302, '/?resetPassword={"status":"open","token":"' + token + '"}');

    else
      return res.redirect(302, '/?resetPassword={"status":"invalidToken"}');
  }

  if (req.method === "POST") {
    const { password, token } = req.body;

    const user = await UsersDAO.getByPasswordRecoveryToken(token);

    if (!user)
      return res.status(404).json({ message: "Invalid token." });

    const userId = user._id;

    await UsersDAO.unsetPasswordRecoveryToken(userId);

    try {
      await UsersDAO.setPassword(userId, password);
    }

    catch (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({});
  }

  return res.status(405).json({ message: "Method not allowed." });
}