import app from "./app.js";
import { configVariables } from "./config/variablesGlobales.js";
import { sequelize } from "./database/database.js";

import { Cliente } from "./models/estadosFinancieros/cliente.models.js";
import { Cuenta } from "./models/estadosFinancieros/cuentas.models.js";
import { DetalleDiario } from "./models/estadosFinancieros/detalleDiario.models.js";
import { DetalleVentas } from "./models/estadosFinancieros/detalleVentas.models.js";
import { LibroDiario } from "./models/estadosFinancieros/libroDiario.models.js";
import { Ventas } from "./models/estadosFinancieros/ventas.models.js";

import { createAdmin } from "./config/admin.js";
// import { createTipoDetalles} from "./utils/clientes.js";
// import {createTipoTransacciones} from "./utils/clientes.js";




async function main(port) {
    try {
      // Conexión a la base de datos 
      await sequelize.authenticate();
  
      // Sincronización de la base de datos
      await sequelize.sync({ force: false, logging: false });
  
      const environment = configVariables.env === "production" ? "produccion" : "desarrollo";
      app.listen(port, () => {
        console.log(`Servidor ${environment} escuchando en el puerto ${port}`);
      });
      createAdmin();
      
    } catch (error) {
      console.error("Error al iniciar el servidor:", error);
    }
  }
  
main(configVariables.port);