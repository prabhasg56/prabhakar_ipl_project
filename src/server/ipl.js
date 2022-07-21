let csvToJson = require('convert-csv-to-json');
let matches = csvToJson.fieldDelimiter(',').getJsonFromCsv('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/server/matches.csv');
let deliveries = csvToJson.fieldDelimiter(',').getJsonFromCsv('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/server/deliveries.csv');
const fs = require('fs')
//console.log(matches)

//Q1. Number of matches played per year for all the years in IPL.

function matchesPlayedPerYear(matches) {
    let matchPerYear = {}
    matches.filter((match) => {
        let year = (match.season)
        if (matchPerYear[year]) {
            matchPerYear[year] += 1;
        }
        else {
            matchPerYear[year] = 1;
        }
    })
    return matchPerYear;
}

//For Calling function and JSON file 
let resultMatchesPlayedPerYear = matchesPlayedPerYear(matches);
fs.writeFile('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/public/output/matchesPlayedPerYear.json', JSON.stringify(resultMatchesPlayedPerYear), (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Number of matches played per year File Created Succesfully");
    }
});


//Q2. Number of matches won per team per year in IPL.

function matchesWonPerYear(matchesData) {
    let matchesPerYear = {}

    matchesData.filter((matchData) => {
        let season = matchData.season
        let Winners = matchData.winner

        if (!(season in matchesPerYear))
            matchesPerYear[season] = {}
        if (Winners in matchesPerYear[season]) {
            matchesPerYear[season][Winners] += 1
        }
        else {
            matchesPerYear[season][Winners] = 1
        }
    })
    return matchesPerYear;
}

//For Calling function and JSON file 
let resultMatchesWonPerYear = matchesWonPerYear(matches);
fs.writeFile('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/public/output/numberOfMatchesWonPerYear.json', JSON.stringify(resultMatchesWonPerYear), (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Number of matches won per year File Created Succesfully");
    }
});



//Q3. Extra runs conceded per team in the year 2016

function extraRunByPerTeam(matchesData, deliveriesData, year) {
    let ExtraRunByTeams = {}
    matchesData.filter((matchData) => {
        if (matchData.season == year) {
            let id = matchData.id;
            deliveriesData.filter((deliveryData) => {
                if (deliveryData.match_id === id) {
                    if (ExtraRunByTeams[deliveryData.bowling_team]) {
                        ExtraRunByTeams[deliveryData.bowling_team] += parseInt(deliveryData.extra_runs);
                    }
                    else {
                        ExtraRunByTeams[deliveryData.bowling_team] = parseInt(deliveryData.extra_runs);
                    }
                }
            })
        }
    }
    )
    return ExtraRunByTeams;
}

//For Calling function and JSON file 
let year = 2016;
let resultExtraRun = extraRunByPerTeam(matches, deliveries, year);
fs.writeFile('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/public/output/extraRunByPerTeamIn2016.json', JSON.stringify(resultExtraRun), (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Extra run conceded in the year 2016 JSON File Created Succesfully");
    }
});



//Q4. Top 10 economical bowlers in the year 2015

function economicalBowlers(matchesData, deliveriesData, year) {
    let bowlers = {}
    matchesData.filter((matchData) => {
        if (matchData.season == year) {
            let id = matchData.id;
            deliveriesData.filter((deliveryData) => {
                if (deliveryData.match_id === id) {
                    if (deliveryData.wide_runs == 0 && deliveryData.noball_runs == 0) {

                        if (bowlers[deliveryData.bowler]) {
                            bowlers[deliveryData.bowler].totalBalls += 1
                            bowlers[deliveryData.bowler].totalRuns += parseFloat(deliveryData.total_runs)
                            bowlers[deliveryData.bowler].economy = ((bowlers[deliveryData.bowler].totalRuns) / (bowlers[deliveryData.bowler].totalBalls / 6)).toFixed(2);
                        }
                        else {
                            bowlers[deliveryData.bowler] = { "totalRuns": parseFloat(deliveryData.total_runs), "totalBalls": 1, "economy": 0 }
                        }
                    }
                }
            })
        }
    })

    return Object.entries(bowlers).sort((a, b) => a[1].economy - b[1].economy).slice(0, 10);
}

//For Calling and JSON file 
let year1 = 2015;
let resultTop10Bowlwrs = economicalBowlers(matches, deliveries, year1);
fs.writeFile('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/public/output/top10EconomicalBowler.json', JSON.stringify(resultTop10Bowlwrs), (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Top 10 economical bowlers in the year 2015 JSON File Created Succesfully");
    }
});

//Extra Problems
//Q1. Find the number of times each team won the toss and also won the match

function numberOfTimesWonAndTossWon(matches) {
    const eachTeamWon = {};
    matches.filter((matchData) => {
        if (matchData.toss_winner === matchData.winner) {
            if (eachTeamWon.hasOwnProperty(matchData.toss_winner)) {
                eachTeamWon[matchData.toss_winner] += 1;
            }
            else {
                eachTeamWon[matchData.toss_winner] = 1;
            }
        }
    })
    return eachTeamWon;
}

//For calling and JSON file

const resultEachTeamWon = numberOfTimesWonAndTossWon(matches);
//console.log(resultEachTeamWon);

fs.writeFile('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/public/output/numberOfTimesWonAndTossWon.json', JSON.stringify(resultEachTeamWon), (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Number of times each team won the toss and match JSON File Created Succesfully");
    }
});
