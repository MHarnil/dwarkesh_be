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

        // Get existing property to preserve current images
        const existingProperty = await Property.findById(req.params.id);
        if (!existingProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Handle floorPlan updates - preserve existing images and append new ones
        const floorPlan = await Promise.all(
            JSON.parse(floorPlanTitles).map(async (item, i) => {
                const file = req.files[`floorPlan_${i}`]?.[0];
                const newImage = file ? await uploadFile(file.path) : null;

                // Get existing images for this floor plan index
                const existingImages = existingProperty.floorPlan[i]?.image || [];

                // Combine existing images with new image (if any)
                const updatedImages = newImage
                    ? [...existingImages, newImage]
                    : existingImages;

                return {
                    title: item.title,
                    image: updatedImages
                };
            })
        );

        // Handle projectGallery updates - preserve existing images and append new ones
        let updatedProjectGallery = [...(existingProperty.projectGallery || [])];

        if (req.files.projectGallery) {
            const newGalleryImages = await Promise.all(
                req.files.projectGallery.map(file => uploadFile(file.path))
            );
            updatedProjectGallery = [...updatedProjectGallery, ...newGalleryImages];
        }

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
                projectGallery: updatedProjectGallery
            },
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete specific floor plan image
exports.deleteFloorPlanImage = async (req, res) => {
    try {
        const { propertyId, floorPlanIndex, imageIndex } = req.params;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (!property.floorPlan[floorPlanIndex]) {
            return res.status(404).json({ message: 'Floor plan not found' });
        }

        if (!property.floorPlan[floorPlanIndex].image[imageIndex]) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Remove the specific image
        property.floorPlan[floorPlanIndex].image.splice(imageIndex, 1);

        await property.save();
        res.json({ message: 'Floor plan image deleted successfully', property });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete specific project gallery image
exports.deleteProjectGalleryImage = async (req, res) => {
    try {
        const { propertyId, imageIndex } = req.params;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (!property.projectGallery[imageIndex]) {
            return res.status(404).json({ message: 'Gallery image not found' });
        }

        // Remove the specific image
        property.projectGallery.splice(imageIndex, 1);

        await property.save();
        res.json({ message: 'Gallery image deleted successfully', property });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};