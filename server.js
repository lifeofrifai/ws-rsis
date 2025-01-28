const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());  // ✅ Enable CORS

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",  // ✅ Allow frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("sendMessage", (msg) => {
    console.log("📨 Message received:", msg);
    io.emit("receiveMessage", msg);
  });

  // // ✅ Handle callPatient event
  // socket.on("callPatient", (encounterID) => {
  //   console.log('📞 Calling patient:', encounterID);

  //   // ✅ Emit as an object for consistency
  //   io.emit("patientCalled", { encounterID });
  // });

  socket.on("callPatient", (encounterID) => {
    console.log('📞 Calling patient:', encounterID);
  
    // ✅ Emit only once to all clients
    socket.broadcast.emit("patientCalled", { encounterID });
  });
  

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
});
