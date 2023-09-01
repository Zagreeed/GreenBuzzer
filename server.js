const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
const port = process.env.PORT || 3000;

(async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      autoIndex: true,
      useUnifiedTopology: true,
    });

    console.log("DATABASE CONNECTED");
  } catch (err) {
    console.log("UNHANDLED-REJECTION");
    console.log(err.message);
    server.close(() => {
      process.exit(1);
    });
  }
})();

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
