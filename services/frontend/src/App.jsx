import { useEffect, useState } from "react";

const API_BASE = "/api/v1";

function App() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

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

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [orderData, setOrderData] = useState({
    customerName: "",
    productId: "",
    quantity: 1,
    totalAmount: "",
  });

  // =========================
  // Load Products
  // =========================

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();
      setProducts(data);

      // Clear selected product if it no longer exists
      if (
        orderData.productId &&
        !data.some((product) => product.id === Number(orderData.productId))
      ) {
        setOrderData((prev) => ({
          ...prev,
          productId: "",
          totalAmount: "",
        }));
      }
    } catch (error) {
      setMessage("Failed to load products");
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =========================
  // Register
  // =========================

  const registerUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Registration successful");

      setRegisterData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  // =========================
  // Login
  // =========================

  const loginUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setMessage("Login successful");

      console.log("Login response:", data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  // =========================
  // Add Product
  // =========================

  const addProduct = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          price: Number(productData.price),
          quantity: Number(productData.quantity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setMessage("Product added successfully");

      setProductData({
        name: "",
        description: "",
        price: "",
        quantity: "",
      });

      loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // =========================
  // Delete Product
  // =========================

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setMessage("Product deleted successfully");

      loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // =========================
  // Product Selection
  // =========================

  const handleProductSelection = (event) => {
    const productId = event.target.value;

    const selectedProduct = products.find(
      (product) => product.id === Number(productId)
    );

    setOrderData((prev) => ({
      ...prev,
      productId,
      totalAmount: selectedProduct
        ? (selectedProduct.price * Number(prev.quantity || 1)).toFixed(2)
        : "",
    }));
  };

  // =========================
  // Quantity Change
  // =========================

  const handleQuantityChange = (event) => {
    const quantity = event.target.value;

    const selectedProduct = products.find(
      (product) => product.id === Number(orderData.productId)
    );

    setOrderData((prev) => ({
      ...prev,
      quantity,
      totalAmount: selectedProduct
        ? (selectedProduct.price * Number(quantity || 0)).toFixed(2)
        : "",
    }));
  };

  // =========================
  // Create Order
  // =========================

  const createOrder = async () => {
    try {
      if (!orderData.customerName) {
        setMessage("Please enter customer name");
        return;
      }

      if (!orderData.productId) {
        setMessage("Please select a product");
        return;
      }

      if (!orderData.quantity || Number(orderData.quantity) <= 0) {
        setMessage("Please enter a valid quantity");
        return;
      }

      const selectedProduct = products.find(
        (product) => product.id === Number(orderData.productId)
      );

      if (!selectedProduct) {
        setMessage("Selected product not found");
        return;
      }

      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: orderData.customerName,
          productName: selectedProduct.name,
          quantity: Number(orderData.quantity),
          totalAmount: Number(orderData.totalAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      setMessage("Order created successfully");

      setOrderData({
        customerName: "",
        productId: "",
        quantity: 1,
        totalAmount: "",
      });

      loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Retail Platform</h1>

      {/* =========================
          Register
      ========================= */}

      <section style={sectionStyle}>
        <h2>Register</h2>

        <div style={formRow}>
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
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                password: e.target.value,
              })
            }
          />

          <button onClick={registerUser}>Register</button>
        </div>
      </section>

      {/* =========================
          Login
      ========================= */}

      <section style={sectionStyle}>
        <h2>Login</h2>

        <div style={formRow}>
          <input
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                password: e.target.value,
              })
            }
          />

          <button onClick={loginUser}>Login</button>
        </div>
      </section>

      {/* =========================
          Products
      ========================= */}

      <section style={sectionStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Products</h2>

          <button onClick={loadProducts}>Refresh Products</button>
        </div>

        <div style={productGrid}>
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} style={productCard}>
                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <p>
                  <strong>Price:</strong> ${product.price}
                </p>

                <p>
                  <strong>Quantity:</strong> {product.quantity}
                </p>

                <button onClick={() => deleteProduct(product.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* =========================
          Add Product
      ========================= */}

      <section style={sectionStyle}>
        <h2>Add Product</h2>

        <div style={formRow}>
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

          <div style={fieldGroup}>
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={productData.price}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  price: e.target.value,
                })
              }
            />
          </div>

          <div style={fieldGroup}>
            <label>Quantity</label>
            <input
              type="number"
              placeholder="1"
              value={productData.quantity}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  quantity: e.target.value,
                })
              }
            />
          </div>

          <button onClick={addProduct}>Add Product</button>
        </div>
      </section>

      {/* =========================
          Create Order
      ========================= */}

      <section style={sectionStyle}>
        <h2>Create Order</h2>

        <div style={orderForm}>
          <div style={fieldGroup}>
            <label>Customer Name</label>
            <input
              placeholder="Customer Name"
              value={orderData.customerName}
              onChange={(e) =>
                setOrderData({
                  ...orderData,
                  customerName: e.target.value,
                })
              }
            />
          </div>

          <div style={fieldGroup}>
            <label>Product</label>

            <select
              value={orderData.productId}
              onChange={handleProductSelection}
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price} ({product.quantity} available)
                </option>
              ))}
            </select>
          </div>

          <div style={fieldGroup}>
            <label>Quantity</label>

            <input
              type="number"
              min="1"
              value={orderData.quantity}
              onChange={handleQuantityChange}
            />
          </div>

          <div style={fieldGroup}>
            <label>Total Amount</label>

            <input
              type="number"
              value={orderData.totalAmount}
              readOnly
              placeholder="0.00"
            />
          </div>

          <button onClick={createOrder}>Create Order</button>
        </div>
      </section>

      {/* =========================
          Message
      ========================= */}

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

// =========================
// Styles
// =========================

const sectionStyle = {
  borderBottom: "1px solid #ccc",
  paddingBottom: "20px",
  marginBottom: "25px",
};

const formRow = {
  display: "flex",
  alignItems: "flex-end",
  gap: "8px",
  flexWrap: "wrap",
};

const orderForm = {
  display: "flex",
  alignItems: "flex-end",
  gap: "12px",
  flexWrap: "wrap",
};

const fieldGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const productCard = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "20px",
  minHeight: "180px",
};

export default App;