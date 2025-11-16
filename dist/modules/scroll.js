const backToTopButton = document.getElementById("backToTop");
const scrollToPostsButton = document.getElementById("scrollToPosts");
const animatedElements = document.querySelectorAll("[data-animate]");
// Обробка скролу: показ кнопки "До гори" + поява елементів
function handleScroll() {
    const scrollPosition = window.scrollY;
    if (backToTopButton) {
        if (scrollPosition > 200) {
            backToTopButton.style.opacity = "1";
            backToTopButton.style.pointerEvents = "auto";
        }
        else {
            backToTopButton.style.opacity = "0";
            backToTopButton.style.pointerEvents = "none";
        }
    }
    animatedElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 80;
        if (isVisible) {
            element.classList.add("is-visible");
        }
    });
}
// Ініціалізація всіх скрол-інтеракцій
export function initScrollInteractions() {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // одразу оновлюємо стан при завантаженні
    if (backToTopButton) {
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
    if (scrollToPostsButton) {
        scrollToPostsButton.addEventListener("click", () => {
            const postsSection = document.getElementById("posts");
            if (postsSection) {
                postsSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
}
