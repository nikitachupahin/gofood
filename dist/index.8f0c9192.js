document.addEventListener("DOMContentLoaded", async ()=>{
    const reviewsList = document.querySelector(".reviews-list");
    const reviewsNavigation = document.querySelector(".reviews-navigation");
    try {
        const response = await fetch("http://localhost:3000/reviews");
        const reviews = await response.json();
        // Створюємо кожен відгук
        reviews.forEach((review, index)=>{
            const reviewItem = document.createElement("div");
            reviewItem.classList.add("reviews-item");
            if (index !== 0) reviewItem.style.display = "none"; // Спочатку показуємо лише перший відгук
            reviewItem.innerHTML = `
          <img src="${review.url}" alt="${review.user}" class="customer-photo">
          <h3>${review.user}</h3>
          <p>${review.text}</p>
          <div class="rating">
            ${'<img src="./img/icon/star.svg" alt="Star">'.repeat(review.rating)}
          </div>
        `;
            reviewsList.appendChild(reviewItem);
            // Додаємо навігаційну точку
            const dot = document.createElement("a");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active"); // Перша точка активна
            dot.href = "#";
            // Додаємо обробник події для кожної точки
            dot.addEventListener("click", (e)=>{
                e.preventDefault();
                // Ховаємо всі відгуки і видаляємо активний клас з точок
                document.querySelectorAll(".reviews-item").forEach((item)=>{
                    item.style.display = "none";
                });
                document.querySelectorAll(".dot").forEach((dot)=>{
                    dot.classList.remove("active");
                });
                // Показуємо вибраний відгук і активуємо відповідну точку
                reviewItem.style.display = "block";
                dot.classList.add("active");
            });
            reviewsNavigation.appendChild(dot);
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
});

//# sourceMappingURL=index.8f0c9192.js.map
