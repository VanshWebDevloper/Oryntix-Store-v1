/* ==================================================
   ORYNTIX
   app.js
   Part 1
================================================== */

"use strict";

/*=========================
    APP
=========================*/

const Oryntix = {

    products: [],

    featured: [],

    cart: [],

    wishlist: []

};



/*=========================
    DOM READY
=========================*/

document.addEventListener("DOMContentLoaded", () => {

    hideLoader();

    setupHeader();

    setupScrollReveal();

    loadFeaturedProducts();

});



/*=========================
    LOADER
=========================*/

function hideLoader() {

    const loader = document.querySelector(".loader");

    if (!loader) return;

    window.addEventListener("load", () => {

        loader.classList.add("hide");

    });

}



/*=========================
    HEADER EFFECT
=========================*/

function setupHeader() {

    const header = document.querySelector(".header");

    if (!header) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 20) {

            header.classList.add("header-scrolled");

        } else {

            header.classList.remove("header-scrolled");

        }

    });

}



/*=========================
    SCROLL REVEAL
=========================*/

function setupScrollReveal() {

    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

            }

        });

    }, {

        threshold: 0.15

    });

    elements.forEach(element => observer.observe(element));

}



/*=========================
    FEATURED PRODUCTS
=========================*/

async function loadFeaturedProducts() {

    const grid = document.getElementById("featured-products-grid");

    if (!grid) return;

    grid.innerHTML = "";

    /*
      Products will be loaded
      from backend or JSON
      in Part 2.
    */

}


/* ==================================================
   ORYNTIX
   app.js
   Part 2
================================================== */


/*=========================
    LOAD PRODUCTS
=========================*/

async function loadFeaturedProducts() {

    const grid = document.getElementById("featured-products-grid");

    if (!grid) return;

    try {

        const response = await fetch("data/products.json");

        if (!response.ok) {

            throw new Error("Unable to load products.");

        }

        const products = await response.json();

        Oryntix.products = products;

        if (!products.length) {

            showEmptyProducts(grid);

            return;

        }

        grid.innerHTML = "";

        products
            .filter(product => product.featured === true)
            .forEach(product => {

                grid.appendChild(createProductCard(product));

            });

        if (!grid.children.length) {

            showEmptyProducts(grid);

        }

    }

    catch (error) {

        console.error(error);

        showEmptyProducts(grid);

    }

}



/*=========================
    PRODUCT CARD
=========================*/

function createProductCard(product) {

    const card = document.createElement("article");

    card.className = "product-card reveal";

    card.innerHTML = `

        <div class="product-thumbnail">

            <img src="${product.image}"
                 alt="${product.name}">

        </div>

        <div class="product-body">

            <div class="product-top">

                <span class="product-tag">

                    ${product.tag || ""}

                </span>

            </div>

            <h3>

                ${product.name}

            </h3>

            <p>

                ${product.shortDescription}

            </p>

            <div class="product-footer">

                <strong>

                    $${product.price}

                </strong>

                <a href="product.html?id=${product.id}"
                   class="primary-btn">

                    View

                </a>

            </div>

        </div>

    `;

    return card;

}



/*=========================
    EMPTY STATE
=========================*/

function showEmptyProducts(container) {

    container.innerHTML = `

        <div class="empty-products">

            <i class="fa-solid fa-box-open"></i>

            <h3>

                No Featured Products Yet

            </h3>

            <p>

                Products added from the Admin Panel
                will automatically appear here.

            </p>

        </div>

    `;

}


/* ==================================================
   ORYNTIX
   app.js
   Part 3
================================================== */


/*=========================
    LOCAL STORAGE
=========================*/

function loadStorage() {

    Oryntix.cart =
        JSON.parse(localStorage.getItem("oryntix-cart")) || [];

    Oryntix.wishlist =
        JSON.parse(localStorage.getItem("oryntix-wishlist")) || [];

    updateCartCounter();

}

function saveCart() {

    localStorage.setItem(

        "oryntix-cart",

        JSON.stringify(Oryntix.cart)

    );

    updateCartCounter();

}

function saveWishlist() {

    localStorage.setItem(

        "oryntix-wishlist",

        JSON.stringify(Oryntix.wishlist)

    );

}



/*=========================
    CART
=========================*/

function addToCart(productId) {

    const exists = Oryntix.cart.find(

        item => item === productId

    );

    if (exists) return;

    Oryntix.cart.push(productId);

    saveCart();

}

function updateCartCounter() {

    const badge = document.querySelector(".cart-count");

    if (!badge) return;

    badge.textContent = Oryntix.cart.length;

}



/*=========================
    WISHLIST
=========================*/

function toggleWishlist(productId) {

    const index = Oryntix.wishlist.indexOf(productId);

    if (index === -1) {

        Oryntix.wishlist.push(productId);

    } else {

        Oryntix.wishlist.splice(index, 1);

    }

    saveWishlist();

}



/*=========================
    SEARCH
=========================*/

function setupSearch() {

    const input = document.getElementById("searchInput");

    if (!input) return;

    input.addEventListener("input", () => {

        const keyword = input.value
            .trim()
            .toLowerCase();

        const cards = document.querySelectorAll(".product-card");

        cards.forEach(card => {

            const title = card
                .querySelector("h3")
                .textContent
                .toLowerCase();

            card.style.display =

                title.includes(keyword)

                ? ""

                : "none";

        });

    });

}



/*=========================
    INITIALIZE
=========================*/

document.addEventListener("DOMContentLoaded", () => {

    loadStorage();

    setupSearch();

});