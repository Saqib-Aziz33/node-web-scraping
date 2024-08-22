/**
 * REFERENCE: https://www.toptal.com/puppeteer/headless-browser-puppeteer-tutorial
 */
const puppeteer = require("puppeteer");

// scrape new, title and link, and show in console
async function ScrapeHackerNews() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://news.ycombinator.com/");
    let urls = await page.evaluate(() => {
      let results = [];
      //   let items = document.querySelectorAll("a.storylink");
      //   new rules, they updated their structure 😒😒😒😒
      let items = document.querySelectorAll("span.titleline > a");
      items.forEach((item) => {
        results.push({
          url: item.getAttribute("href"),
          text: item.innerText,
        });
      });
      return results;
    });
    await browser.close();
    console.log("data:");
    console.log(urls);
    console.log("total records:", urls.length);
  } catch (e) {
    console.log("error:", e.message);
  }
}

// same features as above func, it also includes mulitple pages
async function ScrapeHackerNewsMultiPages(pagesToScrape = 5) {
  try {
    if (!pagesToScrape) {
      pagesToScrape = 1;
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://news.ycombinator.com/");
    let currentPage = 1;
    let urls = [];
    while (currentPage <= pagesToScrape) {
      let newUrls = await page.evaluate(() => {
        let results = [];
        // let items = document.querySelectorAll("a.storylink");
        //   new rules, they updated their structure 😒😒😒😒
        let items = document.querySelectorAll("span.titleline > a");

        items.forEach((item) => {
          results.push({
            url: item.getAttribute("href"),
            text: item.innerText,
          });
        });
        return results;
      });
      urls = urls.concat(newUrls);
      if (currentPage < pagesToScrape) {
        await Promise.all([
          await page.click("a.morelink"),
          //   changed here tooo 💀
          await page.waitForSelector("span.titleline > a"),
        ]);
      }
      currentPage++;
    }
    await browser.close();
    console.log("data:");
    console.log(urls);
    console.log("total records:", urls.length);
  } catch (e) {
    console.log("error:", e.message);
  }
}

module.exports = {
  ScrapeHackerNews,
  ScrapeHackerNewsMultiPages,
};
