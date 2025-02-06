import { SaldoMensualCuenta } from "../../models/estadosFinancieros/saldo_mensual_cuenta.model.js";
import { Cuenta } from "../../models/estadosFinancieros/cuentas.models.js";



//Posibilidad de agregar saldos mensuales a una cuenta, por mes y año

export const agregarSaldoMensualCuenta = async (req, res) => {
    const { int_cuenta_id, mes, anio, dec_saldo_deudora, dec_saldo_acreedora, dec_saldo_anterior_debito, dec_saldo_anterior_credito } = req.body;
    try {
        //comprobar que existe la cuenta
        const cuenta = await Cuenta.findOne({
            where: {
                int_cuenta_id
            }
        });
        if (!cuenta) {
            return res.json({
                status: false,
                message: 'La cuenta no existe',
                body: null
            });
        }

        //comprobar que tenga en un mes en un año no tenga ya un saldo mensual de cuenta
        const saldoMensualCuenta = await SaldoMensualCuenta.findOne({
            where: {
                int_cuenta_id,
                mes,
                anio
            }
        });
        if (saldoMensualCuenta) {
            return res.json({
                status: false,
                message: 'Ya existe un saldo mensual de cuenta para esa cuenta en ese mes y año',
                body: null
            });
        }

        const nuevoSaldoMensualCuenta = await SaldoMensualCuenta.create({
            int_cuenta_id,
            mes,
            anio,
            dec_saldo_deudora,
            dec_saldo_acreedora,
            dec_saldo_anterior_debito,
            dec_saldo_anterior_credito
        }, {
            fields: ['int_cuenta_id', 'mes', 'anio', 'dec_saldo_deudora', 'dec_saldo_acreedora', 'dec_saldo_anterior_debito', 'dec_saldo_anterior_credito']
        });
        if (nuevoSaldoMensualCuenta) {
            return res.json({
                status: true,
                message: 'Saldo mensual de cuenta creado exitosamente',
                data: nuevoSaldoMensualCuenta
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'No se pudo crear el saldo mensual de cuenta',
            data: {}
        });
    }
}

//Editar los saldos mensuales de una cuenta
export const editarSaldoMensualCuenta = async (req, res) => {
    const { int_saldo_mensual_cuenta_id } = req.params;
    const { int_cuenta_id, mes, anio, dec_saldo_deudora, dec_saldo_acreedora, dec_saldo_anterior_debito, dec_saldo_anterior_credito } = req.body;
    try {
        //con el int_saldo_mensual_cuenta_id busco el saldo mensual de cuenta
        const saldoMensualCuenta = await SaldoMensualCuenta.findOne({
            where: {
                int_saldo_mensual_cuenta_id
            }
        });

        //con ello puedo actualizar los datos de ese saldo mensual de cuenta
        const dataActualizada = await SaldoMensualCuenta.update({
            mes,
            anio,
            dec_saldo_deudora,
            dec_saldo_acreedora,
            dec_saldo_anterior_debito,
            dec_saldo_anterior_credito
        }, {
            where: {
                int_saldo_mensual_cuenta_id
            }
        });

        return res.json({
            status: true,
            message: 'Saldo mensual de cuenta actualizado exitosamente',
            data: saldoMensualCuenta
        });
 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'No se pudo actualizar el saldo mensual de cuenta',
            data: {}
        });
    }
}

//obtener saldo mensual de cuenta por int_cuenta_id, mes y anio
//esto es para saber si ya existe un saldo mensual de cuenta para una cuenta en un mes y año
export const obtenerSaldoMensualCuenta = async (req, res) => {
    const { int_cuenta_id, mes, anio } = req.params;
    try {
        const saldoMensualCuenta = await SaldoMensualCuenta.findOne({
            where: {
                int_cuenta_id,
                mes,
                anio
            }
        });
        if (!saldoMensualCuenta) {
            return res.json({
                status: false,
                message: 'No existe saldo mensual de cuenta para esa cuenta en ese mes y año. Puede agregarlo',
                body: null
            });
        }
        return res.json({
            status: true,
            message: 'Saldo mensual de cuenta encontrado',
            body: saldoMensualCuenta
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'No se pudo obtener el saldo mensual de cuenta',
            data: {}
        });
    }
}


export default {
    agregarSaldoMensualCuenta,
    editarSaldoMensualCuenta,
    obtenerSaldoMensualCuenta
}