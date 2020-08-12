const cors = require("cors");
const express = require("express");
const helmet = require("helmet");

const { bot } = require("./bot");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", async (req, res) => {
  const a = await bot("as");

  return res.json({ status: true });
});

app.listen(3333, () => console.log("server running"));
