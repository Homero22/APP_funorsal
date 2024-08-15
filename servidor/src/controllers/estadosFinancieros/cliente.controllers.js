import { Cliente } from "../../models/estadosFinancieros/cliente.models.js";
import {createCuentas} from "../../utils/clientes.js";

export const obtenerClientes = async (req, res) => {
    //paginacion
    try {
        
        const { page, size } = req.query;
        const skip = (page - 1) * 5;
        const limit = size;
        const clientes = await Cliente.findAndCountAll({
            offset: skip,
            limit,
            order: [
                ['dt_fecha_actualizacion', 'DESC']
            ]
        });
        if(!clientes || clientes.count === 0){
            return res.json({
                status:false,
                message: "No se encontraron clientes",
                body: []
            });
        }
        res.json({
            status:true,
            message: "Clientes encontrados",
            body: clientes,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener los clientes",
        });
    }
};

export const obtenerCliente = async (req, res) => {
    try {
        
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id);
        res.json({
            status:true,
            message: "Cliente encontrado",
            body: cliente,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener el cliente",
        });
    }
};

export const crearCliente = async (req, res) => {
    try {
        const data = req.body;
        //comprobar que el ruc no se repita

        const ruc = data.str_cliente_ruc;
        const clienteRuc = await Cliente.findOne({
            where: {
                str_cliente_ruc: ruc,
            },
        });
        if(clienteRuc){
            return res.json({
                status:false,
                message: "El ruc ya esta registrado",
                body: []
            });
        }

       
        
        const cliente = await Cliente.create({
            str_cliente_nombre: data.str_cliente_nombre,
            str_cliente_ruc: data.str_cliente_ruc,
            str_cliente_direccion: data.str_cliente_direccion,
            str_cliente_telefono: data.str_cliente_telefono,
            str_cliente_correo: data.str_cliente_correo,
            str_cliente_password: data.str_cliente_password,
            str_cliente_usuario: data.str_cliente_usuario,
        });
        if(!cliente){
            return res.json({
                status:false,
                message: "No se pudo crear el cliente",
                body: []
            });
        }

        //crear cuentas por defecto
        createCuentas(cliente.int_cliente_id);
        res.json({
            status:true,
            message: "Cliente creado exitosamente",
            body: cliente
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al crear el cliente",
        });
    }
};

export const actualizarCliente = async (req, res) => {
    try {

        let { id } = req.params;
        const data = req.body;

       


        const cliente = await Cliente.update({
            str_cliente_nombre: data.str_cliente_nombre ,
            str_cliente_ruc: data.str_cliente_ruc,
            str_cliente_direccion: data.str_cliente_direccion,
            str_cliente_ruc: data.str_cliente_ruc,
            str_cliente_telefono: data.str_cliente_telefono,
            str_cliente_correo: data.str_cliente_correo,
            str_cliente_password: data.str_cliente_password,
            str_cliente_usuario: data.str_cliente_usuario,
            dt_fecha_actualizacion: new Date(),
        }, {
            where: {
                int_cliente_id: id,
            },
        });

        
        if(!cliente){
            return res.json({
                status:false,
                message: "No se pudo actualizar el cliente",
                body: []
            });
        }
        res.json({
            status:true,
            message: "Cliente actualizado exitosamente",
            body: cliente
        });

       
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al actualizar el cliente",
        });
    }
};

export const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        await Cliente.destroy({
            where: {
                int_cliente_id: id,
            },
        });
        res.json({
            message: "Cliente eliminado exitosamente",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al eliminar el cliente",
        });
    }
};

export const obtenerTodosClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json({
            status:true,
            message: "Clientes encontrados",
            body: clientes,
        });
       
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener los clientes",
        });
    }
}

export default {
    obtenerClientes,
    obtenerCliente,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerTodosClientes
};