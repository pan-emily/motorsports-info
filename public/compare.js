/**
 * NAME: Emily Pan
 * DATE: May 5, 2023
 * CS 132 Web Development
 * 
 * This is the compare.js file that interfaces with the Formula1 
 * Info API. It will create buttons based on the database allowing
 * users to view information about the different aspects of 
 * each motorsport racing. 
 */

(function() {
    "use strict";
    // Any module-globals (limit the use of these when possible)
    const CATEGORIES = ["f1", "indycar"]

    /**
     * Initializes event listeners for the set webpage. 
     * @param None 
     * @return None 
     */
    async function init() {
        /** CategoryHandler() will fetch all the categories available
        * from the API and create buttons for each category available
        * in F1 or Indycar. The buttons behave such that when clicked,
        * the corresponding information on the F1 and Indycar side
        * will appear. 
        */
        categoryHandler();

        // Show today's daily fact
        const fact = await getFact();
        showFact(fact);
    }

    // Other functions
    /**
     * Generates the list of shared topics between both motorsports
     * and shows the available categories in the form of buttons.
     * @param None 
     * @return None 
     */
    async function categoryHandler() {
        let intersection = [];
        for (let i = 0; i < CATEGORIES.length; i++) {
            let categories = await requestCategories(CATEGORIES[i]);
            for (let j = 0; j < categories.length; j++) {
                if (intersection.includes(categories[j]) == false) {
                    intersection.push(categories[j]);
                }
            }
        }
        showCategories(intersection);
    }

    /**
     * Fetches from the Motorsports API the different topics/categories
     * where information is available for both motorsports. 
     * 
     * @param {String} type of motorsport (F1 or Indycar) 
     * @return None 
     */
    async function requestCategories(category) {
        try {
            let resp = await fetch(`/categories/${category}`, {
                method: "GET",
            });
            let response = checkStatus(resp);
            let categoryData = await response.json();
            return categoryData.categories;
            // return showCategories(categoryData);
        } catch(err) {
            handleRequestError(err);
        }

    }

    /**
     * Creates website elements to display the sections of information
     * retreived from the Motorsports API. Creates a button for the 
     * category of information
     * in the text files in the database as parsed by the API. 
     * 
     * @param {String} the type of racing/motorsport 
     * @return None 
     */
    function showCategories(categories) {
        for (let i = 0; i < categories.length; i++) {
            let category = categories[i];
            // create a button 
            var button = gen("button");
            button.classList.add("category-buttons");
            button.textContent = formatHeader(category);
            button.classList.add(category);
            button.id = category;
            button.addEventListener("click", handleDataDisplay);
            qs("#buttons-wrapper").appendChild(button);
        }
    }

    /**
     * Button handler. When a button is selected, the information 
     * of the category related to the button pressed is shown. 
     *  
     * @param None 
     * @return None 
     */
    async function handleDataDisplay() {
        for (let i = 0; i < CATEGORIES.length; i++) {
            let category = CATEGORIES[i];
            let itemData = await requestCategoryData(category);
            let sub = this.id;
            showItemData(category, itemData, sub);
        }
    }

    /**
     * Fetches the data from the API of all the information
     * in the database for a given type of motorsport.
     * 
     * @param {String} type of motorsport 
     * @return None 
     */
    async function requestCategoryData(category) {
        // fetch all the data from API 
        try {
            let resp = await fetch(`/info/${category}`, {
                method: "GET",
            });
            let response = checkStatus(resp);
            let itemData = await response.json();
            return itemData.data;
        } catch(err) {
            handleRequestError(err);
        }
        
    }

     /**
     * Creates website elements to display the sections of information
     * retreived from the Motorsports API. Creates a header for the 
     * category of information and adds paragraphs for the text 
     * in the text files in the database as parsed by the API. 
     * 
     * @param {String} the type of racing/motorsport 
     * @param {JSON Object} All data of that type of racing
     * @param {String} the topic selected to display
     * @return None 
     */
    function showItemData(category, itemData, sub) {
        var parent = id(category);
        var section = gen("section");
        let headers = itemData[sub];
        
        var header = gen("h3");
        header.textContent = formatHeader(sub);
        parent.appendChild(header);

        for (let i = 0; i < headers.length; i++) {
            let text = headers[i].text;
            var p = gen("p");
            p.textContent = text;
            parent.appendChild(p);

        }
    }

    // Formats the header by capitalizing first letter
    function formatHeader(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    /**
     * Fetches the data from the API of today's fun fact
     * in the database.
     * 
     * @param None
     * @return {String} text of today's fun fact 
     */
    async function getFact() {
        try {
            let resp = await fetch(`/daily_fact`, {
                method: "GET",
            });
            let response = checkStatus(resp);
            let text = await response.text();
            return text;
        } catch(err) {
            handleRequestError(err);
        }
    }

    /**
     * Converts text of fun fact into HTML elements
     * to add to the page. Adds a header and formats 
     * the text into a parapgrah, then adds to the sidebar. 
     * 
     * @param {String} type of motorsport 
     * @return None 
     */
    function showFact(fact) {
        var h = gen("h4");
        h.textContent = "Today's fun fact:";

        var p = gen("p");
        p.textContent = fact;

        qs("#buttons-wrapper").appendChild(h);
        qs("#buttons-wrapper").appendChild(p);
    }

  
    /**
     * This function is called when there is an error in the fetch 
     * call chain and displays a user-friendly error message on the page.
     * 
     * Usually an error would occur when the database is not fully
     * balanced (there are files in F1 that are not Indycar, so a
     * direct comparison cannot be made).
     * 
     * @param err (Error)
     * @return None 
     */
    function handleRequestError(err) {
        let response = document.createElement("p");
        let msg = "There was an error requesting data from the motorsports information. " +
            err + "Please try again later.";
        response.textContent = msg;
      }

    // Must include window.onload so that the init
    // does not run before the page is loaded.
    window.onload = init;
})();