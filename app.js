require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const createError = require("http-errors");
const connectMongoDb = require("./db/connectmongodb");

// error handler
// const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticateUser = require("./middleware/authenticated");

const morgan = require("morgan");

const app = express();
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
// const origin = "http://localhost:3000";
// app.use(
//   cors({
//     credentials: true,
//     origin,
//   })
// );
app.use(
  cors({
    credentials: true,
  })
);
app.use(xss());
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

app.use("/api", require("./routes/api.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/code", require("./routes/post.route"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectMongoDb(process.env.MONGO_URL);
    app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
