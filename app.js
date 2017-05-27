const express = require('express');
const app = express();
const fs = require('fs');
const authorize = require('./authorize');
const sendDataToSheet = require('./sendDataToSheet');



app.get('/data/*', (req, res) => {
    fullreq = req.originalUrl
    var temp = fullreq.substring(fullreq.indexOf("temp=")+5,fullreq.indexOf("temp=")+10);
    var hum = fullreq.substring(fullreq.indexOf("hum=")+4,fullreq.indexOf("hum=")+9)
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        authorize(JSON.parse(content), function (auth) {
            sendDataToSheet(auth,temp, hum)
        });
    });
});
app.listen(3000);