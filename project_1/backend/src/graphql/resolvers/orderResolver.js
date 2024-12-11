const Order = require("../../models/Order");
const mongoose = require("mongoose");
const Product = require("../../models/Product");
const User = require("../../models/User");

module.exports = {
    Query: {
        orders: async() => {
            const orders = await Order.find()
                .populate('userId')
                .populate('products.productId');

            if (!orders || orders.length === 0) return [];

            return orders.map(order => {
                if (!order) return null;

                // Si userId n'existe pas, on ne retourne pas l'order
                if (!order.userId) return null;

                return {
                    id: order._id,
                    userId: order.userId._id,
                    user: {
                        id: order.userId._id,
                        name: order.userId.name || 'Unknown',  // Valeur par défaut pour les champs non-nullables
                        email: order.userId.email || 'unknown@email.com',
                        role: order.userId.role || 'user',
                        createdAt: order.userId.createdAt || new Date().toISOString(),
                        updatedAt: order.userId.updatedAt || new Date().toISOString()
                    },
                    products: (order.products || []).map(p => {
                        if (!p.productId) return null;
                        return {
                            product: {
                                id: p.productId._id,
                                name: p.productId.name || 'Unknown Product',
                                price: p.productId.price || 0,
                                stock: p.productId.stock || 0,
                                createdAt: p.productId.createdAt || new Date().toISOString(),
                                updatedAt: p.productId.updatedAt || new Date().toISOString()
                            },
                            quantity: p.quantity || 0
                        };
                    }).filter(Boolean),
                    total: order.total || 0,
                    status: order.status || 'pending',
                    createdAt: order.createdAt || new Date().toISOString(),
                    updatedAt: order.updatedAt || new Date().toISOString()
                };
            }).filter(Boolean);
        },

        order: async(_, {id}) => {
            const order = await Order.findById(id)
                .populate('userId')
                .populate('products.productId');

            if (!order || !order.userId) {
                throw new Error('Order not found or invalid user reference');
            }

            return {
                id: order._id,
                userId: order.userId._id,
                user: {
                    id: order.userId._id,
                    name: order.userId.name || 'Unknown',
                    email: order.userId.email || 'unknown@email.com',
                    role: order.userId.role || 'user',
                    createdAt: order.userId.createdAt || new Date().toISOString(),
                    updatedAt: order.userId.updatedAt || new Date().toISOString()
                },
                products: (order.products || []).map(p => {
                    if (!p.productId) return null;
                    return {
                        product: {
                            id: p.productId._id,
                            name: p.productId.name || 'Unknown Product',
                            price: p.productId.price || 0,
                            stock: p.productId.stock || 0,
                            createdAt: p.productId.createdAt || new Date().toISOString(),
                            updatedAt: p.productId.updatedAt || new Date().toISOString()
                        },
                        quantity: p.quantity || 0
                    };
                }).filter(Boolean),
                total: order.total || 0,
                status: order.status || 'pending',
                createdAt: order.createdAt || new Date().toISOString(),
                updatedAt: order.updatedAt || new Date().toISOString()
            };
        }
    },

    Mutation: {
        createOrder: async (_, { input }) => {
            const { userId = null, products = [], status = 'pending', total = 0 } = input;

            if (!userId) {
                throw new Error('userId is required');
            }

            // Vérifier si l'utilisateur existe
            const userExists = await User.findById(userId);
            if (!userExists) {
                throw new Error('User not found');
            }

            // Format products with proper ObjectId
            const formattedProducts = products.map(product => ({
                productId: new mongoose.Types.ObjectId(product.productId),
                quantity: product.quantity,
            }));

            // Create and save the order
            const order = new Order({
                userId: new mongoose.Types.ObjectId(userId),
                products: formattedProducts,
                status,
                total,
            });

            // Save the order
            await order.save();

            // Populate the references and return the complete order
            const populatedOrder = await Order.findById(order._id)
                .populate('userId')
                .populate('products.productId');

            if (!populatedOrder || !populatedOrder.userId) {
                throw new Error('Failed to create order or invalid user reference');
            }

            // Transform the populated data to match the GraphQL schema
            return {
                id: populatedOrder._id,
                userId: populatedOrder.userId._id,
                user: {
                    id: populatedOrder.userId._id,
                    name: populatedOrder.userId.name || 'Unknown',
                    email: populatedOrder.userId.email || 'unknown@email.com',
                    role: populatedOrder.userId.role || 'user',
                    createdAt: populatedOrder.userId.createdAt || new Date().toISOString(),
                    updatedAt: populatedOrder.userId.updatedAt || new Date().toISOString()
                },
                products: (populatedOrder.products || []).map(p => {
                    if (!p.productId) return null;
                    return {
                        product: {
                            id: p.productId._id,
                            name: p.productId.name || 'Unknown Product',
                            price: p.productId.price || 0,
                            stock: p.productId.stock || 0,
                            createdAt: p.productId.createdAt || new Date().toISOString(),
                            updatedAt: p.productId.updatedAt || new Date().toISOString()
                        },
                        quantity: p.quantity || 0
                    };
                }).filter(Boolean),
                total: populatedOrder.total || 0,
                status: populatedOrder.status || 'pending',
                createdAt: populatedOrder.createdAt || new Date().toISOString(),
                updatedAt: populatedOrder.updatedAt || new Date().toISOString()
            };
        },

        updateOrder: async(_, {id, input}) => {
            const updatedOrder = await Order.findByIdAndUpdate(id, input, {new: true})
                .populate('userId')
                .populate('products.productId');

            if (!updatedOrder || !updatedOrder.userId) {
                throw new Error('Order not found or invalid user reference');
            }

            return {
                id: updatedOrder._id,
                userId: updatedOrder.userId._id,
                user: {
                    id: updatedOrder.userId._id,
                    name: updatedOrder.userId.name || 'Unknown',
                    email: updatedOrder.userId.email || 'unknown@email.com',
                    role: updatedOrder.userId.role || 'user',
                    createdAt: updatedOrder.userId.createdAt || new Date().toISOString(),
                    updatedAt: updatedOrder.userId.updatedAt || new Date().toISOString()
                },
                products: (updatedOrder.products || []).map(p => {
                    if (!p.productId) return null;
                    return {
                        product: {
                            id: p.productId._id,
                            name: p.productId.name || 'Unknown Product',
                            price: p.productId.price || 0,
                            stock: p.productId.stock || 0,
                            createdAt: p.productId.createdAt || new Date().toISOString(),
                            updatedAt: p.productId.updatedAt || new Date().toISOString()
                        },
                        quantity: p.quantity || 0
                    };
                }).filter(Boolean),
                total: updatedOrder.total || 0,
                status: updatedOrder.status || 'pending',
                createdAt: updatedOrder.createdAt || new Date().toISOString(),
                updatedAt: updatedOrder.updatedAt || new Date().toISOString()
            };
        },

        deleteOrder: async(_, {id}) => {
            const deletedOrder = await Order.findByIdAndDelete(id)
                .populate('userId')
                .populate('products.productId');

            if (!deletedOrder || !deletedOrder.userId) {
                throw new Error('Order not found or invalid user reference');
            }

            return {
                id: deletedOrder._id,
                userId: deletedOrder.userId._id,
                user: {
                    id: deletedOrder.userId._id,
                    name: deletedOrder.userId.name || 'Unknown',
                    email: deletedOrder.userId.email || 'unknown@email.com',
                    role: deletedOrder.userId.role || 'user',
                    createdAt: deletedOrder.userId.createdAt || new Date().toISOString(),
                    updatedAt: deletedOrder.userId.updatedAt || new Date().toISOString()
                },
                products: (deletedOrder.products || []).map(p => {
                    if (!p.productId) return null;
                    return {
                        product: {
                            id: p.productId._id,
                            name: p.productId.name || 'Unknown Product',
                            price: p.productId.price || 0,
                            stock: p.productId.stock || 0,
                            createdAt: p.productId.createdAt || new Date().toISOString(),
                            updatedAt: p.productId.updatedAt || new Date().toISOString()
                        },
                        quantity: p.quantity || 0
                    };
                }).filter(Boolean),
                total: deletedOrder.total || 0,
                status: deletedOrder.status || 'pending',
                createdAt: deletedOrder.createdAt || new Date().toISOString(),
                updatedAt: deletedOrder.updatedAt || new Date().toISOString()
            };
        }
    }
}