import Sessions from '../../../lib/sessions/dao';
import Users from '../../../lib/users/dao';

export default async function login(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing fields to login." });

    const user = await Users.findOne().byEmailPassword(email, password).select("email.address email.verified role");

    if (!user)
      return res.status(404).json({ message: "Wrong username and/or password." });

    const userId = user._id;

    const session = await Sessions.findOne().byOwner(userId);
    await session.genToken(req, res);

    return res.status(201).json(user);
  }

  return res.status(405).json({ message: "Method not allowed." });
}