import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
// Enable CORS for frontend applications
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// --- Database Configuration ---
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to true to see SQL queries in the console
  dialectOptions: {
    // Essential for connecting to external PostgreSQL services (like Render)
    ssl: { require: true, rejectUnauthorized: false }
  }
});

// --- Puppy Model Definition ---
const Puppy = sequelize.define('puppies', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  breed: { type: DataTypes.STRING(100), allowNull: true },
  weight_lbs: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  arrival_date: { type: DataTypes.DATE, allowNull: true, defaultValue: Sequelize.NOW },
  vaccinated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'puppies', timestamps: false, underscored: true });

// --- API Routes (CRUD Operations) ---

// GET / - Basic server test route
app.get('/', (req, res) => {
  res.json({ message: 'Puppy Management API is running!', status: 'success' });
});

// GET /puppies - Get all puppies
app.get('/puppies', async (req, res) => {
  try {
    const puppies = await Puppy.findAll();
    res.json(puppies);
  } catch (err) {
    console.error('Error fetching puppies:', err);
    res.status(500).json({ error: 'Failed to retrieve puppies', message: err.message });
  }
});

// GET /puppies/:id - Get a single puppy by ID
app.get('/puppies/:id', async (req, res) => {
  try {
    const puppy = await Puppy.findByPk(req.params.id);
    if (puppy) {
      res.json(puppy);
    } else {
      res.status(404).json({ message: 'Puppy not found' });
    }
  } catch (err) {
    console.error('Error fetching puppy by ID:', err);
    res.status(500).json({ error: 'Failed to retrieve puppy', message: err.message });
  }
});

// POST /puppies - Create a new puppy
app.post('/puppies', async (req, res) => {
  try {
    // Simple check to ensure required field 'name' is present
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name is required to create a puppy.' });
    }
    const newPuppy = await Puppy.create(req.body);
    res.status(201).json(newPuppy);
  } catch (err) {
    console.error('Error creating puppy:', err);
    res.status(500).json({ error: 'Failed to create puppy', message: err.message });
  }
});

// PUT /puppies/:id - Update a puppy by ID
app.put('/puppies/:id', async (req, res) => {
  try {
    const puppy = await Puppy.findByPk(req.params.id);
    if (puppy) {
      await puppy.update(req.body);
      res.json(puppy);
    } else {
      res.status(404).json({ message: 'Puppy not found' });
    }
  } catch (err) {
    console.error('Error updating puppy:', err);
    res.status(500).json({ error: 'Failed to update puppy', message: err.message });
  }
});

// DELETE /puppies/:id - Delete a puppy by ID
app.delete('/puppies/:id', async (req, res) => {
  try {
    const puppy = await Puppy.findByPk(req.params.id);
    if (puppy) {
      await puppy.destroy();
      res.json({ message: 'Puppy deleted successfully' });
    } else {
      res.status(404).json({ message: 'Puppy not found' });
    }
  } catch (err) {
    console.error('Error deleting puppy:', err);
    res.status(500).json({ error: 'Failed to delete puppy', message: err.message });
  }
});

// --- Server Startup Logic ---
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync the model (creates the table if it doesn't exist)
    // IMPORTANT: force: false means it will NOT drop existing tables.
    await Puppy.sync({ force: false });
    console.log("Puppy model synced with database.");

    // Seed the database with initial data
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database or start server:', err);
    // Exit the process if we cannot connect to the database
    process.exit(1);
  }
}

// Function to seed the database with initial puppy data
async function seedDatabase() {
  try {
    // Check if puppies already exist to avoid duplicates
    const existingPuppies = await Puppy.count();
    
    if (existingPuppies === 0) {
      console.log('Seeding database with initial puppy data...');
      
      const puppyData = [
        { name: 'Buddy', breed: 'Golden Retriever', weight_lbs: 65.50, vaccinated: true },
        { name: 'Max', breed: 'Beagle', weight_lbs: 30.00, vaccinated: false },
        { name: 'Bella', breed: 'Labrador', weight_lbs: 55.25, vaccinated: true },
        { name: 'Lucy', breed: 'Poodle', weight_lbs: 20.75, vaccinated: false }
      ];

      await Puppy.bulkCreate(puppyData);
      console.log('Database seeded successfully with', puppyData.length, 'puppies!');
    } else {
      console.log('Database already contains', existingPuppies, 'puppies. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

startServer();
