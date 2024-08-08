import { Cuenta} from "../../models/estadosFinancieros/cuentas.models.js";
import {LibroDiario} from "../../models/estadosFinancieros/libroDiario.models.js";	
import {DetalleDiario} from "../../models/estadosFinancieros/detalleDiario.models.js";
import {Cliente} from "../../models/estadosFinancieros/cliente.models.js";

import generarPdfBalanceBase64 from '../../pdfs/pdfIngresosGastos.js';
import generarPdfBalanceComprobacionBase64 from '../../pdfs/pdfComprobacion.js';
import generarPdfBalanceGeneralBase64 from '../../pdfs/pdfBalanceGeneral.js';

import { Op } from "sequelize";

//crear balance de comprobacion
//aqui se deben tener las cuentas activos, pasivos, patrimonio, ingresos y gastos
const crearBalanceComprobacion = async (req, res) => {
    try {
        console.log("crearBalanceComprobacion");
        let { idCliente } = req.params;
        let { fechaInicio, fechaFin } = req.query;
        fechaInicio = new Date(fechaInicio);
        fechaFin = new Date(fechaFin);

        const cliente = await Cliente.findOne({
            where: { int_cliente_id: idCliente }
        });

        if (!cliente) {
            return res.status(404).json({
                status: false,
                message: "Cliente no encontrado"
            });
        }
 
        const libroDiario = await LibroDiario.findAll({
            where: {
                int_cliente_id: idCliente,
                dt_libro_diario_fecha: {
                    [Op.between]: [fechaInicio, fechaFin]
                }
            },
            include: {
                model: DetalleDiario,
                required: true
            }
        });

        if (libroDiario.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No se encontraron registros en el libro diario"
            });
        }

        console.log("Cantidad de registros", libroDiario.length);

        let activos = { debe: 0, haber: 0 };
        let pasivos = { debe: 0, haber: 0 };
        let patrimonio = { debe: 0, haber: 0 };
        let ingresos = { debe: 0, haber: 0 };
        let gastos = { debe: 0, haber: 0 };

        let totalDebitos = 0;
        let totalCreditos = 0;

        const cuentasActivos = {};
        const cuentasPasivos = {};
        const cuentasPatrimonio = {};
        const cuentasIngresos = {};
        const cuentasGastos = {};

        const tipoCuenta = (codigoCuenta) => {
            const tipos = {
                "1": "ACTIVOS",
                "2": "PASIVOS",
                "3": "PATRIMONIO",
                "4": "INGRESOS",
                "5": "GASTOS"
            };
            return tipos[codigoCuenta[0]];
        };

        libroDiario.forEach(element => {
            element.detalle_libro_diarios.forEach(detalle => {
                const tipo = tipoCuenta(detalle.str_detalle_libro_diario_codigo_cuenta);
                const monto = parseFloat(detalle.dc_detalle_libro_diario_monto);

                if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                    totalDebitos += monto;
                } else {
                    totalCreditos += monto;
                }

                if (tipo === "ACTIVOS") {
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        activos.debe += monto;
                    } else {
                        activos.haber += monto;
                    }
                    if (!cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
                        cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
                            str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
                            str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
                            debe: 0,
                            haber: 0
                        };
                    }
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta].debe += monto;
                    } else {
                        cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta].haber += monto;
                    }
                } else if (tipo === "PASIVOS") {
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        pasivos.debe += monto;
                    } else {
                        pasivos.haber += monto;
                    }
                    if (!cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
                        cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
                            str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
                            str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
                            debe: 0,
                            haber: 0
                        };
                    }
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta].debe += monto;
                    } else {
                        cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta].haber += monto;
                    }
                } else if (tipo === "PATRIMONIO") {
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        patrimonio.debe += monto;
                    } else {
                        patrimonio.haber += monto;
                    }
                    if (!cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta]) {
                        cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta] = {
                            str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
                            str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
                            debe: 0,
                            haber: 0
                        };
                    }
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta].debe += monto;
                    } else {
                        cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta].haber += monto;
                    }
                } else if (tipo === "INGRESOS") {
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        ingresos.debe += monto;
                    } else {
                        ingresos.haber += monto;
                    }
                    if (!cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
                        cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
                            str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
                            str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
                            debe: 0,
                            haber: 0
                        };
                    }
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta].debe += monto;
                    } else {
                        cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta].haber += monto;
                    }
                } else if (tipo === "GASTOS") {
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        gastos.debe += monto;
                    } else {
                        gastos.haber += monto;
                    }
                    if (!cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
                        cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
                            str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
                            str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
                            debe: 0,
                            haber: 0
                        };
                    }
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta].debe += monto;
                    } else {
                        cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta].haber += monto;
                    }
                }
            });
        });

        const infoBalanceComprobacion = {
            activos,
            pasivos,
            patrimonio,
            ingresos,
            gastos,
            cuentasActivos: Object.values(cuentasActivos),
            cuentasPasivos: Object.values(cuentasPasivos),
            cuentasPatrimonio: Object.values(cuentasPatrimonio),
            cuentasIngresos: Object.values(cuentasIngresos),
            cuentasGastos: Object.values(cuentasGastos),
            fechaInicio,
            fechaFin,
            cliente: cliente.str_cliente_nombre,
            totalDebitos,
            totalCreditos
        };

        const pdfBase64 = await generarPdfBalanceComprobacionBase64(infoBalanceComprobacion);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', "inline; filename=informe.pdf");
        // res.send(Buffer.from(pdfBase64, 'base64'));

        return res.json({
            status: true,
            message: "Informe generado correctamente",
            body: pdfBase64
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Error en el servidor"
        });
    }
};





