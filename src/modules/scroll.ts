const backToTopButton: HTMLButtonElement | null =
    document.getElementById("backToTop") as HTMLButtonElement | null;
const scrollToPostsButton: HTMLButtonElement | null =
    document.getElementById("scrollToPosts") as HTMLButtonElement | null;
const animatedElements: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>("[data-animate]");

// Обробка скролу: показ кнопки "До гори" + поява елементів
function handleScroll(): void {
    const scrollPosition: number = window.scrollY;

    if (backToTopButton) {
        if (scrollPosition > 200) {
            backToTopButton.style.opacity = "1";
            backToTopButton.style.pointerEvents = "auto";
        } else {
            backToTopButton.style.opacity = "0";
            backToTopButton.style.pointerEvents = "none";
        }
    }

    animatedElements.forEach((element: HTMLElement): void => {
        const rect: DOMRect = element.getBoundingClientRect();
        const isVisible: boolean = rect.top < window.innerHeight - 80;
        if (isVisible) {
            element.classList.add("is-visible");
        }
    });
}

// Ініціалізація всіх скрол-інтеракцій
export function initScrollInteractions(): void {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // одразу оновлюємо стан при завантаженні

    if (backToTopButton) {
        backToTopButton.addEventListener("click", (): void => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (scrollToPostsButton) {
        scrollToPostsButton.addEventListener("click", (): void => {
            const postsSection: HTMLElement | null =
                document.getElementById("posts");
            if (postsSection) {
                postsSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
}
