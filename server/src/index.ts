import app from "./app.js";
import { connectDB } from "./config/db.js";


// connecting to the database 
connectDB().then(() => {
    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
}).catch((error: any) => {
    console.error("Database connection error ::: ", error.message);
});

