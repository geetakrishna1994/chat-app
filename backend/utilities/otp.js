import axios from "axios";
import { AuthenticationError } from "./Errors.js";

export const generateOTP = (length) => {
  const min = parseInt(1 + "0".repeat(length - 1));
  const multiplier = parseInt(9 + "0".repeat(length - 1));
  const otp = Math.floor(Math.random() * multiplier) + min;
  return otp;
};

export const sendOTP = async (phoneNumber, otp) => {
  console.log("sinside send otp function");
  console.log("api key value : ", process.env.FAST_2_SMS_API_KEY);
  const response = await axios.request({
    method: "POST",
    url: "https://www.fast2sms.com/dev/bulkV2",
    headers: {
      authorization: process.env.FAST_2_SMS_API_KEY,
    },
    data: {
      message: `Your OTP for login into chat app : ${otp}`,
      route: "v3",
      numbers: phoneNumber.toString(),
    },
  });
  if (!response.data.return) {
    console.log(response.status, response.data.message);
    throw new AuthenticationError(
      response.data.message.toString(),
      "problem with the otp service"
    );
  }

  if (response.status !== 200) {
    console.log(response.status, response.data.message);
    throw new AuthenticationError(
      "ERR_SENDING_OTP",
      "problem with the otp service"
    );
  }
};
