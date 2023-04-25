const formData = require('form-data');
const Mailgun = require('mailgun.js');

const sendToMail = ( res, domain, key, messageData ) => {
    const mailgun = new Mailgun(formData);

		const client = mailgun.client({
			username: 'api', 
			key: key
		});

	client.messages.create(domain, messageData)
      .then( res => console.log(res) )
      .catch( err => console.error(err) )

      res.status(200).json(messageData)
    }

  module.exports = sendToMail