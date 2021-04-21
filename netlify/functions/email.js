const Mailgun = require('mailgun-js');

const sendThankYouEmail = async ({data}) => {
  return new Promise((resolve, reject) => {
    console.log('Sending the email');
    const {
      MG_API_KEY: apiKey,
      MG_DOMAIN: domain,
      MG_EMAIL: email,
    } = process.env;
    const mailgun = Mailgun({
      apiKey,
      domain
    });

    const mailData = {
      from: email,
      to: email,
      subject: 'mouse-tracker',
      text: JSON.stringify(data),
    };

    mailgun.messages().send(mailData, err => {
      if (err) return reject(err);

      resolve();
    });
  });
};

exports.handler = async event => {
  try {
    const data = JSON.parse(event.body);

    await sendThankYouEmail(data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "email sent"
      })
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: e.message
    };
  }
};
