import Session from '../../../lib/session';
import UsersDAO from '../../../lib/users/server/dao';

export default async function login(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const user = await UsersDAO.getByCredentials(email, password);

    if (!user)
      return res.status(403).json({ message: "Wrong username and/or password." });

    const userId = user._id;

    const session = new Session(req, res);
    await session.genToken(userId);

    return res.status(201).json({});
  }

  return res.status(405).json({ message: "Method not allowed." });
}