const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios")
const generator = require('./generateHTML');

const writeFileAsync = util.promisify(fs.writeFile);

inquirer
    .prompt([
        {
            type: "input",
            name: "github",
            message: "Enter your GitHub Username"
        },
        {
            type: "checkbox",
            message: "Which colors would you prefer?",
            name: "color",
            choices: [
                "green",
                "blue",
                "pink",
                "red"
            ]
        },

    ])


promptUser()
    .then(function (answers) {
        const html = generateHTML(answers);

        return writeFileAsync("index.html", html);
    })
    .then(function () {
        console.log("Successfully wrote to index.html");
    })
    .catch(function (err) {
        console.log(err);
    });
