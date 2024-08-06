import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";



const app = express();

app.use(express.json());
const whiteList = ["http://localhost:4200",];

app.use(cors({
    origin: whiteList,
    credentials: true
}));

app.use(cookieParser());

export default app;

// Middleware para registrar cada solicitud
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.originalUrl}`);
    next(); // Continuar con la siguiente función de middleware o ruta
  });

app.use(indexRoutes);