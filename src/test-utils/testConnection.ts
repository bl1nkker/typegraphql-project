import { createConnection } from "typeorm"
// Test ORM Connection to db
export const testConnection = (drop: boolean = false) =>{
    return createConnection({
    name:"default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "O_bl1nk_ZD_21",
    // Name of the db
    database: "typegraphql-project-test",
    // Syncronize with ORM entities
    synchronize:drop,
    // Deletes all the tables in db
    dropSchema:drop,
    entities:[__dirname + "./../entity/*.*"]
})
}