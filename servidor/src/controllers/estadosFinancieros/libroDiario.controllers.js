import { Cuenta } from "../../models/estadosFinancieros/cuentas.models.js";
import { LibroDiario } from "../../models/estadosFinancieros/libroDiario.models.js";
import { DetalleDiario } from "../../models/estadosFinancieros/detalleDiario.models.js";
import { parse } from "dotenv";
import { Op } from "sequelize";





const crearDetalleDiario = async (req, res) => {
  try {
    const infoLibroDiario = req.body;

    //Primero llena la tabla libro diario (padre)
    const libroDiarioId = await LibroDiario.create({
      dt_libro_diario_fecha: infoLibroDiario.fecha,
      int_cliente_id: infoLibroDiario.idCliente,

    });
    //recorre el array de detalles y los inserta en la tabla detalle diario
    /**
         * entradas: [
            { code: '2', account: 'PASIVO', debit: 20, credit: 0 },
            {
            code: '1.2',
            account: 'ACTIVO NO CORRIENTE',
            debit: 0,
            credit: 20
            }
        ],
         */
    let tipo = "";
    let monto;

    infoLibroDiario.entradas.forEach(async (element) => {
      if (element.debit > 0) {
        tipo = "DEBE";
        monto = element.debit;
      }
      if (element.credit > 0) {
        tipo = "HABER";
        monto = element.credit;
      }
      const detalleDiario = await DetalleDiario.create({
        int_libro_diario_id: libroDiarioId.int_libro_diario_id,
        str_detalle_libro_diario_nombre_cuenta: element.account,
        str_detalle_libro_diario_codigo_cuenta: element.code,
        int_cuenta_id: element.id,
        str_detalle_libro_diario_tipo: tipo,
        dc_detalle_libro_diario_monto: monto,
      });
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

export default {
  crearDetalleDiario,
  obtenerLibroDiarioByIdCliente,
};
