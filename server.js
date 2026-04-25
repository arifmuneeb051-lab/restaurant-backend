const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 MEMORY STORE
let orders = [];

// =====================
// CREATE ORDER
// =====================
app.post("/order", (req, res) => {
  const order = {
    id: Date.now(),
    tableNumber: req.body.tableNumber,
    items: req.body.items || [],
    total: req.body.total || 0,
    payment: req.body.payment || "Cash",
    status: "pending",
    createdAt: new Date(),
  };

  orders.push(order);

  console.log("🆕 New Order:", order);

  res.json(order);
});

// =====================
// GET ORDERS
// =====================
app.get("/orders", (req, res) => {
  res.json(orders);
});

// =====================
// UPDATE ORDER
// =====================
app.post("/update", (req, res) => {
  const { id, status } = req.body;

  const order = orders.find(o => o.id == id);

  if (order) {
    order.status = status;
    console.log("🔄 Updated:", id, status);
  }

  res.json({ success: true });
});

// =====================
// AUTO REMOVE SERVED (IMPORTANT FIX)
// =====================
app.post("/clear-served", (req, res) => {
  orders = orders.filter(o => o.status !== "served");
  res.json({ success: true });
});

// =====================
// RESET ALL ORDERS
// =====================
app.get("/reset", (req, res) => {
  orders = [];
  console.log("🧹 All orders cleared");
  res.send("All orders cleared ✅");
});

// =====================
// LOGIN SYSTEM
// =====================
const users = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "kitchen", password: "1234", role: "kitchen" },
  { username: "waiter", password: "1234", role: "waiter" },
  { username: "customer", password: "1234", role: "customer" },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    res.json({ success: true, role: user.role });
  } else {
    res.json({ success: false });
  }
});

// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});

console.log("NEW DEPLOY VERSION");