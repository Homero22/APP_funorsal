import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';

export const Cliente = sequelize.define('cliente', {
    int_cliente_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    str_cliente_nombre: {
        type: DataTypes.STRING
    },
    str_cliente_usuario: {
        type: DataTypes.STRING
    },
    str_cliente_password: {
        type: DataTypes.STRING
    },
    str_cliente_ruc: {
        type: DataTypes.STRING
    },
    str_cliente_correo: {
        type: DataTypes.STRING
    },
    str_cliente_telefono: {
        type: DataTypes.STRING
    },
    str_cliente_direccion: {
        type: DataTypes.STRING
    },
    dt_fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    dt_fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    schema: 'estados_financieros',
    timestamps: false,
    freezeTableName: true,
});