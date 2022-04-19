const app = require("../app")
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});

// server.listen(PORT, () => {
//   console.log(`server on port ${PORT}`)
// })
