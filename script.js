document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartWidget = document.querySelector('.cart-widget');
    const cartCountSpan = document.querySelector('.cart-count');
    const main = document.querySelector('main'); // Для додавання модального вікна кошика

    let cartItems = loadCart();
    updateCartDisplay();

    // Функція для завантаження кошика з localStorage
    function loadCart() {
        const cartData = localStorage.getItem('cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    // Функція для збереження кошика в localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // Функція для оновлення відображення кошика (кількість у віджеті)
    function updateCartDisplay() {
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalQuantity;
    }

    // Функція для додавання товару в кошик
    function addToCart(productId, productName, productPrice) {
        const existingItem = cartItems.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                quantity: 1
            });
        }

        saveCart();
        updateCartDisplay();
        displayCartModal(); // Показуємо оновлений кошик
    }

    // Обробники подій для кнопок "Додати в кошик"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = this.dataset.price;
            addToCart(productId, productName, productPrice);
        });
    });

    // Функція для відображення модального вікна кошика
    function displayCartModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.remove(); // Видаляємо попередній, якщо є
        }

        if (cartItems.length === 0) {
            const emptyCartMessage = document.createElement('div');
            emptyCartMessage.id = 'cart-modal';
            emptyCartMessage.classList.add('cart-modal');
            emptyCartMessage.innerHTML = '<p>Кошик порожній.</p><button class="close-cart">Закрити</button>';
            main.appendChild(emptyCartMessage);
            document.querySelector('.close-cart').addEventListener('click', () => {
                document.getElementById('cart-modal').remove();
            });
            return;
        }

        const modalDiv = document.createElement('div');
        modalDiv.id = 'cart-modal';
        modalDiv.classList.add('cart-modal');

        const title = document.createElement('h2');
        title.textContent = 'Ваш кошик';
        modalDiv.appendChild(title);

        const cartItemList = document.createElement('ul');
        cartItemList.classList.add('cart-items');

        let totalCost = 0;
        cartItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)} грн</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
                <button class="decrease-quantity" data-id="${item.id}">-</button>
                <button class="remove-item" data-id="${item.id}">Видалити</button>
            `;
            cartItemList.appendChild(listItem);
            totalCost += item.price * item.quantity;
        });

        modalDiv.appendChild(cartItemList);

        const total = document.createElement('p');
        total.classList.add('cart-total');
        total.textContent = `Загальна вартість: ${totalCost.toFixed(2)} грн`;
        modalDiv.appendChild(total);

        const closeButton = document.createElement('button');
        closeButton.classList.add('close-cart');
        closeButton.textContent = 'Закрити';
        closeButton.addEventListener('click', () => {
            document.getElementById('cart-modal').remove();
        });
        modalDiv.appendChild(closeButton);

        main.appendChild(modalDiv);

        // Додаємо обробники подій для кнопок всередині модального вікна
        modalDiv.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                changeQuantity(productId, 1);
            });
        });

        modalDiv.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                changeQuantity(productId, -1);
            });
        });

        modalDiv.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                removeItem(productId);
            });
        });
    }

    // Обробник кліку на віджет кошика для відображення модального вікна
    cartWidget.addEventListener('click', displayCartModal);

    // Функція для зміни кількості товару в кошику
    function changeQuantity(productId, change) {
        const itemToUpdate = cartItems.find(item => item.id === productId);
        if (itemToUpdate) {
            itemToUpdate.quantity += change;
            if (itemToUpdate.quantity < 1) {
                removeItem(productId);
            } else {
                saveCart();
                updateCartDisplay();
                displayCartModal();
            }
        }
    }

    // Функція для видалення товару з кошика
    function removeItem(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        saveCart();
        updateCartDisplay();
        displayCartModal();
    }

    // Фільтрація товарів (залишаємо без змін, але вона тепер не перезавантажує кошик)
    const filterCheckbox = document.querySelectorAll('input[name="category"]');
    const applyFiltersButton = document.getElementById('apply-filters');
    const productCards = document.querySelectorAll('.product-card');

    applyFiltersButton.addEventListener('click', () => {
        const selectedCategories = Array.from(filterCheckbox)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        productCards.forEach(card => {
            const category = card.querySelector('h3').textContent.toLowerCase();
            if (selectedCategories.length === 0 || selectedCategories.some(cat => category.includes(cat))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