//Crear balance de ingresos y gastos
const crearBalanceIngresosGastosPorIdCliente = async (req, res) => {
    try {
        let{ idCliente} = req.params;
        let { fechaInicio, fechaFin } = req.query;
        fechaInicio = new Date(fechaInicio);
        fechaFin = new Date(fechaFin);

        const cliente = await Cliente.findOne({
            where: { int_cliente_id: idCliente }
        });

        if (!cliente) {
            return res.status(404).json({
                status: false,
                message: "Cliente no encontrado"
            });
        }

        const libroDiario = await LibroDiario.findAll({
            where: {
                int_cliente_id: idCliente,
                dt_libro_diario_fecha: {
                    [Op.between]: [fechaInicio, fechaFin]
                }
            },
            include: {
                model: DetalleDiario,
                required: true
            }
        });

        if (libroDiario.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No se encontraron registros en el libro diario"
            });
        }

        console.log("Cantidad de registros", libroDiario.length);

        let ingresos = 0;
        let gastos = 0;
        const cuentasIngresos = {};
        const cuentasGastos = {};

        const tipoCuenta = (codigoCuenta) => {
            const tipos = {
                "1": "ACTIVOS",
                "2": "PASIVOS",
                "3": "PATRIMONIO",
                "4": "INGRESOS",
                "5": "GASTOS"
            };
            return tipos[codigoCuenta[0]];
        };

        libroDiario.forEach(element => {
            element.detalle_libro_diarios.forEach(detalle => {
                const tipo = tipoCuenta(detalle.str_detalle_libro_diario_codigo_cuenta);
                const monto = parseFloat(detalle.dc_detalle_libro_diario_monto);

                if (tipo === "INGRESOS") {
                    ingresos += monto;
                    if (!cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
                        cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
                            str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
                            str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
                            dc_detalle_libro_diario_monto: 0
                        };
                    }
                    cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta].dc_detalle_libro_diario_monto += monto;
                } else if (tipo === "GASTOS") {
                    gastos += monto;
                    if (!cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
                        cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
                            str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
                            str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
                            dc_detalle_libro_diario_monto: 0
                        };
                    }
                    cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta].dc_detalle_libro_diario_monto += monto;
                }
            });
        });

        const infoBalanceIngresosGastos = {
            ingresos,
            gastos,
            resultado: ingresos - gastos,
            cuentasIngresos: Object.values(cuentasIngresos),
            cuentasGastos: Object.values(cuentasGastos),
            fechaInicio,
            fechaFin,
            cliente: cliente.str_cliente_nombre

        };

        const pdfBase64 = await generarPdfBalanceBase64(infoBalanceIngresosGastos);

        return res.json({
            status: true,
            message: "Informe generado correctamente",
            body: pdfBase64
        });

        //devolver con la cabezera de pdf
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', "inline; filename=informe.pdf");
        // res.send(Buffer.from(pdfBase64, 'base64'));

          //Para visualizar el pdf en el navegador
        /*
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
        res.send(Buffer.from(pdfBase64String, "base64"));
        */
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Error en el servidor"
        });
    }
};




