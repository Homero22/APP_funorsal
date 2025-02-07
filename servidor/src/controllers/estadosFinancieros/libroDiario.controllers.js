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

    console.log(libroDiario.rows);

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
    console.log(infoLibroDiario);
    /** lo que llega en infoLibroDiario
     * {
  int_libro_diario_id: 5,
  dt_libro_diario_fecha: '2025-02-07T16:38:58.181Z',
  int_cliente_id: 1,
  str_libro_diario_descripcion: null,
  detalle_libro_diarios: [
    {
      int_detalle_libro_diario_id: 9,
      int_libro_diario_id: 5,
      str_detalle_libro_diario_nombre_cuenta: 'ACTIVO INTANGIBLE',
      str_detalle_libro_diario_codigo_cuenta: '1.2.2',
      int_cuenta_id: 17,
      str_detalle_libro_diario_tipo: 'DEBE',
      dc_detalle_libro_diario_monto: 14,
      dt_fecha_creacion: '2025-02-07T16:40:20.644Z',
      dt_fecha_actualizacion: '2025-02-07T16:40:20.644Z'
    },
    {
      int_detalle_libro_diario_id: 10,
      int_libro_diario_id: 5,
      str_detalle_libro_diario_nombre_cuenta: 'COOPERATIVA DE AHORRO CRÉDITO',
      str_detalle_libro_diario_codigo_cuenta: '1.1.1.2',
      int_cuenta_id: 8,
      str_detalle_libro_diario_tipo: 'HABER',
      dc_detalle_libro_diario_monto: 14,
      dt_fecha_creacion: '2025-02-07T16:40:20.645Z',
      dt_fecha_actualizacion: '2025-02-07T16:40:20.645Z'
    }
  ]
}
     */
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


export default {
  crearDetalleDiario,
  obtenerLibroDiarioByIdCliente,
  editarDetalleDiario
};
