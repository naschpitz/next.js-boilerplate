import handleError from '../../../lib/handleError';
import Users from '../../../lib/users/dao';

export default async function resetPassword(req, res) {
  if (req.method === "GET") {
    const { token } = req.query;

    const user = await Users.findOne().byPasswordRecoveryToken(token);

    if (user)
      return res.redirect(302, '/?resetPassword={"status":"open","token":"' + token + '"}');

    else
      return res.redirect(302, '/?resetPassword={"status":"invalidToken"}');
  }

  if (req.method === "POST") {
    const { password, token } = req.body;

    const user = await Users.findOne().byPasswordRecoveryToken(token);

    if (!user)
      return res.status(404).json({ message: "Invalid token." });

    try {
      await user.resetPassword(password);
    }

    catch (error) {
      return handleError(req, res, error);
    }

    return res.status(201).json({});
  }

  return res.status(405).json({ message: "Method not allowed." });
}