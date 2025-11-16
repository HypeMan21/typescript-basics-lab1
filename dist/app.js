"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const modalOverlay = document.getElementById("modalOverlay");
const closeModalButton = document.getElementById("closeModal");
const openModalButton = document.getElementById("openModal");
const backToTopButton = document.getElementById("backToTop");
const scrollToPostsButton = document.getElementById("scrollToPosts");
const loadPostsButton = document.getElementById("loadPostsBtn");
const postsContainer = document.getElementById("postsContainer");
const animatedElements = document.querySelectorAll("[data-animate]");
// Допоміжні функції для модалки
function openModal() {
    if (modalOverlay) {
        modalOverlay.classList.add("is-open");
    }
}
function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove("is-open");
    }
}
function initModal() {
    if (!modalOverlay || !openModalButton || !closeModalButton) {
        return;
    }
    openModalButton.addEventListener("click", () => {
        openModal();
    });
    closeModalButton.addEventListener("click", () => {
        closeModal();
    });
    modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
}
// Кнопка "До гори" + анімація при скролі
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
function initScrollInteractions() {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // викликаємо один раз при завантаженні
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
function initPosts() {
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
// Запуск ініціалізації після завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
    initModal();
    initScrollInteractions();
    initPosts();
});
