    const express = require('express');
    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    const cors = require('cors');

    dotenv.config();

    const contactRoutes = require('./routes/contactRoutes');
    const propertyTypeRoutes = require('./routes/propertyTypeRoutes');
    const propertyRoutes = require('./routes/propertyRoutes');

    const app = express();


    app.use(cors());
    app.use(express.json());

    // Register Routes
    app.use('/api', contactRoutes);
    app.use('/api', propertyTypeRoutes);
    app.use('/api', propertyRoutes);

    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('MongoDB connected');
            const PORT = process.env.PORT || 5000;
            app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
        })
        .catch(err => console.error('MongoDB connection failed:', err));
