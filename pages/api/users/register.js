import AbsoluteUrl from 'next-absolute-url';

import handleError from '../../../lib/handleError';
import Mailer from '../../../lib/mailer';
import Users from '../../../lib/users/dao';

export default async function register(req, res) {
  if (req.method === "POST") {
    const { origin } = AbsoluteUrl(req, 'localhost:3000');
    const { email, password } = req.body;

    let user = new Users({ email: { address: email }, password: { hash: password } });

    try {
      await user.save();
    }

    catch (error) {
      return handleError(req, res, error);
    }

    let text = "Welcome!";
    text += "\r\n\r\n";
    text += "To verify your e-mail click the link bellow.";
    text += "\r\n\r\n";
    text += origin + "/api/users/verifyEmail?token=" + user.email.token;
    text += "\r\n\r\n";
    text += "Thanks!";

    const response = await Mailer.send("Welcome to Next.js Boilerplate", text, email);

    if (response)
      return res.status(500).json({ message: "Mail server connection error." });

    user = user.toObject();
    delete user.password;
    delete user.email.token;

    return res.status(201).json(user);
  }

  return res.status(405).json({ message: "Method not allowed." });
}