import hash from 'object-hash';

import Session from '../../../lib/session';
import UsersDAO from '../../../lib/users/dao';

export default async function changePassword(req, res) {
  if (req.method === "POST") {
    const { oldPassword, newPassword } = req.body;

    const session = new Session(req, res);

    const isValid = await session.isValid();

    if (!isValid)
      return res.status(401).send({ message: "Invalid session token." });

    const sessionObj = session.getObject();
    const userId = sessionObj.userId;

    const password = await UsersDAO.getPassword(userId);

    if (hash(oldPassword) !== password)
      return res.status(401).send({ message: "Wrong current password." });

    await UsersDAO.changePassword(userId, newPassword);
    await session.genSecret(userId);
    await session.genToken(userId);

    return res.status(201).send("");
  }

  return res.status(405).send({ message: "Method not allowed." });
}