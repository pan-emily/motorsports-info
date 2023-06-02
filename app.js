/**
 * CS 132
 * Name: Emily Pan
 * CS 132 Spring 2023
 * 
 * This is the javascript code for the Formula 1 API that will
 * handle data for my F1 informational website. 
 * 
 * Some source code inspired by Week 9 Cafe API Case Study
 * Author: El Hovik
 * 
 * Requests/endpoints:
 *  GET /info/:name
 *  GEt /categories/:category
 */

"use strict";

const express = require("express");
const multer = require("multer");
const fs = require("fs/promises");
const path = require("path");
const globby = require("globby");
const { response } = require("express");
const res = require("express/lib/response");
const { json } = require("express/lib/response");

const SERVER_ERROR = "Something went wrong on the server, please try again later.";
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const DEBUG = true;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); 
app.use(multer().none());

// GET endpoints 

/**
 * Returns JSON array of all data available to display.
 * Each file has a cateogry defined by the file's
 * path/file organization, and holds text
 * about the sport under the category. 
 * 
 * Returns a 500 error for server errors. 
 * Returns a 400 error for invalid client input such as
 * wrong motorsport.
 * 
 * Return type is JSON. 
 */
app.get("/info/:name", async (req, res, next) => {
    try {
        let racingType = req.params.name;
        if (racingType === "f1" || racingType === "indycar") {
            let categories = await getData(racingType);
            res.json(categories);
        } else {
            res.status(CLIENT_ERR_CODE);
            err.message = "Issue with racing mode input.";
            next(err);
        }
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/**
 * Returns text of all categories available. 
 * Each file in the f1/indycar folders have different
 * files with unique features, so the differences
 * are simply based off the names of the files in folder.
 * Returns a 500 error for server errors. 
  * Returns a 400 error for invalid client input such as
 * wrong motorsport.
 * 
 * Return type is text. 
 */
app.get("/categories/:category", async (req, res, next) => {
    try {
        let category = req.params.category;
        let itemDirs = await getCategories(category);
        res.type("text");
        res.send(itemDirs);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        res.type("text");
        res.status(500).send(SERVER_ERROR);
        next(err);
    }
});

/**
 * Returns text of today's fun fact. 
 * Today's fun fact is filed under info > daily_fact > today
 * Future functionality will include daily fact archives. 
 * 
 * Returns a 500 error for server errors. 
  * Returns a 400 error for invalid client input such as
 * wrong motorsport.
 * 
 * Return type is text. 
 */
app.get("/daily_fact", async (req, res, next) => {
    try {
        let text = await getFact();
        res.type("text");
        res.send(text);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        res.type("text");
        res.status(500).send(SERVER_ERROR);
        next(err);
    }
});

/** Possible helper functions
 */

/**
 * Generates motorsport (F1/Indycar) data from categories and
 * subdirectories in the format: 
 * { info : {
 *      category : [{itemData}], 
 *      category : [{itemData}], ...
 *     }
 * }
 * 
 * Which is organized in the file structure:
 * info/
 *   category/
 *     itemFile
 * 
 * @param {String} racingType 
 * @returns {Object} generated all data in valid JSON format
 */
async function getData(racingType) {
    let result = {};
    try {
      let path = "info/" + racingType;
      let categories = await fs.readdir(path);
      for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let categoryData = [];
        let itemDirs = await fs.readdir(`${path}/${category}`);
        for (let j = 0; j < itemDirs.length; j++) {
          let itemData = await getItemData(`${path}/${category}/${itemDirs[j]}`, category);
          categoryData.push(itemData);
        }
        result[category] = categoryData;
      }
      return { "data" : result };
    } catch (err) {
      throw err;
    }
}

/**
 * Gets all the categories of information avaialble about
 * a specific motorsport. 
 * 
 * Leverages file organizaton to find all subdirectories 
 * below category/ (ex f1 or indycar) to list out all
 * subcategories/subdirectories of available information. 
 * 
 * @param {String} category 
 * @returns {String} text of all the categories available 
 *                   for a motorsport
 */
async function getCategories(category) {
    try {
        let path = "info/" + category;
        let categories = await fs.readdir(path);
        return {"categories" : categories};
    } catch (err) {
        throw err;
    }

}

/**
 * Adapted from Cafe example code. 
 * Generates data from category/subcategory directory in format:
 *  {path : string, text : string}
 * 
 * Relies on item directory structure in the form: 
 * item-dir/
 *  item.txt
 * 
 * @param {*} itemPath 
 * @returns 
 */
async function getItemData(itemPath, category) {
    let itemName = path.basename(itemPath); 
    // readfile error will be caught all the way up in /menu endpoint, so don't need
    // try/catch here.
    let contents = await fs.readFile(itemPath, "utf8");
    let lines = contents.split("\n");
    let text = lines[0];
    return {
      "category": category,
      "path" : itemPath, 
      "text" : text
    };
  }

/**
 * Generates the daily fact from the location of today's fact:
 * info > daily_fact > today
 * @param None 
 * @return {String} text of today's daily fact
 */
async function getFact() {
    let path = "info/daily_fact/today";
    let contents = await fs.readFile(path, "utf8");
    let lines = contents.split("\n");
    let text = lines[0];
    return text;
}


const PORT = process.env.PORT || 8000;
app.listen(PORT);