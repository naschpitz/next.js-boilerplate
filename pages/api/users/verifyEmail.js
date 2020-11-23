import AbsoluteUrl from 'next-absolute-url';

import handleError from '../../../lib/handleError';
import Mailer from '../../../lib/mailer';
import Sessions from '../../../lib/sessions/dao';
import Users from '../../../lib/users/dao';

export default  async function verifyEmail(req, res) {
  if (req.method === "POST") {
    const { origin } = AbsoluteUrl(req, 'localhost:3000');

    const isValid = await Sessions.isValid(req, res);

    if (!isValid)
      return res.status(401).json({ message: "Invalid session token." });

    const session = await Sessions.findOne().byCookie(req, res).populate('owner');
    const user = session.owner;

    if (!user)
      return res.status(404).json({ message: "User not found." });

    let token;

    try {
      token = await user.genEmailVerificationToken();
    }

    catch (error) {
      return handleError(req, res, error);
    }

    let text = "Hello!";
    text += "\r\n\r\n";
    text += "To verify your e-mail click the link bellow.";
    text += "\r\n\r\n";
    text += origin + "/api/users/verifyEmail?token=" + token;
    text += "\r\n\r\n";
    text += "Thanks!";

    const email = user.email.address;
    const response = await Mailer.send("E-mail Verification", text, email);

    if (response)
      return res.status(500).json({ message: "Mail server connection error." });

    return res.status(201).json({});
  }

  if (req.method === "GET") {
    const { token } = req.query;

    const user = await Users.findOne().byEmailVerificationToken(token);

    if (!user)
      return res.redirect(302, '/?emailVerification=invalidToken');

    try {
      await user.validateEmail();
    }

    catch (error) {
      return handleError(req, res, error);
    }

    return res.redirect(302, '/?emailVerification=success');
  }

  return res.status(405).json({ message: "Method not allowed." });
}