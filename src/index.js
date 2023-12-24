import dotenv from "dotenv";
import ConnectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path: './env'
})

ConnectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
         console.log(`Server is running at port`,process.env.PORT);
    })

    app.on("Error",(error)=>{
        console.log("error",error);
        throw error;
    })
})
.catch((err)=>{
    console.log("Server db connection faild",err);
});

// (
//   async  ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("ERROR",(error)=>{
//             console.log("MONGODB is not support this database",error);
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log("server started",process.env.PORT);
//         })
//     } catch (error) {
//         console.log("ERROR",error);
//         throw error;
//     }
//     }
// )();