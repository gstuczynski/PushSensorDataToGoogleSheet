var google = require('googleapis');
var sheets = google.sheets('v4');

function sendDataToSheet(auth, temp, hum) {
  d = dn = new Date()
  var spreadsheetId

  if (d.getDay() == 7 || !spreadsheetId) {
    dn.setDate(dn.getDate() + 7)
    title = d.toLocaleDateString() + "-" + dn.toLocaleDateString()
    addSheet(auth, title).then(id => {
      instertData(auth, "Temperature", "Humidity ", id);
      spreadsheetId = instertData(auth, temp, hum, id, d);
    })
  } else {
    instertData(auth, temp, spreadsheetId, d)
  }
}
module.exports = sendDataToSheet;

function addSheet(auth, title) {
  return new Promise((resolve, reject) => {
    var request = {
      resource: {
        "properties": {
          "title": title
        }
      },
      auth: auth
    }
    sheets.spreadsheets.create(request, function (err, response) {
      if (err) {
        console.log(err);
        reject('The API returned an error: ' + err);
        return;
      }
      console.log(JSON.stringify(response, null, 2));
      resolve(response.spreadsheetId)
    });
  });
}

function instertData(auth, temp, hum, id, d) {
  if (!d) {
    d = "Date"
  } else {
    d = d.toLocaleDateString() + " " + d.toLocaleTimeString('pl-PL')
  }
  var request = {
    spreadsheetId: id,
    range: 'Arkusz1!A1:B14',
    valueInputOption: 'RAW',

    resource: {
      "range": "Arkusz1!A1:B14",
      "values": [
        [d, temp, hum]
      ],
    },
    auth: auth
  };

  sheets.spreadsheets.values.append(request, function (err, response) {
    if (err) {
      return;
    }
  });
  return id;
}