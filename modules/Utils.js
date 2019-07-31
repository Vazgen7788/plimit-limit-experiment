const pLimit = require('p-limit');
const fakeDownload = require('../helpers/fake-download');
const urlModule = require('url');

const Utils = (() => {
  let hostConcurency = 3;
  let systemConcurency = 10;

  return {
    downloadFiles(urls = []) {
      const hostLimits = {};
      const hostDownloadGroups = urls.reduce((hostGroups, url) => {
        const parsedUrl = urlModule.parse(url);

        if (hostGroups[parsedUrl.host]) {
          const limitPerHost = hostLimits[parsedUrl.host];
          hostGroups[parsedUrl.host].push(() => limitPerHost(() => fakeDownload(url)));
        } else {
          const limitPerHost = pLimit(hostConcurency);
          hostLimits[parsedUrl.host] = limitPerHost;
          hostGroups[parsedUrl.host] = [() => limitPerHost(() => fakeDownload(url))];
        }
        return hostGroups;
      }, {});

      const downloadCollections = Object.values(hostDownloadGroups);
      let promises = [];
      const limit = pLimit(systemConcurency);

      while (downloadCollections.length) {
        downloadCollections.forEach((collection, collectionIndex) => {
          const promisesChunk = collection.splice(0, hostConcurency).map(hostDownload => {
            return limit(() => hostDownload())
          });
          promises = [ ...promises, ...promisesChunk];

          if (!collection.length) {
            downloadCollections.splice(collectionIndex, 1);
          }
        });
      }

      return Promise.all(promises);
    }
  }
})();

module.exports = Utils;
