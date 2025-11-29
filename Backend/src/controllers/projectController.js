const Project = require("../models/Project");

exports.createProject = async (req, res) => {
    try {
        const {
            clientName,
            contact,
            projectName,
            projectType,
            expectedValue,
            projectStatus,
            category,
            followUpDate,
            notes,
        } = req.body;

        const newProject = new Project({
            user: req.user.id,
            clientName,
            contact,
            projectName,
            projectType,
            expectedValue,
            projectStatus,
            category,
            followUpDate,
            notes,
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        console.error("Create Project Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error("Get Projects Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
