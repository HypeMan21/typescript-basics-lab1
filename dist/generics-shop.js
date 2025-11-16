// -------------------------
// Крок 1: базові типи товарів
// -------------------------
// -------------------------
// Крок 2: generic-функції пошуку та фільтрації
// -------------------------
/**
 * Пошук товару за id в масиві будь-яких продуктів.
 * Повертає знайдений товар або undefined, якщо його немає.
 */
export const findProduct = (products, id) => {
    if (!Array.isArray(products)) {
        console.warn("findProduct: параметр products не є масивом");
        return undefined;
    }
    if (!Number.isFinite(id)) {
        console.warn("findProduct: id повинен бути числом");
        return undefined;
    }
    return products.find((product) => product.id === id);
};
/**
 * Фільтрація товарів за максимальною ціною.
 * Повертає новий масив товарів з ціною <= maxPrice.
 */
export const filterByPrice = (products, maxPrice) => {
    if (!Array.isArray(products)) {
        console.warn("filterByPrice: параметр products не є масивом");
        return [];
    }
    if (!Number.isFinite(maxPrice) || maxPrice < 0) {
        console.warn("filterByPrice: maxPrice повинен бути невідʼємним числом");
        return [];
    }
    return products.filter((product) => product.price <= maxPrice);
};
/**
 * Додавання товару в кошик.
 * Якщо товар вже є в кошику, збільшуємо quantity.
 * Повертаємо НОВИЙ масив (не мутуємо існуючий cart).
 */
export const addToCart = (cart, product, quantity) => {
    if (!product) {
        console.warn("addToCart: product є undefined або null");
        return cart;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
        console.warn("addToCart: quantity повинен бути додатнім числом");
        return cart;
    }
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex !== -1) {
        // Створюємо копію масиву та оновлюємо кількість
        const updatedCart = cart.map((item, index) => {
            if (index === existingIndex) {
                return {
                    product: item.product,
                    quantity: item.quantity + quantity
                };
            }
            return item;
        });
        return updatedCart;
    }
    // Якщо товару ще немає в кошику — додаємо новий елемент
    return [
        ...cart,
        {
            product,
            quantity
        }
    ];
};
/**
 * Підрахунок загальної вартості кошика.
 * Повертає суму price * quantity для всіх елементів.
 */
export const calculateTotal = (cart) => {
    if (!Array.isArray(cart)) {
        console.warn("calculateTotal: cart не є масивом");
        return 0;
    }
    const total = cart.reduce((sum, item) => {
        const price = item.product.price;
        const quantity = item.quantity;
        if (price < 0 || quantity <= 0) {
            console.warn("calculateTotal: знайдено некоректні дані в елементі кошика", item);
            return sum;
        }
        return sum + price * quantity;
    }, 0);
    return total;
};
// -------------------------
// Крок 4: тестові дані і демонстрація роботи
// -------------------------
// Масив електроніки
const electronics = [
    {
        id: 1,
        name: "Смартфон",
        price: 10000,
        category: "electronics",
        brand: "SuperPhone",
        warrantyMonths: 24,
        inStock: true,
        description: "Смартфон з OLED-екраном"
    },
    {
        id: 2,
        name: "Ноутбук",
        price: 35000,
        category: "electronics",
        brand: "UltraBook",
        warrantyMonths: 12,
        inStock: false,
        description: "Легкий ноутбук для навчання та роботи"
    }
];
// Масив одягу
const clothes = [
    {
        id: 10,
        name: "Футболка",
        price: 700,
        category: "clothing",
        size: "M",
        material: "Cotton",
        inStock: true,
        description: "Базова чорна футболка"
    },
    {
        id: 11,
        name: "Худі",
        price: 1500,
        category: "clothing",
        size: "L",
        material: "Fleece",
        inStock: true,
        description: "Тепле худі оверсайз"
    }
];
// Масив книг
const books = [
    {
        id: 20,
        name: "Clean Code",
        price: 1200,
        category: "book",
        author: "Robert C. Martin",
        pages: 464,
        inStock: true,
        description: "Класика про чистий код"
    }
];
// Демонстрація роботи функцій
// (можеш залишити ці console.log — викладачу буде видно, що все працює)
function demo() {
    console.log("=== DEMO: findProduct ===");
    const phone = findProduct(electronics, 1);
    const tshirt = findProduct(clothes, 10);
    const unknownProduct = findProduct(electronics, 999);
    console.log("Знайдений телефон:", phone);
    console.log("Знайдена футболка:", tshirt);
    console.log("Невідомий товар:", unknownProduct);
    console.log("\n=== DEMO: filterByPrice ===");
    const cheapElectronics = filterByPrice(electronics, 20000);
    console.log("Електроніка до 20000:", cheapElectronics);
    const cheapClothes = filterByPrice(clothes, 1000);
    console.log("Одяг до 1000:", cheapClothes);
    console.log("\n=== DEMO: cart + calculateTotal ===");
    // Кошик для електроніки
    let electronicsCart = [];
    if (phone) {
        electronicsCart = addToCart(electronicsCart, phone, 1);
    }
    const laptop = findProduct(electronics, 2);
    if (laptop) {
        electronicsCart = addToCart(electronicsCart, laptop, 2);
    }
    const electronicsTotal = calculateTotal(electronicsCart);
    console.log("Кошик електроніки:", electronicsCart);
    console.log("Загальна вартість електроніки:", electronicsTotal);
    // Кошик для книг
    let booksCart = [];
    const cleanCode = findProduct(books, 20);
    if (cleanCode) {
        booksCart = addToCart(booksCart, cleanCode, 3);
    }
    const booksTotal = calculateTotal(booksCart);
    console.log("Кошик книг:", booksCart);
    console.log("Загальна вартість книг:", booksTotal);
}
// Викликаємо demo для перевірки
demo();
