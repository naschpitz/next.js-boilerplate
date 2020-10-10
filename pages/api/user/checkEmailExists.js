import Users from '../../../lib/users/class';

export default async function checkEmailExists(req, res) {
  if (req.method === "GET") {
    const { email } = req.query;

    const exists = await Users.checkEmailExists(email);

    return res.status(200).send({ exists });
  }
}