const cheerio = require("cheerio");
const chalk = require("chalk");
const fs = require("fs");
const ora = require("ora");
const _ = require("lodash");
const axios = require("axios");

print = console.log;
const spinner = ora({
  text: "",
  color: "blue",
  hideCursor: false,
});

function basics() {
  const $ = cheerio.load(
    `<h2 class="title">Hello world
  <p class="subtitle">subtitle</p>
  </h2>
  
  `
  );

  //   get data
  const heading = $("h2.title").find(".subtitle").text();
  //   append data
  $("h2").after("<h3>How are you?</h3>");

  print($.html());
}

async function parseFromUrl() {
  spinner.text = "Fetching URL";
  spinner.start();
  try {
    const $ = await cheerio.fromURL(
      "https://cheerio.js.org/docs/basics/loading"
    );
    // write inside file
    // spinner.text = "SAVING INSIDE FILE";
    // fs.writeFile("document.html", $.html(), "utf-8", (err) => {
    //   if (err) {
    //     print(chalk.red("ERROR while Writing file", err));
    //     return;
    //   }
    //   spinner.succeed("DATA SAVED");
    //   spinner.clear();
    // });
    // show all the script tags, where src start with /assets
    let scriptTags = $(`script[src^="/assets"]`);
    print(chalk.blue(scriptTags));
    spinner.succeed("logged all the script tags");
    spinner.clear();
  } catch (e) {
    print(chalk.red("ERROR while Fetching", e));
  }
}

async function temp() {
  spinner.text = "fetching url";
  spinner.start();
  const $ = await cheerio.fromURL(
    "https://github.com/cheeriojs/cheerio/releases"
  );

  const c_data = $.extract({
    releases: [
      {
        // First, we select individual release sections.
        selector: "section",
        // Then, we extract the release date, name, and notes from each section.
        value: {
          // Selectors are executed within the context of the selected element.
          name: "h2",
          date: {
            selector: "relative-time",
            // The actual release date is stored in the `datetime` attribute.
            value: "datetime",
          },
          notes: {
            selector: ".markdown-body",
            // We are looking for the HTML content of the element.
            value: "innerHTML",
          },
        },
      },
    ],
  });

  //   save to json file
  fs.writeFile("document.json", JSON.stringify(c_data), "utf-8", (err) => {
    if (err) {
      print(chalk.red("ERROR while Writing file", err));
      return;
    }
    spinner.succeed("DATA SAVED");
    spinner.clear();
  });
  const data = $.extract({
    releases: [
      {
        selector: ".Box-body",
        value: {
          name: "a",
        },
      },
    ],
  });

  spinner.succeed("data fetched");
  spinner.clear();
  //   console.log(c_data);
  //   console.log(data);
}

async function scrapWikipediaBooks() {
  spinner.text = "fetching...";
  spinner.start();
  try {
    const responce = await axios.get(
      "https://en.wikibooks.org/wiki/Department:Computing"
    );
    spinner.succeed("data fetched");
    spinner.clear();
    const $ = cheerio.load(responce.data);
    const data = $.extract({
      books: [
        {
          selector: "table li",
          value: {
            name: "a",
            link: {
              selector: "a",
              value: "href",
            },
          },
        },
      ],
    });
    console.log(data);
  } catch (e) {
    console.log("ERROR", e.message);
  }
}

async function scrapReactBasedProject() {
  // cheerio cannot run JS, hence puppeteer will be used for this purpose
  const url = "https://serene-semolina-cbb303.netlify.app/";
  spinner.text = "fetching...";
  spinner.start();
  try {
    const $ = await cheerio.fromURL(url);
  } catch (e) {
    print(chalk.red("ERROR", e.message));
  }
}

// basics();
// parseFromUrl();
// temp();
// scrapWikipediaBooks();
scrapReactBasedProject();
