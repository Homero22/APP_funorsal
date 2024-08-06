import { Router } from "express";

import cuentaController from "../../controllers/estadosFinancieros/cuenta.controllers.js";

const router = Router();

router.get("/cliente/:id", cuentaController.obtenerCuentasByIdCliente);
router.post("/cliente", cuentaController.crearCuenta);

export default router;