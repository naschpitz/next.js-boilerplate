import Sessions from '../../../lib/sessions/dao';
import Users from '../../../lib/users/dao';

export default async function info(req, res) {
  if (req.method === "GET") {
    const isValid = await Sessions.isValid(req, res);

    if (!isValid)
      return res.status(403).json({ message: "Invalid session token." });

    const sessionCookieObj = Sessions.getCookieObject(req, res);

    const userId = sessionCookieObj.userId;
    const user = await Users.findById(userId).select('email.address email.verified');

    const session = await Sessions.findOne().byOwner(userId);
    await session.genToken(req, res);

    return res.status(200).json({ user });
  }

  return res.status(405).json({ message: "Method not allowed." });
}