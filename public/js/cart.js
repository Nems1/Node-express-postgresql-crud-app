// Global variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// Data endpoint url
const url = 'http://localhost:3000/products';

// cart 
let cart = [];

// Products
class Products {
    // Fetch products data from database
    async getProducts() {
        try {
            const result = (await fetch(url)).json();
            //const data = await result.json();
            return result;
        } catch (error) { 
            console.error(error.message);
        }
    }
}

// UI class

class UI {

}
// Local Storage

// Listeners

window.addEventListener('load', (evt) => {
    evt.preventDefault();
    // Instantiate UI class
    const ui = new UI();
    
    // Show all products
    (async function () {
        const data = await new Products();
        const productsObj  = await data.getProducts();
        productsObj.products.map(product => console.log('\n\tProduct\n\t', product));
    }());
});
