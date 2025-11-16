const modalOverlay = document.getElementById("modalOverlay");
const closeModalButton = document.getElementById("closeModal");
const openModalButton = document.getElementById("openModal");
// Відкрити модальне вікно
function openModal() {
    if (modalOverlay) {
        modalOverlay.classList.add("is-open");
    }
}
// Закрити модальне вікно
function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove("is-open");
    }
}
// Ініціалізація слухачів подій для модалки
export function initModal() {
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
