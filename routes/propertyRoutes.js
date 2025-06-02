const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const multer = require('multer');
const { storage } = require('../utils/uploadFile');

const upload = multer({ storage });

// Support multiple file fields for floor plans and project gallery
const multiUpload = upload.fields([
    { name: 'projectGallery', maxCount: 20 },
    ...Array.from({ length: 10 }).map((_, i) => ({ name: `floorPlan_${i}`, maxCount: 10 }))
]);

router.post('/properties', multiUpload, propertyController.createProperty);
router.get('/properties', propertyController.getAllProperties);
router.get('/properties/:id', propertyController.getPropertyById);
router.put('/properties/:id', multiUpload, propertyController.updateProperty);
router.delete('/properties/:id', propertyController.deleteProperty);

module.exports = router;
