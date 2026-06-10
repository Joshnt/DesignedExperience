let socket;

socket = io.connect("https://designedexperience.onrender.com");

  socket.on("connect", () => {
    console.log("Connected");

    socket.emit("joinRoom", "output");
  });

  socket.on("touchesUpdate", (msg) => {
      console.log("Output room got:", msg);
  });