const banner = `
'########:'##::::'##::'######::'##:::::::'##::: ##:
..... ##:: ##:::: ##:'##... ##: ##::::::: ###:: ##:
:::: ##::: ##:::: ##: ##:::..:: ##::::::: ####: ##:
::: ##:::: #########:. ######:: ##::::::: ## ## ##:
:: ##::::: ##.... ##::..... ##: ##::::::: ##. ####:
: ##:::::: ##:::: ##:'##::: ##: ##::::::: ##:. ###:
 ########: ##:::: ##:. ######:: ########: ##::. ##:
........::..:::::..:::......:::........::..::::..::
`;

require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const authRoutes = require("./routes/authRoutes");
const bmiRoutes = require("./routes/bmiRoutes");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const emailRoutes = require("./routes/emailRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authenticateToken = require("./middleware/authMiddleware");
connectDB();

const PORT = process.env.PORT;

const app = express();
app.use(cookieParser());
app.use(
    cors({
        origin: `http://localhost:${PORT}`,
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
    })
);

app.use(expressLayout);
app.set("layout", "layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.use("/auth", authRoutes);
app.use("/bmi", authenticateToken, bmiRoutes);
app.use("/qr", authenticateToken, qrCodeRoutes);
app.use("/email", authenticateToken, emailRoutes);
app.use("/weather", authenticateToken, weatherRoutes);
app.use("/admin", authenticateToken, adminRoutes);

app.listen(PORT, () => {
    console.log(`\n ${banner}`);
    console.log(`http://localhost:${PORT}`);
});
