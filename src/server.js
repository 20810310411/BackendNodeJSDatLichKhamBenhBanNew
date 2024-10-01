const express = require('express');
const bodyParser = require('body-parser');
const viewEngine = require('./config/viewEngine');
const initWebRoutes = require('./route/web');
const userRouter = require('./route/userRouter');
const doctorRouter = require('./route/doctorRouter');
const uploadRouter = require('./route/uploadRouter');
const connectDB = require('./config/connectDB');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

require("dotenv").config();

let app = express();
let port = process.env.PORT || 6969;
const hostname = process.env.HOST_NAME;

connectDB();

// Cài đặt CORS
app.use(
    cors({
      origin: "http://localhost:3000", // Thay bằng domain của frontend
      credentials: true,
    })
);

// Config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Đặt thư mục public/uploads làm public để có thể truy cập
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));


// Config app
viewEngine(app);
// Định nghĩa các route cho API
app.use("/api/users", userRouter);
app.use("/api/doctor", doctorRouter);
// Sử dụng uploadRouter
app.use("/api/doctor", uploadRouter); // Đặt đường dẫn cho upload

app.listen(port, () => {
    console.log("backend nodejs is running on the port:", port, `\n http://localhost:${port}`);
});
