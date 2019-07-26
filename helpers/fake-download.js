module.exports = function fakeDownload(url) {
  return new Promise(resolve => {
    console.log(`[→] downloading file from ${url}`);

    setTimeout(() => {
      console.log(`✅ FILE DOWNLOADED FROM ${url}`);
      resolve()
    }, 3000);
  });
}
