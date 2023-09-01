import axios from "axios";
import { showAlert } from "./alertNotify";

export const changeSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.1:3000/api/v1/user/updateMyPassword"
        : "http://127.0.0.1:3000/api/v1/user/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.Status === "Success") {
      showAlert("success", "Successfully changed Settings");
      window.setTimeout(() => {
        location.assign("/profile");
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
