import express from "express"
import { router } from "./routes"
import cors from "cors";


const PORT = process.env.PORT;
const corsOptions = {
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Adjust based on headers used
    credentials: true, // Allow credentials if needed
};
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use("/",router);

app.listen(PORT, () => {
    console.log("Listening on Port", PORT);
})

