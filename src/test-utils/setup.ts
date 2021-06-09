import { testConnection } from "./testConnection";

// Creates new empty connection (db drops)
testConnection(true).then(() => process.exit())