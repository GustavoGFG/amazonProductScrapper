import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import chrome from 'chrome-aws-lambda';
// import puppeteer from 'puppeteer-core';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Server working');
// });

app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/api/scraped', async (req, res) => {
  const keyword = req.body.keyword;
  const url = `https://www.amazon.com.br/s?k=${keyword}`;
  console.log(keyword);
  console.log(url);
  try {
    const browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      // ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      // waitUntil: 'networkidle2',
    });
    await page.reload({ waitUntil: 'networkidle2' });
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
