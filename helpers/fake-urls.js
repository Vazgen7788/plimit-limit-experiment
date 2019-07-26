function fillFakeUrls(basedOn, count) {
  const urls = [];
  for (let i = 1; i <= count; i++) {
    urls.push(`${basedOn}/${i}`);
  }
  return urls;
}


module.exports = [
  ...fillFakeUrls('https://google.com', 30),
  ...fillFakeUrls('https://yahoo.com', 20),
  ...fillFakeUrls('https://yandex.ru', 40),
  ...fillFakeUrls('https://apple.com', 10),
  ...fillFakeUrls('https://intercom.com', 15),
  ...fillFakeUrls('https://samsung.com', 25),
];
