
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let client;
let db;

async function connectToMongoDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    client = new MongoClient(uri);
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME || 'crm-imobiliario');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Health check endpoint
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MongoDB API is running' });
});

// API Routes
app.get('/api/collections/:collection/find', async (req, res) => {
  try {
    const collectionName = req.params.collection;
    const collection = db.collection(collectionName);
    
    let query = {};
    let options = {};
    
    if (req.query.query) {
      query = JSON.parse(req.query.query);
    }
    
    if (req.query.sort) {
      options.sort = JSON.parse(req.query.sort);
    }
    
    if (req.query.limit) {
      options.limit = parseInt(req.query.limit);
    }
    
    if (req.query.skip) {
      options.skip = parseInt(req.query.skip);
    }
    
    const result = await collection.find(query, options).toArray();
    res.json(result);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/collections/:collection/findOne', async (req, res) => {
  try {
    const collectionName = req.params.collection;
    const collection = db.collection(collectionName);
    
    let query = {};
    if (req.query.query) {
      query = JSON.parse(req.query.query);
    }
    
    // Convert string IDs to ObjectId if needed
    if (query._id && typeof query._id === 'string') {
      query._id = new ObjectId(query._id);
    }
    
    const result = await collection.findOne(query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/collections/:collection', async (req, res) => {
  try {
    const collectionName = req.params.collection;
    const collection = db.collection(collectionName);
    
    const result = await collection.insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('Error inserting document:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/collections/:collection/updateOne', async (req, res) => {
  try {
    const collectionName = req.params.collection;
    const collection = db.collection(collectionName);
    
    const { filter, update } = req.body;
    
    // Convert string IDs to ObjectId if needed
    if (filter._id && typeof filter._id === 'string') {
      filter._id = new ObjectId(filter._id);
    }
    
    const result = await collection.updateOne(filter, update);
    res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/collections/:collection/deleteOne', async (req, res) => {
  try {
    const collectionName = req.params.collection;
    const collection = db.collection(collectionName);
    
    const { filter } = req.body;
    
    // Convert string IDs to ObjectId if needed
    if (filter._id && typeof filter._id === 'string') {
      filter._id = new ObjectId(filter._id);
    }
    
    const result = await collection.deleteOne(filter);
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

// Start server
async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection and shutting down server');
    if (client) await client.close();
    process.exit(0);
  });
}

startServer().catch(console.error);
