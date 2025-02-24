import { Cuenta } from "../../models/estadosFinancieros/cuentas.models.js";
import { LibroDiario } from "../../models/estadosFinancieros/libroDiario.models.js";
import { DetalleDiario } from "../../models/estadosFinancieros/detalleDiario.models.js";
import { parse } from "dotenv";
import { Op } from "sequelize";
import { Cliente } from "../../models/estadosFinancieros/cliente.models.js";





const crearDetalleDiario = async (req, res) => {
  try {
    const infoLibroDiario = req.body;

    console.log(infoLibroDiario);
 

    //Primero llena la tabla libro diario (padre)
    const libroDiarioId = await LibroDiario.create({
      dt_libro_diario_fecha: infoLibroDiario.fecha,
      int_cliente_id: infoLibroDiario.idCliente,

    });

    let tipo = "";
    let monto;

    infoLibroDiario.entradas.forEach(async (element) => {
      if (element.debit > 0) {
        tipo = "DEBE";
        monto = element.debit;
        const detalleDiario = await DetalleDiario.create({
          int_libro_diario_id: libroDiarioId.int_libro_diario_id,
          str_detalle_libro_diario_nombre_cuenta: element.account,
          str_detalle_libro_diario_codigo_cuenta: element.code,
          int_cuenta_id: element.id,
          str_detalle_libro_diario_tipo: tipo,
          dc_detalle_libro_diario_monto: monto,
        });
      }
      if (element.credit > 0) {
        tipo = "HABER";
        monto = element.credit;
        const detalleDiario = await DetalleDiario.create({
          int_libro_diario_id: libroDiarioId.int_libro_diario_id,
          str_detalle_libro_diario_nombre_cuenta: element.account,
          str_detalle_libro_diario_codigo_cuenta: element.code,
          int_cuenta_id: element.id,
          str_detalle_libro_diario_tipo: tipo,
          dc_detalle_libro_diario_monto: monto,
        });
      }

    });

    return res.json({
      status: true,
      message: "Detalle diario creado correctamente",
      body: libroDiarioId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al crear el detalle diario",
      data: {},
    });
  }
};

const obtenerLibroDiarioByIdCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const { limit = 10, offset = 0, mes, anio } = req.query;


    const meses = {
      1: "Enero",
      2: "Febrero",
      3: "Marzo",
      4: "Abril",
      5: "Mayo",
      6: "Junio",
      7: "Julio",
      8: "Agosto",
      9: "Septiembre",
      10: "Octubre",
      11: "Noviembre",
      12: "Diciembre",
    };
    

    // Construir el filtro de fechas
    const filtros = {
      int_cliente_id: idCliente,
    };
    if (mes && anio) {
      filtros.dt_libro_diario_fecha = {
        [Op.between]: [
          new Date(anio, mes - 1, 1),
          new Date(anio, mes, 0), // Último día del mes
        ],
      };
    }


    // Realiza el conteo total en la tabla principal sin incluir los modelos relacionados
    const total = await LibroDiario.count({
      where: filtros,
    });

    const libroDiario = await LibroDiario.findAndCountAll({
      where: filtros,
      order: [["dt_libro_diario_fecha", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: {
        model: DetalleDiario,
        required: true,
      },
    });

    if (libroDiario.rows.length === 0) {
      return res.json({
        status: false,
        message: "No se encontraron registros" + ` del mes ${meses[mes]} del año ${anio}`,
        body: {},
      });
    }

 

    return res.json({
      status: true,
      message: "Libro diario encontrado",
      body: libroDiario.rows,
      total:total
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al obtener el libro diario",
      data: {},
    });
  }
};

