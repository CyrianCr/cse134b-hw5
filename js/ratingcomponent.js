class RatingWidget extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            .rating {
                display: flex;
                justify-content: center;
                font-size: 3rem;
            }

            .star {
                color: white;
                cursor: pointer;
            }

            section {
                background-color: black;
                color: white;
                padding: 0.5rem;
                border: white 2px solid;
                margin: 1rem;
                border-radius: 0.5rem;
            }

            legend {
                font-size: 1.2rem;
                margin: 0.5rem;
            }

            button {
                background-color: #333;
                color: white;
                border: none;
                border-radius: 0.5rem;
                padding: 0.5rem;
                margin: 0.5rem;
                cursor: pointer;
            }
        `;

        const template = document.createElement('template');
        template.innerHTML = `
            <section>
                <form id="ratingForm">
                    <fieldset>
                        <legend>How satisfied are you?</legend>
                        <input type="hidden" id="selectedRating" name="rating" value="0" required>
                        <div class="rating" id="stars">
                            <span class="star" data-value="1">&#10023;</span>
                            <span class="star" data-value="2">&#10023;</span>
                            <span class="star" data-value="3">&#10023;</span>
                            <span class="star" data-value="4">&#10023;</span>
                            <span class="star" data-value="5">&#10023;</span>
                        </div>
                        <output id="ratingOutput">&nbsp;</output>
                        <button id="submitButton" type="submit" style="display: none;">Submit</button>
                    </fieldset>
                </form>
            </section>
        `;

        shadow.appendChild(style);
        shadow.appendChild(template.content.cloneNode(true));

        this.initializeComponent();
    }

    initializeComponent() {
        const stars = this.shadowRoot.querySelectorAll('.star');
        const starsContainer = this.shadowRoot.getElementById('stars');
        const selectedRatingInput = this.shadowRoot.getElementById('selectedRating');
        const ratingOutput = this.shadowRoot.getElementById('ratingOutput');

        starsContainer.addEventListener('mouseover', (event) => this.handleMouseOver(event, stars));
        starsContainer.addEventListener('click', (event) => this.handleClick(event, selectedRatingInput, ratingOutput));
        starsContainer.addEventListener('mouseout', () => this.handleMouseOut(stars));
    }

    handleMouseOver(event, stars) {
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
        } else if (rating >= 3 && rating < 4) {
            emoji = '&#128528;'; // Neutral emoji
        } else if (rating >= 4) {
            emoji = '&#128512;'; // Happy emoji
        }

        this.shadowRoot.getElementById('ratingOutput').innerHTML = emoji;
    }

        handleClick(event, selectedRatingInput, ratingOutput) {
            const selectedStar = event.target;
            const rating = selectedStar.getAttribute('data-value');
            selectedRatingInput.value = rating;
            ratingOutput.textContent = rating >= 4 ? `Thank you for ${rating} rating!`  : `Thank you for your feedback ${rating} stars. We will do better!`;

            this.sendRatingData(selectedRatingInput.value);
        }

        handleMouseOut(stars) {
            stars.forEach(star => {
                star.innerHTML = '&#10023;';
                star.style.color = 'white';
            });
        }

        sendRatingData(rating) {
            const formData = new FormData();
            formData.append('rating', rating);
            formData.append('question', 'How satisfied are you?');
            formData.append('sentBy', 'JS');

            fetch('https://httpbin.org/post', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Sent-By': 'JS'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Form submitted successfully!', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }


customElements.define('rating-widget', RatingWidget);

