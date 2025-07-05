import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./book.model";

const borrowSchema = new Schema<IBorrow>(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        dueDate: {
            type: Date,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

borrowSchema.pre("save", async function (next) {
    const borrow = this;

    // Find the book being borrowed
    const book = await Book.findById(borrow.book);

    // If the book doesn't exist, throw an error
    if (!book) {
        const error: any = new Error("Book not found");
        error.statusCode = 404;
        error.customError = {
            success: false,
            message: "Book not found",
            error: {
                name: "NotFoundError",
                path: "book",
                message: `Book with ID ${borrow.book} does not exist`,
            },
        }

        return next(error)
    }

    // Check if the book has enough copies available
    if (book.copies < borrow.quantity) {
        const error: any = new Error(`Only ${book.copies} copies available to borrow`)
        error.statusCode = 400;
        error.customError = {
            success: false,
            message: "Validation failed",
            error: {
                name: "ValidatorError",
                path: "copies",
                message: `Only ${book.copies} copies available to borrow`,
            },
        };

        return next(error)
    }

    // Deduct quantity and check availability
    book.copies -= borrow.quantity;
    book.checkAvailability();

    // Save the updated book document
    await book.save();
    next();
})

export const Borrow = model<IBorrow>("Borrow", borrowSchema);