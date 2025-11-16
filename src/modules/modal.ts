const modalOverlay: HTMLElement | null = document.getElementById("modalOverlay");
const closeModalButton: HTMLButtonElement | null =
    document.getElementById("closeModal") as HTMLButtonElement | null;
const openModalButton: HTMLButtonElement | null =
    document.getElementById("openModal") as HTMLButtonElement | null;

// Відкрити модальне вікно
function openModal(): void {
    if (modalOverlay) {
        modalOverlay.classList.add("is-open");
    }
}

// Закрити модальне вікно
function closeModal(): void {
    if (modalOverlay) {
        modalOverlay.classList.remove("is-open");
    }
}

// Ініціалізація слухачів подій для модалки
export function initModal(): void {
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
