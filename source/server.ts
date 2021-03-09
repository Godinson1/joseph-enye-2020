export {};
//Import packages
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const config = require("config");
const schema = require("./model/schema");
const routes = require("./route/places");
//import error handler
import { handleError, ResponseError } from "./error";
import { router as AuthRouter } from "./route/route";

dotenv.config();

//Initialize express and cors
const app = express();
app.use(express.json());
app.use(cors());

//Configure PORT and get Mongo Atlas Key
const PORT = process.env.PORT || 4000;
const uri = config.get("ATLAS_URL");

//Connect MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;

connection.on("open", () => {
  console.log("Connection to MongoDB Atlas established successfully");
});

//App Route for Search (Persisting data)
app.use("/places", routes);
app.use("/auth", AuthRouter);

//App Route for retrieving data using graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// setting fall back route and message for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found") as ResponseError;
  error.status = 404;
  next(error);
});

//Error handler helper
app.use(
  (
    err: { statusCode: number; message: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    handleError({ statusCode: 404, message: "Route not found!" }, res);
    next();
  }
);

// setting fall back message for other uncaught errors
app.use(
  (
    error: { message: string; status: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(error.status || 500).json({
      error: {
        message: error.message,
      },
    });
    next();
  }
);

//Listen for Port Server is connected to
app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
