import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import 'dotenv/config';

const { MAIL_API_KEY, BASE_URL_HOST } = process.env;

const mailerSend = new MailerSend({
  apiKey: MAIL_API_KEY,
});

// Відправник
const sentFrom = new Sender(
  'noreply@trial-ynrw7gyoj8nl2k8e.mlsender.net',
  'Helper Name'
);

// Функція для створення параметрів email
const createEmailParams = ({ email, verificationCode }) => {
  const recipients = [new Recipient(email, 'Your Client')];

  const personalization = [
    {
      email: email,
      data: {
        account: {
          email: email, // додаткові дані акаунту
        },
        support_src: `${BASE_URL_HOST}/api/auth/verify/${verificationCode}`,

        support_email: 'support@example.com',
      },
    },
  ];

  return new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject('Verify my email address')
    .setTemplateId('351ndgwod754zqx8')
    .setPersonalization(personalization);
};

// Функція для відправки email
const sendEmail = async (email, verificationCode) => {
  try {
    const emailParams = createEmailParams({ email, verificationCode });
    const response = await mailerSend.email.send(emailParams);
    console.log('Email відправлено успішно:', response);
    return response;
  } catch (error) {
    console.error('Помилка при відправці email:', error);
    throw error;
  }
};

export default { sendEmail };
