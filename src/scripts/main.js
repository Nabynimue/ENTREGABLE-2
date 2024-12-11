const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const cart = JSON.parse(localStorage.getItem('cart')) || [];

const updateCartCounter = () => {
    const cartCounter = $("#cart-count");
    if (!cartCounter) return;
    
    cartCounter.textContent = cart.length;
};

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addToCart = (name, price, image) => {
    cart.push({ name, price, image });
    saveCart();
    updateCartCounter();
    console.log(cart);
};

const stackCartItems = () => {
    cart.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
    }, {});
};

document.addEventListener('DOMContentLoaded', () => {
    $$(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
            addToCart(button.dataset.name, button.dataset.price, button.dataset.image);
            console.log(stackCartItems());
        });
    });

    $("#cart-button").addEventListener("click", () => {
        renderCart();
    });
    updateCartCounter();
});

const cartContainer = $("#cart-container");

const clearCart = () => {
    cart.length = 0;
    saveCart();
    updateCartCounter();
    renderCart();
};

const formatPrice = (price) => {
    return price.toLocaleString('es-AR');
};

const renderCart = () => {
    cartContainer.innerHTML = "";
    cartContainer.classList.remove("hidden");
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-4">
                <p>No hay productos en el carrito</p>
            </div>
        `;
        return;
    }
    
    const groupedItems = cart.reduce((acc, item) => {
        acc[item.name] = acc[item.name] || {
            count: 0,
            price: item.price,
            image: item.image,
            name: item.name
        };
        acc[item.name].count++;
        return acc;
    }, {});

    Object.values(groupedItems).forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
            <div class="flex items-center gap-4 border-b border-gray-300 pb-4">
                <img width="50" height="50" src="${item.image}" alt="${item.name}" />
                <h2>${item.count}x ${item.name}</h2>
                <p>${item.price}</p>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const totalElement = document.createElement("div");
    totalElement.innerHTML = `
        <div class="flex justify-between items-center mt-4 font-bold">
            <h2>Total a pagar:</h2>
            <p>$${formatPrice(total)}</p>
        </div>
        <button id="clear-cart" class="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full">
            Vaciar Carrito
        </button>
    `;
    cartContainer.appendChild(totalElement);
    
    $("#clear-cart").addEventListener("click", clearCart);
    
    updateCartCounter();
};

$("#clear-cart-header").addEventListener("click", clearCart);



