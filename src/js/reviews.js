export async function loadAndDisplayReviews() {
    const reviewsList = document.querySelector(".reviews-list");
    const reviewsNavigation = document.querySelector(".reviews-navigation");

    try {
        const reviews = await fetchReviews();
        renderReviews(reviews, reviewsList);
        renderNavigation(reviews, reviewsNavigation);

        let currentIndex = 0;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % reviews.length; 
            changeReview(currentIndex);
        }, 10000);
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

async function fetchReviews() {
    const response = await fetch("http://localhost:3000/reviews");
    return response.json();
}

function renderReviews(reviews, reviewsList) {
    reviews.forEach((review, index) => {
        const reviewItem = createReviewItem(review);
        if (index === 0) {
            reviewItem.classList.add("active");
        }
        reviewsList.appendChild(reviewItem);
    });
}

function createReviewItem(review) {
    const reviewItem = document.createElement("div");
    reviewItem.classList.add("reviews-item");
    reviewItem.innerHTML = `
        <img src="${review.url}" alt="${review.user}" class="customer-photo">
        <h3>${review.user}</h3>
        <p>${review.text}</p>
        <div class="rating">
            ${'<img src="https://img.freepik.com/free-vector/star-round-corners_78370-4576.jpg" alt="Star">'.repeat(review.rating)}
        </div>
    `;
    return reviewItem;
}

function renderNavigation(reviews, reviewsNavigation) {
    reviews.forEach((_, index) => {
        const dot = createDot(index);
        if (index === 0) dot.classList.add("active");
        reviewsNavigation.appendChild(dot);
    });
}

function createDot(index) {
    const dot = document.createElement("a");
    dot.classList.add("dot");
    dot.href = "#";
    dot.addEventListener("click", (e) => {
        e.preventDefault();
        changeReview(index);
    });
    return dot;
}

function changeReview(index) {
    const reviews = document.querySelectorAll(".reviews-item");
    reviews.forEach((review) => {
        review.classList.remove("active");
    });
    if (reviews[index]) {
        reviews[index].classList.add("active");
    }

    setActiveDot(index);
}

function setActiveDot(index) {
    document.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"));
    const dots = document.querySelectorAll(".dot");
    if (dots[index]) {
        dots[index].classList.add("active");
    }
}
