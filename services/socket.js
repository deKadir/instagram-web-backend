let users = [];
const addUser = user => {
  if (user.userId === null || user.socketId === null) return;
  !users.some(userI => userI.userId === user.userId) && users.push(user);
};
const removeUser = socketId => {
  users = users.filter(user => user.socketId !== socketId);
};
const getUser = userId => {
  return users.find(user => user.userId === userId);
};

export default function socket({ io }) {
  io.on('connection', socket => {
    socket.on('addUser', user => {
      addUser(user);
      console.log(users);
    });

    socket.on('sendMessage', ({ sender, receiverId, conversationId, text }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit('getMessage', {
          sender,
          conversationId,
          text,
        });
      }
    });

    socket.on('disconnect', () => {
      removeUser(socket.id);
    });
  });
}
