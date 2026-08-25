import { useEffect, useState } from "react";
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

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 1
  });

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  // =========================
  // Products
  // =========================

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API}/v1/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err.response?.data);
      setMessage("Failed to load products");
    }
  };

  const createProduct = async () => {
    try {
      const res = await axios.post(
        `${API}/v1/products`,
        productData
      );

      setMessage("Product created successfully");

      setProductData({
        name: "",
        description: "",
        price: 0,
        quantity: 1
      });

      setProducts([...products, res.data]);
    } catch (err) {
      console.log(err.response?.data);
      setMessage("Product creation failed");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/v1/products/${id}`);

      setProducts(products.filter((product) => product.id !== id));

      setMessage("Product deleted successfully");
    } catch (err) {
      console.log(err.response?.data);
      setMessage("Product deletion failed");
    }
  };

  // Load products when frontend starts
  useEffect(() => {
    getProducts();
  }, []);

  // =========================
  // Register
  // =========================

  const register = async () => {
    try {
      await axios.post(
        `${API}/v1/auth/register`,
        registerData
      );

      setMessage("Registered successfully");
    } catch (err) {
      console.log(err.response?.data);
      setMessage("Registration failed");
    }
  };

  // =========================
  // Login
  // =========================

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

  // =========================
  // Create Order
  // =========================

  const calculateOrderTotal = (productName, quantity) => {
    const selectedProduct = products.find(
      (product) => product.name === productName
    );

    if (!selectedProduct) {
      return 0;
    }

    return Number((selectedProduct.price * quantity).toFixed(2));
  };

  const handleOrderProductChange = (e) => {
    const productName = e.target.value;
    const quantity = 1;

    setOrderData({
      ...orderData,
      productName,
      quantity,
      totalAmount: calculateOrderTotal(productName, quantity)
    });
  };

  const handleOrderQuantityChange = (e) => {
    const selectedProduct = products.find(
      (product) => product.name === orderData.productName
    );

    let quantity = Number(e.target.value);

    if (quantity < 1 || Number.isNaN(quantity)) {
      quantity = 1;
    }

    if (selectedProduct && quantity > selectedProduct.quantity) {
      quantity = selectedProduct.quantity;
    }

    setOrderData({
      ...orderData,
      quantity,
      totalAmount: calculateOrderTotal(orderData.productName, quantity)
    });
  };

  const createOrder = async () => {
    try {
      const jwtToken = localStorage.getItem("token");

      if (!jwtToken) {
        setMessage("Please login first");
        return;
      }

      if (!orderData.productName) {
        setMessage("Please select a product");
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
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        maxWidth: "1000px",
        margin: "auto"
      }}
    >
      <h1>E-Commerce Retail Platform</h1>

      {/* ========================= */}
      {/* Register */}
      {/* ========================= */}

      <h2>Register</h2>

      <input
        placeholder="First Name"
        value={registerData.firstName}
        onChange={(e) =>
          setRegisterData({
            ...registerData,
            firstName: e.target.value
          })
        }
      />

      <input
        placeholder="Last Name"
        value={registerData.lastName}
        onChange={(e) =>
          setRegisterData({
            ...registerData,
            lastName: e.target.value
          })
        }
      />

      <input
        placeholder="Email"
        value={registerData.email}
        onChange={(e) =>
          setRegisterData({
            ...registerData,
            email: e.target.value
          })
        }
      />

      <input
        placeholder="Password"
        type="password"
        value={registerData.password}
        onChange={(e) =>
          setRegisterData({
            ...registerData,
            password: e.target.value
          })
        }
      />

      <button onClick={register}>Register</button>

      <hr />

      {/* ========================= */}
      {/* Login */}
      {/* ========================= */}

      <h2>Login</h2>

      <input
        placeholder="Email"
        value={loginData.email}
        onChange={(e) =>
          setLoginData({
            ...loginData,
            email: e.target.value
          })
        }
      />

      <input
        placeholder="Password"
        type="password"
        value={loginData.password}
        onChange={(e) =>
          setLoginData({
            ...loginData,
            password: e.target.value
          })
        }
      />

      <button onClick={login}>Login</button>

      <hr />

      {/* ========================= */}
      {/* Products */}
      {/* ========================= */}

      <h2>Products</h2>

      <button onClick={getProducts}>
        Refresh Products
      </button>

      <div style={{ marginTop: "15px" }}>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "5px"
              }}
            >
              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <p>
                <strong>Price:</strong> ${product.price}
              </p>

              <p>
                <strong>Quantity:</strong> {product.quantity}
              </p>

              <button
                onClick={() => deleteProduct(product.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <h3>Add Product</h3>

      <input
        placeholder="Product Name"
        value={productData.name}
        onChange={(e) =>
          setProductData({
            ...productData,
            name: e.target.value
          })
        }
      />

      <input
        placeholder="Description"
        value={productData.description}
        onChange={(e) =>
          setProductData({
            ...productData,
            description: e.target.value
          })
        }
      />

      <input
        placeholder="Price"
        type="number"
        value={productData.price}
        onChange={(e) =>
          setProductData({
            ...productData,
            price: Number(e.target.value)
          })
        }
      />

      <input
        placeholder="Quantity"
        type="number"
        value={productData.quantity}
        onChange={(e) =>
          setProductData({
            ...productData,
            quantity: Number(e.target.value)
          })
        }
      />

      <button onClick={createProduct}>
        Add Product
      </button>

      <hr />

      {/* ========================= */}
      {/* Create Order */}
      {/* ========================= */}

      <h2>Create Order</h2>

      <input
        placeholder="Customer Name"
        value={orderData.customerName}
        onChange={(e) =>
          setOrderData({
            ...orderData,
            customerName: e.target.value
          })
        }
      />

      <select
        value={orderData.productName}
        onChange={handleOrderProductChange}
      >
        <option value="">Select Product</option>
        {products.map((product) => (
          <option key={product.id} value={product.name}>
            {product.name} - ${product.price} ({product.quantity} available)
          </option>
        ))}
      </select>

      <input
        placeholder="Quantity"
        type="number"
        min="1"
        max={
          products.find(
            (product) => product.name === orderData.productName
          )?.quantity || undefined
        }
        value={orderData.quantity}
        onChange={handleOrderQuantityChange}
        disabled={!orderData.productName}
      />

      <input
        placeholder="Amount"
        type="number"
        value={orderData.totalAmount}
        readOnly
      />

      <button onClick={createOrder}>
        Create Order
      </button>

      <hr />

      <p>
        <strong>{message}</strong>
      </p>
    </div>
  );
}

export default App;
