import UsersDAO from '../../../lib/dao/users';

export default async function checkEmailExists(req, res) {
  if (req.method === "GET") {
    const { email } = req.query;

    const exists = await UsersDAO.checkEmailExists(email);

    return res.status(200).send({ exists });
  }
}