const Property = require('../models/property');
const { uploadFile } = require('../utils/uploadFile');

exports.createProperty = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            propertyType,
            address,
            contactNumber,
            propertyDetail,
            floorPlanTitles
        } = req.body;

        const floorPlan = await Promise.all(
            JSON.parse(floorPlanTitles).map(async (item, i) => {
                const file = req.files[`floorPlan_${i}`]?.[0];
                const uploadedImage = file ? await uploadFile(file.path) : null;

                return {
                    title: item.title,
                    image: uploadedImage
                };
            })
        );

        const projectGallery = req.files.projectGallery
            ? await Promise.all(req.files.projectGallery.map(file => uploadFile(file.path)))
            : [];

        const property = await Property.create({
            title,
            subtitle,
            propertyType,
            address,
            contactNumber,
            propertyDetail: JSON.parse(propertyDetail),
            floorPlan,
            projectGallery
        });

        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProperties = async (req, res) => {
    const properties = await Property.find().populate('propertyType');
    res.json(properties);
};

exports.getPropertyById = async (req, res) => {
    const property = await Property.findById(req.params.id).populate('propertyType');
    if (!property) return res.status(404).json({ message: 'Not found' });
    res.json(property);
};

exports.updateProperty = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            propertyType,
            address,
            contactNumber,
            propertyDetail,
            floorPlanTitles
        } = req.body;

        const floorPlan = await Promise.all(
            JSON.parse(floorPlanTitles).map(async (item, i) => {
                const file = req.files[`floorPlan_${i}`]?.[0];
                const uploadedImage = file ? await uploadFile(file.path) : null;

                return {
                    title: item.title,
                    image: uploadedImage
                };
            })
        );

        const projectGallery = req.files.projectGallery
            ? await Promise.all(req.files.projectGallery.map(file => uploadFile(file.path)))
            : [];

        const updated = await Property.findByIdAndUpdate(
            req.params.id,
            {
                title,
                subtitle,
                propertyType,
                address,
                contactNumber,
                propertyDetail: JSON.parse(propertyDetail),
                floorPlan,
                projectGallery
            },
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProperty = async (req, res) => {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
};
