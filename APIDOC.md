
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
      {"category":"cars","path":"info/f1/cars/type.txt","text":"F1 is a high-speed open-top car race which usees 1.6L V6 engine cars."}],"races":[{"category":"races","path":"info/f1/races/locations.txt","text":"F1 tracks all have different shapes, with designated tracks and street circuits. These tracks typically have to be of higher grade than those of Indycar. F1 races are international, covering the 5 continents while Indycar races mostly occur in the United States."}],"teams":[{"category":"teams","path":"info/f1/teams/teams.txt","text":"The F1 teams are: Alfa Romeo, AlphaTauri, Aston Martin, Ferrari, Haas, McLaren, Mercedes, Red Bull, and Williams."}]}}
```

## *GET /menu/:category*
**Returned Data Format**: JSON

**Description:** 
Returns JSON data with items for the given category, if valid (ignoring letter-casing). 

**Supported parameters**
* /:category (required)
  * Category name for items to search for.

**Example Request:** `/menu/drinks` or `/menu/Drinks`

**Example Response:**
```json
[
  "bubble-tea",
  "classic-coffee",
  "the-sippy"
]
```

**Error Handling:**
* 400: Invalid request if given a category that does not currently exist on the store.

**Example Request:** `/menu/badcategory`

**Example Response:**
```Category badcategory not found.```


## *POST /contact*
**Returned Data Format**: Plain Text

**Description:** 
Sends information to the Cafe web service for a "Contact Us" endpoint, including the name of the user, their email, and a text message. Returns a response about whether the information was successfully sent, otherwise provides details about an erroneous request.

**Supported Parameters**
* POST body parameters: 
  * `name` (optional) - name of customer
  * `message` (required) - contact message
  * `email` (required) - email of customer

**Example Request:** `/contact`
* POST body parameters: 
  * `name=''`
  * `message='Lorem says hello'`
  * `email='lorem@ipsum.edu'`

**Example Response:**
```Your message was received! We will send an email back soon.```

**Error Handling:**
* 400: Invalid request missing required `message` or `email` parameter.

**Example Request:** `/contact`
* POST body parameters: 
  * `name='Lorem'`
  * `message='Hello!'`

**Example Response:**
```Missing required POST parameters for /contact: email.```