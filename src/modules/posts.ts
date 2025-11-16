import type { Post } from "../types/post.js";

const loadPostsButton: HTMLButtonElement | null =
    document.getElementById("loadPostsBtn") as HTMLButtonElement | null;
const postsContainer: HTMLElement | null =
    document.getElementById("postsContainer");

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

// Відображення постів у контейнері
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

// Ініціалізація логіки завантаження постів
export function initPosts(): void {
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
