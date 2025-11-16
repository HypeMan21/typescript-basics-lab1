import { initModal } from "./modules/modal.js";
import { initScrollInteractions } from "./modules/scroll.js";
import { initPosts } from "./modules/posts.js";
// Точка входу: ініціалізуємо всі модулі після завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
    initModal();
    initScrollInteractions();
    initPosts();
});
