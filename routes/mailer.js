var nodemailer = require('nodemailer');

var smtpConfig = {
    host: 'smtp.mailgun.org',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.mailsender,
        pass: process.env.mailsenderpass
    }
};

var transporter = nodemailer.createTransport(smtpConfig);

transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Mailserver is ready to take our messages');
   }
});

module.exports = {
  send: (html) => {
    const p = new Promise();
    transporter.sendMail({
      from: process.env.mailsender,
      to: [process.env.mailreceiver],
      subject: 'Заказ в магазине автосмазок',
      html,
    }, (err, res) => {
      err ? p.reject(err) : p.resolve(res);
    });
    return p;
  },
};
