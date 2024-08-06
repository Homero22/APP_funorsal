import { Cuenta} from "../../models/estadosFinancieros/cuentas.models.js";
import {LibroDiario} from "../../models/estadosFinancieros/libroDiario.models.js";
import {DetalleDiario} from "../../models/estadosFinancieros/detalleDiario.models.js";

const crearDetalleDiario = async (req, res) => {
    
    try {
        
        const infoLibroDiario = req.body;
        console.log(infoLibroDiario);
        //Primero llena la tabla libro diario (padre)
        const libroDiarioId = await LibroDiario.create({
            dt_libro_diario_fecha : infoLibroDiario.fecha,
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
            // const cuenta = await Cuenta.findOne({
            //     where: {
            //         str_cuenta_codigo: element.code
            //     }
            // });
            // console.log(cuenta);
            if(element.debit > 0){
                tipo = "DEBE";
                monto = element.debit;
            }
            if(element.credit > 0){
                tipo = "HABER";
                monto = element.credit;
            }
            const detalleDiario = await DetalleDiario.create({
                int_libro_diario_id: libroDiarioId.int_libro_diario_id,
                str_detalle_libro_diario_nombre_cuenta: element.account,
                str_detalle_libro_diario_codigo_cuenta: element.code,
                str_detalle_libro_diario_tipo: tipo,
                dc_detalle_libro_diario_monto: monto
            });
        }
        );


        return res.json({
            status:true,
            message: "Detalle diario creado correctamente",
            body: libroDiarioId
        });

        

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error al crear el detalle diario",
            data: {}
        });
    }
}

const obtenerLibroDiarioByIdCliente = async (req, res) => {
    try {
        console.log("LIbro diario cliente")
        const {idCliente} = req.params;
        const libroDiario = await LibroDiario.findAll({
            where: {
                int_cliente_id: idCliente
            },
            include: {
                model: DetalleDiario,
                required:true
            },
            order: [
                ['dt_libro_diario_fecha', 'ASC']
            ]
        });
        if(libroDiario.length === 0){
            return res.json({
                status:false,
                message: "No se encontraron registros",
                body: {}
            });
        }
        console.log("Libros",libroDiario)
        return res.json({
            status:true,
            message: "Libro diario encontrado",
            body: libroDiario
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error al obtener el libro diario",
            data: {}
        });
    }
}

export default {
    crearDetalleDiario,
    obtenerLibroDiarioByIdCliente
}
