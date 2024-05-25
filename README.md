# Flight Path Tracker

## Story
There are over 100,000 flights a day, with millions of people and cargo being transferred worldwide. With so many people and different carrier/agency groups, it can be hard to track where a person might be. To determine a person's flight path, we must sort through all of their flight records.

## Goal
To create a microservice API to help us understand and track how a particular person’s flight path may be queried. The API should accept a request that includes a list of flights defined by a source and destination airport code. These flights may not be listed in order and must be sorted to find the total flight paths starting and ending at airports.

## API Endpoint

**POST /calculate**
### Approach: Topological Sorting
**Steps**
 1. Building the Graph: Construct a graph where each node represents an airport, and directed edges represent flights from the source to the destination airport.
 2. Identifying the Start Node: The starting airport will be the one that has no incoming flights.
 3. Topological Sorting: Perform a topological sort to get the flight path in the correct order.

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

### How To Run
-   `npm install`
-   `node server.js`
-   Send a POST request using a tool like Postman to the URL `http://localhost:8080/calculate` with the body format shown above.


## Conclusion
By using a topological sort approach with error handling and cycle detection, you can ensure that the solution is robust and can handle complex scenarios effectively. This approach provides clear error messages and maintains the integrity of the flight path calculation.