//crear balance general
const crearBalanceGeneral = async (req, res) => {
    try {
        console.log("crearBalanceGeneral");
        let { idCliente } = req.params;
        let { fechaInicio, fechaFin } = req.query;
        fechaInicio = new Date(fechaInicio);
        fechaFin = new Date(fechaFin);

        const cliente = await Cliente.findOne({
            where: { int_cliente_id: idCliente }
        });

        if (!cliente) {
            return res.status(404).json({
                status: false,
                message: "Cliente no encontrado"
            });
        }

        const libroDiario = await LibroDiario.findAll({
            where: {
                int_cliente_id: idCliente,
                dt_libro_diario_fecha: {
                    [Op.between]: [fechaInicio, fechaFin]
                }
            },
            include: {
                model: DetalleDiario,
                required: true
            }
        });

        if (libroDiario.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No se encontraron registros en el libro diario"
            });
        }

        // let activos = { debe: 0, haber: 0 };
        // let pasivos = { debe: 0, haber: 0 };
        // let patrimonio = { debe: 0, haber: 0 };

        let totalDebitos = 0;
        let totalCreditos = 0;

        let totalMontoActivo = 0; // Inicializar totalMontoActivo
        let totalMontoPasivo = 0; // Inicializar totalMontoPasivo
        let totalMontoPatrimonio = 0; // Inicializar totalMontoPatrimonio

        const cuentasActivos = {};
        const cuentasPasivos = {};
        const cuentasPatrimonio = {};

        const tipoCuenta = (codigoCuenta) => {
            const tipos = {
                "1": "ACTIVOS",
                "2": "PASIVOS",
                "3": "PATRIMONIO",
                "4": "INGRESOS",
                "5": "GASTOS"
            };
            return tipos[codigoCuenta[0]];
        };

        libroDiario.forEach(element => {
            element.detalle_libro_diarios.forEach(detalle => {
                const tipo = tipoCuenta(detalle.str_detalle_libro_diario_codigo_cuenta);
                const monto = parseFloat(detalle.dc_detalle_libro_diario_monto);

                if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                    totalDebitos += monto;
                } else {
                    totalCreditos += monto;
                }

                if (tipo === "ACTIVOS") {
                    if (!cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
                        cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
                            str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
                            str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
                            debe: 0,
                            haber: 0,
                            saldo: 0 // Agregar saldo inicializado en 0
                        };
                    }
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta].debe += monto;
                    } else {
                        cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta].haber += monto;
                    }
                } else if (tipo === "PASIVOS") {
                    if (!cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
                        cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
                            str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
                            str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
                            debe: 0,
                            haber: 0,
                            saldo: 0 // Agregar saldo inicializado en 0
                        };
                    }
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta].debe += monto;
                    } else {
                        cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta].haber += monto;
                    }
                } else if (tipo === "PATRIMONIO") {
                    if (!cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta]) {
                        cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta] = {
                            str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
                            str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
                            debe: 0,
                            haber: 0,
                            saldo: 0 // Agregar saldo inicializado en 0
                        };
                    }
                    if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
                        cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta].debe += monto;
                    } else {
                        cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta].haber += monto;
                    }
                }
            });
        });

        // Calcular saldo (debe - haber) y total de montos para cada cuenta
        Object.values(cuentasActivos).forEach(cuenta => {
            cuenta.saldo = cuenta.debe - cuenta.haber;
            totalMontoActivo += cuenta.saldo;
        });

        Object.values(cuentasPasivos).forEach(cuenta => {
            cuenta.saldo = cuenta.debe - cuenta.haber;
            totalMontoPasivo += cuenta.saldo;
        });

        Object.values(cuentasPatrimonio).forEach(cuenta => {
            cuenta.saldo = cuenta.debe - cuenta.haber;
            totalMontoPatrimonio += cuenta.saldo;
        });

        //poner en positivo los saldos  
        totalMontoActivo = Math.abs(totalMontoActivo);
        totalMontoPasivo = Math.abs(totalMontoPasivo);
        totalMontoPatrimonio = Math.abs(totalMontoPatrimonio);


        // Calcular el resultado del ejercicio
        let resultadoEjercicio = totalMontoActivo - (totalMontoPasivo + totalMontoPatrimonio);

        const infoBalance = {
            totalMontoActivo,
            totalMontoPasivo,
            totalMontoPatrimonio,
            cuentasActivos: Object.values(cuentasActivos),
            cuentasPasivos: Object.values(cuentasPasivos),
            cuentasPatrimonio: Object.values(cuentasPatrimonio),
            fechaInicio,
            fechaFin,
            cliente: cliente.str_cliente_nombre,
            totalDebitos,
            totalCreditos,
            resultadoEjercicio
        };

        const pdfBase64 = await generarPdfBalanceGeneralBase64(infoBalance);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', "inline; filename=informe.pdf");
        // res.send(Buffer.from(pdfBase64, 'base64')); 


        return res.json({
            status: true,
            message: "Informe generado correctamente",
            body: pdfBase64
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Error en el servidor"
        });
    }
}







export default {
    crearBalanceIngresosGastosPorIdCliente,
    crearBalanceComprobacion,
    crearBalanceGeneral
}