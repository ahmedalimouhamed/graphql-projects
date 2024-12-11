const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    Query: {
        users: async () => await User.find(),
        user: async (_, { id }) => await User.findById(id),
    },

    Mutation: {
        createUser: async(_, {input}) => {
            const { name, email, password } = input;
            const user = await User.findOne({ email });
            if (user) {
                throw new Error("User already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword
            });
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            return {
                token,
                user: {
                    ...newUser._doc,
                    password: null
                }
            };
        },

        login: async (_, { input }) => {
            // Extract input
            const { email, password } = input;
        
            // Find the user by email
            const user = await User.findOne({ email });
        
            // If user is not found or password is incorrect
            if (!user || !await bcrypt.compare(password, user.password)) {
                throw new Error("Invalid credentials");
            }
        
            // Generate JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
        
            // Log user and token for debugging
            console.log(user);
            console.log(token);
        
            // Return token and user details without the password
            return {
                token,
                user: {
                    ...user._doc,
                    password: null // Exclude password from the response
                }
            };
        },
        

        updateUser: async(_, {id, input}) =>{
            const user = await User.findById(id);
            if(!user){
                throw new Error("User not found");
            }
            const updatedUser = await User.findByIdAndUpdate(id, input, {new: true});
            return updatedUser;
        },

        deleteUser: async(_, {id}) => {
            const user = await User.findById(id);
            if(!user){
                throw new Error("User not found");
            }
            await User.findByIdAndDelete(id);
            return "User deleted";
        }
    }
};