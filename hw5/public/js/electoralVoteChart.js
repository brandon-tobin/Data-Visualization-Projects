
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param shiftChart an instance of the ShiftChart class
 */
function ElectoralVoteChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    // ******* TODO: PART II *******

    var republican = [];
    var democrat = [];
    var independent = [];

    //Group the states based on the winning party for the state;
    for (var i = 0; i < electionResult.length; i++)
    {
        if (electionResult[i].State_Winner == "R")
            republican.push(electionResult[i]);
        else if (electionResult[i].State_Winner == "D")
            democrat.push(electionResult[i]);
        else
            independent.push(electionResult[i]);
    }

    //then sort them based on the margin of victory
    republican.sort(function(a, b){return a.RD_Difference - b.RD_Difference});
    democrat.sort(function(a, b){return a.RD_Difference - b.RD_Difference});
    independent.sort(function(a, b){return a.RD_Difference - b.RD_Difference});


    var totaldata = independent.concat(democrat, republican);

    // console.log(totaldata);

    var stackData = [];

    for (var j = 0; j < totaldata.length; j++)
    {
        stackData.push({x: j, y: totaldata[j].Total_EV});
    }

    var stack = d3.stack();
    stack(stackData);

    var xScale = d3.scaleBand()
        .domain(d3.range(stackData.length))
        .rangeRound([0, self.svgWidth], 0.05);

    var yScale = d3.scaleLinear()
        .domain([0,
            d3.max(stackData, function(d) {
                return d3.max(d, function(d) {
                    // console.log(d.y0);
                    return d.y0 + d.y;
                });
            })
        ])
        .range([0, self.svgHeight]);

    var groups = self.svg.selectAll("g")
        .data(stackData)
        .enter()
        .append("g")
        .style("fill", function(d, i) {
            return colorScale(i);
        });

    // Add a rect for each data value
    var rects = groups.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            // console.log("Made it here");
            return yScale(d.y0);
        })
        .attr("height", function(d) {
            return yScale(d.y);
        })
        .attr("width", xScale.bandwidth());



    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.


    // var min = d3.min(totaldata, function (d) {return d.Total_EV;});
    // var max = d3.max(totaldata, function (d) {return d.Total_EV;});
    //
    //


    // var xScale = d3.scaleLinear()
    //     .domain([min, max])
    //     .range([self.margin.left + self.margin.right, self.svgBounds.width]);

    // var yScale = d3.scaleLinear()
    //     .domain([0, totaldata.length])
    //     .range([self.margin.left + self.margin.right, self.svgBounds.width]);

    // var rects = self.svg.selectAll("rect").data(totaldata);
    //
    // rects = rects.enter()
    //     .append("rect")
    //     .attr("class", "stacked")
    //     .merge(rects);
    //
    // rects.attr("x", function(d, i) {
    //     return xScale(d.Total_EV);
    // })
    //     .attr("y", 50)
    //     // .attr("y", function(d) {
    //     //     return xScale(d.Total_EV);
    //     // })
    //     .attr("width", function (d) {
    //         return xScale(d.Total_EV);
    //     })
    //     .attr("height", 20)
    //     .attr("fill", function (d) {
    //         if (d.RD_Difference == 0)
    //             return "#45AD6A";
    //         else
    //             return colorScale(d.RD_Difference);
    //     })
    //     .classed("electoralVotes", true);




    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

};
