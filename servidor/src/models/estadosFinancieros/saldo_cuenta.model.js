import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import { Cuenta } from './cuentas.models.js';

// export const SaldoCuenta = sequelize.define('saldo_cuenta', {
//     int_saldo_cuenta_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     int_cuenta_id: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: Cuenta,
//             key: 'int_cuenta_id'
//         }
//     },
//     dt_saldo_cuenta_fecha: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     },
//     dec_saldo_cuenta_debe: {
//         type: DataTypes.DECIMAL
//     },
//     dec_saldo_cuenta_haber: {
//         type: DataTypes.DECIMAL
//     },
//     dec_saldo_cuenta_saldo: {
//         type: DataTypes.DECIMAL
//     },
// }, {
//     schema: 'estados_financieros',
//     timestamps: false,
//     freezeTableName: true,
// });


