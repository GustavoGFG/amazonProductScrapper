document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const resultContainer = document.getElementById('resultContainer');
  const loadingAnimation = document.getElementById('loadingAnimation');

  searchBtn.addEventListener('click', searchProducts);
  searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      searchProducts();
    }
  });

  async function searchProducts() {
    const searchedWord = searchInput.value.trim();

    if (searchedWord) {
      // Disable input and button
      searchInput.disabled = true;
      searchBtn.disabled = true;
      resultContainer.innerHTML = '';
      loadingAnimation.style.display = 'block';
      try {
        const response = await fetch(
          `https://amazonscrapperbackend.onrender.com//api/scrape?keyword=${encodeURIComponent(
            searchedWord
          )}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data! Try again.');
        }

        const data = await response.json();
        console.log(data);
        displayResults(data.data);
      } catch (error) {
        console.error(error.message);
        const failedTextElement = document.createElement('h2');
        failedTextElement.innerHTML = 'Failed to fetch data! Try again.';
        resultContainer.appendChild(failedTextElement);
      } finally {
        // Re-enable input and button
        searchInput.disabled = false;
        searchBtn.disabled = false;
        // Hide loading animation
        loadingAnimation.style.display = 'none';
      }
    } else {
      alert('Please enter a search term.');
    }
  }

  function displayResults(products) {
    resultContainer.innerHTML = '';

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('img-container');
      productDiv.appendChild(imgContainer);

      const img = document.createElement('img');
      img.src = product.img;
      img.alt = 'Product Image';
      imgContainer.appendChild(img);

      const title = document.createElement('h3');
      title.textContent = product.title;
      productDiv.appendChild(title);

      const ratingReviewContainer = document.createElement('div');
      ratingReviewContainer.classList.add('rating-review');
      productDiv.appendChild(ratingReviewContainer);

      if (product.rating) {
        const ratingContainer = document.createElement('div');
        ratingContainer.classList.add('rating-container');
        ratingContainer.innerHTML = generateStarRating(product.rating);
        ratingReviewContainer.appendChild(ratingContainer);
      }

      if (product.numberOfReviews != null) {
        const numReviews = document.createElement('p');
        numReviews.textContent = `${product.numberOfReviews}`;
        ratingReviewContainer.appendChild(numReviews);
      }
      if (product.rating != 'N/A' && product.numberOfReviews != null) {
        ratingReviewContainer.addEventListener('mouseover', () =>
          showRatingTooltip(product.rating, ratingReviewContainer)
        );
      }

      resultContainer.appendChild(productDiv);
    });
  }
  function showRatingTooltip(rating, container) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('rating-tooltip');
    tooltip.textContent = `Rating: ${rating}`;
    tooltip.style.position = 'absolute';
    tooltip.style.bottom = `${container.offsetBottom - tooltip.offsetHeight}px`;
    tooltip.style.left = `${container.offsetLeft + tooltip.offsetWidth}px`;
    container.appendChild(tooltip);

    container.addEventListener('mouseout', () =>
      container.removeChild(tooltip)
    );
  }

  function generateStarRating(rating) {
    var decimalNumber = rating % 1;
    var fullStars = Math.floor(rating);
    var halfStar = decimalNumber >= 0.39 && decimalNumber <= 0.71 ? 1 : 0;
    var emptyStars = 5 - fullStars - halfStar;

    if (decimalNumber > 0.71) {
      fullStars++;
      emptyStars--;
    }

    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fa-solid fa-star"></i>';
    }

    if (halfStar) {
      starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="fa-regular fa-star"></i>';
    }

    return starsHTML;
  }
});
