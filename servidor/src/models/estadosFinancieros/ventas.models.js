import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import { Cliente } from './cliente.models.js';

export const Ventas = sequelize.define('ventas', {
    int_ventas_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    int_cliente_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Cliente,
            key: 'int_cliente_id'
        }
    },
    dt_ventas_fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    str_ventas_descripcion: {
        type: DataTypes.STRING
    },
    dc_ventas_total: {
        type: DataTypes.DECIMAL
    },
    dc_ventas_iva: {
        type: DataTypes.DECIMAL
    },
    dc_ventas_subtotal: {
        type: DataTypes.DECIMAL
    },
    str_ventas_estado: {
        type: DataTypes.STRING
    }
}, {
    schema: 'estados_financieros',
    timestamps: false,
    freezeTableName: true,
});