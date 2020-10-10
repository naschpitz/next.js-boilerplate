import Session from '../../../lib/session'
import UsersDAO from '../../../lib/users/dao'

export default async function login(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const user = await UsersDAO.getByCredentials(email, password);

    if (!user)
      return res.status(403).send({message: "Wrong username and/or password."});

    const userId = user._id;

    const session = new Session(req, res);
    await session.genToken(userId);

    return res.status(201).send("");
  }

  return res.status(405).send({ message: "Method not allowed." });
}