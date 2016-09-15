// Global var for FIFA world cup data
var allWorldCupData;


/**
 * Render and update the bar chart based on the selection of the data type in the drop-down box
 *
 * @param selectedDimension a string specifying which dimension to render in the bar chart
 */
function updateBarChart(selectedDimension) {

    var svgBounds = d3.select("#barChart").node().getBoundingClientRect(),
        xAxisWidth = 100,
        yAxisHeight = 70;

    // ******* TODO: PART I *******

    var yAxisPad = 75;

    var min = d3.min(allWorldCupData, function (d) {return d[selectedDimension];});
    var max = d3.max(allWorldCupData, function (d) {return d[selectedDimension];});
    var width = parseInt(d3.select("svg#barChart").style("width"), 10);
    var height = parseInt(d3.select("svg#barChart").style("height"), 10);

    // Create the x and y scales; make
    // sure to leave room for the axes
    var xScale = d3.scaleLinear()
        .domain([0, allWorldCupData.length])
        .range([yAxisPad, width])
        .nice();

    var yScale = d3.scaleLinear()
        .domain([0, max])
        .range([0, height - xAxisWidth])
        .nice();

    // Create colorScale
    var colorScale = d3.scaleLinear()
        .domain([0, min, max])
        .range(["darkred", "steelblue", "midnightblue"]);

    // Create the axes (hint: use #xAxis and #yAxis)
    var xAxisScale = d3.scaleBand()
        .range([yAxisPad, width - 1]);

    xAxisScale.domain(allWorldCupData.map(function (d) {
        return d.year;
    }));

    var yAxisScale = d3.scaleLinear()
        .domain([0, max])
        .range([height - 50, 0]);

    var svg = d3.select("g#xAxis");

    var xAxis = d3.axisBottom();
    xAxis.scale(xAxisScale);

    svg.attr("transform", "translate(" + 0 + "," + (height - 50) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", -5)
        .attr("x", 9)
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start")
        .merge(svg);

    var svg = d3.select("g#yAxis");

    var yAxis = d3.axisLeft();
    yAxis.scale(yAxisScale);

    svg.attr("transform", "translate(" + (yAxisPad - 2) + "," + 0 +")")
        .call(yAxis);

    // Create the bars (hint: use #bars)
    var svg = d3.select("g#bars");

    var bars = svg.selectAll("rect").data(allWorldCupData);

    bars.exit()
        .remove();

    bars = bars.enter()
        .append("rect")
        .merge(bars);

    bars.attr("x", function (d, i) {
            return xScale(i);
        })
        .attr("y", 50   )
        .attr("width", 20)
        .attr("height", function (d) {
            return yScale(d[selectedDimension]);
        })
        .attr("transform", "translate(0, 400) scale(1, -1)")
        .style("fill", function (d) {
            return colorScale(d[selectedDimension]);
        });



    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.

    // TODO: Need to uncolor Red when new bar is selected!!!!

    d3.selectAll("rect")
        .on("click", function (d) {
            d3.select(this)
                .style("fill", "Red");
    });

    // Call the necessary update functions for when a user clicks on a bar.
    // Note: think about what you want to update when a different bar is selected.


}

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {

    // ******* TODO: PART I *******
    //Changed the selected data when a user selects a different
    // menu item from the drop down.

    var selection = document.getElementById('dataset').value;

    updateBarChart(selection);


}

/**
 * Update the info panel to show info about the currently selected world cup
 *
 * @param oneWorldCup the currently selected world cup
 */
function updateInfo(oneWorldCup) {

    // ******* TODO: PART III *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year

    // Hint: For the list of teams, you can create an list element for each team.
    // Hint: Select the appropriate ids to update the text content.


}

/**
 * Renders and updated the map and the highlights on top of it
 *
 * @param the json data with the shape of all countries
 */
function drawMap(world) {

    //(note that projection is global!
    // updateMap() will need it to add the winner/runner_up markers.)

    projection = d3.geoConicConformal().scale(200).translate([500, 450]);

    // ******* TODO: PART IV *******

    // Draw the background (country outlines; hint: use #map)
    // Make sure and add gridlines to the map

    // Hint: assign an id to each country path to make it easier to select afterwards
    // we suggest you use the variable in the data element's .id field to set the id

    // Make sure and give your paths the appropriate class (see the .css selectors at
    // the top of the provided html file)


}

/**
 * Clears the map
 */
function clearMap() {

    // ******* TODO: PART V*******
    //Clear the map of any colors/markers; You can do this with inline styling or by
    //defining a class style in styles.css

    //Hint: If you followed our suggestion of using classes to style
    //the colors and markers for hosts/teams/winners, you can use
    //d3 selection and .classed to set these classes on and off here.

}


/**
 * Update Map with info for a specific FIFA World Cup
 * @param the data for one specific world cup
 */
function updateMap(worldcupData) {

    //Clear any previous selections;
    clearMap();

    // ******* TODO: PART V *******

    // Add a marker for the winner and runner up to the map.

    //Hint: remember we have a conveniently labeled class called .winner
    // as well as a .silver. These have styling attributes for the two
    //markers.


    //Select the host country and change it's color accordingly.

    //Iterate through all participating teams and change their color as well.

    //We strongly suggest using classes to style the selected countries.



}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

//Load in json data to make map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, csv) {

    csv.forEach(function (d) {

        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        //Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;

    });

    // Store csv data in a global variable
    allWorldCupData = csv;

    allWorldCupData = allWorldCupData.reverse();
    // Draw the Bar chart for the first time
    updateBarChart('attendance');
});
