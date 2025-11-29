const Lead = require("../models/Lead");

exports.createLead = async (req, res) => {
    try {
        const { name, email, phone, status, source, notes } = req.body;

        const newLead = new Lead({
            user: req.user.id,
            name,
            email,
            phone,
            status,
            source,
            notes,
        });

        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (error) {
        console.error("Create Lead Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        console.error("Get Leads Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLead = await Lead.findOneAndUpdate(
            { _id: id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedLead) return res.status(404).json({ message: "Lead not found" });
        res.json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLead = await Lead.findOneAndDelete({ _id: id, user: req.user.id });
        if (!deletedLead) return res.status(404).json({ message: "Lead not found" });
        res.json({ message: "Lead deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
