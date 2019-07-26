const pLimit = require('p-limit');
const fakeDownload = require('../helpers/fake-download');

const Utils = (() => {
  return {
    getHostFromString(url) {
        let hostname;

        if (url.indexOf("//") > -1) {
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
      let downloadsCount = 0;
      let downloads = [];

      Object.keys(hostGroups).forEach((host, index) => {
        const limitPerHost = pLimit(3);
        downloadsCount += hostGroups[host].length;
        hostDownloadGroups[index] = hostGroups[host].map(url => {
          return limitPerHost(() => fakeDownload(url))
        });
      });


      while (hostGroups.length) {
        hostGroups.forEach(group => {
          const downloadsChunk = group.splice(0, 3);
          downloads = [ ...downloads, group.splice(0, 3)]; //3 pLimit

          if (!group.length) {
            const groupIndex = hostGroups.indexOf(group);
            hostGroups.splice(groupIndex, 1);
          }
        });
      }


      const limit = pLimit(10);
      const promises = downloads.map(fn => {
          return limit(() => fn());
      });

      return Promise.all(promises);
    }
  }
})();

module.exports = Utils;
