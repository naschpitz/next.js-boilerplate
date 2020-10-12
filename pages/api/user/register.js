import AbsoluteUrl from 'next-absolute-url';

import Mailer from '../../../lib/mailer';
import Session from '../../../lib/session';
import Users from '../../../lib/users/server/class';
import UsersDAO from '../../../lib/users/server/dao';

export default async function register(req, res) {
  if (req.method === "POST") {
    const { origin } = AbsoluteUrl(req, 'localhost:3000');
    const { email, password } = req.body;

    const exists = await Users.checkEmailExists(email);

    if (exists)
      return res.status(409).send({ message: "There is already a registered user with this e-mail." });

    const user = { email: { address: email }, password: password };

    let response;

    try {
      response = await UsersDAO.insert(user);
    }

    catch (error) {
      return res.status(400).send({ message: error.message });
    }

    if (!response.result.ok)
      return res.status(500).send({ message: "Error inserting user in the database." });

    const userId  = response.insertedIds[0];

    const session = new Session(req, res);
    await session.genSecret(userId);
    await session.genToken(userId);

    const token = await Users.genEmailVerificationToken(userId);

    let text = "Welcome!";
    text += "\r\n\r\n";
    text += "To verify your e-mail click the link bellow.";
    text += "\r\n\r\n";
    text += origin + "/api/user/verifyEmail?token=" + token;
    text += "\r\n\r\n";
    text += "Thanks!";

    response = await Mailer.send("Welcome to Next.js Boilerplate", text, email);

    if (response)
      return res.status(500).send({ message: "Mail server connection error." });

    return res.status(201).send("");
  }

  return res.status(405).send({ message: "Method not allowed." });
}