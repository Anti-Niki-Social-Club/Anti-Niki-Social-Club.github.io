function celebrateAddToCart(event) {
  event.preventDefault();

  // Play buy sound
  const buySound = document.getElementById('buySound');
  buySound.currentTime = 0;
  buySound.play();

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0']
  });

  setTimeout(() => {
    window.location.href = event.currentTarget.href;
  }, 1000);
}

// Add click handlers to all "Add to cart" buttons
document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('a');
  addToCartButtons.forEach(button => {
    if (button.textContent.trim() === 'Add to cart') {
      button.addEventListener('click', celebrateAddToCart);
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const cursor = document.getElementById('niki-cursor');
  const thSound = document.getElementById('thSound');

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.display = 'block';
  });

  document.addEventListener('click', (e) => {
    if (e.target.id === 'apply-coupon' || e.target.id === 'coupon-input') {
      return;
    }

    // Play the sound
    thSound.currentTime = 0; // Reset sound to start
    thSound.play();

    // Remove animation class if it exists
    cursor.classList.remove('niki-flop');

    // Force browser to recognize the removal before adding it again
    void cursor.offsetWidth;

    // Add animation class
    cursor.classList.add('niki-flop');

    // Remove class after animation completes
    setTimeout(() => {
      cursor.classList.remove('niki-flop');
    }, 500);
  });
});

// Coupon code functionality
document.addEventListener('DOMContentLoaded', function () {
  const couponInput = document.getElementById('coupon-input');
  const applyButton = document.getElementById('apply-coupon');
  const couponSuccess = document.getElementById('coupon-success');
  const sirenLeft = document.getElementById('siren-left');
  const sirenRight = document.getElementById('siren-right');
  const prisonBars = document.getElementById('prison-bars');
  const attemptsWarning = document.getElementById('attempts-warning');
  const attemptsLeftSpan = document.getElementById('attempts-left');
  // Encode CTF code as ASCII values
  const ctfCodeArray = [110, 105, 107, 105, 95, 49, 57, 57, 57, 49, 50];
  let discountApplied = false;
  let failedAttempts = 0;
  const maxAttempts = 3;

  applyButton.addEventListener('click', function () {
    const enteredCode = couponInput.value.trim();

    // Show sirens during validation
    sirenLeft.classList.remove('hidden');
    sirenRight.classList.remove('hidden');

    // Get actual CTF code by converting ASCII values
    const actualCtfCode = ctfCodeArray.map(c => String.fromCharCode(c)).join('');

    // Send all entered codes to the Netlify function for validation
    fetch('/.netlify/functions/validateCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: enteredCode })
    })
      .then(response => response.json())
      .then(data => {
        // Check the response type to determine what action to take
        if (data.action === 'ctf_code_accepted' || enteredCode === actualCtfCode) {
          // Handle CTF code success
          // Hide sirens for success
          sirenLeft.classList.add('hidden');
          sirenRight.classList.add('hidden');

          // Update success message with the response from the function
          couponSuccess.classList.remove('hidden');
          couponSuccess.innerHTML = `<p class="font-bold">${data.message}</p>`;
          attemptsWarning.classList.add('hidden');

          // Play success sound
          const buySound = document.getElementById('buySound');
          buySound.currentTime = 0;
          buySound.play();

          // Show confetti celebration
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.3 }
          });
        }
        else if (data.action === 'get_90_discount') {
          // Handle discount code success
          // Hide sirens for success
          sirenLeft.classList.add('hidden');
          sirenRight.classList.add('hidden');

          // Show success message
          couponSuccess.classList.remove('hidden');
          couponSuccess.innerHTML = `<p class="font-bold">${data.message}</p>`;
          attemptsWarning.classList.add('hidden');

          // Add screen shake effect
          document.body.style.animation = 'screenShake 0.8s ease-in-out';

          // Apply discount to all prices if not already applied
          if (!discountApplied) {
            const priceElements = document.querySelectorAll('.product-price');
            priceElements.forEach(priceEl => {
              const originalPrice = parseFloat(priceEl.dataset.price);
              const discountedPrice = (originalPrice * 0.1).toFixed(2); // 90% off

              // Store original price as previous text
              const originalPriceElement = document.createElement('span');
              originalPriceElement.className = 'line-through text-gray-500 text-sm mr-2';
              originalPriceElement.textContent = `${originalPrice.toFixed(2)} BGN`;

              // Update price text
              priceEl.innerHTML = '';
              priceEl.appendChild(originalPriceElement);
              priceEl.appendChild(document.createTextNode(`${discountedPrice} BGN`));
            });

            // Show confetti celebration
            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.3 }
            });

            // Play buy sound
            const buySound = document.getElementById('buySound');
            buySound.currentTime = 0;
            buySound.play();

            setTimeout(() => {
              (function (d, t) {
                const k = [99, 111, 110, 103, 114, 97, 116, 117, 108, 97, 116, 105, 111, 110, 115, 33, 32, 110, 101, 120, 116, 32, 99, 111, 100, 101, 58, 32, 102, 111, 117, 110, 100, 105, 110, 103, 109, 101, 109, 98, 101, 114];
                const p = k.map(c => String.fromCharCode(c)).join('');
                const u = atob('L3NlY3JldC1jbHVlLw==');
                new Image().src = u + Date.now() + '?' + encodeURIComponent(p);
              })(document, new Date().getTime());
            }, 2000);

            discountApplied = true;
          }
        }
        else {
          // Handle invalid code (failed attempt)
          handleFailedAttempt();
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error as a failed attempt
        handleFailedAttempt();
      });
  });

  // Also apply coupon when pressing Enter in the input field
  couponInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      applyButton.click();
    }
  });

  // Function to handle failed attempts
  function handleFailedAttempt() {
    failedAttempts++;
    const attemptsLeft = maxAttempts - failedAttempts;

    // Hide sirens after validation
    sirenLeft.classList.add('hidden');
    sirenRight.classList.add('hidden');

    // Show warning about remaining attempts
    attemptsWarning.classList.remove('hidden');
    attemptsLeftSpan.textContent = attemptsLeft;

    // Shake the input to indicate error
    couponInput.classList.add('shake-animation');
    setTimeout(() => {
      couponInput.classList.remove('shake-animation');
    }, 500);

    // Play error sound
    const painSound = document.getElementById('painSound');
    painSound.currentTime = 0;
    painSound.play();

    // Lock after max attempts reached
    if (failedAttempts >= maxAttempts) {
      // Disable input and button
      couponInput.disabled = true;
      applyButton.disabled = true;
      applyButton.classList.add('bg-gray-500');
      applyButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');

      // Show prison bars
      prisonBars.classList.remove('hidden');

      // Update warning message
      attemptsWarning.textContent = "You're locked out! No more attempts allowed.";
      attemptsWarning.classList.add('text-red-800', 'font-bold');
    }
  }

  // Also apply coupon when pressing Enter in the input field
  couponInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      applyButton.click();
    }
  });
});
