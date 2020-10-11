import Session from '../../../lib/session';
import Users from '../../../lib/users/server/class';
import UsersDAO from '../../../lib/users/server/dao';

export default async function register(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const exists = await Users.checkEmailExists(email);

    if (exists)
      return res.status(409).send({ message: "There is already a registered user with this e-mail." });

    const user = { email: { address: email }, password: password };
    const response = await UsersDAO.insert(user);

    if (response.result.ok) {
      const userId  = response.insertedIds[0];

      const session = new Session(req, res);
      await session.genSecret(userId);
      await session.genToken(userId);

      return res.status(201).send("");
    }

    else
      return res.status(500).send({ message: "Error inserting user in the database." });
  }

  return res.status(405).send({ message: "Method not allowed." });
}