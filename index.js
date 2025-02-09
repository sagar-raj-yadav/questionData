import express from 'express';
import { promises as fs } from 'fs';
import cors from 'cors'; // Import the cors package

const app = express();
const port = process.env.PORT || 5000;

// Apply CORS middleware to allow all origins
app.use(cors());

// Function to read data from a file
const getDataFromFile = async (fileName) => {
  try {
    const data = await fs.readFile(fileName, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading ${fileName}: ${err.message}`);
  }
};

// Endpoint for physics data
app.get('/physics/question', async (req, res) => {
  try {
    const data = await getDataFromFile('physicsData.json');
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint for chemistry data
app.get('/chemistry/question', async (req, res) => {
  try {
    const data = await getDataFromFile('chemistryData.json');
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


//physics syllabus data
app.get('/physicSyllabus', async (req, res) => {
  try {
    const data = await getDataFromFile('physicSyllabus.json');
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//chemistry syllabus data
app.get('/chemistrySyllabus', async (req, res) => {
  try {
    const data = await getDataFromFile('chemistrySyllabus.json');
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


//mathematics syllabus data
app.get('/mathsSyllabus', async (req, res) => {
  try {
    const data = await getDataFromFile('mathSyllabus.json');
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Root route
app.get('/', (req, res) => {
  res.send('This is previous year question api data');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
