import express, { Application, Response, Request, NextFunction } from "express";
import { bookRoutes } from "./app/routes/book.routes";
import { borrowRoutes } from "./app/routes/borrow.routes";
import cors from "cors"

const app: Application = express();
app.use(express.json());
app.use(cors({ origin: ["https://library-management-client-chi.vercel.app"] }));



// ✅ Route Mounting
app.use("/api/books", bookRoutes)
app.use("/api/borrow", borrowRoutes)


// Root route to serve welcome page
app.get("/", (req: Request, res: Response) => {
    res.send("server is created successfully");
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