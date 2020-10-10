import Session from '../../../lib/session';
import UsersDAO from '../../../lib/users/dao';

export default async function resetPassword(req, res) {
  if (req.method === "POST") {
    const { token } = req.query;

    const user = UsersDAO.getByPasswordResetToken(token);

    if (!user) {

    }

    const userId = user._id;

    const session = new Session(req, res);
    await session.genToken(userId);

    return res.status(201).send("");
  }

  return res.status(405).send({ message: "Method not allowed." });
}