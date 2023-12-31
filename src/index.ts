import express from 'express';
const cors = require('cors');
import { connection } from "./db";
import { OkPacket, OkPacketParams, RowDataPacket } from 'mysql2';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors({origin: '*'}));

const FROM_WHERE = 'IID'

app.get('/', async (req, res) => {
  res.json("test123456");
});

// get all IIDs
app.get(`/${FROM_WHERE}`, async (req, res) => {
  // Execute the query to get all users
  connection.query(`SELECT * FROM ${FROM_WHERE}`, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the users as a JSON response
    res.json(results);
  });
});

// get by ID test 
app.get(`/${FROM_WHERE}/:id`, async (req, res) => {

  const getById = req.params.id;

  if (!getById) {
    res.status(404).json({error: 'Invalid Id'});
  }
  // Execute the query to get all users 
  connection.query(`SELECT * FROM ${FROM_WHERE} WHERE id=?`, getById, (error, results:RowDataPacket[]) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results) res.json(results[0]);
    
  });
});

// Delete by ID
app.delete(`/${FROM_WHERE}/:id`, async (req, res) => {
  const removeById = req.params.id;
  
  connection.query(`DELETE FROM ${FROM_WHERE} WHERE id=?`, removeById, (error, results:OkPacket) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.status(204).end();
    }

  });
});

// Update by Id
app.put(`/${FROM_WHERE}/:id`, async (req, res) => {
  const removeById = req.params.id;
  const data = req.body;
  
  connection.query(`UPDATE ${FROM_WHERE} SET ? WHERE id=?`, [data, removeById], (error, results:OkPacket) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.status(204).end();
    }

  });
});


// Add to IIDs
app.post(`/${FROM_WHERE}`, async (req, res) => {
  const { name, species, sex, occupation, origin, pfp, birth_year, status, description, createdAt } = req.body;

  connection.query(`INSERT INTO ${FROM_WHERE} (name, species, sex, occupation, origin, pfp, birth_year, status, description, createdAt) 
    VALUES ('${name}', '${species}', '${sex}', '${occupation}', '${origin}', '${pfp}', '${birth_year}', '${status}', '${description}', '${createdAt}')`, 
    (error, results:OkPacket) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.status(204).end();
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
