import express, { Application, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { bookRoutes } from "./app/routes/book.routes";
import { borrowRoutes } from "./app/routes/borrow.routes";
import path from "path";
import cors from "cors"

const app: Application = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// ✅ Route Mounting
app.use("/api/books", bookRoutes)
app.use("/api/borrow", borrowRoutes)

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Root route to serve welcome page
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/welcome.html"));
});

// ✅ Not Found
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    })
})

// ✅ Global Error Handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Something went wrong'

    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
    }

    // MongoDB duplicate key error
    else if (error.code === 11000) {
        statusCode = 400;
        message = `Duplicate value for: isbn`;
    }

    res.status(statusCode).json({
        message,
        success: false,
        error
    });
})

export default app;