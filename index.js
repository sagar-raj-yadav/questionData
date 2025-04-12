import express from 'express';
import { promises as fs } from 'fs';
import cors from 'cors'; // Import the cors package

const app = express();
const port = process.env.PORT || 5000;

// Apply CORS middleware to allow all origins
app.use(cors());
// Ensure CORS header is always set
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Or use your frontend URL instead of "*"
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Function to read data from a file
const getDataFromFile = async (fileName) => {
  try {
    const data = await fs.readFile(fileName, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading ${fileName}: ${err.message}`);
  }
};

//all bus data
app.get('/allbusdata', async (req, res) => {
  const { to, from } = req.query;

  // Basic validation
  if (!to || !from) {
    return res.status(400).json({ error: "Missing 'to' or 'from' query parameters" });
  }

  try {
    const data = await getDataFromFile('NEW_BUS_DATA.json');

    // Ensure 'data' is an array
    if (!Array.isArray(data)) {
      return res.status(500).json({ error: "Invalid data format" });
    }

    // Filter data by source and destination city
    const filteredData = data.filter(bus =>
      bus.source_city.trim().toLowerCase() === from.toString().trim().toLowerCase() &&
      bus.destination_city.trim().toLowerCase() === to.toString().trim().toLowerCase()
    );

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching bus data:", error.message);
    res.status(500).send("Server error: " + error.message);
  }
});




// Fetch specific question by ID
app.get('/physics/question/:id', async (req, res) => {
  try {
    const data = await getDataFromFile('physicsData.json');
    const questionId = parseInt(req.params.id); // Convert id to number

    const question = data.find(q => q.id === questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
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
