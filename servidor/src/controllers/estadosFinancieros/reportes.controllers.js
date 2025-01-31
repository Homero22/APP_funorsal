import { Cuenta } from "../../models/estadosFinancieros/cuentas.models.js";
import { LibroDiario } from "../../models/estadosFinancieros/libroDiario.models.js";
import { DetalleDiario } from "../../models/estadosFinancieros/detalleDiario.models.js";
import { Cliente } from "../../models/estadosFinancieros/cliente.models.js";
import { SaldoMensualCuenta } from "../../models/estadosFinancieros/saldo_mensual_cuenta.model.js";
import moment from "moment";

import generarPdfBalanceBase64 from "../../pdfs/pdfIngresosGastos.js";
import generarPdfBalanceComprobacionBase64 from "../../pdfs/pdfComprobacion.js";
import generarPdfBalanceGeneralBase64 from "../../pdfs/pdfBalanceGeneral.js";

import { Op } from "sequelize";

//crear balance de comprobacion
//aqui se deben tener las cuentas activos, pasivos, patrimonio, ingresos y gastos
const crearBalanceComprobacion = async (req, res) => {
  try {
    let { idCliente } = req.params;
    let { fechaInicio, fechaFin } = req.query;
    fechaInicio = new Date(fechaInicio);
    fechaFin = new Date(fechaFin);



    //para crear un reporte de balance de comprobacion se necesita que las fechas sean del mismo mes y año
    if (
      fechaInicio.getMonth() !== fechaFin.getMonth() ||
      fechaInicio.getFullYear() !== fechaFin.getFullYear()

    ) {
      return res.status(400).json({
        status: false,
        message: "Las fechas deben ser del mismo mes y año",
      });
    }

    const mesInicio = fechaInicio.getMonth() + 1;
    const anioInicio = fechaInicio.getFullYear();
    console.log("Mes inicio: ", mesInicio);
    console.log("Año inicio: ", anioInicio);

    let mesAnterior = 0;
    let anioAnterior = 0;

    if (mesInicio === 1) {
      mesAnterior = 12;
      anioAnterior = anioInicio - 1;
    } else {
      mesAnterior = mesInicio - 1;
      anioAnterior = anioInicio;
    }

    

    const cliente = await Cliente.findOne({
      where: { int_cliente_id: idCliente },
    });

    if (!cliente) {
      return res.status(404).json({
        status: false,
        message: "Cliente no encontrado",
      });
    }
    const fechaInicioLocal = moment.tz(fechaInicio, "America/Bogota").toDate();
    const fechaFinLocal = moment.tz(fechaFin, "America/Bogota").endOf("day").toDate();

    console.log("Fecha inicio:2222 ", fechaInicio);
    console.log("Fecha fin:222 ", fechaFin);
    const libroDiario = await LibroDiario.findAll({
      where: {
        int_cliente_id: idCliente,
        dt_libro_diario_fecha: {
          [Op.between]: [fechaInicioLocal, fechaFinLocal],
        },
      },
      include: {
        model: DetalleDiario,
        required: true,
      },
    });

    if (libroDiario.length === 0) {
      return res.json({
        status: false,
        message: "No se encontraron registros en el libro diario",
        body: null,
      });
    }
    console.log("Cantidad: ", libroDiario.length);

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
        1: "ACTIVOS",
        2: "PASIVOS",
        3: "PATRIMONIO",
        4: "INGRESOS",
        5: "GASTOS",
      };
      return tipos[codigoCuenta[0]];
    };

    //objeto vacio para guardar los saldos anteriores de cada cuenta


    // for (const element of libroDiario) {
    //   for (const detalle of element.detalle_libro_diarios) {

    //     //obtengo el saldo anterior de la cuenta si no existe se pone 0
    //     const saldoAnterior = await SaldoMensualCuenta.findOne({
    //         where: {
    //             int_cuenta_id: detalle.int_cuenta_id,
    //             mes: mesAnterior,
    //             anio: anioAnterior
    //         }
    //     });
    //     let saldoAnteriorCuenta = 0;
    //     let saldo_acreedora = 0;
    //     let saldo_deudora = 0;
    //     let saldo_anterior_debito = 0;
    //     let saldo_anterior_credito = 0;

    //     if(saldoAnterior){
    //        saldo_deudora = saldoAnterior.dec_saldo_deudora;
    //         saldo_acreedora = saldoAnterior.dec_saldo_acreedora;
    //         saldo_anterior_debito = saldoAnterior.dec_saldo_anterior_debito;
    //         saldo_anterior_credito = saldoAnterior.dec_saldo_anterior_credito;
    //     }


    //     const tipo = tipoCuenta(detalle.str_detalle_libro_diario_codigo_cuenta);
        
    //     const monto = parseFloat(detalle.dc_detalle_libro_diario_monto);

    //     if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //       totalDebitos += monto;
    //     } else {
    //       totalCreditos += monto;
    //     }
    //     //voy calculando el saldo actual de cada cuenta 

    //     if (tipo === "ACTIVOS") {
    //       if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //         activos.debe += monto;
    //       } else {
    //         activos.haber += monto;
    //       }

    //       if (!cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
    //         cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
    //           str_detalle_libro_diario_nombre_cuenta:
    //             detalle.str_detalle_libro_diario_nombre_cuenta,
    //           str_detalle_libro_diario_codigo_cuenta:
    //             detalle.str_detalle_libro_diario_codigo_cuenta,
    //           debe: 0,
    //           haber: 0,
    //           saldo_acreedora,
    //           saldo_deudora,
    //           saldo_anterior_debito,
    //           saldo_anterior_credito
    //         };
    //       }
    //       if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //         cuentasActivos[
    //           detalle.str_detalle_libro_diario_codigo_cuenta
    //         ].debe += monto;
    //       } else {
    //         cuentasActivos[
    //           detalle.str_detalle_libro_diario_codigo_cuenta
    //         ].haber += monto;
    //       }
    //       cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_deudora = cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_anterior_debito + cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta].debe - cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta].haber;

    //       console.log("Saldo deudora: ", cuentasActivos[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_deudora);
      

    //     } else if (tipo === "PASIVOS") {
    //       if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //         pasivos.debe += monto;
    //       } else {
    //         pasivos.haber += monto;
    //       }
    //       if (!cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
    //         cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
    //           str_detalle_libro_diario_nombre_cuenta:
    //             detalle.str_detalle_libro_diario_nombre_cuenta,
    //           str_detalle_libro_diario_codigo_cuenta:
    //             detalle.str_detalle_libro_diario_codigo_cuenta,
    //           debe: 0,
    //           haber: 0,
    //           saldo_acreedora,
    //           saldo_deudora,
    //           saldo_anterior_debito,
    //           saldo_anterior_credito,
    //         };
    //       }
    //       if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //         cuentasPasivos[
    //           detalle.str_detalle_libro_diario_codigo_cuenta
    //         ].debe += monto;
    //       } else {
    //         cuentasPasivos[
    //           detalle.str_detalle_libro_diario_codigo_cuenta
    //         ].haber += monto;
    //       }
          
    //       cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_acreedora = cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_anterior_credito + cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta].haber - cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta].debe;

    //     } else if (tipo === "PATRIMONIO") {
    //       if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //         patrimonio.debe += monto;
    //       } else {
    //         patrimonio.haber += monto;
    //       }
    //       if (
    //         !cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta]
    //       ) {
    //         cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta] =
    //           {
    //             str_detalle_libro_diario_nombre_cuenta:
    //               detalle.str_detalle_libro_diario_nombre_cuenta,
    //             str_detalle_libro_diario_codigo_cuenta:
    //               detalle.str_detalle_libro_diario_codigo_cuenta,
    //             debe: 0,
    //             haber: 0,
    //             saldo_acreedora,
    //             saldo_deudora,
    //             saldo_anterior_debito,
    //             saldo_anterior_credito
    //           };
    //       }
    //       if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //         cuentasPatrimonio[
    //           detalle.str_detalle_libro_diario_codigo_cuenta
    //         ].debe += monto;
    //       } else {
    //         cuentasPatrimonio[
    //           detalle.str_detalle_libro_diario_codigo_cuenta
    //         ].haber += monto;
    //       }
    //       cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_acreedora = cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_anterior_credito + cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta].haber


    //     } else if (tipo === "INGRESOS") {
    //       if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //         ingresos.debe += monto;
    //       } else {
    //         ingresos.haber += monto;
    //       }
    //       if (
    //         !cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta]
    //       ) {
    //         cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
    //           str_detalle_libro_diario_nombre_cuenta:
    //             detalle.str_detalle_libro_diario_nombre_cuenta,
    //           str_detalle_libro_diario_codigo_cuenta:
    //             detalle.str_detalle_libro_diario_codigo_cuenta,
    //           debe: 0,
    //           haber: 0,
    //           saldo_acreedora,
    //           saldo_deudora,
    //           saldo_anterior_debito,
    //           saldo_anterior_credito
    //         };
    //       }
    //       if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //         cuentasIngresos[
    //           detalle.str_detalle_libro_diario_codigo_cuenta
    //         ].debe += monto;
    //       } else {
    //         cuentasIngresos[
    //           detalle.str_detalle_libro_diario_codigo_cuenta
    //         ].haber += monto;
    //       }
    //       cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_acreedora = cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_anterior_credito + cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta].haber

    //     } else if (tipo === "GASTOS") {
    //       if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //         gastos.debe += monto;
    //       } else {
    //         gastos.haber += monto;
    //       }
    //       if (!cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
    //         cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
    //           str_detalle_libro_diario_nombre_cuenta:
    //             detalle.str_detalle_libro_diario_nombre_cuenta,
    //           str_detalle_libro_diario_codigo_cuenta:
    //             detalle.str_detalle_libro_diario_codigo_cuenta,
    //           debe: 0,
    //           haber: 0,
    //           saldo_acreedora,
    //           saldo_deudora,
    //           saldo_anterior_debito,
    //           saldo_anterior_credito
    //         };
    //       }
    //       if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
    //         cuentasGastos[
    //           detalle.str_detalle_libro_diario_codigo_cuenta
    //         ].debe += monto;
    //       } else {
    //         cuentasGastos[
    //           detalle.str_detalle_libro_diario_codigo_cuenta
    //         ].haber += monto;
    //       }
    //       cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_deudora = cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta].saldo_anterior_debito + cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta].debe

      
    //     }
    //   }
    // }

    // Cargar todos los saldos mensuales en una sola consulta para evitar múltiples queries dentro del bucle
