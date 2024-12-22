import { Router } from "express";
import clienteRoutes from "./estadosFinancieros/cliente.routes.js";
import loginRoutes from './seguridad/login.routes.js';
import cuentasRoutes from './estadosFinancieros/cuenta.routes.js';
import libroDiarioRoutes from './estadosFinancieros/libroDiario.routes.js';
import reportesRoutes from './estadosFinancieros/reportes.routes.js';


const router = Router();

//info
router.get("/info", (req, res) => {
    res.json({
        message: "Bienvenido a la API de Contabilidad",
        info: {
            version: "1.0",
            autor: "Sara",
            descripcion: "API para el sistema de contabilidad"
        }
    });
});



router.use("/clientes", clienteRoutes);
router.use("/login", loginRoutes);
router.use("/cuentas", cuentasRoutes);
router.use("/libroDiario", libroDiarioRoutes);
router.use("/reportes", reportesRoutes);



export default router;