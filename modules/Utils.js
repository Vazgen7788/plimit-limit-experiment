const pLimit = require('p-limit');
const fakeDownload = require('../helpers/fake-download');

const Utils = (() => {
  let hostConcurency = 3;
  let systemConcurency = 10;

  return {
    getHostFromString(url) {
        let hostname;

        if (url.indexOf('//') > -1) {
          hostname = url.split('/')[2];
        } else {
          hostname = url.split('/')[0];
        }

        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];

        return hostname;
    },

    groupUrlsByHost(urls) {
      const hostGroups = {};

      urls.forEach(url => {
        const host = this.getHostFromString(url);

        if (hostGroups[host]) {
          hostGroups[host].push(url);
        } else {
          hostGroups[host] = [url];
        }
      });

      return hostGroups;
    },

    downloadFiles(urls = []) {
      const hostGroups = this.groupUrlsByHost(urls);
      const hostDownloadGroups = [];
      let downloads = [];

      Object.keys(hostGroups).forEach((host, index) => {
        const limitPerHost = pLimit(hostConcurency);
        hostDownloadGroups[index] = hostGroups[host].map(url => {
          return () => limitPerHost(() => fakeDownload(url))
        });
      });

      while (hostDownloadGroups.length) {
        hostDownloadGroups.forEach(group => {
          const downloadsChunk = group.splice(0, hostConcurency);
          downloads = [ ...downloads, ...downloadsChunk];

          if (!group.length) {
            const groupIndex = hostDownloadGroups.indexOf(group);
            hostDownloadGroups.splice(groupIndex, 1);
          }
        });
      }

      const limit = pLimit(systemConcurency);
      const promises = downloads.map(fn => {
          return limit(() => fn());
      });

      return Promise.all(promises);
    }
  }
})();

module.exports = Utils;
