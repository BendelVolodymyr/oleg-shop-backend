import { Server } from 'socket.io';

let io;

const initSocket = server => {
  io = new Server(server, {
    cors: {
      origin: '*', // Замінити на конкретний фронтенд домен, якщо потрібно
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    console.log(`🔗 Клієнт підключився: ${socket.id}`);

    // Отримання повідомлення та трансляція всім
    socket.on('sendMessage', ({ sender, message }) => {
      io.emit('receiveMessage', { sender, message });
    });

    // Оновлення товару в реальному часі
    socket.on('updateProduct', product => {
      io.emit('productUpdated', product);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Клієнт відключився: ${socket.id}`);
    });

    socket.on('error', err => {
      console.error(`🚨 Помилка WebSocket: ${err.message}`);
    });
  });
};

const getSocketInstance = () => io;

export default { initSocket, getSocketInstance };
