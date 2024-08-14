import { Router } from "express";

import cuentaController from "../../controllers/estadosFinancieros/cuenta.controllers.js";

const router = Router();

router.get("/cliente/:id", cuentaController.obtenerCuentasByIdCliente);
router.post("/cliente", cuentaController.crearCuenta);
router.get("/info/:id", cuentaController.obtenerInformacionCuentaById);
router.put("/:id", cuentaController.actualizarCuenta);
router.delete("/:id", cuentaController.eliminarCuenta);

export default router;