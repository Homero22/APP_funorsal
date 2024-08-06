import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import {Cliente} from '../estadosFinancieros/cliente.models.js';

export const Cuenta = sequelize.define('cuenta', {
    int_cuenta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    str_cuenta_nombre: {
        type: DataTypes.STRING
    },
    int_cliente_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Cliente,
            key: 'int_cliente_id'
        }
    },
    str_cuenta_descripcion: {
        type: DataTypes.STRING
    },
    str_cuenta_codigo: {
        type: DataTypes.STRING
    },
    int_cuenta_padre_id:{
        type: DataTypes.INTEGER
    }
}, {
    schema: 'estados_financieros',
    timestamps: false,
    freezeTableName: true,
});