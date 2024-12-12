const Task = require('../../models/Task');

module.exports = {
    Query: {
        tasks: async() => { 
            return await Task.find();
        },

        task: async(_, {id}) => {
            return await Task.findById(id);
        }
    },

    Mutation: {
        createTask: async(_, {input}) => {
            try{
                const task = new Task(input);
                const savedTask = (await task.save()).populate(['project', 'assignee']);
                return savedTask;
            }catch(err){
                console.log(err);
            }
        },

        updateTask: async(_, {id, input}) => {
            return await Task.findByIdAndUpdate(id, input).populate(['project', 'assignee']);
        },

        deleteTask: async(_, {id}) => {
            return await Task.findByIdAndDelete(id).populate(['project', 'assignee']);
        }       
    }
}