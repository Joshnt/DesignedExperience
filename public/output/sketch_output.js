let socket;

socket = io.connect("https://designx-color.onrender.com");

  socket.on("connect", () => {
    console.log("Connected");

    socket.emit("joinRoom", "output");
  });

  socket.on("data", (msg) => {
      console.log("Output room got:", msg);
  });