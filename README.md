# Amazon Scraper

Welcome to the Amazon Scraper repository! This project provides a web scraping solution to retrieve product information from Amazon's website based on user-provided keywords. With this tool, you can easily search for products on Amazon and extract essential details such as titles, ratings, number of reviews, and images.

## Live Demo

You can try out the Amazon Scraper by visiting the live demo [here](https://amazonscrapped.vercel.app/). Feel free to enter any search term and explore the scraped results!

## Features

- **Search Products**: Enter any search term to retrieve relevant products from Amazon.
- **Dynamic Results**: Results are dynamically fetched and displayed on the web page.
- **Product Details**: View important details including product titles, ratings, number of reviews, and images.
- **Responsive Design**: The application is designed to work seamlessly across various devices and screen sizes.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js, Puppeteer
- **Deployment**: Vercel (Frontend), Render (Backend)

## Getting Started

To run the Amazon Scraper locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using **npm install**.
4. Start the backend server using **npm run start**.
5. Open the provided frontend URL in your browser.

## How it Works

The Amazon Scraper utilizes Puppeteer, a Node library for controlling headless Chrome, to scrape product information from Amazon's search results page. When a user enters a search term, the frontend sends a request to the backend server, which then launches a headless browser, navigates to the Amazon search page, and extracts relevant product details. The scraped data is then sent back to the frontend and displayed to the user.

## Contribution

Contributions to the Amazon Scraper project are welcome! If you find any bugs, have feature requests, or want to contribute enhancements, please feel free to open an issue or submit a pull request.
