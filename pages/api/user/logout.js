import Sessions from '../../../lib/sessions/dao';

export default async function logout(req, res) {
  if (req.method === "POST") {
    Sessions.invalidate(req, res);

    return res.status(201).json({});
  }

  return res.status(404).json({});
}