const express = require("express");
const { json } = express;
const cors = require("cors");
const uploadRouter = require("./routes/uploadRoutes.js");
const sellerRouter = require("./routes/sellerRoutes.js");
const buyerRouter = require("./routes/buyerRoutes.js");
const itemRouter = require("./routes/itemRoutes.js");
const oracleRouter = require("./routes/oracleRoutes.js");
const contractRouter = require("./routes/contractRoutes.js");

const app = express();

app.use(json());
app.use(cors());
app.use("/api", uploadRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/buyer", buyerRouter);
app.use("/api/item", itemRouter);
app.use("/api/oracle", oracleRouter);
app.use("/api/contract", contractRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
