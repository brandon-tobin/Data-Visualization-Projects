
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param shiftChart an instance of the ShiftChart class
 */
function ElectoralVoteChart(shiftChart){

    var self = this;
    self.init();

    self.shiftChart = shiftChart;
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

    // ******* PART II *******

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

    var stackData = [];

    var evCount = 0;

    stackData.push({x: 0, y: totaldata[0].Total_EV, y0: 0, color: totaldata[0].RD_Difference, state: totaldata[0].State, stateWinner: totaldata[0].State_Winner});

    for (var j = 1; j < totaldata.length; j++)
    {
        stackData.push({x: j, y: totaldata[j].Total_EV, y0: totaldata[j-1].Total_EV + evCount, color: totaldata[j].RD_Difference, state: totaldata[j].State, stateWinner: totaldata[j].State_Winner});
        evCount += totaldata[j-1].Total_EV;
    }

    evCount += totaldata[totaldata.length-1].Total_EV;

    var xScale = d3.scaleLinear()
        .domain([0, evCount])
        .range([0, self.svgWidth]);

    var groups = self.svg.selectAll("g").data(stackData);

    var groupsEnter = groups.enter().append("g");
    groupsEnter.append("rect");

    groups = groups.merge(groupsEnter);

    groups.select("rect")
        .attr("x", function(d) {
            return xScale(d.y0);
        })
        .attr("y", self.svgHeight/2)
        .attr("height", 30)
        .attr("width", function (d) {
            return xScale(d.y);
        })
        .attr("id", function (d) {
            return d.state;
        })
        .attr("fill", function (d) {
            if (d.stateWinner == "I")
                return "#45AD6A";
            else
                return colorScale(d.color);
        })
        .classed("electoralVotes", true);


    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary
    var republicanVoteCount = parseInt(electionResult[0].R_EV_Total);
    var democratVoteCount = parseInt(electionResult[0].D_EV_Total);
    var independentVoteCount = parseInt(electionResult[0].I_EV_Total);

    var data = [];

    if (!isNaN(independentVoteCount))
    {
        data = [{x: 0, y: independentVoteCount, p: "I"},
            {x: independentVoteCount, y: democratVoteCount, p: "D"},
            {x: independentVoteCount + democratVoteCount, y: republicanVoteCount, p: "R"}];
    }
    else
    {
        data = [{x: 0, y: democratVoteCount, p: "D"},
            {x: democratVoteCount, y: republicanVoteCount, p: "R"}];
    }

    var texts = self.svg.selectAll("text#voteCount").data(data);

    texts.exit().remove();

    var textsEnter = texts.enter().append("text");

    texts = texts.merge(textsEnter);

    texts.attr("x", function (d) {
        if (d.p == "I")
            return 0;
        else if (d.p == "D")
            if (data[0].p == "I")
                return xScale(data[0].y);
            else
                return 0;
        else
            return xScale(evCount);
    })
        .attr("y", self.svgHeight/2 - 15)
        .text(function (d) {
            return d.y;
        })
        .attr("id", "voteCount")
        .attr("class", function(d) { return self.chooseClass(d.p); })
        .classed("electoralVoteText", true);

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    if (!document.getElementById("middleBar1")) {
        self.svg.append("rect")
            .attr("x", self.svgWidth / 2)
            .attr("y", self.svgHeight / 2 - 5)
            .attr("width", 1)
            .attr("height", 40)
            .attr("id", "middleBar1")
            .classed("middlePoint", true);
    }
    else {
        self.svg.select("#middleBar1").remove();

        self.svg.append("rect")
            .attr("x", self.svgWidth / 2)
            .attr("y", self.svgHeight / 2 - 5)
            .attr("width", 1)
            .attr("height", 40)
            .attr("id", "middleBar1")
            .classed("middlePoint", true);
    }

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    if (!document.getElementById("EVText")) {
        self.svg.append("text")
            .attr("x", self.svgWidth / 2 - 25)
            .attr("y", self.svgHeight / 2 - 30)
            .attr("id", "EVText")
            .text("Electoral Vote (270 needed to win)")
            .classed("electoralVotesNote", true);
    }
    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

    var brush = d3.brushX()
        .extent([[0, self.svgHeight/2],[self.svgWidth, self.svgHeight/2 + 30]])
        .on("end", brushed);

    function brushed() {
        var selection = d3.event.selection;

        var states = [];

        var rects = self.svg.selectAll("rect").filter(function (d) {
            if (d3.select(this).attr("x") >= selection[0] && d3.select(this).attr("x") <= selection[1])
            {
                if (d3.select(this).attr("id") != null)
                    states.push(d3.select(this).attr("id"));
                return true;
            }
            else
                return false;
        });

        self.shiftChart.update(states);
    }

    if (!document.getElementById("brush")) {
        self.svg.append("g")
            .attr("id", "brush")
            .attr("class", "brush")
            .call(brush);
    }
    else {
        self.svg.select("#brush").remove();

        self.svg.append("g")
            .attr("id", "brush")
            .attr("class", "brush")
            .call(brush);
    }
};
