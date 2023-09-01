import { login, logOut } from "./login";
import { addToCart } from "./addToCart";
import { changeSettings } from "./changeSetings";

const loginForm = document.querySelector(".login-form");
const userPanel = document.querySelector(".user-vis");
const logOutBtn = document.querySelector(".log-out-btn");
const btnLeft = document.querySelector(".left-btn");
const btnright = document.querySelector(".right-btn");
const infoSettings = document.querySelector(".user-settingsss");
const userSettings = document.querySelector(".user-settings");
const addCart = document.querySelector(".add-to-cart");
const cartss = document.querySelectorAll(".cart-border");

const productCart = document.querySelector(".product-main");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.querySelector(".pass-input").value;
    const email = document.querySelector(".email-input").value;

    login(password, email);
  });
}

if (userPanel) {
  logOutBtn.addEventListener("click", () => {
    logOut();
  });
}

if (userSettings) {
  userSettings.addEventListener("submit", (e) => {
    e.preventDefault();
    const currentPassword = document.querySelector(".current-pass").value;
    const NewPassword = document.querySelector(".new-pass").value;
    const passwordconfirm = document.querySelector(".confirm-pass").value;

    changeSettings(
      { currentPassword, NewPassword, passwordconfirm },
      "password"
    );
  });
}

if (btnright) {
  btnright.addEventListener("click", () => {
    infoSettings.classList.remove("switchOp");
    userSettings.classList.add("switchOp");
  });

  btnLeft.addEventListener("click", () => {
    infoSettings.classList.add("switchOp");
    userSettings.classList.remove("switchOp");
  });
}

if (infoSettings) {
  infoSettings.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector(".new-name").value;
    const email = document.querySelector(".new-email").value;

    changeSettings({ name, email }, "data");
  });
}

if (addCart) {
  addCart.addEventListener("submit", (e) => {
    e.preventDefault();

    const quantity = document.querySelector(".quantity").value;
    const element = document.querySelector(".right");
    const productId = element.getAttribute("product-id");
    console.log(productId);
    addToCart(quantity, productId);
  });
}

// cartss.forEach((el) => {
//   const addBtn = document.querySelector(".add");
//   const minusBtn = document.querySelector(".minus");
//   const cardsQuantity = document.querySelector(".cart-quantity");

//   addBtn.addEventListener("click", () => {
//     console.log("ADD");
//   });
//   minusBtn.addEventListener("click", () => {
//     console.log("ADD");
//   });
// });

const eventControler = document.querySelectorAll(".plus-minus");

cartss.forEach((el) => {
  const minusBtn = document.querySelector(".minus");
  const cardsQuantity = document.querySelector(".cart-quantity");

  minusBtn.addEventListener("click", () => {
    console.log("ADDED");
  });
});
