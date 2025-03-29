import {cart, returnCartItemsPrice, returnCartQuantity, returnCartItemsShippingPrice, updateCartQuantity} from './cart.js';
import products from './data.js';
import {DeliveryOptions} from './deliveryOptions.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

//update the complete checkout page whenever, some operation is performed in this page

function updateCheckoutPage(){
    let cartSummaryHTML='';
    if(returnCartQuantity()===0){
    cartSummaryHTML=`<p class="cart-empty-msg">Your Cart Looks Empty!  Please Add Some Products To Your &#x1f6d2;</p>`;
    }else{
    cart.forEach( (cartItem)=>{
    
        let matchingItem,matchingOption;
        products.forEach( (product)=>{
            if(product.id===cartItem.productId){
                matchingItem=product;
            }
        }); 
    let deliveryOptionId=cartItem.deliveryOptionId;
    DeliveryOptions.forEach((DeliveryOption)=>{
        if(DeliveryOption.id===deliveryOptionId){
         matchingOption=DeliveryOption;
        }
     });
     let today=dayjs();
     let deliveryDate=today.add(matchingOption.deliveryDays,'days');
     let dateString=deliveryDate.format('dddd,MMMM D');
    
    //to display the newly added products(product details) in the checkout page

    cartSummaryHTML+=
    `
    <div class="main-div-left-section-divs 
                js-main-div-left-section-divs-${matchingItem.id}">
        <div class="cart-items-delivery-date">Delivery date: <span style="font-size: 19px;">${dateString}</span></div>
        <div class="cart-items-details-div">
            <div><img class="images" src='${matchingItem.image}'></div>
            <div class="product-details">
                <div class="product-name">${matchingItem.name}</div>
                <div class="product-price">$${(matchingItem.priceCents/100).toFixed(2)}</div>
                <div>Quantity:
                    <span id="${matchingItem.id}-quantity">${cartItem.quantity}</span>
                    <div id="${matchingItem.id}-input-div" class="input-div"></div>
                    <span class="update js-update" data-product-id="${matchingItem.id}" ">Update</span> 
                    <span class="delete js-delete" data-product-id="${matchingItem.id}"">Delete</span>
                </div>
            </div>
            <div class="delivery-options"> 
               <span style="font-weight: 600; margin-left: 6px;">
                  Choose a delivery option:
               </span>
               ${deliveryOptions(cartItem)}
            </div>
        </div>
    </div>
    `;
    paymentsSection();
    
    });
    }
    
    document.querySelector('.js-main-div-tot-left-section').innerHTML=cartSummaryHTML;

    //to display the delivery dates section in every newly added product in the cart

    function deliveryOptions(cartItem){
        
        let totalHTML='';
        DeliveryOptions.forEach((DeliveryOption)=>{
            let ischecked=cartItem.deliveryOptionId===DeliveryOption.id; 
            console.log(ischecked);
            let today=dayjs();
            let deliveryDate=today.add(DeliveryOption.deliveryDays,'days');
            let dateString=deliveryDate.format('dddd,MMMM D');
            let priceString=DeliveryOption.deliveryCharge===0 ? 'FREE' : `$${(DeliveryOption.deliveryCharge/100).toFixed(2)} - `;
            totalHTML+=
            `
            <div class="delivery-options-div" style="margin-top: 10px">
                <input class="radio-button js-radio-button" type="radio" name="radio-${cartItem.productId}" ${ischecked? 'checked':''}
                data-product-id="${cartItem.productId}" data-delivery-option-id="${DeliveryOption.id}">
                <div><span class="delivery-date">${dateString}</span><div class="shipping">${priceString} Shipping</div></div>
            </div>
            `;
        });
        return totalHTML;
    }

    //to delete product from the cart

    function deleteProduct(){
        document.querySelectorAll('.js-delete')
        .forEach((deleteButton)=>{
            deleteButton.addEventListener('click',()=>{
            let productId=deleteButton.dataset.productId;
            cart.forEach((cartItem,index)=>{
                if(cartItem.productId===productId)
                    cart.splice(index,1);
            });
            updateCheckoutPage();
            paymentsSection();
            localStorage.setItem('cart',JSON.stringify(cart));
            document.querySelector(`.js-main-div-left-section-divs-${productId}`).remove();
            })
        })
    }

    deleteProduct(); 

    //to change delivery dates for the product in the cart

    function radioButtons(){
        document.querySelectorAll('.js-radio-button').forEach(element => {
        element.addEventListener('click',()=>{
            let {productId,deliveryOptionId}=element.dataset;
            let matchingItem;
        
            cart.forEach( (cartItem)=>{
            if(cartItem.productId===productId){
                matchingItem=cartItem;
            }
            });
            matchingItem.deliveryOptionId=deliveryOptionId;
            localStorage.setItem('cart',JSON.stringify(cart));
            updateCheckoutPage();
            paymentsSection();
        });
        });
        }
    radioButtons();

    //to update the cart quantity in this checkout page and save it

    function showSaveOption(){
        document.querySelectorAll('.js-update')
        .forEach((updateButton)=>{
            updateButton.addEventListener('click',()=>{
            let productId=updateButton.dataset.productId;
            let updatedQuantity;
            cart.forEach((cartItem)=>{
                if(cartItem.productId===productId)
                    if(updateButton.innerHTML==="Update"){
                        document.getElementById(`${productId}-quantity`).innerHTML='';
                        document.getElementById(`${productId}-input-div`).innerHTML=`<input type="number" value="${cartItem.quantity}" class="new-quantity" id="${productId}-input" min="1">`;
                        updateButton.innerHTML="Save";
                    }else{
                        cartItem.quantity=updatedQuantity=document.getElementById(`${productId}-input`).value;
                        document.getElementById(`${productId}-quantity`).innerHTML=`${cartItem.quantity}`;
                        document.getElementById(`${productId}-input-div`).innerHTML='';
                        updateButton.innerHTML="Update";
                    }
            });
            paymentsSection();
            localStorage.setItem('cart',JSON.stringify(cart));
            })
        })
        
    }

    showSaveOption();

}

