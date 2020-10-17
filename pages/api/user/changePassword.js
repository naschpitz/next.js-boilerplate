import handleError from '../../../lib/handleError';
import Sessions from '../../../lib/sessions/dao';

export default async function changePassword(req, res) {
  if (req.method === "POST") {
    const { oldPassword, newPassword } = req.body;

    const isValid = await Sessions.isValid(req, res);

    if (!isValid)
      return res.status(403).json({ message: "Invalid session token." });

    const session = await Sessions.findOne().byCookie(req, res).populate('owner');
    const user = session.owner;

    if (!user.comparePassword(oldPassword))
      return res.status(403).json({ message: "Wrong current password." });

    try {
      user.password.hash = newPassword;
      await user.save();
    }

    catch (error) {
      return handleError(req, res, error);
    }

    await session.genSecret();
    await session.genToken(req, res);

    return res.status(201).json({});
  }

  return res.status(405).json({ message: "Method not allowed." });
}