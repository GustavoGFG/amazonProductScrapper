import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// import chromeModule from 'chrome-aws-lambda';
// import puppeteerCore from 'puppeteer-core';
// import puppeteerModule from 'puppeteer';
import puppeteer from 'puppeteer-core';
// let chrome;
// let puppeteer;

// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//   chrome = chromeModule;
//   puppeteer = puppeteerCore;
// } else {
//   puppeteer = puppeteerModule;
// }

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Server working');
});

app.post('/api/scraped', async (req, res) => {
  // let options = {};
  // if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  options = {
    args: [
      ...chrome.args,
      '--hide-scrollbars',
      '--disable-web-security',
      '--enable-gpu',
    ],
    defaultViewport: chrome.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chrome.executablePath),
    headless: true,
    ignoreHTTPSErrors: true,
  };
  // }

  const keyword = req.body.keyword;
  const url = `https://www.amazon.com.br/s?k=${keyword}`;
  console.log(keyword);
  console.log(url);
  try {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('[data-component-type="s-search-result"]');

    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll(
        '[data-component-type="s-search-result"]'
      );
      const productsArray = [];

      productElements.forEach(element => {
        const obj = { title: '', rating: '', numberOfReviews: '', img: '' };

        const productTitle = element.querySelector('h2 span');
        obj.title = productTitle ? productTitle.textContent : 'N/A';

        const numberReviewsElement = element.querySelector(
          '.a-size-base.s-underline-text'
        );
        obj.numberOfReviews = numberReviewsElement
          ? Number(numberReviewsElement.textContent)
          : 'N/A';

        const ratingElement = element.querySelector('.a-icon-alt');
        obj.rating = ratingElement
          ? Number(ratingElement.textContent.split(' ')[0].replace(',', '.'))
          : 'N/A';

        const imgElement = element.querySelector('.s-image');
        obj.img = imgElement ? imgElement.getAttribute('src') : 'N/A';

        productsArray.push(obj);
      });

      return productsArray;
    });

    await browser.close();

    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
