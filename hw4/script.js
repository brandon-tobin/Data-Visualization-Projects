/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;

/** Global vars for storing what kind of sort is applied.*/
var teamSorted = false;
var goalsSorted = false;
var roundSorted = false;
var winsSorted = false;
var lossesSorted = false;
var totalGamesSorted = false;


/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;

/**Set variables for commonly accessed data columns*/
var goalsMadeHeader = 'Goals Made',
    goalsConcededHeader = 'Goals Conceded';

/** Setup the scales*/
var goalScale = d3.scaleLinear()
    .range([cellBuffer, 2 * cellWidth - cellBuffer]);

/**Used for games/wins/losses*/
var gameScale = d3.scaleLinear()
    .range([0, cellWidth - cellBuffer]);

/**Color scales*/
/**For aggregate columns*/
var aggregateColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#016450']);

/**For goal Column*/
var goalColorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(['#cb181d', '#034e7b']);

/**json Object to convert between rounds/results and ranking value*/
var rank = {
    "Winner": 7,
    "Runner-Up": 6,
    'Third Place': 5,
    'Fourth Place': 4,
    'Semi Finals': 3,
    'Quarter Finals': 2,
    'Round of Sixteen': 1,
    'Group': 0
};



//For the HACKER version, comment out this call to d3.json and implement the commented out
// d3.csv call below.

d3.json('data/fifa-matches.json',function(error,data){
    teamData = data;
    createTable();
    updateTable();
})


// // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
// d3.csv("data/fifa-matches.csv", function (error, csvData) {
//
//    // ******* PART I *******
//
//
// });
// // ********************** END HACKER VERSION ***************************

/**
 * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
 *
 */
d3.csv("data/fifa-tree.csv", function (error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
        d.id = d.Team + d.Opponent + i;
    });

    createTree(csvData);
});

/**
 * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
 * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
 *
 */
