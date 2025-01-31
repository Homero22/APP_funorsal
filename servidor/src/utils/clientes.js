import { Cliente } from '../models/estadosFinancieros/cliente.models.js';
import { Cuenta } from "../models/estadosFinancieros/cuentas.models.js";


/**
 * int_cliente_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    str_cliente_nombre: {
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
 */

    /**
     * informacion ejemplo
     * Ejemplos de Datos
Tabla: Tipo_Transacciones
id	nombre
1	Ingreso
2	Egreso
Tabla: Tipo_Cuentas
id	nombre
1	Activo
2	Pasivo
3	Patrimonio
4	Ingreso
5	Gasto
Tabla: Tipo_Detalles
id	nombre
1	Debe
2	Haber
Tabla: Transacciones
id	fecha	tipo_id	descripción	monto	cuenta_id	usuario_id
1	2024-05-01	1	Venta de producto	500.00	1	1
2	2024-05-02	2	Compra de insumos	200.00	2	2
Tabla: Cuentas
id	nombre	tipo_id	saldo_inicial	saldo_actual
1	Caja	1	1000.00	1500.00
2	Proveedores	2	0.00	200.00
3	Ventas	4	0.00	500.00
4	Compra de Insumos	5	0.00	200.00
Tabla: Detalles_Transacciones
id	transaccion_id	cuenta_id	cantidad	tipo_id
1	1	1	500.00	1
2	1	3	500.00	2
3	2	2	200.00	1
4	2	4	200.00	2
Este esquema normalizado mejora la consistencia y permite la expansión de los tipos sin necesidad de cambiar la estructura de las tablas principales.
     */
    //creamos 31 clientes
