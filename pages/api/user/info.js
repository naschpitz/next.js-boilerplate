import Session from '../../../lib/session';
import UsersDAO from '../../../lib/users/dao';

export default async function info(req, res) {
  if (req.method === "GET") {
    const session = new Session(req, res);

    const isValid = await session.isValid();

    if (!isValid)
      return res.status(401).send({ message: "Invalid session token." });

    const sessionObj = session.getObject();

    const userId = sessionObj.userId;
    const user = await UsersDAO.getById(userId);

    delete user.password;
    delete user.session;

    await session.genToken(userId);

    return res.status(200).send({ user });
  }

  return res.status(405).send({ message: "Method not allowed." });
}