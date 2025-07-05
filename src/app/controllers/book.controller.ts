import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";

// ✅ Create Book
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const book = await Book.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        })
    } catch (error) {
        next(error)
    }
}

// ✅ Get All Books
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find().sort({ "createdAt": -1 });

        res.json({
            success: true,
            message: books.length > 0
                ? "Books retrieved successfully"
                : "No books found",
            data: books
        })
    } catch (error) {
        next(error)
    }
}

// ✅ Get Book by ID
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.bookId;
        const book = await Book.findById(id);

        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                error: {
                    name: "NotFoundError",
                    path: "bookId",
                    message: `Book with ID ${id} does not exist`
                }
            });
            return
        }

        res.json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    } catch (error) {
        next(error)
    }
}

// ✅ Update Book 
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.bookId;
        const updateData = req.body;

        const book = await Book.findById(id);

        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                error: {
                    name: "NotFoundError",
                    path: "bookId",
                    message: `Book with ID ${id} does not exist`,
                },
            });
            return
        }

        Object.assign(book, updateData);
        book.checkAvailability();
        await book.save();

        res.json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    } catch (error) {
        next(error)
    }
}

// ✅ Delete Book
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.bookId;
        const deletedBook = await Book.findOneAndDelete({ _id: id });

        if (!deletedBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                error: {
                    name: "NotFoundError",
                    path: "bookId",
                    message: `Book with ID ${id} does not exist`,
                },
            });
            return
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        })
    } catch (error) {
        next(error)
    }
}