const saldosAnteriores = await SaldoMensualCuenta.findAll({
  where: {
    mes: mesAnterior,
    anio: anioAnterior
  }
});

// Convertir los resultados en un objeto para acceso rápido
const saldosMap = {};
saldosAnteriores.forEach(saldo => {
  saldosMap[saldo.int_cuenta_id] = saldo;
});




for (const element of libroDiario) {
  for (const detalle of element.detalle_libro_diarios) {
    const cuentaId = detalle.int_cuenta_id;
    const saldoAnterior = saldosMap[cuentaId] || {
      dec_saldo_deudora: 0,
      dec_saldo_acreedora: 0,
      dec_saldo_anterior_debito: 0,
      dec_saldo_anterior_credito: 0
    };

    // Definir tipo de cuenta
    const tipo = tipoCuenta(detalle.str_detalle_libro_diario_codigo_cuenta);
    const monto = parseFloat(detalle.dc_detalle_libro_diario_monto);
    const esDebe = detalle.str_detalle_libro_diario_tipo === "DEBE";

    // Determinar en qué objeto almacenar la cuenta
    let cuentasTipo;
    if (tipo === "ACTIVOS") cuentasTipo = cuentasActivos;
    else if (tipo === "PASIVOS") cuentasTipo = cuentasPasivos;
    else if (tipo === "PATRIMONIO") cuentasTipo = cuentasPatrimonio;
    else if (tipo === "INGRESOS") cuentasTipo = cuentasIngresos;
    else if (tipo === "GASTOS") cuentasTipo = cuentasGastos;
    else continue;

    // Si la cuenta aún no existe en el objeto, inicializarla
    if (!cuentasTipo[detalle.str_detalle_libro_diario_codigo_cuenta]) {
      cuentasTipo[detalle.str_detalle_libro_diario_codigo_cuenta] = {
        str_detalle_libro_diario_nombre_cuenta: detalle.str_detalle_libro_diario_nombre_cuenta,
        str_detalle_libro_diario_codigo_cuenta: detalle.str_detalle_libro_diario_codigo_cuenta,
        debe: 0,
        haber: 0,
        saldo_acreedora: saldoAnterior.dec_saldo_acreedora,
        saldo_deudora: saldoAnterior.dec_saldo_deudora,
        saldo_anterior_debito: saldoAnterior.dec_saldo_anterior_debito,
        saldo_anterior_credito: saldoAnterior.dec_saldo_anterior_credito
      };
    }

    // Sumar valores de debe y haber
    if (esDebe) {
      cuentasTipo[detalle.str_detalle_libro_diario_codigo_cuenta].debe += monto;
    } else {
      cuentasTipo[detalle.str_detalle_libro_diario_codigo_cuenta].haber += monto;
    }
  }
}