updateCheckoutPage();
 

//payments section
//display order summary with all cartitem's total price with all shippng charges and taxes

function paymentsSection(){
    let orderSummaryHTML='';
    let cartItemsPrice=returnCartItemsPrice();
    let cartItemsShippingPrice=returnCartItemsShippingPrice();
    let totalPriceBeforeTax=(Number(cartItemsPrice)+Number(cartItemsShippingPrice)).toFixed(2);
    let tax=(totalPriceBeforeTax*0.1).toFixed(2);
    let totalPriceAfterTax=(Number(totalPriceBeforeTax)+Number(tax)).toFixed(2);
    orderSummaryHTML=
    `
        <div class="order-summary">Order Summary</div>
        <div class="order-summary-divs">
        <div>Items (${returnCartQuantity()}):</div>
        <div>${cartItemsPrice}</div>
        </div>
        <div class="order-summary-divs">
        <div>Shipping & handling:</div>
        <div>${cartItemsShippingPrice}</div>
        </div>
        <div class="order-summary-divs">
        <div style="padding-top: 9px;">Total before tax:</div>
        <div style="border-top: 1px solid rgb(222, 222, 222); padding-top: 9px;">$${totalPriceBeforeTax}</div>
        </div>
        <div class="order-summary-divs">
        <div>Estimated tax (10%):</div>
        <div>$${tax}</div>
        </div>
        <div class="order-summary-divs" id="order-total">
        <div style="color: rgb(177, 39, 4);">Order total:</div>
        <div>$${totalPriceAfterTax}</div>
        </div>
        <div class="paypal-option">Use PayPal <input type="checkbox" class="checkbox"></div>
        <div class="place-order-div"><button class="place-order-button">Place your order</button></div>
    `;

    document.querySelector('.js-main-div-tot-right-section').innerHTML=orderSummaryHTML;
    document.querySelector('.js-checkoutItemsCount').innerHTML=returnCartQuantity();
    
}

paymentsSection();