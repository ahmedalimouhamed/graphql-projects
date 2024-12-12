const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


module.exports = {
    Query : {
        me: async(_, __, {user}) => {
            if(!user) throw new Error('Unauthenticated');
            return await User.findById(user.id);
        },

        users: async(_, __, {user}) => {
            if(!user) throw new Error('Unauthorized');
            return await User.find().populate([
                {path: 'projects', strictPopulate: false}, 
                {path: 'tasks', strictPopulate: false}
            ]);
        },

        user: async(_, {id}) => {
            return await User.findById(id).populate([
                {path: 'projects', strictPopulate: false}, 
                {path: 'tasks', strictPopulate: false}
            ]);
        }
    },

    Mutation: {
        register: async(_, {input}) => {
            try{
                const {name, email, password, role} = input;
                const existingUser = await User.findOne({ $or: [{ email }, { name }] });
                if(existingUser) throw new Error('User already exists');
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({name, email, password: hashedPassword, role});
                const savedUser = await newUser.save();

                const token = jwt.sign({id: savedUser._id}, process.env.SECRET_KEY, {expiresIn: '1d'});
                return {token, user: {...savedUser._doc, password: null}};
            }catch(err){
                console.log(err);
            }
        }, 

        login: async(_, {input}) => {
            try{
                const {email, password} = input;
                const user = await User.findOne({email});

                if(!user || !await bcrypt.compare(password, user.password)) throw new Error('Invalid credentials');

                const token = jwt.sign({id: user._id, role: user.role}, process.env.SECRET_KEY, {expiresIn: '1d'});
                
                console.log(user);
                console.log(token);

                return {token, user: {...user._doc, password: null}};
            }catch(err){
                console.log(err);
            }

        },

        updateUser: async(_, {id, input}) => {
            return await User.findByIdAndUpdate(id, input).populate([
                {path: 'projects', strictPopulate: false}, 
                {path: 'tasks', strictPopulate: false}
            ]);
        },

        deleteUser: async(_, {id}) => {
            return await User.findByIdAndDelete(id).populate([
                {path: 'projects', strictPopulate: false}, 
                {path: 'tasks', strictPopulate: false}
            ]);
        }
    }
        
}