const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 CREATE SERVER
const server = http.createServer(app);

// 🔥 SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🧠 STORE ORDERS
let orders = [];

// 🔌 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
});

// ==========================
// 🚀 CREATE ORDER
// ==========================
app.post("/order", (req, res) => {
  console.log("🔥 ORDER RECEIVED:", req.body);

  if (!req.body || !req.body.tableNumber) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const order = {
    id: orders.length + 1,
    tableNumber: req.body.tableNumber,
    items: req.body.items || [],
    total: req.body.total || 0,
    payment: req.body.payment || "Cash",
    status: "pending",
    createdAt: new Date(),
  };

  orders.push(order);

  console.log("📦 Current Orders:", orders.length);

  io.emit("newOrder", order); // 🔥 REAL-TIME

  res.json({ message: "Order received", order });
});

// ==========================
// 📦 GET ALL ORDERS
// ==========================
app.get("/orders", (req, res) => {
  console.log("📡 Orders requested");
  res.json(orders);
});

// ==========================
// 🔄 UPDATE ORDER STATUS
// ==========================
app.post("/update", (req, res) => {
  console.log("🔄 UPDATE:", req.body);

  const { id, status } = req.body;

  const order = orders.find((o) => o.id === id);

  if (order) {
    order.status = status;
    io.emit("updateOrder", order);
    console.log("✅ Order updated:", id, status);
  } else {
    console.log("❌ Order not found:", id);
  }

  res.json({ message: "Updated" });
});

// ==========================
// 🔐 LOGIN SYSTEM
// ==========================
const users = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "kitchen", password: "1234", role: "kitchen" },
  { username: "waiter", password: "1234", role: "waiter" },
  { username: "customer", password: "1234", role: "customer" } 
];

app.post("/login", (req, res) => {
  console.log("🔐 Login attempt:", req.body);

  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ success: true, role: user.role });
  } else {
    res.json({ success: false });
  }
});

// ==========================
// 🟢 START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});