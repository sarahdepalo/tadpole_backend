const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const http = require('http');
const host = '0.0.0.0';
const port = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(port, host, () => {
    console.log(`Server is running at ${host}:${port}`)
});


//Routes:

//Authentication Routes - Reg & Login:
app.use("/auth", require("./routes/jwtAuth"));


//Dashboard Route - for logged in users only:
app.use("/dashboard", require("./routes/dashboard"));

// Index route for verification of server functionality
const rootController = require('./routes/index');
app.use('/', rootController);


