import Database from "better-sqlite3";
const db = new Database(":memory:");
db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY)");
console.log("SQLite OK");
