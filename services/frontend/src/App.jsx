import { useState } from "react";
import axios from "axios";

const API = "/api";

function App() {
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [orderData, setOrderData] = useState({
    customerName: "",
    productName: "",
    quantity: 1,
    totalAmount: 0
  });

  const [message, setMessage] = useState("");

  const register = async () => {
    try {
      await axios.post(`${API}/v1/auth/register`, registerData);
      setMessage("Registered successfully");
    } catch (err) {
      console.log(err.response?.data);
      setMessage("Registration failed");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(
        `${API}/v1/auth/login`,
        loginData
      );

      const jwtToken = res.data.accessToken;

      localStorage.setItem("token", jwtToken);

      setMessage("Login successful");
    } catch (err) {
      console.log(err.response?.data);
      setMessage("Login failed");
    }
  };

  const createOrder = async () => {
    try {
      const jwtToken = localStorage.getItem("token");

      if (!jwtToken) {
        setMessage("Please login first");
        return;
      }

      const res = await axios.post(
        `${API}/v1/users/test/create-order`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        }
      );

      setMessage(JSON.stringify(res.data));
    } catch (err) {
      console.log(err.response?.data);
      setMessage("Order creation failed");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Retail Platform Demo</h1>

      <h2>Register</h2>
      <input
        placeholder="First Name"
        onChange={(e) =>
          setRegisterData({ ...registerData, firstName: e.target.value })
        }
      />
      <input
        placeholder="Last Name"
        onChange={(e) =>
          setRegisterData({ ...registerData, lastName: e.target.value })
        }
      />
      <input
        placeholder="Email"
        onChange={(e) =>
          setRegisterData({ ...registerData, email: e.target.value })
        }
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) =>
          setRegisterData({ ...registerData, password: e.target.value })
        }
      />
      <button onClick={register}>Register</button>

      <hr />

      <h2>Login</h2>
      <input
        placeholder="Email"
        onChange={(e) =>
          setLoginData({ ...loginData, email: e.target.value })
        }
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) =>
          setLoginData({ ...loginData, password: e.target.value })
        }
      />
      <button onClick={login}>Login</button>

      <hr />

      <h2>Create Order</h2>
      <input
        placeholder="Customer Name"
        onChange={(e) =>
          setOrderData({ ...orderData, customerName: e.target.value })
        }
      />
      <input
        placeholder="Product Name"
        onChange={(e) =>
          setOrderData({ ...orderData, productName: e.target.value })
        }
      />
      <input
        placeholder="Quantity"
        type="number"
        onChange={(e) =>
          setOrderData({ ...orderData, quantity: Number(e.target.value) })
        }
      />
      <input
        placeholder="Amount"
        type="number"
        onChange={(e) =>
          setOrderData({ ...orderData, totalAmount: Number(e.target.value) })
        }
      />
      <button onClick={createOrder}>Create Order</button>

      <hr />
      <p>{message}</p>
    </div>
  );
}

export default App;