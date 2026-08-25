import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

const API = "/api";

function App() {
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [products, setProducts] = useState([]);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [orderData, setOrderData] = useState({
    customerName: "",
    productName: "",
    quantity: 1,
    totalAmount: 0,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // --------------------------------------------------
  // MESSAGE
  // --------------------------------------------------

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------

  const register = async () => {
    try {
      await axios.post(`${API}/v1/auth/register`, registerData);

      showMessage("Registration successful");

      setRegisterData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.log(err.response?.data);
      showMessage("Registration failed", "error");
    }
  };

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const login = async () => {
    try {
      const res = await axios.post(
        `${API}/v1/auth/login`,
        loginData
      );

      const jwtToken = res.data.accessToken;

      localStorage.setItem("token", jwtToken);

      showMessage("Login successful");
    } catch (err) {
      console.log(err.response?.data);
      showMessage("Login failed", "error");
    }
  };

  // --------------------------------------------------
  // GET PRODUCTS
  // --------------------------------------------------

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${API}/v1/products`);

      setProducts(res.data);
    } catch (err) {
      console.log(err.response?.data);
      showMessage("Unable to load products", "error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // --------------------------------------------------
  // ADD PRODUCT
  // --------------------------------------------------

  const addProduct = async () => {
    try {
      if (
        !productData.name ||
        !productData.price ||
        !productData.quantity
      ) {
        showMessage(
          "Please enter product name, price and quantity",
          "error"
        );
        return;
      }

      await axios.post(`${API}/v1/products`, {
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        quantity: Number(productData.quantity),
      });

      showMessage("Product added successfully");

      setProductData({
        name: "",
        description: "",
        price: "",
        quantity: "",
      });

      loadProducts();
    } catch (err) {
      console.log(err.response?.data);
      showMessage("Failed to add product", "error");
    }
  };

  // --------------------------------------------------
  // DELETE PRODUCT
  // --------------------------------------------------

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/v1/products/${id}`);

      showMessage("Product deleted successfully");

      // If deleted product was selected in order section
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);

        setOrderData({
          ...orderData,
          productName: "",
          totalAmount: 0,
        });
      }

      loadProducts();
    } catch (err) {
      console.log(err.response?.data);
      showMessage("Failed to delete product", "error");
    }
  };

  // --------------------------------------------------
  // SELECT PRODUCT FOR ORDER
  // --------------------------------------------------

  const selectProduct = (productId) => {
    const product = products.find(
      (item) => String(item.id) === String(productId)
    );

    if (!product) {
      setSelectedProduct(null);

      setOrderData({
        ...orderData,
        productName: "",
        totalAmount: 0,
      });

      return;
    }

    setSelectedProduct(product);

    const quantity = 1;

    setOrderData({
      ...orderData,
      productName: product.name,
      quantity,
      totalAmount: Number(product.price) * quantity,
    });
  };

  // --------------------------------------------------
  // ORDER QUANTITY CHANGE
  // --------------------------------------------------

  const changeOrderQuantity = (value) => {
    let quantity = Number(value);

    if (quantity < 1 || Number.isNaN(quantity)) {
      quantity = 1;
    }

    if (selectedProduct && quantity > selectedProduct.quantity) {
      quantity = selectedProduct.quantity;
    }

    const totalAmount = selectedProduct
      ? Number(selectedProduct.price) * quantity
      : 0;

    setOrderData({
      ...orderData,
      quantity,
      totalAmount,
    });
  };

  // --------------------------------------------------
  // CREATE ORDER
  // --------------------------------------------------

  const createOrder = async () => {
    try {
      const jwtToken = localStorage.getItem("token");

      if (!jwtToken) {
        showMessage("Please login first", "error");
        return;
      }

      if (!orderData.customerName) {
        showMessage("Please enter customer name", "error");
        return;
      }

      if (!selectedProduct) {
        showMessage("Please select a product", "error");
        return;
      }

      if (orderData.quantity < 1) {
        showMessage("Quantity must be at least 1", "error");
        return;
      }

      const res = await axios.post(
        `${API}/v1/users/test/create-order`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      showMessage(
        `Order created successfully. Order ID: ${res.data.id}`
      );

      setOrderData({
        customerName: "",
        productName: "",
        quantity: 1,
        totalAmount: 0,
      });

      setSelectedProduct(null);

      loadProducts();
    } catch (err) {
      console.log(err.response?.data);
      showMessage("Order creation failed", "error");
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <h1>E-Commerce Retail Platform</h1>
      </header>

      {/* REGISTER + LOGIN */}

      <section className="auth-section">

        <div className="auth-box">
          <h2>Register</h2>

          <div className="form-row">

            <input
              placeholder="First Name"
              value={registerData.firstName}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  firstName: e.target.value,
                })
              }
            />

            <input
              placeholder="Last Name"
              value={registerData.lastName}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  lastName: e.target.value,
                })
              }
            />

            <input
              placeholder="Email"
              type="email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  email: e.target.value,
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
                  password: e.target.value,
                })
              }
            />

            <button
              className="btn btn-primary"
              onClick={register}
            >
              Register
            </button>

          </div>
        </div>

        <div className="auth-box">
          <h2>Login</h2>

          <div className="form-row">

            <input
              placeholder="Email"
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value,
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
                  password: e.target.value,
                })
              }
            />

            <button
              className="btn btn-primary"
              onClick={login}
            >
              Login
            </button>

          </div>
        </div>

      </section>

      {/* PRODUCTS */}

      <section className="section">

        <div className="section-header">
          <h2>Products</h2>

          <button
            className="btn btn-blue"
            onClick={loadProducts}
          >
            Refresh Products
          </button>
        </div>

        <div className="product-grid">

          {products.length === 0 ? (
            <div className="empty">
              No products available
            </div>
          ) : (
            products.map((product) => {

              const totalValue =
                Number(product.price) *
                Number(product.quantity);

              return (
                <div
                  className="product-card"
                  key={product.id}
                >

                  <div className="product-info">

                    <h3>{product.name}</h3>

                    <div className="product-details">

                      <div>
                        <span>Price</span>
                        <strong>
                          ${Number(product.price).toFixed(2)}
                        </strong>
                      </div>

                      <div>
                        <span>Quantity Available</span>
                        <strong>
                          {product.quantity.toLocaleString()}
                        </strong>
                      </div>

                      <div>
                        <span>Total Value</span>
                        <strong>
                          ${totalValue.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </strong>
                      </div>

                    </div>

                  </div>

                  <button
                    className="btn btn-danger delete-btn"
                    onClick={() =>
                      deleteProduct(product.id)
                    }
                  >
                    Delete
                  </button>

                </div>
              );
            })
          )}

        </div>

      </section>

      {/* ADD PRODUCT */}

      <section className="section">

        <h2>Add Product</h2>

        <div className="add-product-card">

          <div className="field">
            <input
              placeholder="Product Name"
              value={productData.name}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="field">
            <input
              placeholder="Description"
              value={productData.description}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="field">
            <input
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              value={productData.price}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  price: e.target.value,
                })
              }
            />

            <small>Enter price in USD</small>
          </div>

          <div className="field">
            <input
              placeholder="Quantity"
              type="number"
              min="1"
              value={productData.quantity}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  quantity: e.target.value,
                })
              }
            />

            <small>Enter available quantity</small>
          </div>

          <button
            className="btn btn-success"
            onClick={addProduct}
          >
            Add Product
          </button>

        </div>

      </section>

      {/* CREATE ORDER */}

      <section className="section">

        <h2>Create Order</h2>

        <div className="order-card">

          {/* CUSTOMER */}

          <div className="order-field">

            <label>Customer Name</label>

            <input
              placeholder="Enter customer name"
              value={orderData.customerName}
              onChange={(e) =>
                setOrderData({
                  ...orderData,
                  customerName: e.target.value,
                })
              }
            />

          </div>

          {/* PRODUCT */}

          <div className="order-field">

            <label>Select Product</label>

            <select
              value={selectedProduct?.id || ""}
              onChange={(e) =>
                selectProduct(e.target.value)
              }
            >

              <option value="">
                -- Select Product --
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} - $
                  {Number(product.price).toFixed(2)}
                </option>
              ))}

            </select>

            <small>
              Choose a product from the list
            </small>

          </div>

          {/* QUANTITY */}

          <div className="order-field">

            <label>Quantity</label>

            <input
              type="number"
              min="1"
              max={selectedProduct?.quantity || undefined}
              value={orderData.quantity}
              onChange={(e) =>
                changeOrderQuantity(e.target.value)
              }
            />

            <small>
              Number of units you want to order
              {selectedProduct && (
                <>
                  {" "}
                  (Max available:{" "}
                  {selectedProduct.quantity})
                </>
              )}
            </small>

          </div>

          {/* UNIT PRICE */}

          <div className="order-field">

            <label>Unit Price (USD)</label>

            <input
              type="text"
              value={
                selectedProduct
                  ? `$${Number(
                      selectedProduct.price
                    ).toFixed(2)}`
                  : "$0.00"
              }
              readOnly
            />

            <small>
              Price per unit (auto-filled)
            </small>

          </div>

          {/* TOTAL */}

          <div className="order-field">

            <label>Total Amount (USD)</label>

            <input
              type="text"
              value={`$${Number(
                orderData.totalAmount || 0
              ).toFixed(2)}`}
              readOnly
            />

            <small>
              Quantity × Unit Price
            </small>

          </div>

          {/* BUTTON */}

          <button
            className="btn btn-success create-order-btn"
            onClick={createOrder}
          >
            Create Order
          </button>

        </div>

      </section>

      {/* MESSAGE */}

      {message && (
        <div
          className={`message ${
            messageType === "error"
              ? "message-error"
              : "message-success"
          }`}
        >
          <span>{message}</span>

          <button
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}

export default App;