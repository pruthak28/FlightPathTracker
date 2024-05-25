
# Flight Path Tracker

## Story
There are over 100,000 flights a day, with millions of people and cargo being transferred worldwide. With so many people and different carrier/agency groups, it can be hard to track where a person might be. To determine a person's flight path, we must sort through all of their flight records.

## Goal
To create a microservice API to help us understand and track how a particular person’s flight path may be queried. The API should accept a request that includes a list of flights defined by a source and destination airport code. These flights may not be listed in order and must be sorted to find the total flight paths starting and ending at airports.

## Assumption
The initial source and final destination will always be different airports

## API Endpoint

**POST /calculate**
### Approach: Topological Sorting
- **Graph Construction**: Build a graph using adjacency lists and track in-degrees of nodes.
- **Queue Initialization**: Initialize a queue with nodes having zero in-degree.
- **Processing**: Process nodes from the queue, appending them to the sorted result and reducing in-degrees of their neighbors.
- **Cycle Detection**: If the number of sorted nodes doesn't match the number of graph nodes, a cycle or disconnected segment is detected.

#### Error Handling
- **Invalid Input**: Return `400 Bad Request` for invalid input.
- **Cycle or Disconnected Segments**: Throw an error if a cycle is detected or if there are disconnected segments.

### Request Body
```json
{
    "flights": [["SFO", "EWR"], ["ATL", "EWR"], ["SFO", "ATL"]]
}
```

### Response
```json
{
    "path": ["SFO", "ATL", "EWR"]
}
```

### Errors

-   `400 Bad Request`: Invalid input format.
-   `500 Internal Server Error`: An error occurred during processing.

### Examples

#### Valid Request
```json
{
  "flights": [["SFO", "EWR"]]
}
```

#### Response:
```json
{
  "path": ["SFO", "EWR"]
}
```
***
#### Invalid Request (Cycle Detection)
```json
{
  "flights": [["SFO", "ATL"], ["ATL", "EWR"], ["EWR", "SFO"]]
}
```

#### Response:
```json
{
  "error": "Cycle detected or disconnected segments"
}
```

### How To Run
-   `npm install`
-   `node server.js`
-   Send a POST request using a tool like Postman to the URL `http://localhost:8080/calculate` with the body format shown above.


## Conclusion
By using a topological sort approach with error handling and cycle detection, you can ensure that the solution is robust and can handle complex scenarios effectively. This approach provides clear error messages and maintains the integrity of the flight path calculation.
