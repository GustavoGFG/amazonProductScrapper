document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const resultContainer = document.getElementById('resultContainer');

  searchBtn.addEventListener('click', async () => {
    const searchedWord = searchInput.value.trim();

    if (searchedWord) {
      try {
        const response = await fetch(
          'https://amazonscrapperbackend.onrender.com/api/scraped',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword: searchedWord }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        displayResults(data);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      alert('Please enter a search term.');
    }
  });

  function displayResults(products) {
    resultContainer.innerHTML = '';

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      const img = document.createElement('img');
      img.src = product.img;
      img.alt = 'Product Image';
      productDiv.appendChild(img);

      const title = document.createElement('h3');
      title.textContent = product.title;
      productDiv.appendChild(title);

      const rating = document.createElement('p');
      rating.textContent = `Rating: ${product.rating}`;
      productDiv.appendChild(rating);

      const numReviews = document.createElement('p');
      numReviews.textContent = `Number of Reviews: ${product.numberOfReviews}`;
      productDiv.appendChild(numReviews);

      resultContainer.appendChild(productDiv);
    });
  }
});
