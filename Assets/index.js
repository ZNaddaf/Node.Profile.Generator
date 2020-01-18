//======================================================================
///// NPM Databases
//======================================================================
const fs = require("fs");
const HTMLGenerator = require('./generateHTML');
const inquirer = require("inquirer");
const axios = require("axios").default;
const pdf = require('html-pdf');

//======================================================================
///// Inquirer Questions 
//======================================================================

inquirer
    .prompt([
        {
            type: "input",
            name: "username",
            message: "Enter your GitHub Username"
        },
        {
            type: "list",
            message: "Which color would you prefer?",
            name: "color",
            choices: [
                "green",
                "blue",
                "pink",
                "red"
            ]
        },
    ])

    //======================================================================
    ///// Function to query gitHub
    //======================================================================

    .then(function (userInput) {
        const queryUrl = `https://api.github.com/users/${userInput.username}`;
        const queryStarUrl = `https://api.github.com/users/${userInput.username}/starred`;

        ghquery(queryUrl).then(function (data) {
            ghQueryStars(queryStarUrl).then(function (responseStars) {

                var options = { format: 'Letter' };
                data.responseStars = responseStars,

                    pdf.create(HTMLGenerator.getHTML(userInput, responseStars, data), options).toFile(`./${userInput.username}.pdf`, function (err, res) {
                        if (err) return console.log(err);
                        console.log(res);
                    });
            })
        })

    });

//======================================================================
///// Function to use the responses 
//======================================================================

function ghquery(queryUrl) {
    return axios.get(queryUrl)

        .then(function (response) {

            let data = {

                profileImg: (response.data.avatar_url + ".png"),
                gitHubUsername: (response.data.login),
                fullName: (response.data.name),
                userCity: (response.data.location),
                userGitHubProfile: (response.data.html_url),
                userBlog: (response.data.blog),
                userBio: (response.data.bio),
                userRepos: (response.data.public_repos),
                userFollowers: (response.data.followers),
                userFollowing: (response.data.following)
            };
            if (!data.userCity) {
                data.userCity = "Wandering Spirit";
            }
            if (!data.userBio) {
                data.userBio = "Welcome to my Code!";
            }
            if (!data.userBlog) {
                data.userBlog = "I'm still working on my blog ATM";
            }

            return data;

        });
}

//======================================================================
///// Here we get the user's Github stars
//======================================================================


function ghQueryStars(queryStarUrl) {

    return axios.get(queryStarUrl)
        .then(function (responseStars) {
            console.log(responseStars.data.length);

            return responseStars.data.length;
        });
};