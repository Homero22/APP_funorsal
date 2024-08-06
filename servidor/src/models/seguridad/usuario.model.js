import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import { Cliente } from '../estadosFinancieros/cliente.models.js';

export const Usuario = sequelize.define('usuario', {
    int_usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    str_usuario_nombre: {
        type: DataTypes.STRING
    },
    str_usuario_apellido: {
        type: DataTypes.STRING
    },
    str_usuario_email: {
        type: DataTypes.STRING
    },
    str_usuario_password: {
        type: DataTypes.STRING
    },
    str_usuario_telefono: {
        type: DataTypes.STRING
    },
    str_usuario_direccion: {
        type: DataTypes.STRING
    },
    str_usuario_rol: {
        type: DataTypes.STRING,
        defaultValue: 'usuario'
    },
    str_usuario_estado: {
        type: DataTypes.STRING,
        defaultValue: 'ACTIVO'
    },
}, {
    schema: 'seguridad',
    timestamps: false,
    freezeTableName: true,
});