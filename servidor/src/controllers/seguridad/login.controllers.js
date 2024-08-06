import {Usuario} from '../../models/seguridad/usuario.model.js';
import {Cliente} from '../../models/estadosFinancieros/cliente.models.js';

export const login = async (req, res) => {
    try {
        console.log("Login",req.body);
        const {usuario, contrasena} = req.body;
        if(usuario ==='admin'){
            console.log("entro admin");
            const usuarioF = await Usuario.findOne({
                where: {
                    str_usuario_nombre: usuario,
                    str_usuario_password: contrasena
                }
            });
            console.log("data bd",usuarioF);
            if (!usuarioF)  {
                return res.status(400).json({
                    message: "Usuario o contraseña incorrectos"
                });
            }
            res.json({
                status: true,
                message: "Usuario encontrado",
                body: usuarioF
            });
        }else{
            const cliente = await Cliente.findOne({
                where: {
                    str_cliente_usuario: usuario,
                    str_cliente_password: contrasena
                }
            });
            
            if (!cliente)  {
                return res.status(400).json({
                    message: "Usuario o contraseña incorrectos"
                });
            }
            console.log("data bd",cliente);
            res.json({
                status: true,
                message: "Usuario encontrado",
                body: cliente
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener el usuario",
        });
    }
};

export default {
    login
}