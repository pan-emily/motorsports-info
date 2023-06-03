
# CS132 Motorsports API Documentation
**Author:** Emily Pan
**Last Updated:** 06/02/2023

Adapted from El Hovik's Cafe API example. 

The motorsports API provides functionality to retrieve information from a database
of information about Formula 1, Indycar, and other interesting motorsports facts. 

Clients can retrieve information about certain topics and compare/contrast betwen
Formula1 and Indycar, such as cars, teams, etc, which are returned as JSON objects. Functionality is also provided to get a fun fact of the day. The API returns this information as text.

Summary of endpoints:
* GET /info/:name
* GET /categories/:category
* GET /daily_fact
...

In the current version of this API, all error responses are returned as plain text. Any 500 errors represent a server-side issue and include a generic error message. Any 400-level errors represent an invalid request by a client, and are documented appropriately for any parameterized endpoint.

Contact the author at emilypan@caltech.edu for any bug reports or feature requests!

## *GET /info/:name*
**Returned Data Format**: JSON

**Description:**
Returns a JSON collection of all F1 or Indycar data available to display.

**Parameters**
* /:name (required): The name of the racing type information you are seeking to display (either "indycar" or "f1"). 

**Example Request:** `/info/f1`

**Example Response:**
```json
{"data":
  {"cars":
    [{"category":"cars",
        "path":"info/f1/cars/development.txt",
        "text": "Each F1 car is uniquely engineered to suit the individual drivers and typically undergo more development by each team. F1 cars are often very different from one another in both engineering and performance." },
    {"category":"cars",
       "path":"info/f1/cars/engine.txt",
       "text":"Despite having less engine capacity, F1 cars are more powerful, capable of generating around 1000 BHP. Both"},
    {"category":"cars",
      "path":"info/f1/cars/type.txt",
      "text":"F1 is a high-speed open-top car race which usees 1.6L V6 engine cars."}],
  "races":
        [{"category":"races",
        "path":"info/f1/races/locations.txt",
        "text":"F1 tracks all have different shapes, with designated tracks and street circuits. These tracks typically have to be of higher grade than those of Indycar. F1 races are international, covering the 5 continents while Indycar races mostly occur in the United States."}],
  "teams":
  [{"category":"teams",
    "path":"info/f1/teams/teams.txt",
    "text":"The F1 teams are: Alfa Romeo, AlphaTauri, Aston Martin, Ferrari, Haas, McLaren, Mercedes, Red Bull, and Williams."}
    ]
  }
}
```
**Error Handling:**
* 400: Invalid request if the racing type isn't f1 or indycar. 

**Example Request:** `/info/badracingtype`

**Example Response:**
```Racing type not found. ```

## *GET /categories/:category
**Returned Data Format**: Array[{String}]

**Description:**
Returns a text array of all the categories available. 

**Parameters**
* /:category (required): The name of the racing category information you are seeking to display. 

**Example Request:** `/categories/f1`

**Example Response:**
```json
{"categories" : ["cars","races","teams"]}
```
**Error Handling:**
* 500: Invalid request if the motorsport you are trying to get the categories of does not have a directory in the database. 

**Example Request:** `/categories/badracingtype`

**Example Response:**
```Cound not find this motorsport.  ```


## *GET /daily_fact
**Returned Data Format**: Text

**Description:**
Returns a text of today's fun fact. 

**Parameters**
* None

**Example Request:** `/daily_fact`

**Example Response:**
```Each F1/Indycar vehicle consists of over 8,000 parts. 
```
**Error Handling:**
* 500: Invalid request if there is no fact today.  

<!-- **Example Request:** `/daily_fact` -->

**Example Response:**
```Could not find today's fun fact.   ```
