import 'dotenv/config';
import nodemailer from 'nodemailer';
import jsonwebtoken from 'jsonwebtoken';
import * as fs from 'fs';

async function readCSS() {
  try {
    const cssContent = await fs.promises.readFile('./src/services/emailStyle.css', 'utf-8');
    return cssContent;
  } catch (error) {
    console.error('Erro ao ler o arquivo CSS:', error);
    return '';
  }
}

async function adaptHtml(text: string, title: string) {
  const css = await readCSS();
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>${title}</title>
      <style>${css}</style>
  </head>
  <body>
    <p>${text}</p>                                

  </body>
  </html>
  `;

  return html;
}


const EmailService = {
  async sendEmail(to: string, subject: string, html: string) {

    const transporter = nodemailer.createTransport(
      {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT as string) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    );

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject: 'Modelo brainMinder - ' + subject,
      html,
    };

    try{
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erro ao enviar email: ', error);
    }
  },

  async sendPasswordDefinitionEmail(email: string) {
    const token = await jsonwebtoken.sign({ email }, process.env.JWT_SECRET || 'secret');

    const subject = 'Definição de senha';
    const text = 'Clique no link abaixo para definir sua senha: ' + process.env.PLATFORM_URL + '/definir-senha/' + token;
    const html = await adaptHtml(text, subject);
    return this.sendEmail(email, subject, html);
  },

  async sendHappyNewYear(email: string) {
    const subject = 'Feliz Ano novo';
    const text = 'Um feliz ano novo da turminha do backend.';
    const html = await adaptHtml(text, subject);
    return this.sendEmail(email, subject, html);
  },

  async sendAccountValidationEmail(email: string) {
    const token = await jsonwebtoken.sign({ email }, process.env.JWT_SECRET || 'secret');

    const subject = 'Validação de e-mail';
    const text = 'Clique no link abaixo para validar seu e-mail: ' + process.env.PLATFORM_URL + 'validar-email/' + token;
    const html = await adaptHtml(text, subject);
    return this.sendEmail(email, subject, html);
  },
};

export default EmailService;