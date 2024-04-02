const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const { Server } = require("socket.io");

// Criando uma instância do Express
const app = express();
// Criando uma instância do servidor HTTP passando o Express
const server = createServer(app);
// Criando uma instância do Socket.io passando o servidor HTTP
const io = new Server(server);

// Definindo o index.html como a página inicial (rota "/")
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// Log de conexão de usuários
io.on("connection", (socket) => {
  console.log("Um usuário se conectou");
  socket.on("disconnect", () => {
    console.log("Um usuário desconectou");
  });
});

// Log de mensagens
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});

// Enviando mensagens para todos os usuários conectados
// Também seria possível utilizar o método broadcast para enviar para todos os usuários, exceto o que enviou a mensagem, mas para este exemplo, utilizamos o método emit que envia para todos os usuários conectados
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// Iniciando o servidor na porta 3000
server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
