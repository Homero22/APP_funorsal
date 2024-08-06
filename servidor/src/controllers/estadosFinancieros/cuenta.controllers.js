import { Cuenta} from "../../models/estadosFinancieros/cuentas.models.js";

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
        console.log("Crear cuenta")
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


export default {
    obtenerCuentasByIdCliente,
    crearCuenta
};