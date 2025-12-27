// =======================
// Basket
// =======================
let basket = [];

// =======================
// Products & Prices
// =======================
const products = {
  iphone: {
    name: "iPhone 17 Pro Max",
    base: 1200,
    options: {
      "256GB": 0,
      "512GB (+$150)": 150,
      "1TB (+$300)": 300
    }
  },
  watch: {
    name: "Apple Watch",
    base: 400,
    options: {
      "Aluminum": 0,
      "Stainless (+$50)": 50,
      "Ultra (+$100)": 100
    }
  },
  airpods: {
    name: "Apple AirPods",
    base: 180,
    options: {
      "Standard": 0,
      "Wireless (+$40)": 40,
      "Pro (+$80)": 80
    }
  }
};

// =======================
// Update price when property changes
// =======================
function updateProductPrice(productId, selectEl, priceEl) {
  const option = selectEl.value;
  const product = products[productId];
  const newPrice = product.base + product.options[option];
  priceEl.innerText = "$" + newPrice;
}

// =======================
// Add To Basket
// =======================
function addToBasket(productId, selectEl, qtyEl) {
  const qty = parseInt(qtyEl.value);
  const option = selectEl.value;

  if (isNaN(qty) || qty < 1) {
    alert("Quantity must be at least 1");
    return;
  }

  const product = products[productId];
  const unitPrice = product.base + product.options[option];
  const totalPrice = unitPrice * qty;

  basket.push({
    productId,
    productName: product.name,
    option,
    unitPrice,
    qty,
    totalPrice
  });

  updateBasketSummary();
}

// =======================
// Update Basket Summary
// =======================
function updateBasketSummary() {
  let totalItems = 0;
  let totalCost = 0;

  basket.forEach(item => {
    totalItems += item.qty;
    totalCost += item.totalPrice;
  });

  const itemsEl = document.getElementById("itemsCount");
  const totalEl = document.getElementById("totalPrice");

  if (itemsEl && totalEl) {
    itemsEl.innerText = totalItems;
    totalEl.innerText = "$" + totalCost.toFixed(2);
  }
}

// =======================
// Empty Cart
// =======================
function emptyCart() {
  basket = [];
  updateBasketSummary();

  document.querySelectorAll("input[type='radio']").forEach(r => r.checked = false);
  document.querySelectorAll(".card-name input").forEach(i => i.value = "");
  const m = document.getElementById("expMonth");
  const y = document.getElementById("expYear");
  const c = document.getElementById("cvv");
  if (m) m.selectedIndex = 0;
  if (y) y.selectedIndex = 0;
  if (c) c.value = "";
}

// =======================
// Allow only numbers + auto move to next field
// =======================
function onlyNumbers(input) {
  input.value = input.value.replace(/[^0-9]/g, '');

  if (input.value.length === 4) {
    const next = input.nextElementSibling;
    if (next && next.tagName === "INPUT") {
      next.focus();
    }
  }
}

// =======================
// Validate Payment Info
// =======================
function validatePayment() {
  const payMethod = document.querySelector("input[name='pay']:checked");
  if (!payMethod) {
    alert("Please select payment method");
    return false;
  }

  const cardInputs = document.querySelectorAll(".card-name input");
  for (let input of cardInputs) {
    if (input.value.length !== 4) {
      alert("Each card field must contain exactly 4 digits");
      return false;
    }
  }

  const month = document.getElementById("expMonth")?.value;
  const year = document.getElementById("expYear")?.value;

  if (!month || !year || month === "MM" || year === "YYYY") {
    alert("Please select expiry date");
    return false;
  }

  const now = new Date();
  const expDate = new Date(year, month - 1, 1);
  if (expDate < now) {
    alert("Card expired. Application withdrawn");
    return false;
  }

  const cvv = document.getElementById("cvv")?.value;
  if (!/^[0-9]{3}$/.test(cvv)) {
    alert("CVV must be exactly 3 digits");
    return false;
  }

  return true;
}

// =======================
// Checkout
// =======================
function checkout() {
  if (basket.length === 0) {
    alert("Basket is empty");
    return;
  }

  if (!validatePayment()) return;

  let total = 0;
  basket.forEach(item => total += item.totalPrice);

  let delivery = 0;
  if (total <= 1000) {
    delivery = total * 0.10;
  }

  const finalTotal = total + delivery;

  const ok = confirm(
    "Total: $" + total.toFixed(2) +
    "\nDelivery: $" + delivery.toFixed(2) +
    "\nFinal Total: $" + finalTotal.toFixed(2) +
    "\nDo you accept?"
  );

  if (ok) {
    alert("Thank you for your purchase!");
    emptyCart();
  } else {
    alert("Application withdrawn");
  }
}

// =======================
// Validate Contact Form
// =======================
function validateContact() {
  const first = document.getElementById("firstName")?.value.trim();
  const last = document.getElementById("lastName")?.value.trim();
  const msg = document.getElementById("message")?.value.trim();

  if (!first || !last || !msg) {
    alert("Please fill all fields");
    return false;
  }

  alert("Thank you for contacting us!");
  return true;
}
