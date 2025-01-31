import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import { Cuenta } from './cuentas.models.js';

export const SaldoMensualCuenta= sequelize.define('tb_saldo_mensual_cuenta', {
    int_saldo_mensual_cuenta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    int_cuenta_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Cuenta,
            key: 'int_cuenta_id'
        }
    },
    //este dato de mes y año es para saber a que mes y año corresponde el saldo
    mes: {
        type: DataTypes.INTEGER
    },
    anio: {
        type: DataTypes.INTEGER
    },
    dec_saldo_deudora: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    dec_saldo_acreedora: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    dec_saldo_anterior_debito: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    dec_saldo_anterior_credito: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
}, {
    schema: 'estados_financieros',
    timestamps: false,
    freezeTableName: true,
});
