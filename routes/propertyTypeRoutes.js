const express = require('express');
const router = express.Router();
const {
    createPropertyType,
    getAllPropertyTypes,
    getPropertyTypeById,
    updatePropertyType,
    deletePropertyType
} = require('../controllers/propertyTypeController');

router.post('/property-types', createPropertyType);
router.get('/property-types', getAllPropertyTypes);
router.get('/property-types/:id', getPropertyTypeById);
router.put('/property-types/:id', updatePropertyType);
router.delete('/property-types/:id', deletePropertyType);

module.exports = router;
