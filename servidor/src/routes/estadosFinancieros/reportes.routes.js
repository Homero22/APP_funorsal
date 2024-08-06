import { Router } from "express";

import reportesController from "../../controllers/estadosFinancieros/reportes.controllers.js";

const router = Router();

router.get("/ingresos-gastos/:idCliente", reportesController.crearBalanceIngresosGastosPorIdCliente);
router.get("/comprobacion/:idCliente", reportesController.crearBalanceComprobacion);
router.get("/balance-general/:idCliente", reportesController.crearBalanceGeneral);

export default router;