// Ahora calcular los saldos finales después del bucle
Object.values(cuentasActivos).forEach(cuenta => {
  cuenta.saldo_anterior_debito = parseFloat(cuenta.saldo_anterior_debito) || 0;
  cuenta.debe = parseFloat(cuenta.debe) || 0;
  cuenta.haber = parseFloat(cuenta.haber) || 0;
  cuenta.saldo_deudora = cuenta.saldo_anterior_debito + cuenta.debe - cuenta.haber;
  cuenta.saldo_acreedora = 0;
  cuenta.saldo_anterior_credito = 0;
  
});

Object.values(cuentasPasivos).forEach(cuenta => {
  cuenta.saldo_anterior_credito = parseFloat(cuenta.saldo_anterior_credito) || 0;
  cuenta.haber = parseFloat(cuenta.haber) || 0;
  cuenta.debe = parseFloat(cuenta.debe) || 0;
  cuenta.saldo_acreedora = cuenta.saldo_anterior_credito + cuenta.haber - cuenta.debe;
  cuenta.saldo_deudora=0;
  cuenta.saldo_anterior_debito=0;
 
});

Object.values(cuentasPatrimonio).forEach(cuenta => {
  cuenta.saldo_anterior_credito = parseFloat(cuenta.saldo_anterior_credito) || 0;
  cuenta.haber = parseFloat(cuenta.haber) || 0;
  cuenta.saldo_acreedora = cuenta.saldo_anterior_credito + cuenta.haber;
  cuenta.saldo_deudora=0;
  cuenta.saldo_anterior_debito=0;
});

