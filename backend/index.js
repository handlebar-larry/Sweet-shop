require("dotenv").config();

const createApp = require("./src/app");
const connectToDatabase = require("./src/config/database");

const app = createApp();

// Start server only if not running tests
if (process.env.NODE_ENV !== "test") {
  connectToDatabase();

  const port = process.env.PORT || 3500;
  app.listen(port, () => {
    console.log("Server running on PORT", port);
  });
}

module.exports = app;
