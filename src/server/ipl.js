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
        } else {
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
    } else {
        console.log("Number of matches played per year File Created Succesfully");
    }
});


//Q2. Number of matches won per team per year in IPL.

function matchesWonPerYear(matchesData) {
    let matchesPerYear = {}

    matchesData.filter((matchData) => {
        let season = matchData.season
        let Winners = matchData.winner

        if (!(season in matchesPerYear)) {
            matchesPerYear[season] = {}
        }
        if (Winners in matchesPerYear[season]) {
            matchesPerYear[season][Winners] += 1
        } else {
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
    } else {
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
                    } else {
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
    } else {
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
                        } else {
                            bowlers[deliveryData.bowler] = { "totalRuns": parseFloat(deliveryData.total_runs), "totalBalls": 1, "economy": 0 }
                        }
                    }
                }
            })
        }
    })

    return Object.entries(bowlers).sort((firstItem, nextItem) => firstItem[1].economy - nextItem[1].economy).slice(0, 10);
}

//For Calling and JSON file 
let year1 = 2015;
let resultTop10Bowlwrs = economicalBowlers(matches, deliveries, year1);
//console.log(resultTop10Bowlwrs)
fs.writeFile('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/public/output/top10EconomicalBowler.json', JSON.stringify(resultTop10Bowlwrs), (error) => {
    if (error) {
        console.log(error);
    } else {
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
            } else {
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
    } else {
        console.log("Number of times each team won the toss and match JSON File Created Succesfully");
    }
});


//Q2. Find a player who has won the highest number of Player of the Match awards for each season

playerHighestAwards = (matches) => {
    let object = {};
    let result = {};
    let maxSeason = 2017;

    matches.filter((matchData) => {

        if (matchData.season == maxSeason) {
            let key = matchData.player_of_match;
            if (object.hasOwnProperty(key)) {
                object[key] += 1;
            } else {
                object[key] = 1;
            }
        } else {
            result[maxSeason] = Object.entries(object).sort((a, b) => b[1] - a[1])[0]
            maxSeason = matchData.season;
            object = {};
        }
    });

    return result;
}

const resultplayerHighestAwards = playerHighestAwards(matches)
fs.writeFile('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/public/output/playerWonHighNoOfAward.json', JSON.stringify(resultplayerHighestAwards), (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Player highest Match Award JSON File Created Succesfully");
    }
});


//Q3. Find the strike rate of a batsman for each season

const batsmanStrikeRate = (matches, deliveries) => {

    const matchIdSeason = {};
    const resultStrikeRate = {};

    matches.filter((matchData) => {
        matchIdSeason[matchData.id] = matchData.season;

        deliveries.filter((deliveriesData) => {
            let key = deliveriesData.batsman;
            let season_key = matchIdSeason[deliveriesData.match_id];

            if (resultStrikeRate.hasOwnProperty(key))   // if batsman exist in result
            {
                if (resultStrikeRate.key.hasOwnProperty(season_key)) //batsman + season both exists
                {
                    resultStrikeRate.key.season_key.total_runs += parseInt(deliveriesData.batsman_runs);
                    resultStrikeRate.key.season_key.balls += 1;
                    resultStrikeRate.key.season_key.strikeRate = (resultStrikeRate.key.season_key.total_runs * 100) / resultStrikeRate.key.season_key.balls;
                } else {  //batsman exist, but season dont exist
                    resultStrikeRate.key.season_key = { "runs": parseInt(deliveriesData.batsman_runs), "balls": 1, "strikeRate": deliveriesData.batsman_runs100 };
                }
            } else { //current batsman dont exist in result

                resultStrikeRate.key = { [season_key]: { "runs": parseInt(deliveriesData.batsman_runs), "balls": 1, "strikeRate": parseFloat(deliveriesData.batsman_runs) * 100 } };
            }
        });
    });
    return resultStrikeRate;
}

// Calling function and JSON file

const resultStrikeRate = batsmanStrikeRate(matches, deliveries);
//console.log(resultStrikeRate);
fs.writeFile('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/public/output/batsmanStrikeRate.json', JSON.stringify(resultStrikeRate), (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Batsman strike rate JSON File Created Succesfully");
    }
});



//Q4. Find the highest number of times one player has been dismissed by another player

const numberOfPlayerDismissed = (deliveries) => {
    const resultNumberOfPlayerDismissed = {};

    deliveries.filter((deliveriesData) => {
        if (!deliveriesData.player_dismissed) {
            return true;
        } else if (resultNumberOfPlayerDismissed.hasOwnProperty(deliveriesData.player_dismissed)) {
            resultNumberOfPlayerDismissed[deliveriesData.player_dismissed] += 1;
        } else {
            resultNumberOfPlayerDismissed[deliveriesData.player_dismissed] = 1;
        }
    })
    return Object.entries(resultNumberOfPlayerDismissed).sort((a, b) => b[1] - a[1])[0];
}

//Calling function and JSON file 

const resultNumberOfPlayerDismissed = numberOfPlayerDismissed(deliveries);
//console.log(resultNumberOfPlayerDismissed);
fs.writeFile('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/public/output/numberOfPlayerDismissed.json', JSON.stringify(resultNumberOfPlayerDismissed), (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("highest number of times one player has been dismissed by another player JSON File Created Succesfully");
    }
});


//Q5. Find the bowler with the best economy in super overs

const findSuperOverEconomy = (delivery) => {
    let resultSuperOverEconomy = {};

    delivery.filter((deliveryData) => {
        if (resultSuperOverEconomy.hasOwnProperty(deliveryData.bowler)) {

            if (deliveryData.is_super_over != 0) {
                resultSuperOverEconomy[deliveryData.bowler].balls += 1;
                resultSuperOverEconomy[deliveryData.bowler].runs += parseInt(deliveryData.total_runs);

                resultSuperOverEconomy[deliveryData.bowler].economy = (resultSuperOverEconomy[deliveryData.bowler].runs / (resultSuperOverEconomy[deliveryData.bowler].balls / 6)).toFixed(2);
            }
        } else {
            if (deliveryData.is_super_over != 0) {
                resultSuperOverEconomy[deliveryData.bowler] = { "runs": parseInt(deliveryData.total_runs), "balls": 1, "economy": 0 };
            }
        }
    })
    return Object.entries(resultSuperOverEconomy).sort((firstItem, nextItem) => firstItem[1].economy - nextItem[1].economy)[0];
}

//Calling function and JSON file

const resultSuperOverEconomy = findSuperOverEconomy(deliveries);
//console.log(resultSuperOverEconomy);
fs.writeFile('/home/prabhas/Desktop/MountBlueAssignment/JavaScript/IPL/src/public/output/bestEconomySuperOver.json', JSON.stringify(resultSuperOverEconomy), (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Best economy in super overs JSON File Created Succesfully");
    }
});

