const stars = document.querySelectorAll('.star');
const starsContainer = document.getElementById('stars');
const selectedRatingInput = document.getElementById('selectedRating');
const submitButton = document.getElementById('submitButton');

const ratingOutput = document.getElementById('ratingOutput');

const ratingForm = document.getElementById('ratingForm');
ratingForm.style.display = 'block';

starsContainer.addEventListener('mouseover', function(event) {
    const hoveredStar = event.target;
    const rating = hoveredStar.getAttribute('data-value');

    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= rating) {
            star.innerHTML = '&#10022;';
            star.style.color = 'white';
        } else {
            star.innerHTML = '&#10023;';
            star.style.color = '';
        }
    });
    let emoji = '';
    if (rating >= 0 && rating < 3) {
        emoji = '&#128577;'; // Sad emoji
    } else if (rating >= 3 && rating <4) {
        emoji = '&#128528;'; // Neutral emoji
    } else if (rating >= 4) {
        emoji = '&#128512;'; // Happy emoji
    }
    

    ratingOutput.innerHTML = emoji;
});

starsContainer.addEventListener('click', function(event) {
    const selectedStar = event.target;
    const rating = selectedStar.getAttribute('data-value');

    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= rating) {
            star.innerHTML = '&#10022;';
            star.style.color = 'white';
        } else {
            star.innerHTML = '&#10023;';
            star.style.color = '';
        }
    });

    selectedRatingInput.value = rating;
    if (!selectedRatingInput.value) {
        selectedRatingInput.value = '0';
    }
    if (selectedRatingInput.value === '0' || selectedRatingInput.value === '1' || selectedRatingInput.value === '2' || selectedRatingInput.value === '3' ) {
        ratingOutput.textContent = "Thank you for your feedback "+selectedRatingInput.value+" stars. We will do better!";}
    else if (selectedRatingInput.value === '4' || selectedRatingInput.value === '5' ) {
        ratingOutput.textContent = "Thank you for "+selectedRatingInput.value+" rating!";
    }

    const sentByInput = document.getElementById('sentByInput'); // Define sentByInput here

    // Add headers and set form values
    sentByInput.value = 'JS'; // Form payload value
    fetch('https://httpbin.org/post', {
        method: 'POST',
        body: new FormData(document.getElementById('ratingForm')),
        headers: {
            'X-Sent-By': 'JS' // Request header value
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Form submitted successfully!', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

starsContainer.addEventListener('mouseout', function() {
    stars.forEach(star => {
        star.innerHTML = '&#10023;';
        star.style.color = 'white';
    });
});
