const Contact = require('../models/contact');

// Create (POST /contact)
exports.submitContact = async (req, res) => {
    try {
        const { project, firstName, lastName, contactNo, email, message } = req.body;

        const newContact = new Contact({ project, firstName, lastName, contactNo, email, message });
        await newContact.save();

        res.status(201).json({ success: true, message: 'Contact submitted successfully!', data: newContact });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Read all (GET /contact)
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Read one by id (GET /contact/:id)
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });

        res.json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update by id (PUT /contact/:id)
exports.updateContact = async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedContact) return res.status(404).json({ success: false, message: 'Contact not found' });

        res.json({ success: true, message: 'Contact updated', data: updatedContact });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete by id (DELETE /contact/:id)
exports.deleteContact = async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) return res.status(404).json({ success: false, message: 'Contact not found' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
