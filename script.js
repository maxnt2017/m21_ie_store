document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCountSpan = document.querySelector('.cart-count');
    let cartItemCount = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartItemCount++;
            cartCountSpan.textContent = cartItemCount;
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = this.dataset.price;
            console.log(`Товар "${productName}" (ID: ${productId}) за ${productPrice} грн додано до кошика.`);
            // Тут можна додати більш складну логіку для керування кошиком (наприклад, збереження в localStorage)
        });
    });

    const filterCheckbox = document.querySelectorAll('input[name="category"]');
    const applyFiltersButton = document.getElementById('apply-filters');
    const productCards = document.querySelectorAll('.product-card');

    applyFiltersButton.addEventListener('click', () => {
        const selectedCategories = Array.from(filterCheckbox)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        productCards.forEach(card => {
            const category = card.querySelector('h3').textContent.toLowerCase(); // Припустимо, що назва товару містить категорію
            if (selectedCategories.length === 0 || selectedCategories.some(cat => category.includes(cat))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
