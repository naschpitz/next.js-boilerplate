import Sessions from '../../../lib/sessions/dao';

export default async function logout(req, res) {
  if (req.method === "PUT") {
    const isValid = await Sessions.isValid(req, res);

    if (!isValid)
      return res.status(401).json({ message: "Invalid session token." });

    Sessions.invalidate(req, res);

    return res.status(200).json({});
  }

  return res.status(405).json({ message: "Method not allowed." });
}