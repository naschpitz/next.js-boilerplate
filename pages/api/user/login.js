import Sessions from '../../../lib/sessions/dao';
import Users from '../../../lib/users/dao';

export default async function login(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const user = await Users.findOne().byEmailPassword(email, password);

    if (!user)
      return res.status(403).json({ message: "Wrong username and/or password." });

    const userId = user._id;

    const session = await Sessions.findOne().byOwner(userId);
    await session.genToken(req, res);

    return res.status(201).json({});
  }

  return res.status(405).json({ message: "Method not allowed." });
}