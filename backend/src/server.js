const dotenv = require('dotenv');
dotenv.config();
const app = require('./app'); 
const { connection } = require('./database/db'); 

app.listen(process.env.PORT, async () => {
    await connection();
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);    
});
