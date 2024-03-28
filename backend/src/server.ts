// Express
import express from "express";
// CORS
import cors from "cors";



const initializeApp = async () => {


  const app = express();
  const port = process.env.PORT ?? (8080 as number);
  const DEPLOYMENT = process.env.DEPLOYMENT ?? "LOCAL";

  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use((req, res, next) => {
    express.json({
      limit: "5mb",
      type: ["application/json", "text/plain"],
    })(req, res, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid JSON" });
      } else {
        next();
      }
    });
  });




  const localWhitelist = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3001",
    "http://localhost:3001",
  ];

  const testingWhitelist: any[] = [];

  const productionWhitelist: any[] = [];

  const corsOptions = {
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Headers",
      "x-csrf-token",
      "Set-Cookie",
    ],
    origin:
      DEPLOYMENT === "LOCAL"
        ? localWhitelist
        : DEPLOYMENT === "TESTING"
        ? testingWhitelist
        : productionWhitelist,
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  };

  app.use(cors(corsOptions));


  app.get("/", (req, res) => {
    res.send("MIT Innovation Centre Management Portal!");
  });



  app.listen(port, async () => {
    console.log(`Express is listening at http://localhost:${port}`);
  });
};

initializeApp().catch((error) => {
  console.error("Failed to initialize server:", error);
  process.exit(1);
});
