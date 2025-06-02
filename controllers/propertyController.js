const Property = require('../models/property');
const { uploadFile } = require('../utils/uploadFile');

exports.createProperty = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            address,
            contactNumber,
            propertyDetail,
            floorPlanTitles
        } = req.body;

        // Upload floor plan images
        const floorPlan = await Promise.all(
            JSON.parse(floorPlanTitles).map(async (item, i) => {
                const uploadedImages = req.files[`floorPlan_${i}`]
                    ? await Promise.all(req.files[`floorPlan_${i}`].map(file => uploadFile(file.path)))
                    : [];

                return {
                    title: item.title,
                    images: uploadedImages
                };
            })
        );

        // Upload project gallery images
        const projectGallery = req.files.projectGallery
            ? await Promise.all(req.files.projectGallery.map(file => uploadFile(file.path)))
            : [];

        // Create new property in DB
        const property = await Property.create({
            title,
            subtitle,
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
    const properties = await Property.find();
    res.json(properties);
};

exports.getPropertyById = async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });
    res.json(property);
};

exports.updateProperty = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            address,
            contactNumber,
            propertyDetail,
            floorPlanTitles
        } = req.body;

        const floorPlan = await Promise.all(
            JSON.parse(floorPlanTitles).map(async (item, i) => {
                const uploadedImages = req.files[`floorPlan_${i}`]
                    ? await Promise.all(req.files[`floorPlan_${i}`].map(file => uploadFile(file.path)))
                    : [];

                return {
                    title: item.title,
                    images: uploadedImages
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
