const express = require('express');
const router = express.Router();
const {
    submitContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
} = require('../controllers/contactController');

router.post('/contact', submitContact);
router.get('/contact', getAllContacts);
router.get('/contact/:id', getContactById);
router.put('/contact/:id', updateContact);
router.delete('/contact/:id', deleteContact);

module.exports = router;
