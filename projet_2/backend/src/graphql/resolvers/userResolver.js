const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const resolvers = {
    Query: {
        test: () => 'test',
        me: async (_, __, {user}) => {
            if(!user) throw new Error('You must be logged in');
            return await User.findById(user.id);
        },
        users: async () => {
            return await User.find();
        },
        user: async (_, {id}) => {
            return await User.findById(id);
        }
    },
    Mutation: {
        register: async (_, { input }) => {
            try {
                console.log('Registration input:', input);
                const { username, email, password, role } = input;

                // Check if user already exists
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error("User already exists");
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create the new user
                const newUser = new User({
                    username,
                    email,
                    password: hashedPassword,
                    role,
                });

                const savedUser = await newUser.save();
                console.log('User saved:', savedUser);

                // Generate JWT token
                const token = jwt.sign(
                    { id: savedUser._id, email: savedUser.email, role: savedUser.role },
                    process.env.SECRET_KEY,
                    { expiresIn: "1d" }
                );

                // Match the AuthPayload type exactly
                return {
                    token,
                    user: {
                        id: savedUser._id,
                        username: savedUser.username,
                        email: savedUser.email,
                        password: savedUser.password,
                        role: savedUser.role,
                        createdAt: savedUser.createdAt,
                        updatedAt: savedUser.updatedAt
                    }
                };
            } catch (error) {
                console.error('Registration error:', error);
                throw new Error(error.message || 'An error occurred during registration');
            }
        },

        login: async (_, {input}) => {
            const {email, password} = input;
            const user = await User.findOne({email});
            if(!user || !(await bcrypt.compare(password, user.password))) throw new Error('Invalid credentials');
            const token = jwt.sign({id: user.id, role: user.role}, process.env.SECRET_KEY);
            return {token, user};
        },

        updateUser: async (_, {id, input}) => {
            return await User.findByIdAndUpdate(id, input, {new: true});
        },


        deleteUser: async (_, {id}) => {
            return await User.findByIdAndDelete(id);
        }
    }
};

module.exports = resolvers;