const db =require('./config/db');

(async () => {
    try{
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log(rows)
    } catch (err) {
        console.error('DB TEST FAILED:', err);
    }
})();