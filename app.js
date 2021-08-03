const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

//Routes:

//Authentication Routes - Reg & Login:
app.use("/auth", require("./routes/jwtAuth"));


//Dashboard Route - for logged in users only:
app.use("/dashboard", require("./routes/dashboard"));

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000")
});