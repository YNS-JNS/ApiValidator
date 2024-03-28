const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required !"]
        },
        price: {
            type: Number,
            required: [true, "Price must be a number and required !"]
        },
        category: {
            type: String,
            required: [true, "Category is required"]
        }
        
    }
);


module.exports = mongoose.model("ProductModel", productSchema); 