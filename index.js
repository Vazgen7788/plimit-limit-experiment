const Utils = require('./modules/Utils');
const fakeUrls = require('./helpers/fake-urls')

Utils.downloadFiles(fakeUrls).then(() => {
  console.log('💪 GREAT JOB !!! All files downloaded.');
});

