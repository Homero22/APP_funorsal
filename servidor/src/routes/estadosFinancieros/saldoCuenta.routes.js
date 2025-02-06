import { Router } from "express";

import saldoCuentaController from "../../controllers/estadosFinancieros/saldosCuenta.controller.js";

const router = Router();

router.post("/", saldoCuentaController.agregarSaldoMensualCuenta);
router.put("/:int_saldo_mensual_cuenta_id", saldoCuentaController.editarSaldoMensualCuenta);
router.get("/:int_cuenta_id/:mes/:anio", saldoCuentaController.obtenerSaldoMensualCuenta);

export default router;