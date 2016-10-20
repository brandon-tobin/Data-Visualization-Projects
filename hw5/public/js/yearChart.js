/**
 * Constructor for the Year Chart
 *
 * @param electoralVoteChart instance of ElectoralVoteChart
 * @param tileChart instance of TileChart
 * @param votePercentageChart instance of Vote Percentage Chart
 * @param electionInfo instance of ElectionInfo
 * @param electionWinners data corresponding to the winning parties over mutiple election years
 */
function YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners) {
    var self = this;

    self.electoralVoteChart = electoralVoteChart;
    self.tileChart = tileChart;
    self.votePercentageChart = votePercentageChart;
    self.electionWinners = electionWinners;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
YearChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#year-chart").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    //creates svg element within the div
    self.svg = divyearChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
YearChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R") {
        return "yearChart republican";
    }
    else if (party == "D") {
        return "yearChart democrat";
    }
    else if (party == "I") {
        return "yearChart independent";
    }
}


/**
 * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
 */
YearChart.prototype.update = function(){
    var self = this;

    //Domain definition for global color scale
    var domain = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60 ];

    //Color range for global color scale
    var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];

    //Global colorScale to be used consistently by all the charts
    self.colorScale = d3.scaleQuantile()
        .domain(domain).range(range);

    // ******* PART I *******

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    var pathData = [ { "x": 0,   "y": 50},  { "x": self.svgWidth,  "y": 50}];

    var pathFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    self.svg.append("path")
        .attr("d", pathFunction(pathData))
        .classed("lineChart", true);

    var xScale = d3.scaleLinear()
        .domain([0, self.electionWinners.length])
        .range([self.margin.left + self.margin.right, self.svgBounds.width])
        .nice();

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

    var circles = self.svg.selectAll("circle").data(self.electionWinners);

    // var circleColorClass = "";
    // circles.exit()
    //     .transition()
    //     .duration(1000)
    //     .attr("opacity", 0)
    //     .remove();

    circles = circles.enter()
        .append("circle")
        .merge(circles);

    // circles
    //     .transition()
    //     .duration(3000)
    //     .attr("opacity", 1);

    circles.attr("cx", function (d, i) {
        return xScale(i);
    })
        .attr("cy", 50)
        .attr("r", 15)
        .attr("class", function(d) { return self.chooseClass(d.PARTY); })
        .classed("yearChart", true);


    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements

    var text = self.svg.selectAll("text")
        .data(self.electionWinners)
        .enter()
        .append("text");

    var textLabels = text
        .attr("x", function (d, i) {
            return xScale(i);
        })
        .attr("y", 95)
        .text( function (d) { return d.YEAR; })
        .classed("yeartext", true);



    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle

    self.svg.selectAll("circle")
        .on("mouseover", function (d) {
            d3.select(this)
                .classed("highlighted", true);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .classed("highlighted", false);
        })
        .on("click", function (d) {
            d3.select("circle#selected")
                .classed("selected", false)
                .attr("id", null);
            d3.select(this)
                .attr("id", "selected")
                .classed("selected", true);

            //Election information corresponding to that year should be loaded and passed to
            // the update methods of other visualizations
            d3.csv("data/Year_Timeline_" + d.YEAR + ".csv", function (error, electionResult) {
                electionResult.forEach(function(d) {
                    d.Total_EV = parseInt(d.Total_EV);
                    d.RD_Difference = parseFloat(d.RD_Difference);
                });
                self.electoralVoteChart.update(electionResult, self.colorScale);
                self.votePercentageChart.update(electionResult, self.colorScale);
                self.tileChart.update(electionResult, self.colorScale);
            });
        });




    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
};
