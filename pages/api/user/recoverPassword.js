import AbsoluteUrl from 'next-absolute-url';

import Mailer from '../../../lib/mailer';
import Users from '../../../lib/users/server/class';

export default async function recoverPassword(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;
    const { origin } = AbsoluteUrl(req, 'localhost:3000');

    const exists = await Users.checkEmailExists(email);

    if (!exists)
      return res.status(404).send({ message: "E-mail not registered in the database." });

    const token = await Users.genPasswordRecoveryToken(email);

    let text = "Hello!";
    text += "\r\n\r\n";
    text += "To confirm you wish to reset your password click the link bellow.";
    text += "\r\n\r\n";
    text += origin + "/api/user/resetPassword?token=" + token;
    text += "\r\n\r\n";
    text += "Thanks!";

    const response = await Mailer.send("Password Reset", text, email);

    if (response)
      return res.status(500).send({ message: "Mail service connection error" });

    return res.status(201).send("");
  }

  return res.status(405).send({ message: "Method not allowed." });
}