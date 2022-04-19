const {app, server, PORT} = require("../app")
const portApp = process.env.PORT || 3000;

app.listen(portApp, () => {
  console.log(`Listening to PORT ${PORT}`);
});

server.listen(PORT, () => {
  console.log(`server on port ${PORT}`)
})
