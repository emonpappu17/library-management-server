import express from "express";
import { createBook, deleteBook, getAllBooks, getBookById, updateBook } from "../controllers/book.controller";

export const bookRoutes = express.Router();

bookRoutes.post("/", createBook);
bookRoutes.get("/", getAllBooks);
bookRoutes.get("/:bookId", getBookById)
bookRoutes.put("/:bookId", updateBook)
bookRoutes.delete("/:bookId", deleteBook)
