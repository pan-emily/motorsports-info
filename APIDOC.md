
# CS132 Motorsports API Documentation
**Author:** Emily Pan
**Last Updated:** 06/02/2023

Adapted from El Hovik's Cafe API example. 

The motorsports API provides functionality to retrieve information from a database
of information about Formula 1, Indycar, and other interesting motorsports facts. 

Clients can retrieve information about certain topics and compare/contrast betwen
Formula1 and Indycar, such as cars, teams, etc, which are returned as JSON objects. Functionality is also provided to get a fun fact of the day. The API returns this information as text. 500-level errors refer to server-side errors, while 400-level errors refer to client-side errors. 

Summary of endpoints:
* GET /menu
* GET /menu/:category
* GET /categories
* GET /images
* POST /contact
* POST /addItem
...

In the current version of this API, all error responses are returned as plain text. Any 500 errors represent a server-side issue and include a generic error message. Any 400-level errors represent an invalid request by a client, and are documented appropriately for any parameterized endpoint.

Contact the author at hovik@caltech.edu for any bug reports or feature requests!

## *GET /menu*
**Returned Data Format**: JSON

**Description:**
Returns a JSON collection of categories and items available on the #C0FFEE Cafe menu.

**Parameters**
* mini=true (optional)
  * Returns a minified version of the menu if passed as "true"

**Example Request:** `menu?mini=true`

**Example Response:**
```json
{
  "categories": {
    "Drinks": [
      {
        "name": "Bubble Tea",
        "image": "tea.png",
        "description": "Bubbles.",
        "in-stock": true
      },
      {
        "name": "Classic Coffee",
        "image": "coffee.png",
        "description": "The classic.",
        "in-stock": true
      },
      {
        "name": "The Sippy",
        "image": "the-sippy.png",
        "description": "The classic. In a sippy cup.",
        "in-stock": false
      }
    ],
    "Foods": [
      {
        "name": "Baguette",
        "image": "baguette.jpg",
        "description": "A Baguette.",
        "in-stock": true
      },
      {
        "name": "Cereal",
        "image": "cereal.png",
        "description": "To complement the most important drink of the day.",
        "in-stock": true
      },
      {
        "name": "Coffee Noodles",
        "image": "noodles.jpg",
        "description": "The next big thing.",
        "in-stock": true
      },
      {
        "name": "Doughnut",
        "image": "doughnut.png",
        "description": "We don't have bagels.",
        "in-stock": false
      }
    ]
  }
}
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