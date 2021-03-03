const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { response } = require('express');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
  const email = req.body.email;
  const fName = req.body.firstName;
  const lName = req.body.lastName;

  const subData = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };
  const jsonSubData = JSON.stringify(subData);
  const url = 'https://us1.api.mailchimp.com/3.0/lists/07381bcaa3';
  const options = {
    method: 'POST',
    auth: 'faysal:e5c677cd0cb66d511fdbd48e65427c5e-us1',
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
    response.on('data', function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonSubData);
  request.end();
});

app.post('/failure', function (req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server is listening on port 3000...');
});

// apikey e5c677cd0cb66d511fdbd48e65427c5e-us1
// audience list 07381bcaa3
