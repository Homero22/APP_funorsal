import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import { Ventas } from './ventas.models.js';

export const DetalleVentas = sequelize.define('detalle_ventas', {
    int_detalle_ventas_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    int_ventas_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Ventas,
            key: 'int_ventas_id'
        }
    },
    str_detalle_ventas_nombre_producto: {
        type: DataTypes.STRING
    },
    dc_detalle_ventas_precio: {
        type: DataTypes.DECIMAL
    },
    int_detalle_ventas_cantidad: {
        type: DataTypes.INTEGER
    },
    dt_fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    dt_fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    schema: 'estados_financieros',
    timestamps: false,
    freezeTableName: true,
});