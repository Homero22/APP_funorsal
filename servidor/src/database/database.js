import { Sequelize } from "sequelize";
import {dbVariables} from "../config/variablesGlobales.js";

export const sequelize = new Sequelize(
  dbVariables.dbName,
  dbVariables.dbUser,
  dbVariables.dbPassword,
  {
    host: dbVariables.dbServer,
    logging:false,
    dialect: dbVariables.dbDialect,
    port: dbVariables.dbPort
  }
);