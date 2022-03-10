let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
export default function socket({ io }) {
  io.on("connection", (socket) => {
    //burada userı ekliyoruz socket id ile her sayfa yeniledniğinde socket ıd değişir
    // bunu clientta ben yazdım örnek olarak
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      console.log(userId + "added");
    });
    //burada userı mesaj göndereceği kişinin idsini ve ne gönderdiyse onu gönderiyorum
    // const user göndereceğim kişinin idsi demektir, yukarıda tuttuğum array içerisinde socket id ile to vasıtasyıla iletyorum böylelikle sadece o dinleyebilecek

    //getMessage ı clientta dinlediğimde socket.on() ile eğer socket idim eşit ise zaten yakalarım değilse o mesage gelmeyecektir
    //send message her mesaj gönderdiğinde kullanacaksın
    socket.on("sendMessage", ({ sender, receiverId, conversationId, text }) => {
      const user = getUser(receiverId);

      console.log(user);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          sender,
          conversationId,
          text,
        });
      }
    });

    //burada da disconnect oldğunda çıkartıyorum kullancıyı ki sorun yaşamasın
    socket.on("disconnect", () => {
      removeUser(socket.id);
    });
  });
}
