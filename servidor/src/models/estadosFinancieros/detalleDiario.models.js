import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/database.js';
import { LibroDiario} from './libroDiario.models.js';

export const DetalleDiario = sequelize .define('detalle_libro_diario', {
    int_detalle_libro_diario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    int_libro_diario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: LibroDiario,
            key: 'int_libro_diario_id'
        }
    },
    str_detalle_libro_diario_nombre_cuenta: {
        type: DataTypes.STRING
    },
    str_detalle_libro_diario_codigo_cuenta: {
        type: DataTypes.STRING
    },
    int_cuenta_id: {
        type: DataTypes.INTEGER
    },
    str_detalle_libro_diario_tipo: {
        type: DataTypes.STRING
    },
    dc_detalle_libro_diario_monto: {
        type: DataTypes.DECIMAL
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

//relaciones

DetalleDiario.belongsTo(LibroDiario,{ foreignKey:'int_libro_diario_id'});
LibroDiario.hasMany(DetalleDiario,{ foreignKey:'int_libro_diario_id'});

    