var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const loadPostsButton = document.getElementById("loadPostsBtn");
const postsContainer = document.getElementById("postsContainer");
// Завантаження постів з API
function fetchPosts() {
    return __awaiter(this, arguments, void 0, function* (limit = 4) {
        const url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`;
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error("Не вдалося завантажити пости");
        }
        const data = (yield response.json());
        return data;
    });
}
// Відображення постів у контейнері
function renderPosts(posts) {
    if (!postsContainer)
        return;
    postsContainer.innerHTML = "";
    posts.forEach((post) => {
        const card = document.createElement("div");
        card.className = "post-card";
        card.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
    `;
        postsContainer.appendChild(card);
    });
}
// Ініціалізація логіки завантаження постів
export function initPosts() {
    if (!loadPostsButton)
        return;
    loadPostsButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        loadPostsButton.disabled = true;
        loadPostsButton.textContent = "Завантаження...";
        try {
            const posts = yield fetchPosts(4);
            renderPosts(posts);
            loadPostsButton.textContent = "Оновити пости";
        }
        catch (error) {
            if (postsContainer) {
                postsContainer.innerHTML =
                    "<p>Сталася помилка при завантаженні постів.</p>";
            }
            loadPostsButton.textContent = "Спробувати ще раз";
        }
        finally {
            loadPostsButton.disabled = false;
        }
    }));
}