function createTable() {

// ******* PART II *******

    // Setup goalScale and add axis
    goalScale.domain([0, Math.max(d3.max(teamData, function (d) {return d.value[goalsMadeHeader]}), d3.max(teamData, function (d) {return d.value[goalsConcededHeader]}))])

    var goalAxis = d3.axisTop();
    goalAxis.scale(goalScale);

    d3.select("td#goalHeader")
        .append("svg")
        .attr("width", cellWidth * 2)
        .attr("height", cellHeight)
        .append("g")
        .attr("transform", "translate(0," + (cellHeight - 1) + ")")
        .call(goalAxis);

    // Setup gameScale
    gameScale.domain([0, d3.max(teamData, function (d) {return d.value["TotalGames"];})]);

    // Setup aggregateColorScale
    aggregateColorScale.domain([0, Math.max(d3.max(teamData, function (d) {return d.value["TotalGames"];}), d3.max(teamData, function (d) {return d.value["Losses"];}), d3.max(teamData, function (d) {return d.value["Wins"];}))]);

    // Copy teamData over to tableElements
    tableElements = teamData;


// ******* PART V *******
    var table = document.getElementsByTagName("thead");

    var children = table[0].childNodes[1].childNodes;

    for (var i = 1; i < children.length; i+= 2)
    {
        children[i].onclick = function() {
            sortTable(this);
        }
    }

    function sortTable(tableCell)
    {
        if (tableCell.textContent == "Team")
        {
            collapseList();

            if (teamSorted == false)
            {
                tableElements.sort(function(a, b) {
                    if (a.key < b.key)
                        return -1;
                    if (a.key > b.key)
                        return 1;
                    return 0;
                });
                teamSorted = true;
            }
            else
            {
                tableElements.sort(function(a, b) {
                    if (a.key < b.key)
                        return 1;
                    if (a.key > b.key)
                        return -1;
                    return 0;
                });
                teamSorted = false;
            }

            updateTable();
        }

        if (tableCell.textContent == " Goals ")
        {
            collapseList();

            if (goalsSorted == false)
            {
                tableElements.sort(function(a, b) {
                    if (a.value["Delta Goals"] < b.value["Delta Goals"])
                        return 1;
                    if (a.value["Delta Goals"] > b.value["Delta Goals"])
                        return -1;
                    return 0;
                });
                goalsSorted = true;
            }
            else
            {
                tableElements.sort(function(a, b) {
                    if (a.value["Delta Goals"] < b.value["Delta Goals"])
                        return -1;
                    if (a.value["Delta Goals"] > b.value["Delta Goals"])
                        return 1;
                    return 0;
                });
                goalsSorted = false;
            }

            updateTable();
        }

        if (tableCell.textContent == "Round/Result")
        {
            collapseList();

            if (roundSorted == false)
            {
                tableElements.sort(function(a, b) {
                    if (a.value.Result.ranking < b.value.Result.ranking)
                        return 1;
                    if (a.value.Result.ranking > b.value.Result.ranking)
                        return -1;
                    return 0;
                });
                roundSorted = true;
            }
            else
            {
                tableElements.sort(function(a, b) {
                    if (a.value.Result.ranking < b.value.Result.ranking)
                        return -1;
                    if (a.value.Result.ranking > b.value.Result.ranking)
                        return 1;
                    return 0;
                });
                roundSorted = false;
            }

            updateTable();
        }

        if (tableCell.textContent == "Wins")
        {
            collapseList();

            if (winsSorted == false)
            {
                tableElements.sort(function(a, b) {
                    if (a.value["Wins"] < b.value["Wins"])
                        return 1;
                    if (a.value["Wins"] > b.value["Wins"])
                        return -1;
                    return 0;
                });
                winsSorted = true;
            }
            else
            {
                tableElements.sort(function(a, b) {
                    if (a.value["Wins"] < b.value["Wins"])
                        return -1;
                    if (a.value["Wins"] > b.value["Wins"])
                        return 1;
                    return 0;
                });
                winsSorted = false;
            }

            updateTable();
        }

        if (tableCell.textContent == "Losses")
        {
            collapseList();

            if (lossesSorted == false)
            {
                tableElements.sort(function(a, b) {
                    if (a.value["Losses"] < b.value["Losses"])
                        return 1;
                    if (a.value["Losses"] > b.value["Losses"])
                        return -1;
                    return 0;
                });
                lossesSorted = true;
            }
            else
            {
                tableElements.sort(function(a, b) {
                    if (a.value["Losses"] < b.value["Losses"])
                        return -1;
                    if (a.value["Losses"] > b.value["Losses"])
                        return 1;
                    return 0;
                });
                lossesSorted = false;
            }

            updateTable();
        }

        if (tableCell.textContent == "Total Games")
        {
            collapseList();

            if (totalGamesSorted == false)
            {
                tableElements.sort(function(a, b) {
                    if (a.value["TotalGames"] < b.value["TotalGames"])
                        return 1;
                    if (a.value["TotalGames"] > b.value["TotalGames"])
                        return -1;
                    return 0;
                });
                totalGamesSorted = true;
            }
            else
            {
                tableElements.sort(function(a, b) {
                    if (a.value["TotalGames"] < b.value["TotalGames"])
                        return -1;
                    if (a.value["TotalGames"] > b.value["TotalGames"])
                        return 1;
                    return 0;
                });
                totalGamesSorted = false;
            }

            updateTable();
        }
    }
}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {

// ******* PART III *******

    var tr = d3.select("tbody").selectAll("tr")
        .data(tableElements);

    tr.exit()
        .remove();

    tr = tr.enter()
        .append("tr")
        .on("mouseover", function (d) {
            updateTree(d);
        })
        .merge(tr);

    var td = tr.selectAll("td")
        .data(function (d, i) {
            return [{type: d.value["type"], vis: 'text', value: d.key},
                {type: d.value["type"], vis: 'goals', value: [d.value[goalsMadeHeader], d.value[goalsConcededHeader], d.value["Delta Goals"]]},
                {type: d.value["type"], vis: 'text', value: d.value.Result},
                {type: d.value["type"], vis: 'bar', value: d.value["Wins"]},
                {type: d.value["type"], vis: 'bar', value: d.value["Losses"]},
                {type: d.value["type"], vis: 'bar', value: d.value["TotalGames"]}];
        });

    td.exit()
        .remove();

    var tdEnter = td.enter()
        .append("td");

    td = tdEnter.merge(td);

    // Create the bars for Wins, Losses, Total Games
    var newTDS = tdEnter.filter(function (d) {return d.vis == "bar";}); // && d.type == "aggregate";});

    newTDS = newTDS.append("svg")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .append("g")
        .append("rect");

    td = td.merge(newTDS);

    newTDS = td.select("g")
        .append("text");

    td = td.merge(newTDS);

    var tds = td.filter(function (d) {return d.vis == "bar";}); //&& d.type == "aggregate";});

    tds.select("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", function (d) {
            if (d.value == null)
                return 0;
            else
                return gameScale(d.value);
        })
        .attr("height", barHeight)
        .attr("fill", function (d) {
            return aggregateColorScale(Math.abs(d.value));
        });

    // Create the labels for the bars
    tds.select("text")
        .attr("x", function (d) {
            if (d.value == null)
                return 0;
            else
                return gameScale((d.value - 1.25));
        })
        .attr("y", cellHeight / 2)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.value;
        })
        .attr("class", "label");

    // Create the Goals chart
    var newTDS = tdEnter.filter(function (d) {return d.vis == "goals";}); //&& d.type == "aggregate";});

    newTDS = newTDS.append("svg")
        .attr("width", cellWidth * 2)
        .attr("height", cellHeight)
        .append("g")
        .append("rect");

    td = td.merge(newTDS);

    newTDS = td.select("g")
        .append("circle")
        .attr("id", "firstCircle");

    newTDS = td.select("g")
        .append("circle")
        .attr("id", "secondCircle");

    td = td.merge(newTDS);

    var tds = td.filter(function (d) {return d.vis == "goals" && d.type == "aggregate";});

    tds.select("rect")
        .attr("x", function (d) {
            return Math.min(goalScale(d.value[0]), goalScale(d.value[1]));
        })
        .attr("y", cellHeight/2 - 5)
        .attr("width", function (d) {
            return Math.max((goalScale(d.value[0]) - goalScale(d.value[1])), (goalScale(d.value[1]) - goalScale(d.value[0])));
        })
        .attr("height", cellHeight/2)
        .attr("class", function (d) {
            if (d.value[2] > 0)
                return "goalBarBlue";
            else
                return "goalBarRed";
        });

    tds.select("circle#firstCircle")
        .attr("cx", function (d) {
            return goalScale(d.value[0]);
        })
        .attr("cy", cellHeight / 2)
        .attr("class", function (d) {
            if (d.value[2] == 0)
                return "goalCircleNeutral";
            else
                return "goalCircleWinner";
        });

    tds.select("circle#secondCircle")
        .attr("cx", function (d) {
            return goalScale(d.value[1]);
        })
        .attr("cy", cellHeight / 2)
        .attr("class", function (d) {
            if (d.value[2] == 0)
                return "goalCircleNeutral";
            else
                return "goalCircleLooser";
        });

    var tds = td.filter(function (d) {return d.vis == "goals" && d.type == "game";});

    tds.select("rect")
        .attr("x", function (d) {
            return Math.min(goalScale(d.value[0]), goalScale(d.value[1]));
        })
        .attr("y", cellHeight/2 - 3)
        .attr("width", function (d) {
            return Math.max((goalScale(d.value[0]) - goalScale(d.value[1])), (goalScale(d.value[1]) - goalScale(d.value[0])));
        })
        .attr("height", cellHeight/2/2)
        .attr("class", function (d) {
            if ((d.value[0] - d.value[1]) > 0)
                return "goalBarBlue";
            else
                return "goalBarRed";
        });

    tds.select("circle#firstCircle")
        .attr("cx", function (d) {
            return goalScale(d.value[0]);
        })
        .attr("cy", cellHeight / 2)
        .attr("class", function (d) {
            if ((d.value[0] - d.value[1]) == 0)
                return "goalRingNeutral";
            else
                return "goalRingWinner";
        });

    tds.select("circle#secondCircle")
        .attr("cx", function (d) {
            return goalScale(d.value[1]);
        })
        .attr("cy", cellHeight / 2)
        .attr("class", function (d) {
            if ((d.value[1] - d.value[0]) == 0)
                return "goalRingNeutral";
            else
                return "goalRingLooser";
        });

    tds = td.filter(function (d) {return d.vis == "text" && d.type== "aggregate";})
        .html(function (d) {
            if (typeof d.value === 'string' || d.value instanceof String)
                return "<span class=\"teamNames\" onclick=\"updateList(this.parentElement.parentElement.rowIndex - 2)\">" + d.value + "</span>";
            else
                return d.value["label"];
        });

    tds = td.filter(function (d) {return d.vis == "text" && d.type== "game";})
        .html(function (d) {
            if (typeof d.value === 'string' || d.value instanceof String)
                return "<span class=\"gameNames\">" + d.value + "</span>";
            else
                return d.value["label"];
        });
}


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* PART IV *******

    for (var i = tableElements.length-1; i > 0; i--)
    {
        if(tableElements[i].value["type"] == "game")
        {
            tableElements.splice(i, 1);
        }
    }
}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* PART IV *******

    if (tableElements[i+1] == null || tableElements[i+1].value["type"] == "aggregate")
    {
        var insertRowNum = i;
        var loopTimes = teamData[i].value["games"].length;

        for (var j = 0; j < loopTimes; j++)
        {
            var toBeAdded = Object.assign({}, teamData[i].value["games"][j]);
            toBeAdded.key = "x" + toBeAdded.key;
            tableElements.splice(insertRowNum + 1, 0, toBeAdded);
            insertRowNum++;
        }
    }
    else
    {
        var removeRowNum = i+1;
        var loopTimes = teamData[i].value["games"].length;

        for (j = 0; j < loopTimes; j++)
        {
            tableElements.splice(removeRowNum, 1);
        }
    }

    updateTable();
}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* PART VI *******

    var root = d3.stratify()
        .id(function(d) { return d.id; })
        .parentId(function(d) {
            if (treeData[d.ParentGame] == null)
                return '';
            else
                return treeData[d.ParentGame].id; })
        (treeData);

    var svg = d3.select("g#tree")
        .attr("transform", "translate(75,0)");

    var tree = d3.tree()
        .size([675, 300]);

    tree(root);

    var link = svg.selectAll(".link")
        .data(root.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
        });

    var node = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function (d) {
            if (d.parent == null || d.data.Team == d.parent.data.Team)
                return "winner";
            else
                return "node";
        })
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    node.append("circle")
        .attr("r", 5);

    node.append("text")
        .attr("dy", 3)
        .attr("x", function (d) {
            return d.children ? -8 : 8;
        })
        .attr("class", "node")
        .style("text-anchor", function (d) {
            return d.children ? "end" : "start";
        })
        .text(function (d) {
            return (d.data.Team);
        });
}

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* PART VII *******

    clearTree();

    if (row.key.substr(0,1) == "x")
    {
        var pathElements = d3.selectAll("g#tree path");

        var selectedPaths = pathElements.filter(function (d) {
            return (d.data.Team == row.key.substr(1, row.key.length) && d.data.Opponent == row.value.Opponent)
                || (d.data.Team == row.value.Opponent && d.data.Opponent == row.key.substr(1, row.key.length));
        });

        selectedPaths.classed("selected", true);

        var textElements = d3.selectAll("g#tree text");

        var selectedText = textElements.filter(function (d) {
            return (d.data.Team == row.key.substr(1, row.key.length) && d.data.Opponent == row.value.Opponent)
                || (d.data.Team == row.value.Opponent && d.data.Opponent == row.key.substr(1, row.key.length));
        });

        selectedText.classed("selectedLabel", true);

    }
    else
    {
        var pathElements = d3.selectAll("g#tree path");

        var selectedPaths = pathElements.filter(function (d) {return d.data.Team == row.key && d.parent.data.Team == row.key;});

        selectedPaths.classed("selected", true);

        var textElements = d3.selectAll("g#tree text");

        var selectedText = textElements.filter(function (d) {return d.data.Team == row.key;});

        selectedText.classed("selectedLabel", true);
    }
}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* PART VII *******
    var paths = d3.selectAll("g#tree path")
        .classed("selected", false);

    var text = d3.selectAll("g#tree text")
        .classed("selectedLabel", false);
}

