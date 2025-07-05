import { Model, model, Schema } from "mongoose";
import { IBook } from "../interfaces/book.interface";
import { Borrow } from "./borrow.model";

const bookSchema = new Schema<IBook>(
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true,
            enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']
        },
        isbn: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        },
        copies: {
            type: Number,
            required: true,
            min: [0, 'Copies must be a positive number']
        },
        available: {
            type: Boolean,
            default: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

// Availability control 
bookSchema.method("checkAvailability", function () {
    this.available = this.copies > 0;
})

// Delete Borrowed Book for Book delete
bookSchema.post("findOneAndDelete", async function (doc, next) {
    if (doc) {
        await Borrow.deleteMany({ book: doc._id })
    }
    next();
})

export const Book = model<IBook>("Book", bookSchema);