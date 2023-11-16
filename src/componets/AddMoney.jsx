import React from 'react'
import { Button, Grid,Input } from "@mui/material";
import axios from "axios";

const AddMoney = () => {
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }
  
    async function displayRazorpay() {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }
        const result = await axios.post('http://98.70.37.41:5003/payment/orders');
  
        if (!result) {
            alert("Server error. Are you online?");
            return;
        }
  
        const { amount, id: order_id, currency } = result.data;
  
        const options = {
            key: "rzp_test_yWxIyhMZq8Twq5", // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: "NVC Fund Bank",
            description: "Test Transaction",
            // image: { logo },
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };
  
                const result = await axios.post("http://98.70.37.41:5003/payment/success", data);
  
                alert(result.data.msg);
            },
            prefill: {
                name: "mahantesh",
                email: "mahantesh@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "mahantesh Corporate Office",
            },
            theme: {
                color: "#61dafb",
            },
        };
  
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }
  return (
    <>
    <Button onClick={displayRazorpay} variant="outlined">Add Money</Button>
    {/* <p><strong> NOTE:</strong>  Money will be Debited From Your Account and will be added to NVC Fund Bank Wallet</p> */}
    </>
  )
}

export default AddMoney