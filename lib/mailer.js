import NodeMailer from 'nodemailer';

class _Mailer {
  constructor() {
    this.sender = NodeMailer.createTransport(process.env.MAIL_URL);
  }

  async send(subject, text, to) {
    const data = {
      from: process.env.MAIL_FROM,
      to: to,
      subject: subject,
      text: text
    }

    try { await this.sender.sendMail(data); }
    catch (error) { return error }
  }
}

const Mailer = new _Mailer();
export default Mailer;