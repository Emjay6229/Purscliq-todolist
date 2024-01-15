const Team = require("../models/Team");


exports.createTeam = async (req, res) => {
    const name = req.body.name;

    try {
      const team = new Team({ name });
      await team.save();
      res.status(201).json(`Your team ${name} has been created successfully`);
  } catch(err) {
	    console.log(err);
			res.status(500).json(err.message);
	}
}

exports.addUserToTeam = async (req, res) => {
    const { user, teamName } = req.body;

		try {
			const team = await team.find({ name: projectName })
	
			project.tasks.push(task);
	
			await project.save();
	
			res.status(201).json(`Your Project ${name} created successfully`);
		} catch(err) {
			console.log(err);
			res.status(500).json(err.message);
		}
}