const editarDetalleDiario = async (req, res) => {
  try {
    const { id } = req.params;
    const infoLibroDiario = req.body;

   // Buscar y actualizar el registro en LibroDiario
    const libroDiario = await LibroDiario.findByPk(id);
    if (!libroDiario) {
      return res.status(404).json({
        status: false,
        message: "Libro Diario no encontrado",
      });
    }

    await libroDiario.update({
      dt_libro_diario_fecha: infoLibroDiario.fecha,
      int_cliente_id: infoLibroDiario.idCliente,
    });

    // Eliminar detalles anteriores
    await DetalleDiario.destroy({
      where: { int_libro_diario_id: id },
    });

    // Insertar los nuevos detalles
    let tipo = "";
    let monto;

    for (const element of infoLibroDiario.detalle_libro_diarios) {
      await DetalleDiario.create({
        int_libro_diario_id: infoLibroDiario.int_libro_diario_id,
        str_detalle_libro_diario_nombre_cuenta: element.str_detalle_libro_diario_nombre_cuenta,
        str_detalle_libro_diario_codigo_cuenta: element.str_detalle_libro_diario_codigo_cuenta,
        int_cuenta_id: element.int_cuenta_id,
        str_detalle_libro_diario_tipo:element.str_detalle_libro_diario_tipo,
        dc_detalle_libro_diario_monto: element.dc_detalle_libro_diario_monto,
      });
      // Verificar si hay un nuevo saldo en DEBE
      if (element.nuevoSaldoDebe !== 0) {
        await DetalleDiario.create({
          int_libro_diario_id: infoLibroDiario.int_libro_diario_id,
          str_detalle_libro_diario_nombre_cuenta: element.str_detalle_libro_diario_nombre_cuenta,
          str_detalle_libro_diario_codigo_cuenta: element.str_detalle_libro_diario_codigo_cuenta,
          int_cuenta_id: element.int_cuenta_id,
          str_detalle_libro_diario_tipo: 'DEBE',  // Especificamos que es un "DEBE"
          dc_detalle_libro_diario_monto: element.nuevoSaldoDebe,
        });
      }

      // Verificar si hay un nuevo saldo en HABER
      if (element.nuevoSaldoHaber !== 0) {
        await DetalleDiario.create({
          int_libro_diario_id: infoLibroDiario.int_libro_diario_id,
          str_detalle_libro_diario_nombre_cuenta: element.str_detalle_libro_diario_nombre_cuenta,
          str_detalle_libro_diario_codigo_cuenta: element.str_detalle_libro_diario_codigo_cuenta,
          int_cuenta_id: element.int_cuenta_id,
          str_detalle_libro_diario_tipo: 'HABER',  // Especificamos que es un "HABER"
          dc_detalle_libro_diario_monto: element.nuevoSaldoHaber,
        });
      }
    }

    return res.json({
      status: true,
      message: "Detalle diario actualizado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: true,
      message: "Error al actualizar el detalle diario",
      data: {},
    });
  }
};

//funcion para obtener los ingresos y gastos de un cliente en un año
const obtenerIngresosGastos = async (req, res) => {
  try {
    const { idCliente, anio } = req.params;

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
          [Op.between]: [`${anio}-01-01`, `${anio}-12-31`],
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
        message: "No se encontraron registros",
      });
    }

    let ingresos = 0;
    let gastos = 0;

    const tipoCuenta = (codigoCuenta) => {
      const tipos = {
        1: "ACTIVOS",
        2: "PASIVOS",
        3: "PATRIMONIO",
        5: "INGRESOS",
        4: "GASTOS",
      };
      return tipos[codigoCuenta[0]];
    };

    let ingresosPorMes = new Array(12).fill(0);
    let gastosPorMes = new Array(12).fill(0);
    const cuentasIngresos = {};
    const cuentasGastos = {};
    


    libroDiario.forEach((element) => {
      element.detalle_libro_diarios.forEach((detalle) => {
        const tipo = tipoCuenta(detalle.str_detalle_libro_diario_codigo_cuenta);
        const monto = parseFloat(detalle.dc_detalle_libro_diario_monto);
        const mes = new Date(element.dt_libro_diario_fecha).getMonth()

        if (tipo === "INGRESOS") {
          console.log("Ingreso", detalle.str_detalle_libro_diario_codigo_cuenta,);
          ingresosPorMes[mes] += monto;
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
          gastosPorMes[mes] += monto;
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


    return res.json({
      status: true,
      message: "Ingresos y gastos encontrados",
      ingresos: ingresosPorMes,
      gastos: gastosPorMes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al obtener los ingresos y gastos",
      data: {},
    });
  }
};


export default {
  crearDetalleDiario,
  obtenerLibroDiarioByIdCliente,
  editarDetalleDiario,
  obtenerIngresosGastos,
};
