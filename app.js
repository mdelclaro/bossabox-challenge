const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv-safe").config();

const { mongodb_url } = require("./src/utils/config");

const toolsRoutes = require("./src/routes/tools");
const userRoutes = require("./src/routes/users");
const authRoutes = require("./src/routes/auth");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rotas
app.use("/v1/tools", toolsRoutes);
app.use("/v1/user/signup", userRoutes);
app.use("/v1/auth", authRoutes);

// tratamento de erros
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

app.use((req, res) => {
  res.status(404).json({ message: "URL inválida" });
});

mongoose.set("useFindAndModify", false);
mongoose
  .connect(mongodb_url, { useNewUrlParser: true })
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log("Erro mongodb: " + err);
  });
