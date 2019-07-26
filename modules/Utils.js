const pLimit = require('p-limit');
const fakeDownload = require('../helpers/fake-download');

const Utils = (() => {
  const limit = pLimit(3);

  return {
    async downloadFiles(urls) {
      const promises = urls.map(url => {
          return limit(() => fakeDownload(url));
      });

      return Promise.all(promises);
    }
  }
})();

module.exports = Utils;
