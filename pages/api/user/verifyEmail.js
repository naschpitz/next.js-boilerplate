import AbsoluteUrl from 'next-absolute-url';

import Mailer from '../../../lib/mailer';
import Session from '../../../lib/session';
import Users from '../../../lib/users/server/class';
import UsersDAO from '../../../lib/users/server/dao';

export default async function verifyEmail(req, res) {
  if (req.method === "POST") {
    const { origin } = AbsoluteUrl(req, 'localhost:3000');

    const session = new Session(req, res);
    const isValid = await session.isValid();

    if (!isValid)
      return res.status(403).send({ message: "Invalid session token." });

    const sessionObj = session.getObject();

    const userId = sessionObj.userId;
    const user = await UsersDAO.getById(userId);

    if (!user)
      return res.status(404).send({ message: "User not found." });

    const token = await Users.genEmailVerificationToken(userId);

    let text = "Hello!";
    text += "\r\n\r\n";
    text += "To verify your e-mail click the link bellow.";
    text += "\r\n\r\n";
    text += origin + "/api/user/verifyEmail?token=" + token;
    text += "\r\n\r\n";
    text += "Thanks!";

    const email = user.email.address;
    const response = await Mailer.send("E-mail Verification", text, email);

    if (response)
      return res.status(500).send({ message: "Mail server connection error." });

    return res.status(201).send("");
  }

  if (req.method === "GET") {
    const { token } = req.query;

    const user = await UsersDAO.getByEmailVerificationToken(token);

    if (!user) {
      res.writeHead(302, { Location: '/?emailVerification=invalidToken' });
      return res.end();
    }

    const userId = user._id;
    await UsersDAO.setEmailVerified(userId, true);

    await UsersDAO.unsetEmailVerificationToken(userId);

    res.writeHead(302, { Location: '/?emailVerification=success' });
    return res.end();
  }

  return res.status(405).send({ message: "Method not allowed." });
}