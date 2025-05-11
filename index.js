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



app.get('/allbusdata', async (req, res) => {
  const {
    to,
    from,
    minrange,
    maxrange,
    type,
    rating,
    departure_time
  } = req.query;

  try {
    const data = await getDataFromFile('NEW_BUS_DATA.json');

    if (!Array.isArray(data)) {
      return res.status(500).json({ error: "Invalid data format" });
    }

    // Convert query params to appropriate types
    const min = parseFloat(minrange);
    const max = parseFloat(maxrange);
    const minRating = parseFloat(rating);

    // If both 'from' and 'to' are missing, return top 5 buses
    if (!to && !from) {
      return res.json(data.slice(0, 5));
    }

    const filteredData = data.filter(bus => {
      let isValid = true;

      // Filter by cities
      if (from) {
        isValid = isValid && bus.source_city.toLowerCase().includes(from.toLowerCase());
      }
      if (to) {
        isValid = isValid && bus.destination_city.toLowerCase().includes(to.toLowerCase());
      }

      // Filter by price range
      if (!isNaN(min) && bus.price < min) isValid = false;
      if (!isNaN(max) && bus.price > max) isValid = false;

      // Filter by bus type
      if (type && bus.type.toLowerCase() !== type.toLowerCase()) isValid = false;

      // Filter by rating
      if (!isNaN(minRating) && bus.star < minRating) isValid = false;

      // Filter by departure time
      if (departure_time && bus.start_time !== departure_time) isValid = false;

      return isValid;
    });

    res.json(filteredData.slice(0, 5)); // Return top 5 matched buses

  } catch (error) {
    console.error("Error fetching bus data:", error.message);
    res.status(500).send("Server error: " + error.message);
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
