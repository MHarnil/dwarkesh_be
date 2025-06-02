const PropertyType = require('../models/propertyType');

// Create
exports.createPropertyType = async (req, res) => {
    try {
        const { name } = req.body;
        const newType = new PropertyType({ name });
        await newType.save();
        res.status(201).json({ success: true, data: newType });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Read All
exports.getAllPropertyTypes = async (req, res) => {
    try {
        const types = await PropertyType.find();
        res.json({ success: true, data: types });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Read One
exports.getPropertyTypeById = async (req, res) => {
    try {
        const type = await PropertyType.findById(req.params.id);
        if (!type) return res.status(404).json({ success: false, message: 'Property type not found' });
        res.json({ success: true, data: type });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update
exports.updatePropertyType = async (req, res) => {
    try {
        const updatedType = await PropertyType.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true, runValidators: true }
        );
        if (!updatedType) return res.status(404).json({ success: false, message: 'Property type not found' });
        res.json({ success: true, data: updatedType });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete
exports.deletePropertyType = async (req, res) => {
    try {
        const deletedType = await PropertyType.findByIdAndDelete(req.params.id);
        if (!deletedType) return res.status(404).json({ success: false, message: 'Property type not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
