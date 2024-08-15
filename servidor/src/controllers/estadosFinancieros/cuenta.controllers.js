import { Cuenta} from "../../models/estadosFinancieros/cuentas.models.js";
import {LibroDiario} from "../../models/estadosFinancieros/libroDiario.models.js";
import {DetalleDiario} from "../../models/estadosFinancieros/detalleDiario.models.js";
import { Op } from "sequelize";

export const obtenerCuentasByIdCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const cuentas = await Cuenta.findAll({
            where: {
                int_cliente_id: id
            }
        });
        res.json({
            status: true,
            message: "Cuentas encontradas",
            body: cuentas,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener las cuentas",
        });
    }
};

export const crearCuenta = async (req, res) => {
    try {
        
        const data = req.body;
        console.log(data);
        const cuenta = await Cuenta.create(data);
        if(!cuenta){
            return res.json({
                status: false,
                message: "Error al crear la cuenta",
                body:[]
            });
        }
        res.json({
            status: true,
            message: "Cuenta creada",
            body: cuenta,
        });
      
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al crear la cuenta",
        });
    }
};

export const obtenerInformacionCuentaById = async (req, res) => {
    try {
        
        
        const { id } = req.params;
        let { fechaInicio, fechaFin } = req.query;

        fechaInicio = new Date(fechaInicio);
        fechaFin = new Date(fechaFin);

        const cuenta = await Cuenta.findOne({
            where: {
                int_cuenta_id: id
            },
            raw: true
        });
        if(!cuenta){
            return res.json({
                status: false,
                message: "Cuenta no encontrada",
                body:[]
            });
        }

        let nombre = cuenta.str_cuenta_nombre;
        let idCliente = cuenta.int_cliente_id;


        const libroDiario = await LibroDiario.findAll({
            where: {
                int_cliente_id: idCliente,
                dt_libro_diario_fecha: {
                    [Op.between]: [fechaInicio, fechaFin]
                }
            },
            raw: true,
            include: {
                model: DetalleDiario,
                required: true,
                where: {
                    str_detalle_libro_diario_nombre_cuenta: nombre
                }
            },
            
        });

    

        if(!libroDiario){
            return res.json({
                status: false,
                message: "No se encontraron registros",
                body:[]
            });
        }

        const movimientos = await organizarMovimientos(libroDiario);



         async function organizarMovimientos(movimientos) {
            let totalDebe = 0;
            let totalHaber = 0;
            const detalles = [];
          
            for (const movimiento of movimientos) {
                let otrosMovimientos = await DetalleDiario.findAll({
                    where: {
                        int_libro_diario_id: movimiento.int_libro_diario_id
                    }
                });
            
                
              const monto = parseFloat(movimiento['detalle_libro_diarios.dc_detalle_libro_diario_monto']);
              const tipo = movimiento['detalle_libro_diarios.str_detalle_libro_diario_tipo'];
          
              if (tipo === 'DEBE') {
                totalDebe += monto;
              } else if (tipo === 'HABER') {
                totalHaber += monto;
              }
          
              detalles.push({
                fecha: movimiento.dt_libro_diario_fecha,
                descripcion: movimiento['detalle_libro_diarios.str_detalle_libro_diario_nombre_cuenta'],
                debe: tipo === 'DEBE' ? monto : null,
                haber: tipo === 'HABER' ? monto : null,
                int_libro_diario_id: movimiento.int_libro_diario_id,
                otrosMovimientos
               });
            }

        

          
            return {
              resumen: {
                totalDebe: totalDebe.toFixed(2),
                totalHaber: totalHaber.toFixed(2),
              },
                detalles
            };
        }



     
        res.json({
            status: true,
            message: "Cuenta encontrada",
            body: movimientos,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener la cuenta",
        });
    }
}

export const actualizarCuenta = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const cuenta = await Cuenta.update(data, {
            where: {
                int_cuenta_id: id
            }
        });
        res.json({
            status: true,
            message: "Cuenta actualizada",
            body: cuenta,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al actualizar la cuenta",
        });
    }
}

export const eliminarCuenta = async (req, res) => {
    try {
        const { id } = req.params;
        const cuenta = await Cuenta.destroy({
            where: {
                int_cuenta_id: id
            }
        });
        res.json({
            status: true,
            message: "Cuenta eliminada",
            body: cuenta,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al eliminar la cuenta",
        });
    }
}


export default {
    obtenerCuentasByIdCliente,
    crearCuenta,
    obtenerInformacionCuentaById,
    actualizarCuenta,
    eliminarCuenta
};