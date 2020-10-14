import Session from '../../../lib/session';

export default async function logout(req, res) {
  if (req.method === "POST") {
    const session = new Session(req, res);

    session.invalidate();

    return res.status(201).json({});
  }

  return res.status(404).json({});
}