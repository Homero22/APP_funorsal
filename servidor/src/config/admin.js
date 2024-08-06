
import { Usuario } from '../models/seguridad/usuario.model.js';

let admin = {
    username: 'admin',
    password: 'admin'
}

export const createAdmin = async () => {

    //comprobar si el usuario admin ya existe

    const usuario = await Usuario.findOne({ where: { str_usuario_email: admin.username } });

    if (usuario) {
        console.log('El usuario admin ya existe');
        return;
    }

    //crear usuario admin

    const nuevoAdmin = {
        str_usuario_nombre: 'admin',
        str_usuario_apellido: 'admin',
        str_usuario_email: admin.username,
        str_usuario_password: admin.password,
        str_usuario_rol: 'admin'
    }

    await Usuario.create(nuevoAdmin);
    console.log('Usuario admin creado');

    


}