let clientes = [
    {
        int_cliente_id: 1,
        str_cliente_nombre: 'Cliente 1',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 1',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 2,
        str_cliente_nombre: 'Cliente 2',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 2',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 3,
        str_cliente_nombre: 'Cliente 3',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 3',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 4,
        str_cliente_nombre: 'Cliente 4',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 4',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 5,
        str_cliente_nombre: 'Cliente 5',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 5',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 6,
        str_cliente_nombre: 'Cliente 6',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 6',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 7,
        str_cliente_nombre: 'Cliente 7',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 7',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 8,
        str_cliente_nombre: 'Cliente 8',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 8',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 9,
        str_cliente_nombre: 'Cliente 9',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 9',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 10,
        str_cliente_nombre: 'Cliente 10',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 10',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 11,
        str_cliente_nombre: 'Cliente 11',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 11',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 12,
        str_cliente_nombre: 'Cliente 12',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 12',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 13,
        str_cliente_nombre: 'Cliente 13',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 13',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 14,
        str_cliente_nombre: 'Cliente 14',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 14',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
    {
        int_cliente_id: 15,
        str_cliente_nombre: 'Cliente 15',
        str_cliente_ruc: '123456789',
        str_cliente_correo: '',
        str_cliente_telefono: '0987654321',
        str_cliente_direccion: 'Direccion 15',
        dt_fecha_actualizacion: new Date(),
        dt_fecha_creacion: new Date()
    },
]

let tipoCuentas = [
    {
        int_tipo_cuenta_id: 1,
        str_tipo_cuenta_nombre: 'Activo',
        str_tipo_cuenta_descripcion: 'Cuentas de Activo',
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
    },
    {
        int_tipo_cuenta_id: 2,
        str_tipo_cuenta_nombre: 'Pasivo',
        str_tipo_cuenta_descripcion: 'Cuentas de Pasivo',
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
    },
    {
        int_tipo_cuenta_id: 3,
        str_tipo_cuenta_nombre: 'Patrimonio',
        str_tipo_cuenta_descripcion: 'Cuentas de Patrimonio',
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
    },
    {
        int_tipo_cuenta_id: 4,
        str_tipo_cuenta_nombre: 'Ingresos',
        str_tipo_cuenta_descripcion: 'Cuentas de Ingresos',
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
    },
    {
        int_tipo_cuenta_id: 5,
        str_tipo_cuenta_nombre: 'Egresos',
        str_tipo_cuenta_descripcion: 'Cuentas de Egresos',
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
    }
]

let tipoDetalles = [
    {
        int_tipo_detalle_id: 1,
        str_tipo_detalle_nombre: 'Debe',
        str_tipo_detalle_descripcion: 'Debe',
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
    },
    {
        int_tipo_detalle_id: 2,
        str_tipo_detalle_nombre: 'Haber',
        str_tipo_detalle_descripcion: 'Haber',
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
    }
]

let tipoTransacciones = [
    {
        int_tipo_transaccion_id: 1,
        str_tipo_transaccion_nombre: 'Ingreso',
        str_tipo_transaccion_descripcion: 'Ingreso',
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
    },
    {
        int_tipo_transaccion_id: 2,
        str_tipo_transaccion_nombre: 'Egreso',
        str_tipo_transaccion_descripcion: 'Egreso',
        dt_fecha_creacion: new Date(),
        dt_fecha_actualizacion: new Date()
    }
]






export const createCuentas = async (int_cliente_id) => {
    
    let cuentasGenerales = [
        {
            str_cuenta_nombre: 'ACTIVO',
            int_cliente_id: int_cliente_id,
            str_cuenta_descripcion: 'Cuentas de Activo',
            str_cuenta_codigo: '1',
            int_cuenta_padre_id: null
        },
        {
            str_cuenta_nombre: 'PASIVO',
            int_cliente_id: int_cliente_id,
            str_cuenta_descripcion: 'Cuentas de Pasivo',
            str_cuenta_codigo: '2',
            int_cuenta_padre_id: null
        },

        {
            str_cuenta_nombre: 'PATRIMONIO NETO',
            int_cliente_id: int_cliente_id,
            str_cuenta_descripcion: 'Cuentas de Patrimonio',
            str_cuenta_codigo: '3',
            int_cuenta_padre_id: null
        },
        {
            str_cuenta_nombre: 'INGRESOS',
            int_cliente_id: int_cliente_id,
            str_cuenta_descripcion: 'Cuentas de Ingresos',
            str_cuenta_codigo: '4',
            int_cuenta_padre_id: null
        },
        {
            str_cuenta_nombre: 'GASTOS',
            int_cliente_id: int_cliente_id,
            str_cuenta_descripcion: 'Cuentas de Egresos',
            str_cuenta_codigo: '5',
            int_cuenta_padre_id: null
        }

    ]
 //creamos las cuentas
 const cuentas = await Cuenta.bulkCreate(cuentasGenerales);

 //obtengo los int_cuenta_id de las cuentas generales para crear las subcuentas y ponerlas en int_cuenta_padre_id dado el idCliente

    let activo =await Cuenta.findOne({where: {str_cuenta_nombre: 'ACTIVO', int_cliente_id: int_cliente_id}});
    let pasivo =await Cuenta.findOne({where: {str_cuenta_nombre: 'PASIVO', int_cliente_id: int_cliente_id}});
    let patrimonio =await  Cuenta.findOne({where: {str_cuenta_nombre: 'PATRIMONIO NETO', int_cliente_id: int_cliente_id}});
    let ingresos =await Cuenta.findOne({where: {str_cuenta_nombre: 'INGRESOS', int_cliente_id: int_cliente_id}});
    let gastos =await Cuenta.findOne({where: {str_cuenta_nombre: 'GASTOS', int_cliente_id: int_cliente_id}});

    let activoCorriente =await Cuenta.create({
        str_cuenta_nombre: 'ACTIVO CORRIENTE',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Activo Corriente',
        str_cuenta_codigo: '1.1',
        int_cuenta_padre_id: activo.int_cuenta_id
    });

    let disponible = await Cuenta.create({
        str_cuenta_nombre: 'DISPONIBLE',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Disponible',
        str_cuenta_codigo: '1.1.1',
        int_cuenta_padre_id: activoCorriente.int_cuenta_id
    });
    let cooperativaAhorroCredito = await Cuenta.create({
        str_cuenta_nombre: 'COOPERATIVA DE AHORRO CRÉDITO',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Cooperativa de Ahorro Crédito',
        str_cuenta_codigo: '1.1.1.2',
        int_cuenta_padre_id: disponible.int_cuenta_id
    });
    let bancosInstituciones = await Cuenta.create({
        str_cuenta_nombre: 'BANCOS Y OTRAS INSTITUCIONES',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Bancos y Otras Instituciones',
        str_cuenta_codigo: '1.1.1.3',
        int_cuenta_padre_id: disponible.int_cuenta_id
    });
    let inversionesCooperativas = await Cuenta.create({
        str_cuenta_nombre: 'INVERSIONES EN COOPERATIVAS',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Inversiones en Cooperativas',
        str_cuenta_codigo: '1.1.1.4',
        int_cuenta_padre_id: disponible.int_cuenta_id
    });

    let activos_financieros = await Cuenta.create({
        str_cuenta_nombre: 'ACTIVOS FINANCIEROS',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Activos Financieros',
        str_cuenta_codigo: '1.1.2',
        int_cuenta_padre_id: activoCorriente.int_cuenta_id
    });
    let cuentasPorCobrar = await Cuenta.create({
        str_cuenta_nombre: 'CUENTAS POR COBRAR',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Cuentas por Cobrar',
        str_cuenta_codigo: '1.1.2.1',
        int_cuenta_padre_id: activos_financieros.int_cuenta_id
    });
    let anticipoProveedores = await Cuenta.create({
        str_cuenta_nombre: 'ANTICIPO A PROVEEDORES',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Anticipo a Proveedores',
        str_cuenta_codigo: '1.1.2.5',
        int_cuenta_padre_id: activos_financieros.int_cuenta_id
    });
    let provisionIncobrables = await Cuenta.create({
        str_cuenta_nombre: 'PROVISIÓN INCOBRABLES DE CUENTAS',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Provisión Incobrables de Cuentas',
        str_cuenta_codigo: '1.1.2.6',
        int_cuenta_padre_id: activos_financieros.int_cuenta_id
    });



    let inventarios = await Cuenta.create({
        str_cuenta_nombre: 'INVENTARIOS',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Inventarios',
        str_cuenta_codigo: '1.1.3',
        int_cuenta_padre_id: activoCorriente.int_cuenta_id
        });


    let activoNoCorriente =await Cuenta.create({
        str_cuenta_nombre: 'ACTIVO NO CORRIENTE',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Activo No Corriente',
        str_cuenta_codigo: '1.2',
        int_cuenta_padre_id: activo.int_cuenta_id
    });

    let activoIntangible =await Cuenta.create({
        str_cuenta_nombre: 'ACTIVO INTANGIBLE',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Activo Intangible',
        str_cuenta_codigo: '1.2.2',
        int_cuenta_padre_id: activoNoCorriente.int_cuenta_id
    });
    let activoIntangibleGastosDiferidos =await Cuenta.create({
        str_cuenta_nombre: 'ACTIVO INTANGIBLE-GASTOS DIFERIDOS',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Activo Intangible-Gastos Diferidos',
        str_cuenta_codigo: '1.2.2.1',
        int_cuenta_padre_id: activoIntangible.int_cuenta_id
    });

    let fijo =await Cuenta.create({
        str_cuenta_nombre: 'ACTIVOS FIJOS',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Fijo',
        str_cuenta_codigo: '1.2.1',
        int_cuenta_padre_id: activoNoCorriente.int_cuenta_id
    });
    let propiedadPlantaEquipo =await Cuenta.create({
        str_cuenta_nombre: 'PROPIEDAD,PLANTA Y EQUIPO',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Propiedad, Planta y Equipo',
        str_cuenta_codigo: '1.2.1.1',
        int_cuenta_padre_id: fijo.int_cuenta_id
    });


    let pasivoCorriente =await Cuenta.create({
        str_cuenta_nombre: 'PASIVO CORRIENTE',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Pasivo Corriente',
        str_cuenta_codigo: '2.1',
        int_cuenta_padre_id: pasivo.int_cuenta_id
    });

    let cuentasPorPagar =await Cuenta.create({
        str_cuenta_nombre: 'CUENTAS POR PAGAR',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Cuentas por Pagar',
        str_cuenta_codigo: '2.1.1',
        int_cuenta_padre_id: pasivoCorriente.int_cuenta_id
    });
    let obligacionesPatronales =await Cuenta.create({
        str_cuenta_nombre: 'OBLIGACIONES PATRONALES',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Obligaciones Patronales',
        str_cuenta_codigo: '2.1.1.2',
        int_cuenta_padre_id: cuentasPorPagar.int_cuenta_id
    });
    let obligacionesPorPagarSRI =await Cuenta.create({
        str_cuenta_nombre: 'OBLIGACIONES POR PAGAR SRI',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Obligaciones por Pagar SRI',
        str_cuenta_codigo: '2.1.1.3 ',
        int_cuenta_padre_id: cuentasPorPagar.int_cuenta_id
    });
    let otrasRetenciones =await Cuenta.create({
        str_cuenta_nombre: 'OTRAS RETENCIONES',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Otras Retenciones',
        str_cuenta_codigo: '2.1.1.4',
        int_cuenta_padre_id: cuentasPorPagar.int_cuenta_id
    });
    let interesesObligaciones =await Cuenta.create({
        str_cuenta_nombre: 'INTERESES DE OBLIGACIONES POR',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Intereses de Obligaciones por',
        str_cuenta_codigo: '2.1.1.7',
        int_cuenta_padre_id: cuentasPorPagar.int_cuenta_id
    });
    let anticipoClientes =await Cuenta.create({
        str_cuenta_nombre: 'ANTICIPO DE CLIENTES',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Anticipo de Clientes',
        str_cuenta_codigo: '2.1.1.8',
        int_cuenta_padre_id: cuentasPorPagar.int_cuenta_id
    });


    let pasivoNoCorriente =await Cuenta.create({
        str_cuenta_nombre: 'PASIVO NO CORRIENTE',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Pasivo No Corriente',
        str_cuenta_codigo: '2.2',
        int_cuenta_padre_id: pasivo.int_cuenta_id
    });
    let obligacionesLargoPlazo =await Cuenta.create({
        str_cuenta_nombre: 'OBLIGACIONES A LARGO PLAZO',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Obligaciones a Largo Plazo',
        str_cuenta_codigo: '2.2.1',
        int_cuenta_padre_id: pasivoNoCorriente.int_cuenta_id
    });
    let otrasObligacionesLargoPlazo =await Cuenta.create({
        str_cuenta_nombre: 'OTRAS OBLIGACIONES A LARGO PLAZO',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Otras Obligaciones a Largo Plazo',
        str_cuenta_codigo: '2.2.1.2',
        int_cuenta_padre_id: obligacionesLargoPlazo.int_cuenta_id
    });

    let capital =await Cuenta.create({
        str_cuenta_nombre: 'CAPITAL',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Capital',
        str_cuenta_codigo: '3.1',
        int_cuenta_padre_id: patrimonio.int_cuenta_id
    });
    let reservas =await Cuenta.create({
        str_cuenta_nombre: 'RESERVAS',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Reservas',
        str_cuenta_codigo: '3.1.2',
        int_cuenta_padre_id: capital.int_cuenta_id
    });
    let otrasReservasEstatutarias =await Cuenta.create({
        str_cuenta_nombre: 'OTRAS RESERVAS ESTATUTARIAS',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Otras Reservas Estatutarias',
        str_cuenta_codigo: '3.1.2.2',
        int_cuenta_padre_id: reservas.int_cuenta_id
    });
    let otrosAportesPatrimoniales =await Cuenta.create({
        str_cuenta_nombre: 'OTROS APORTES PATRIMONIALES',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Otros Aportes Patrimoniales',
        str_cuenta_codigo: '3.1.3',
        int_cuenta_padre_id: capital.int_cuenta_id
    });

    let ingresosOperacionales =await Cuenta.create({
        str_cuenta_nombre: 'INGRESOS OPERACIONALES',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Ingresos Operacionales',
        str_cuenta_codigo: '4.1',
        int_cuenta_padre_id: ingresos.int_cuenta_id
    });

    let ingresosNoOperacionales =await Cuenta.create({
        str_cuenta_nombre: 'INGRESOS NO OPERACIONALES',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Ingresos No Operacionales',
        str_cuenta_codigo: '4.2',
        int_cuenta_padre_id: ingresos.int_cuenta_id
    });

    let gastosYCostosOperacionales =await Cuenta.create({
        str_cuenta_nombre: 'GASTOS Y COSTOS OPERACIONALES',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Gastos y Costos Operacionales',
        str_cuenta_codigo: '5.1',
        int_cuenta_padre_id: gastos.int_cuenta_id
    });
    let gastosYCostosDeVenta =await Cuenta.create({
        str_cuenta_nombre: 'GASTOS Y COSTOS DE VENTA',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Gastos y Costos de Venta',
        str_cuenta_codigo: '5.1.1',
        int_cuenta_padre_id: gastosYCostosOperacionales.int_cuenta_id
    });

    let gastosAdministrativos =await Cuenta.create({
        str_cuenta_nombre: 'GASTOS ADMINISTRATIVOS',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Gastos Administrativos',
        str_cuenta_codigo: '5.1.2',
        int_cuenta_padre_id: gastosYCostosOperacionales.int_cuenta_id
    });

    let gastosFinancieros =await Cuenta.create({
        str_cuenta_nombre: 'GASTOS FINANCIEROS',
        int_cliente_id: int_cliente_id,
        str_cuenta_descripcion: 'Cuentas de Gastos Financieros',
        str_cuenta_codigo: '5.1.3',
        int_cuenta_padre_id: gastosYCostosOperacionales.int_cuenta_id
    });
    
}

 

export const createClientes = async () => {

//bulcamos para crear clientes
const cliente = await Cliente.bulkCreate(clientes);
}

