import * as dotenv from 'dotenv';

dotenv.config();
//viables para la conexion a la base de datos
export const dbVariables = {
    dbUser: process.env.DB_USER,
    dbServer: process.env.DB_SERVER,
    dbPassword: process.env.DB_PASSWORD,
    dbDialect: process.env.DB_DIALECT,
    dbName:process.env.DB_NAME,
    dbPort:process.env.DB_PORT,
}

//variables  para el servidor
export const configVariables = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
}

export const jwtVariables = {
    jwtSecret:process.env.JWT_SECRET,
    jwtExpiresIn:process.env.JWT_EXPIRES_IN
}