Object.values(cuentasIngresos).forEach(cuenta => {
  cuenta.saldo_anterior_credito = parseFloat(cuenta.saldo_anterior_credito) || 0;
  cuenta.haber = parseFloat(cuenta.haber) || 0;
  cuenta.saldo_acreedora = cuenta.saldo_anterior_credito + cuenta.haber;
  cuenta.saldo_deudora=0;
  cuenta.saldo_anterior_debito=0;
});

Object.values(cuentasGastos).forEach(cuenta => {
  cuenta.saldo_anterior_debito = parseFloat(cuenta.saldo_anterior_debito) || 0;
  cuenta.debe = parseFloat(cuenta.debe) || 0;
  cuenta.saldo_deudora = cuenta.saldo_anterior_debito + cuenta.debe;
  cuenta.saldo_acreedora=0;
  cuenta.saldo_anterior_credito=0;
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
      totalCreditos,
    };

    const pdfBase64 = await generarPdfBalanceComprobacionBase64(
      infoBalanceComprobacion
    );
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', "inline; filename=informe.pdf");
    // res.send(Buffer.from(pdfBase64, 'base64'));

    return res.json({
      status: true,
      message: "Informe generado correctamente",
      body: pdfBase64,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Error en el servidor",
    });
  }
};

//Crear balance de ingresos y gastos
const crearBalanceIngresosGastosPorIdCliente = async (req, res) => {
  try {
    let { idCliente } = req.params;
    let { fechaInicio, fechaFin } = req.query;
    fechaInicio = new Date(fechaInicio);
    fechaFin = new Date(fechaFin);

    const cliente = await Cliente.findOne({
      where: { int_cliente_id: idCliente },
    });

    if (!cliente) {
      return res.json({
        status: false,
        message: "Cliente no encontrado",
        body: null,
      });
    }

    const libroDiario = await LibroDiario.findAll({
      where: {
        int_cliente_id: idCliente,
        dt_libro_diario_fecha: {
          [Op.between]: [fechaInicio, fechaFin],
        },
      },
      include: {
        model: DetalleDiario,
        required: true,
      },
    });

    console.log("Cantidad: ", libroDiario.length);

    if (libroDiario.length === 0) {
      console.log("No se encontraron registros en el libro diario");
      return res.json({
        status: false,
        message: "No se encontraron registros en el libro diario",
        body: null,
      });
    }

    let ingresos = 0;
    let gastos = 0;
    const cuentasIngresos = {};
    const cuentasGastos = {};

    const tipoCuenta = (codigoCuenta) => {
      const tipos = {
        1: "ACTIVOS",
        2: "PASIVOS",
        3: "PATRIMONIO",
        4: "INGRESOS",
        5: "GASTOS",
      };
      return tipos[codigoCuenta[0]];
    };

    libroDiario.forEach((element) => {
      element.detalle_libro_diarios.forEach((detalle) => {
        const tipo = tipoCuenta(detalle.str_detalle_libro_diario_codigo_cuenta);
        const monto = parseFloat(detalle.dc_detalle_libro_diario_monto);

        if (tipo === "INGRESOS") {
          ingresos += monto;
          if (
            !cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta]
          ) {
            cuentasIngresos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
              str_detalle_libro_diario_nombre_cuenta:
                detalle.str_detalle_libro_diario_nombre_cuenta,
              str_detalle_libro_diario_codigo_cuenta:
                detalle.str_detalle_libro_diario_codigo_cuenta,
              dc_detalle_libro_diario_monto: 0,
            };
          }
          cuentasIngresos[
            detalle.str_detalle_libro_diario_codigo_cuenta
          ].dc_detalle_libro_diario_monto += monto;
        } else if (tipo === "GASTOS") {
          gastos += monto;
          if (!cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
            cuentasGastos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
              str_detalle_libro_diario_nombre_cuenta:
                detalle.str_detalle_libro_diario_nombre_cuenta,
              str_detalle_libro_diario_codigo_cuenta:
                detalle.str_detalle_libro_diario_codigo_cuenta,
              dc_detalle_libro_diario_monto: 0,
            };
          }
          cuentasGastos[
            detalle.str_detalle_libro_diario_codigo_cuenta
          ].dc_detalle_libro_diario_monto += monto;
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
      cliente: cliente.str_cliente_nombre,
    };

    const pdfBase64 = await generarPdfBalanceBase64(infoBalanceIngresosGastos);

    return res.json({
      status: true,
      message: "Informe generado correctamente",
      body: pdfBase64,
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
      message: "Error en el servidor",
    });
  }
};

//crear balance general
const crearBalanceGeneral = async (req, res) => {
  try {
    let { idCliente } = req.params;
    let { fechaInicio, fechaFin } = req.query;
    fechaInicio = new Date(fechaInicio);
    fechaFin = new Date(fechaFin);

    const cliente = await Cliente.findOne({
      where: { int_cliente_id: idCliente },
    });

    if (!cliente) {
      return res.status(404).json({
        status: false,
        message: "Cliente no encontrado",
      });
    }

    const libroDiario = await LibroDiario.findAll({
      where: {
        int_cliente_id: idCliente,
        dt_libro_diario_fecha: {
          [Op.between]: [fechaInicio, fechaFin],
        },
      },
      include: {
        model: DetalleDiario,
        required: true,
      },
    });

    if (libroDiario.length === 0) {
      return res.json({
        status: false,
        message: "No se encontraron registros en el libro diario",
        body: null,
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
        1: "ACTIVOS",
        2: "PASIVOS",
        3: "PATRIMONIO",
        4: "INGRESOS",
        5: "GASTOS",
      };
      return tipos[codigoCuenta[0]];
    };

    libroDiario.forEach((element) => {
      element.detalle_libro_diarios.forEach((detalle) => {
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
              str_detalle_libro_diario_nombre_cuenta:
                detalle.str_detalle_libro_diario_nombre_cuenta,
              str_detalle_libro_diario_codigo_cuenta:
                detalle.str_detalle_libro_diario_codigo_cuenta,
              debe: 0,
              haber: 0,
              saldo: 0, // Agregar saldo inicializado en 0
            };
          }
          if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
            cuentasActivos[
              detalle.str_detalle_libro_diario_codigo_cuenta
            ].debe += monto;
          } else {
            cuentasActivos[
              detalle.str_detalle_libro_diario_codigo_cuenta
            ].haber += monto;
          }
        } else if (tipo === "PASIVOS") {
          if (!cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta]) {
            cuentasPasivos[detalle.str_detalle_libro_diario_codigo_cuenta] = {
              str_detalle_libro_diario_nombre_cuenta:
                detalle.str_detalle_libro_diario_nombre_cuenta,
              str_detalle_libro_diario_codigo_cuenta:
                detalle.str_detalle_libro_diario_codigo_cuenta,
              debe: 0,
              haber: 0,
              saldo: 0, // Agregar saldo inicializado en 0
            };
          }
          if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
            cuentasPasivos[
              detalle.str_detalle_libro_diario_codigo_cuenta
            ].debe += monto;
          } else {
            cuentasPasivos[
              detalle.str_detalle_libro_diario_codigo_cuenta
            ].haber += monto;
          }
        } else if (tipo === "PATRIMONIO") {
          if (
            !cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta]
          ) {
            cuentasPatrimonio[detalle.str_detalle_libro_diario_codigo_cuenta] =
              {
                str_detalle_libro_diario_nombre_cuenta:
                  detalle.str_detalle_libro_diario_nombre_cuenta,
                str_detalle_libro_diario_codigo_cuenta:
                  detalle.str_detalle_libro_diario_codigo_cuenta,
                debe: 0,
                haber: 0,
                saldo: 0, // Agregar saldo inicializado en 0
              };
          }
          if (detalle.str_detalle_libro_diario_tipo === "DEBE") {
            cuentasPatrimonio[
              detalle.str_detalle_libro_diario_codigo_cuenta
            ].debe += monto;
          } else {
            cuentasPatrimonio[
              detalle.str_detalle_libro_diario_codigo_cuenta
            ].haber += monto;
          }
        }
      });
    });

    // Calcular saldo (debe - haber) y total de montos para cada cuenta
    Object.values(cuentasActivos).forEach((cuenta) => {
      cuenta.saldo = cuenta.debe - cuenta.haber;
      totalMontoActivo += cuenta.saldo;
    });

    Object.values(cuentasPasivos).forEach((cuenta) => {
      cuenta.saldo = cuenta.debe - cuenta.haber;
      totalMontoPasivo += cuenta.saldo;
    });

    Object.values(cuentasPatrimonio).forEach((cuenta) => {
      cuenta.saldo = cuenta.debe - cuenta.haber;
      totalMontoPatrimonio += cuenta.saldo;
    });

    //poner en positivo los saldos
    totalMontoActivo = Math.abs(totalMontoActivo);
    totalMontoPasivo = Math.abs(totalMontoPasivo);
    totalMontoPatrimonio = Math.abs(totalMontoPatrimonio);

    // Calcular el resultado del ejercicio
    let resultadoEjercicio =
      totalMontoActivo - (totalMontoPasivo + totalMontoPatrimonio);

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
      resultadoEjercicio,
    };

    const pdfBase64 = await generarPdfBalanceGeneralBase64(infoBalance);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', "inline; filename=informe.pdf");
    // res.send(Buffer.from(pdfBase64, 'base64'));

    return res.json({
      status: true,
      message: "Informe generado correctamente",
      body: pdfBase64,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Error en el servidor",
    });
  }
};

//funcionalidad para calcular el balance de comprobacion donde se incluyen saldos anteriores es decir el saldo anterior de cada cuenta con un calculo especifico

export default {
  crearBalanceIngresosGastosPorIdCliente,
  crearBalanceComprobacion,
  crearBalanceGeneral,
};
