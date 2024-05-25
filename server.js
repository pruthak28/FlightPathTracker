const express = require('express');
const app = express();
const port = 8080;
const Joi = require('joi');
const rateLimit = require('express-rate-limit');

app.use(express.json());

const flightSchema = Joi.array().items(
  Joi.array().length(2).items(Joi.string().length(3)).required()
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.post('/calculate', async (req, res) => {
  const { error } = flightSchema.validate(req.body.flights);
  if (error) return res.status(400).send({ error: error.details[0].message });

  try {
    const flights = req.body.flights;
    const path = calculateFlightPath(flights);
    if (!path) throw new Error('Invalid flight data');

    res.json({ path });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

function calculateFlightPath(flights) {
  // Create adjacency list and in-degree map
  const graph = new Map();
  const inDegree = new Map();

  flights.forEach(([src, dest]) => {
      if (!graph.has(src)) graph.set(src, []);
      if (!graph.has(dest)) graph.set(dest, []);
      graph.get(src).push(dest);

      inDegree.set(dest, (inDegree.get(dest) || 0) + 1);
      if (!inDegree.has(src)) inDegree.set(src, 0);
  });

  // Find the start node (with zero in-degree)
  let startNode = null;
  for (let [node, degree] of inDegree) {
      if (degree === 0) {
          startNode = node;
          break;
      }
  }

  if (!startNode) throw new Error('Cycle detected or disconnected segments');

  // Topological sort approach
  const sortedPath = [];
  const queue = [startNode];

  while (queue.length) {
      const node = queue.shift();
      sortedPath.push(node);

      for (let neighbor of graph.get(node)) {
          inDegree.set(neighbor, inDegree.get(neighbor) - 1);
          if (inDegree.get(neighbor) === 0) {
              queue.push(neighbor);
          }
      }
  }

  if (sortedPath.length !== graph.size) throw new Error('Cycle detected or disconnected segments');

  return sortedPath;
}

module.exports = { calculateFlightPath };
