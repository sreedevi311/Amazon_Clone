import  products  from "./data.js";
import { DeliveryOptions } from "./deliveryOptions.js";

//load cart from localStorage or go with default cart if failed to load

export let cart=JSON.parse(localStorage.getItem('cart'))||[{productId:"id1",quantity:1,deliveryOptionId:"1"}];

//display added to cart msg, whenever add to cart button was clicked

export function addedToCartMsg(productId){
    const msgDiv=document.getElementById(`${productId}`);
        msgDiv.innerHTML='<span style="color: white; background-color: #067D62; border-radius: 50%;font-size: 14px; padding: 1px 4px">✔</span>          Added';
        msgDiv.classList.add('added-to-cart-msg');
        setTimeout( ()=>{
            msgDiv.innerHTML='';
            msgDiv.classList.remove('added-to-cart-msg');
        },300);
}

//add the product to cart array, whenever add to cart button was clicked

export function addToCart(productId,deliveryOptionId,dbQuantity){
    let matchingItem;
    
    cart.forEach( (cartItem)=>{
        if(cartItem.productId===productId){
            matchingItem=cartItem;
        }
    });
   

    if(matchingItem){ 
        matchingItem.quantity+=parseInt(dbQuantity);
    }
    else{
        cart.push({
            productId:productId,
            quantity:dbQuantity,
            deliveryOptionId:"1"
        });
    }
    console.log(cart);
    localStorage.setItem('cart',JSON.stringify(cart));
}

//update the cart quantity in cart symbol in home page

export function updateCartQuantity(){
    document.querySelector('.js-cartquantity').innerHTML=returnCartQuantity();
}

//return cart quantity, whenever needed in any function

export function returnCartQuantity(){
    let cartQuantity=0;
    
    cart.forEach( (cartItem)=>{
        cartQuantity+=parseInt(cartItem.quantity);
    });
    return cartQuantity;
}

//return total cart items price total, whenever needed in any function

export function returnCartItemsPrice(){
    let cartItemsPrice=0;
    
    cart.forEach( (cartItem)=>{
        products.forEach( (product)=>{
            if(product.id===cartItem.productId){
                cartItemsPrice+=(product.priceCents*cartItem.quantity);
            }
        });
    });
    cartItemsPrice= (cartItemsPrice/100).toFixed(2);
    return cartItemsPrice;
}

//return total cart items shipping price total, whenever needed in any function

export function returnCartItemsShippingPrice(){
    let cartItemsShippingPrice=0;
    
    cart.forEach( (cartItem)=>{
        DeliveryOptions.forEach( (option)=>{
            if(option.id===cartItem.deliveryOptionId){
                cartItemsShippingPrice+=(option.deliveryCharge);
            }
        });
    });
    cartItemsShippingPrice= (cartItemsShippingPrice/100).toFixed(2);
    return cartItemsShippingPrice;
}
