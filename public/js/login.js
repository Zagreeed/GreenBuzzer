import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./alertNotify";

export const login = async (pass, email) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/user/login",
      data: {
        email: email,
        password: pass,
      },
    });

    if (res.data.Status === "Success") {
      showAlert("success", "login Successfully");
      console.log("hellow");

      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
    console.log(error);
  }
};

export const logOut = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/user/logOut",
    });

    if (res.data.Status === "Success") {
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (error) {
    console.log("Something whent wrong!");
    console.log(error);
  }
};
