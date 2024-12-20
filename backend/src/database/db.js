const mysql2 = require('mysql2');

const db = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


async function connection() {
    try {
        await db.promise().getConnection();
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
        throw error;
    }
}

module.exports = { db, connection };
