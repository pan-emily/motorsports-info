/**
 * NAME: Emily Pan
 * DATE: May 5, 2023
 * CS 132 Web Development
 * This is the formula1.js file that handles the
 * interactive components of the Formula 1 Info
 * webpage. Flags can be toggled to be viewed/hidden
 * or removed altogether. The car images can be
 * magnified by hovering the mouse over the image.
 */

(function() {
    "use strict";
    // any module-globals (limit the use of these when possible)
    const COUNTRIES = ["bahrain", "saudi", "australia", "azerbaijan", 
                       "usa", "italy", "monaco", "spain", "canada", 
                       "austria", "britain", "hungary", "belgium", 
                       "holland", "singapore", "japan", "qatar", 
                       "mexico", "brazil", "uae"]

    /**
     * Initializes event listeners for the set webpage. 
     * @param None 
     * @return None 
     */
    function init() {
        id("flags-btn").addEventListener("click", showFlags);
        id("flags-remove-btn").addEventListener("click", removeFlags);
        id("car1").addEventListener("mouseenter", magnifyCar1);
        id("car1").addEventListener("mouseleave", shrinkCar1);
        id("car2").addEventListener("mouseenter", magnifyCar2);
        id("car2").addEventListener("mouseleave", shrinkCar2);
    }

    // other functions
    /**
     * Makes fetch call to RESTCountries' Country API 
     * Upon success, returns the official name of the country
     * If an error occurs, displays an appropriate message on the page
     * @param country (String) 
     * @return String official name of the country 
     */
    async function fetchCountry(country) {
        var url = 'https://restcountries.com/v3.1/name/' + country;
        try {
            let resp = await fetch(url);
            resp = checkStatus(resp);
            let data = await resp.json();
            return data[0].name.official;
        } catch (err) {
            let errorMessage = err.message;
            handleRequestError(errorMessage);
        }
    }
    /**
     * This function is called when there is an error in the fetch 
     * call chain and displays a user-friendly error message on the page.
     * @param err (Error)
     * @return None 
     */
    function handleRequestError(err) {
        let response = document.createElement("p");
        let msg = "There was an error requesting data from the RESTCountries service " +
          err + "Please try again later.";
        response.textContent = msg;
        qs("#flags").appendChild(response);
      }

    /*
     * When the "Toggle Flags" button is clicked on, the flag images
     * can be shown or hidden. 
     */
    async function showFlags() {
        var flags = id('flags');
        flags.classList.toggle("hidden");

        let names = await Promise.all(COUNTRIES.map(async country => {
            return fetchCountry(country);
        }));

        console.log(names);
        let countryNames = document.createElement("p");
        countryNames.textContent = names.join(", ");
        qs("#flags").appendChild(countryNames);
    }

    /** 
     * When the "Remove Flags" button is clicked, the flag 
     * images and flag-related buttons are removed permanently.
    */
    function removeFlags() {
        var parent = id('f1-intro');
        var flags = id('flags');
        var toggleButton = id('flags-btn');
        var removeButton = id('flags-remove-btn');
        parent.removeChild(flags);
        parent.removeChild(toggleButton);
        parent.removeChild(removeButton);
    }

    /** 
     * When the mouse hovers over the first car image, the car image
     * magnifies 2x. 
    */
    function magnifyCar1() {
        var car = id('car1');
        car.style.scale = 2;
    }

    /** 
     * When the mouse leaves the hover area of the car, 
     * the image shrinks back to its original size. 
    */
    function shrinkCar1() {
        var car = id('car1');
        car.style.scale = 1;
    }

    /** 
     * When the mouse hovers over the second car image, the car image
     * magnifies 1.5x. 
    */
    function magnifyCar2() {
        var car = id('car2');
        car.style.scale = 1.5;
    }

    /** 
     * When the mouse leaves the hover area of the car, 
     * the image shrinks back to its original size. 
    */
    function shrinkCar2() {
        var car = id('car2');
        car.style.scale = 1;
    }

    // Must include window.onload so that the init
    // does not run before the page is loaded.
    window.onload = init;
})();
