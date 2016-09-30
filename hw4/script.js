/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;


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
//    // ******* TODO: PART I *******
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

// ******* TODO: PART II *******
    var test = "Goals Made";
    // console.log(teamData[0].value["Goals Made"]);
    // console.log(teamData.value["Goals Made"]);
    // console.log(teamData);
    //
    //
    // console.log(maxGoals);

    //    .domain([0, d3.max(teamData,function (d) {return d.value[goalsMadeHeader];})])
    //console.log(teamData.value[goalsMadeHeader]);
    // console.log(d3.max(teamData, function (d) {return d.value[goalsMadeHeader]}));
    // console.log(d3.max(teamData, function (d) {return d.value[goalsConcededHeader]}));
    //
    // var absoluteMax = Math.max(d3.max(teamData, function (d) {return d.value[goalsMadeHeader]}), d3.max(teamData, function (d) {return d.value[goalsConcededHeader]}));
    // console.log(absoluteMax);

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






// ******* TODO: PART V *******

}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {

// ******* TODO: PART III *******

    // var tr = d3.select("tbody").selectAll("tr")
    //     .data(tableElements)
    //     .enter()
    //     .append("tr");
    //
    // tr.exit()
    //     .remove();
    //
    // var td = tr.selectAll("td")
    //     .data(function (d, i) {
    //         return [{type: d.value["type"], vis: 'text', value: d.key},
    //             {type: d.value["type"], vis: 'goals', value: [d.value[goalsMadeHeader], d.value[goalsConcededHeader], d.value["Delta Goals"]]},
    //             {type: d.value["type"], vis: 'text', value: d.value.Result},
    //             {type: d.value["type"], vis: 'bar', value: d.value["Wins"]},
    //             {type: d.value["type"], vis: 'bar', value: d.value["Losses"]},
    //             {type: d.value["type"], vis: 'bar', value: d.value["TotalGames"]}];
    //     })
    //     .enter()
    //     .append("td");
    //
    // td.exit()
    //     .remove();

    var tr = d3.select("tbody").selectAll("tr")
        .data(tableElements);

    tr.exit()
        .remove();

    tr = tr.enter()
        .append("tr")
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

    // td = td.enter()
    //     .append("td")
    //     .merge(td);


    // Create the bars for Wins, Losses, Total Games
    // var tds = td.filter(function (d) {return d.vis == "bar";}); //&& d.type == "aggregate";});
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

    var tds = td.filter(function (d) {return d.vis == "bar" && d.type == "aggregate";});

    // tds = tds.append("svg")
    //     .attr("width", cellWidth)
    //     .attr("height", cellHeight)
    //     .append("g")
    //     .append("rect");

    // tds = tds.enter()
    //     .append("svg")
    //     .attr("width", cellWidth)
    //     .attr("height", cellHeight)
    //     .append("g")
    //     .merge(tds);


    tds.select("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", function (d) {
            return gameScale(d.value);
        })
        .attr("height", barHeight)
        .attr("fill", function (d) {
            return aggregateColorScale(Math.abs(d.value));
        });

    // Create the labels for the bars
    // tds.select("g")
    //     .append("text")
    tds.select("text")
        .attr("x", function (d) {
            return gameScale((d.value - 1.25));
        })
        .attr("y", cellHeight / 2)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.value;
        })
        .attr("class", "label");

    var tds = td.filter(function (d) {return d.vis == "bar" && d.type == "game";});

    tds.select("rect")
        .remove();

    tds.select("text")
        .remove();


























    // tds.exit()
    //     .remove();

    // tds = tds.append("svg")
    //     .attr("width", cellWidth)
    //     .attr("height", cellHeight)
    //     .append("g");
    //
    // tds.append("rect")
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr("width", function (d) {
    //         return gameScale(d.value);
    //     })
    //     .attr("height", barHeight)
    //     .attr("fill", function (d) {
    //         return aggregateColorScale(Math.abs(d.value));
    //     });
    //
    // // Create the labels for the bars
    // tds.append("text")
    //     .attr("x", function (d) {
    //         return gameScale((d.value - 1.25));
    //     })
    //     .attr("y", cellHeight / 2)
    //     .attr("dy", ".35em")
    //     .text(function (d) {
    //         return d.value;
    //     })
    //     .attr("class", "label");


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

    // td = td.merge(newTDS);
    //
    // newTDS = td.select("g")
    //     .append("circle");
    //
    // td = td.merge(newTDS);

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
            // console.log(d.value);
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
        // .append("circle")
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
            // console.log(d.value);
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
    // .append("circle")
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
             // console.log(d);
            if (typeof d.value === 'string' || d.value instanceof String)
                return "<span class=\"teamNames\" onclick=\"updateList(this.parentElement.parentElement.rowIndex - 2)\">" + d.value + "</span>";
                // return "<span class=\"teamNames\" onclick=\"updateList()\">" + d.value + "</span>";
                // return "<span class=\"teamNames\" onclick=\"updateList(" + d + ")\">" + d.value + "</span>";
            else
                return d.value["label"];
        });

    tds = td.filter(function (d) {return d.vis == "text" && d.type== "game";})
        .html(function (d) {
            // console.log(d);
            if (typeof d.value === 'string' || d.value instanceof String)
                return "<span class=\"gameNames\">" + d.value + "</span>";
                //return "<span class=\"teamNames\" onclick=\"updateList(this.parentElement.parentElement.rowIndex - 2)\">" + d.value + "</span>";
            // return "<span class=\"teamNames\" onclick=\"updateList()\">" + d.value + "</span>";
            // return "<span class=\"teamNames\" onclick=\"updateList(" + d + ")\">" + d.value + "</span>";
            else
                return d.value["label"];
        });


};


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******

    for (var i = tableElements.length-1; i > 0; i--)
    {
        console.log(tableElements.length);
        // if (tableElements[i])
        // console.log(tableElements[i].value.type);
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

    // ******* TODO: PART IV *******
    // console.log("Made it here:");
    // console.log(i);
    // console.log(tableElements);
    // console.log(teamData[i].value["games"].length);

    // Case when next row is an aggregate, expand the list

    if (tableElements[i+1] == null || tableElements[i+1].value["type"] == "aggregate")
    {
        // console.log("Made it here!!!!!");
        var insertRowNum = i;
        var loopTimes = teamData[i].value["games"].length;

        for (var j = 0; j < loopTimes; j++)
        {
            // var toBeAdded = teamData[i].value["games"][j];
            var toBeAdded = Object.assign({}, teamData[i].value["games"][j]);
            // console.log(toBeAdded);
            toBeAdded.key = "x" + toBeAdded.key;
            // console.log(toBeAdded);
            tableElements.splice(insertRowNum + 1, 0, toBeAdded);
            insertRowNum++;
        }
    }

    else
    {
        var removeRowNum = i+1;
        var loopTimes = teamData[i].value["games"].length;

        for (var j = 0; j < loopTimes; j++)
        {
            // var toBeAdded = teamData[i].value["games"][j];
            // toBeAdded.key = "x" + toBeAdded.key;
            // console.log(toBeAdded);
            tableElements.splice(removeRowNum, 1);
            // insertRowNum++;
        }
        // console.log(teamData);
    }


    // console.log(teamData[i].value["games"].length);
    //
    // console.log(teamData[i].value["games"][2]);

    //tableElements.splice(i,howmany,item1,.....,itemX)
    // console.log(tableElements);
    updateTable();
    // console.log(tableElements);
}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******
    //  var root = d3.stratify()
    //     .id(function (d) { return d.id;})
    //     .parentId(function (d) {console.log(d.ParentGame); return d.ParentGame; })
    //     .data(treeData);

    // var root = d3.stratify()
    //     .id(function(d) { return d.id; })
    //     .parentId(function(d) {console.log(d.ParentGame); return d.ParentGame; })
    //     (treeData);

};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******


}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******


}



