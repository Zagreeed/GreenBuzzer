import axios from "axios";
import { showAlert } from "./alertNotify";

export const addToCart = async (quatity, productId) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/cart/addtocart",
      data: {
        quantity: quatity,
        productId: productId,
      },
    });

    if (res.data.Status === "Success") {
      showAlert("success", "Succefully added to cart");
    }
  } catch (error) {
    console.log(error);
  }
};
