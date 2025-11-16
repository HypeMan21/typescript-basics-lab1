interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

const modalOverlay: HTMLElement | null = document.getElementById("modalOverlay");
const closeModalButton: HTMLButtonElement | null =
    document.getElementById("closeModal") as HTMLButtonElement | null;
const openModalButton: HTMLButtonElement | null =
    document.getElementById("openModal") as HTMLButtonElement | null;

const backToTopButton: HTMLButtonElement | null =
    document.getElementById("backToTop") as HTMLButtonElement | null;
const scrollToPostsButton: HTMLButtonElement | null =
    document.getElementById("scrollToPosts") as HTMLButtonElement | null;

const loadPostsButton: HTMLButtonElement | null =
    document.getElementById("loadPostsBtn") as HTMLButtonElement | null;
const postsContainer: HTMLElement | null =
    document.getElementById("postsContainer");

const animatedElements: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>("[data-animate]");

// Допоміжні функції для модалки
function openModal(): void {
    if (modalOverlay) {
        modalOverlay.classList.add("is-open");
    }
}

function closeModal(): void {
    if (modalOverlay) {
        modalOverlay.classList.remove("is-open");
    }
}

function initModal(): void {
    if (!modalOverlay || !openModalButton || !closeModalButton) {
        return;
    }

    openModalButton.addEventListener("click", (): void => {
        openModal();
    });

    closeModalButton.addEventListener("click", (): void => {
        closeModal();
    });

    modalOverlay.addEventListener("click", (event: MouseEvent): void => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
}

// Кнопка "До гори" + анімація при скролі
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

function initScrollInteractions(): void {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // викликаємо один раз при завантаженні

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

// Завантаження постів з API
async function fetchPosts(limit: number = 4): Promise<Post[]> {
    const url: string = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`;
    const response: Response = await fetch(url);

    if (!response.ok) {
        throw new Error("Не вдалося завантажити пости");
    }

    const data: Post[] = (await response.json()) as Post[];
    return data;
}

function renderPosts(posts: Post[]): void {
    if (!postsContainer) return;

    postsContainer.innerHTML = "";

    posts.forEach((post: Post): void => {
        const card: HTMLDivElement = document.createElement("div");
        card.className = "post-card";
        card.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
    `;
        postsContainer.appendChild(card);
    });
}

function initPosts(): void {
    if (!loadPostsButton) return;

    loadPostsButton.addEventListener("click", async (): Promise<void> => {
        loadPostsButton.disabled = true;
        loadPostsButton.textContent = "Завантаження...";

        try {
            const posts: Post[] = await fetchPosts(4);
            renderPosts(posts);
            loadPostsButton.textContent = "Оновити пости";
        } catch (error: unknown) {
            if (postsContainer) {
                postsContainer.innerHTML =
                    "<p>Сталася помилка при завантаженні постів.</p>";
            }
            loadPostsButton.textContent = "Спробувати ще раз";
        } finally {
            loadPostsButton.disabled = false;
        }
    });
}

// Запуск ініціалізації після завантаження DOM
document.addEventListener("DOMContentLoaded", (): void => {
    initModal();
    initScrollInteractions();
    initPosts();
});
