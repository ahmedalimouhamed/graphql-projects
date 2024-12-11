const Product = require("../../models/Product");

module.exports = {
    Query: {
        products: async() => await Product.find(),
        product: async(_, {id}) => await Product.findById(id)
    },

    Mutation: {
        createProduct: async(_, {input}) => await Product.create(input),
        updateProduct: async(_, {id, input}) => await Product.findByIdAndUpdate(id, input, {new: true}),
        deleteProduct: async(_, {id}) => await Product.findByIdAndDelete(id)
    }
};