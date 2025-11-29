const Project = require("../models/Project");
const Lead = require("../models/Lead");

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      freelancerId: req.user.id
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.convertLeadToProject = async (req, res) => {
  try {
    const lead = await Lead.findOne({ 
      _id: req.params.leadId, 
      freelancerId: req.user.id 
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const project = await Project.create({
      freelancerId: req.user.id,
      clientName: lead.clientName,
      contactDetails: lead.contactDetails,
      source: lead.source,
      description: lead.description,
      revenue: lead.estimatedRevenue,
      expectedTime: lead.expectedTime,
      status: "In Progress"
    });

    await Lead.findByIdAndDelete(lead._id);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ freelancerId: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, freelancerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFollowUpNote = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      freelancerId: req.user.id 
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.followUpNotes.push({ note: req.body.note });
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const leads = await Lead.find({ freelancerId: req.user.id });
    const projects = await Project.find({ freelancerId: req.user.id });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Follow-ups for today/tomorrow/overdue (leads and projects)
    // Includes overdue items (before today) and items due today/tomorrow
    const followUps = [
      ...leads.filter(l => {
        const followUp = new Date(l.followUpDate);
        return followUp < tomorrow; // Include overdue and today/tomorrow
      }).map(l => ({ ...l.toObject(), type: "lead" })),
      ...projects.filter(p => {
        const expected = new Date(p.expectedTime);
        return expected < tomorrow && p.status !== "Completed"; // Include overdue and today/tomorrow
      }).map(p => ({ ...p.toObject(), type: "project" }))
    ].sort((a, b) => {
      const dateA = a.type === "lead" ? new Date(a.followUpDate) : new Date(a.expectedTime);
      const dateB = b.type === "lead" ? new Date(b.followUpDate) : new Date(b.expectedTime);
      return dateA - dateB; // Earliest dates first (overdue will appear first)
    });

    // All non-completed projects for Priority Projects (sorted by earliest expectedTime)
    // Shows ALL projects regardless of date - overdue, today, or future
    const allUpcomingProjects = projects
      .filter(p => p.status !== "Completed")
      .map(p => ({ ...p.toObject(), type: "project" }))
      .sort((a, b) => {
        const dateA = new Date(a.expectedTime);
        const dateB = new Date(b.expectedTime);
        return dateA - dateB; // Sort by earliest expected time first
      });

    const expectedRevenue = projects
      .filter(p => p.status !== "Completed")
      .reduce((sum, p) => sum + (p.revenue || 0), 0);

    res.json({
      followUps,
      priorityProjects: allUpcomingProjects, // All upcoming projects for Priority Projects section
      expectedRevenue,
      leadsCount: leads.length,
      projectsCount: projects.length,
      projectsByStatus: {
        "In Progress": projects.filter(p => p.status === "In Progress").length,
        "On Hold": projects.filter(p => p.status === "On Hold").length,
        "Partially Completed": projects.filter(p => p.status === "Partially Completed").length,
        "Completed": projects.filter(p => p.status === "Completed").length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

