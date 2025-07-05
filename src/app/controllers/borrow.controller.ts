import { NextFunction, Request, Response } from "express";
import { Borrow } from "../models/borrow.model";

// ✅ Borrow a Book
export const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { book, quantity, dueDate } = req.body;
        // console.log(book, quantity, dueDate);
        const borrow = await Borrow.create({ book, quantity, dueDate })

        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        })
    } catch (error) {
        next(error);
    }
}


// ✅ Borrowed Books Summary
export const getBorrowedBooksSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const summary = await Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" }
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            {
                $unwind: "$bookDetails"
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn"
                    },
                    totalQuantity: 1,

                }
            }
        ])

        res.status(201).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        })
    } catch (error) {
        next(error);
    }
}