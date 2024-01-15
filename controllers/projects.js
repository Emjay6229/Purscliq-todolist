const Project = require("../models/Project");


exports.createProject = async (req, res) => {
    const name = req.body.name;

    try {
      const project = new Project({ name });
      await project.save();
      res.status(201).json(`Your Project ${name} created successfully`);
  } catch(err) {
		console.log(err);
		res.status(500).json(err.message);
	}
}


exports.addTaskToProject = async (req, res) => {
    const { task, projectName } = req.body;

		try {
			const project = await Project.find({ name: projectName })
	
			project.tasks.push(task);
	
			await project.save();
	
			res.status(201).json(`Your Project ${name} created successfully`);
		} catch(err) {
			console.log(err);
			res.status(500).json(err.message);
		}
}