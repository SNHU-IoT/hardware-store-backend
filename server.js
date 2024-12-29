const mongoose = require('mongoose');

// Replace with your MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/hardware_store';

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connection successful!');
    // Test a quick inventory query
    mongoose.connection.db.collection('inventory').find({}).toArray((err, docs) => {
      if (err) {
        console.error('Error fetching inventory:', err);
      } else {
        console.log('Inventory:', docs);
      }
      mongoose.disconnect();
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
