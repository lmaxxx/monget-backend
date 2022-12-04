const nodemailer = require("nodemailer")
const getVerificationEmailTemplate = require("../emailTemplates/verificationEmail")

class MailService {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })

  async sendActivationMail(to, link, name) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Monget`,
      text: "",
      html: getVerificationEmailTemplate(name, link)
    })
  }
}

module.exports = new MailService()
