import {addToCart, addedToCartMsg, updateCartQuantity } from "./cart.js";
import {products} from "./data.js";

//display all products in home page

 let totalHTML='';
 products.forEach( (product) => {
    totalHTML+=
    `
      <div class="div">
            <div class="image-div"><img class="image" src="${product.image}"></div>
            <p class="product-name">${product.name}</p>
             <div style=" display: grid; grid-template-columns: 1fr 50px;">
                 <img src=${product.rating.stars} class="rating">
                 <div class="rated-people">${product.rating.people}</div>
             </div>
             <div class="price">${(product.priceCents/100).toFixed(2)}</div>
             <select class="drop-box" id="db-${product.id}">
                 <option value="1">1</option>
                 <option value="2">2</option>
                 <option value="3">3</option>
                 <option value="4">4</option>
                 <option value="5">5</option>
                 <option value="6">6</option>
                 <option value="7">7</option>
                 <option value="8">8</option>
                 <option value="9">9</option>
                 <option value="10">10</option>
             </select>
             <div class="added-to-cart-msg js-added-to-cart-msg" id="${product.id}" style="height: 20px; margin: 0px 0px 8px 0px;"></div>
             <button class="add-to-cart js-add-to-cart" data-product-id="${product.id}" data-delivery-option-id="1">Add to cart</button>
        </div>
    `;
 });

 document.querySelector('.js-main').innerHTML=`${totalHTML}`;

//listen to any add to cart button clicks in home page

function addToCartButtonsClicks(){
    document.querySelectorAll('.js-add-to-cart').forEach( (button)=>{
        button.addEventListener('click',()=>{
            const {productId,deliveryOptionId}=button.dataset;
            addedToCartMsg(productId);
            let quantity=parseInt(document.getElementById(`db-${productId}`).value);
            addToCart(productId,deliveryOptionId,quantity);
            updateCartQuantity();
        });
    });
}

addToCartButtonsClicks();
updateCartQuantity();

//search the products, searched in search bar in home page

document.querySelector('.js-search-icon').addEventListener('click', (button) => {
    let keyword=document.querySelector('.js-search-box').value.trim();
    searchProducts(keyword); 
});


function searchProducts(keyword) {
    const query = keyword.toLowerCase();
    const filterData = products.filter((product) =>{
        return (product.name.toLowerCase().includes(query));
    });
    displayProducts(filterData);
    addToCartButtons();
}

const displayProducts=(Products)=>{
    document.querySelector('.main').innerHTML=Products.map((product)=>{
        return(
            `
            <div class="div" style="max-width: 168px;">
                  <div class="image-div"><img class="image" src="${product.image}"></div>
                  <p class="product-name">${product.name}</p>
                   <div style=" display: grid; grid-template-columns: 1fr 50px;">
                       <img src=${product.rating.stars} class="rating">
                       <div class="rated-people">${product.rating.people}</div>
                   </div>
                   <div class="price">${(product.priceCents/100).toFixed(2)}</div>
                   <select class="drop-box" id="db-${product.id}">
                       <option value="1">1</option>
                       <option value="2">2</option>
                       <option value="3">3</option>
                       <option value="4">4</option>
                       <option value="5">5</option>
                       <option value="6">6</option>
                       <option value="7">7</option>
                       <option value="8">8</option>
                       <option value="9">9</option>
                       <option value="10">10</option>
                   </select>
                   <div class="added-to-cart-msg js-added-to-cart-msg" id="${product.id}" style="height: 20px; margin: 0px 0px 8px 0px;"></div>
                   <button class="add-to-cart js-add-to-cart" data-product-id="${product.id}" data-delivery-option-id="1">Add to cart</button>
              </div>
          `
        )
    })
}
