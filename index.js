const Utils = require('./modules/Utils');

const listOfUrls = [
  'https://google.com',
  'https://facebook.com',
  'https://yahoo.com',
  'https://yandex.com',
  'https://intercom.com',
  'https://ngrok.com',
  'https://gmail.com',
  'https://apple.com',
  'https://samsung.com',
];


Utils.downloadFiles(listOfUrls).then(() => {
  console.log('GREAT !!! All files downloaded.');
});

