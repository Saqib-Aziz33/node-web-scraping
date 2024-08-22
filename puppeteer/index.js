const puppeteer = require("puppeteer");
const chalk = require("chalk");
const fs = require("fs");
const ora = require("ora");

const print = console.log;
const spinner = ora({
  text: "",
  color: "blue",
  hideCursor: false,
});

/**
 * FUNCTIONS REFERNCES
 */
// DocsExample();
// takeScreenshot();
fetchReactBasedSite();
// findGithubUser();

/**
 * FUNCTIONS DEFINATIONS
 */
async function DocsExample() {
  const browser = await puppeteer.launch({
    // headless: false,
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto("https://developer.chrome.com/");

  // Set screen size.
  await page.setViewport({ width: 1080, height: 1024 });

  // Type into search box.
  await page.locator(".devsite-search-field").fill("automate beyond recorder");

  // Wait and click on first result.
  await page.locator(".devsite-result-item-link").click();

  // Locate the full title with a unique string.
  const textSelector = await page
    .locator("text/Customize and automate")
    .waitHandle();
  const fullTitle = await textSelector?.evaluate((el) => el.textContent);

  // Print the full title.
  console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
}

async function takeScreenshot() {
  spinner.text = "fetching...";
  spinner.start();
  const url = "https://serene-semolina-cbb303.netlify.app/";
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://pptr.dev/guides/getting-started");
  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  const ss = await page.screenshot({ fullPage: true, type: "png" });
  spinner.text = "saving file";
  fs.writeFileSync("./ss.png", ss);
  spinner.succeed("saved");
  spinner.clear();

  // const headTag = await page.$('head')
}

async function fetchReactBasedSite() {
  const url = "https://serene-semolina-cbb303.netlify.app/";
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  // Set screen size
  await page.setViewport({ width: 1366, height: 640 });
  // const html = await page.evaluate(
  //   () => document.getElementById("root").innerHTML
  // );
  // await page.locator(".comming-soon-section").scroll({
  //   scrollTop: "50px",
  // });
  const html = await page.content();
  console.log(html);
}

async function findGithubUser() {
  const url = "https://github-finder-five-phi.vercel.app/";
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(url);
  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  await page.locator('input[type="text"]').fill("saqib aziz");
  await page.locator('button[type="submit"]').click();
  // await browser.close();
}
