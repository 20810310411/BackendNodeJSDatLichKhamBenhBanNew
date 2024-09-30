// server.js
const express = require('express');
const bodyParser = require('body-parser');
const viewEngine = require('./config/viewEngine');
const initWebRoutes = require('./route/web');
const userRouter = require('./route/userRouter');
const doctorRouter = require('./route/doctorRouter');
const connectDB = require('./config/connectDB');
const cors = require('cors');

require("dotenv").config();

let app = express();
let port = process.env.PORT || 6969;
const hostname = process.env.HOST_NAME;

connectDB();
app.use(
    cors({
      origin: "http://localhost:3000", // Thay bằng domain của frontend
      credentials: true,
    })
  );

// Config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
// initWebRoutes(app);
// Định nghĩa các route cho API
app.use("/api/users", userRouter);
app.use("/api/doctor", doctorRouter);

app.listen(port, () => {
    console.log("backend nodejs is running on the port:", port, `\n http://localhost:${port}`);
});


  
