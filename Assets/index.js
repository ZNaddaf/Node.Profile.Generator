//======================================================================
///// NPM Databases
//======================================================================
const fs = require("fs");
const HTMLGenerator = require('./generateHTML');
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios")
const pdf = require('html-pdf');


//======================================================================
///// Variables for Github query  
//======================================================================

let profileImg;
let gitHubUserName;
let userCity;
let userGitHubProfile;
let userBlog;
let userBio;
let userRepositories;
let userFollowers;
let userGHStars;
let userFollowing;

//======================================================================
///// Inquirer Questions 
//======================================================================

inquirer
    .prompt([
        // function promptUser() {
        //     return inquirer.prompt([
        {
            type: "input",
            name: "github",
            message: "Enter your GitHub Username"
        },
        {
            type: "checkbox",
            message: "Which color would you prefer?",
            name: "color",
            choices: [
                "green",
                "blue",
                "pink",
                "red",
                "black"
            ]
        },
    ])
    // }
    // promptUser()

    //======================================================================
    ///// Function to query gitHub
    //======================================================================

    .then(function (userInput) {
        const queryUrl = `https://api.github.com/users/${userInput.username}`;
        const queryStarUrl = `https://api.github.com/users/${userInput.username}/starred`;

        ghquery(queryUrl).then(function (response) {
            ghQueryStars(queryStarUrl).then(function (responseStars) {

                var options = { format: 'Letter' };
                var rendered = HTMLGenerator.Generator(userInput, response, responseStars, profileImg, gitHubUsername, userCity, userGitHubProfile, userBlog, userBio, userRepos, userFollowers, userFollowing);

                pdf.create(rendered, options).toFile(`./${userInput.username}.pdf`, function (err, res) {
                    if (err) return console.log(err);
                    console.log(res);
                })
            })
        })

    });

//======================================================================
///// Function to use the responses 
//======================================================================

function ghquery(queryUrl) {
    console.log(queryUrl);
    return axios.get(queryUrl)
        .then(function (response) {

            profileImg = (response.data.avatar_url + ".png");
            gitHubUsername = (response.data.login);
            userCity = (response.data.location);
            userGitHubProfile = (response.data.html_url);
            userBlog = (response.data.blog);
            userBio = (response.data.bio);
            userRepos = (response.data.public_repos);
            userFollowers = (response.data.followers);
            userFollowing = (response.data.following);

            return response;
        });
};

///// Here we get the user's Github stars

function ghQueryStars(queryStarUrl) {

    return axios.get(queryStarUrl)
        .then(function (responseStars) {
            console.log(responseStars.data.length);

            return responseStars.data.length;
        });
};

// promptUser()
//     .then(function (answers) {
//         const html = generateHTML(answers);
//         return writeFileAsync("index.html", html);
//     })
//     .then(function () {
//         console.log("Successfully wrote to index.html");
//     })
//     .catch(function (err) {
//         console.log(err);
//     });
