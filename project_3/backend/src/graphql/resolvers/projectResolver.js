const Project = require('../../models/Project');

module.exports = {
    Query: {
        projects: async() => {
            return await Project.find().populate('members');
        },

        project: async(_, {id}) => {
            return await Project.findById(id).populate('members');
        }
    },

    Mutation: {
        createProject: async(_, {input}) => {
            console.log(input);
            try{
                const project = new Project(input);
                const savedProject = await project.save();
                const populatedProject = savedProject.populate('members');
                return populatedProject;
            }catch(err){
                console.log(err);
            }
        },

        updateProject: async(_, {id, input}) => {
            return await Project.findByIdAndUpdate(id, input).populate('members');
        },

        deleteProject: async(_, {id}) => {    
            return await Project.findByIdAndDelete(id).populate('members');
        }
    }
}