/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
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
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
}

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult){
    var self = this;

    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            if (isNaN(parseFloat(electionResult[0].I_Votes_Total)))
            {
                tooltip_data = {
                    "result": [
                        {"nominee": electionResult[0].D_Nominee_prop,"votecount": electionResult[0].D_Votes_Total,"percentage": electionResult[0].D_PopularPercentage,"party":"D"} ,
                        {"nominee": electionResult[0].R_Nominee_prop,"votecount": electionResult[0].R_Votes_Total,"percentage": electionResult[0].R_PopularPercentage,"party":"R"}
                    ]};
            }
            else
            {
                tooltip_data = {
                    "result": [
                        {"nominee": electionResult[0].D_Nominee_prop,"votecount": electionResult[0].D_Votes_Total,"percentage": electionResult[0].D_PopularPercentage,"party":"D"} ,
                        {"nominee": electionResult[0].R_Nominee_prop,"votecount": electionResult[0].R_Votes_Total,"percentage": electionResult[0].R_PopularPercentage,"party":"R"} ,
                        {"nominee": electionResult[0].I_Nominee_prop,"votecount": electionResult[0].I_Votes_Total,"percentage": electionResult[0].I_PopularPercentage,"party":"I"}
                    ]};
            }

            return self.tooltip_render(tooltip_data);
        });


    // ******* PART III *******

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.
    var republicanPercentage = electionResult[0].R_PopularPercentage;
    var democratPercentage = electionResult[0].D_PopularPercentage;
    var independentPercentage = electionResult[0].I_PopularPercentage;

    var data = [];

    if (!isNaN(independentPercentage))
    {
        data = [{x: 0, y: independentPercentage, p: "I", nominee: electionResult[0].I_Nominee_prop},
            {x: independentPercentage, y: democratPercentage, p: "D", nominee: electionResult[0].D_Nominee_prop},
            {x: independentPercentage + democratPercentage, y: republicanPercentage, p: "R", nominee: electionResult[0].R_Nominee_prop}];
    }
    else
    {
        data = [{x: 0, y: democratPercentage, p: "D", nominee: electionResult[0].D_Nominee_prop},
            {x: democratPercentage, y: republicanPercentage, p: "R", nominee: electionResult[0].R_Nominee_prop}];
    }

    self.svg.call(tip);

    var xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, self.svgWidth])
        .nice();

    var groups = self.svg.selectAll("g").data(data);

    groups.exit().remove();

    var groupsEnter = groups.enter().append("g");
    groupsEnter.append("rect");

    groups = groups.merge(groupsEnter);

    groups.select("rect")
        .attr("x", function(d) {
            return xScale(d.x);
        })
        .attr("y", self.svgHeight/2)
        .attr("height", 30)
        .attr("width", function (d) {
            return xScale(d.y);
        })
        .attr("class", function(d) { return self.chooseClass(d.p); })
        .classed("votesPercentage", true)
        //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
        //then, vote percentage and number of votes won by each party.
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);


    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary
    var texts = self.svg.selectAll("text#percent").data(data);

    texts.exit().remove();

    var textsEnter = texts.enter().append("text");

    texts = texts.merge(textsEnter);

    texts.attr("x", function (d) {
        if (d.p == "I")
            return 0;
        else if (d.p == "D")
            if (data[0].p == "I")
                return xScale(data[0].y + d.y/4);
            else
                return 0;

        else
            return xScale(100);
    })
        .attr("y", self.svgHeight/2 - 15)
        .text(function (d) {
            return d.y + "%";
        })
        .attr("id", "percent")
        .attr("class", function(d) { return self.chooseClass(d.p); })
        .classed("votesPercentageText", true);

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    if (!document.getElementById("middleBar2"))
    {
        self.svg.append("rect")
            .attr("x", self.svgWidth/2)
            .attr("y", self.svgHeight/2 - 5)
            .attr("width", 1)
            .attr("height", 40)
            .attr("id", "middleBar2")
            .classed("middlePoint", true);
    }
    else
    {
        self.svg.select("#middleBar2").remove();

        self.svg.append("rect")
            .attr("x", self.svgWidth/2)
            .attr("y", self.svgHeight/2 - 5)
            .attr("width", 1)
            .attr("height", 40)
            .attr("id", "middleBar2")
            .classed("middlePoint", true);
    }


    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    if (!document.getElementById("PVText")) {

        self.svg.append("text")
            .attr("x", self.svgWidth / 2 - 25)
            .attr("y", self.svgHeight / 2 - 30)
            .attr("id", "PVText")
            .text("Popular Vote (50%)")
            .classed("votesPercentageNote", true);
    }
    else
    {
        self.svg.select("#PVText").remove();

        self.svg.append("text")
            .attr("x", self.svgWidth / 2 - 25)
            .attr("y", self.svgHeight / 2 - 30)
            .attr("id", "PVText")
            .text("Popular Vote (50%)")
            .classed("votesPercentageNote", true);
    }


    texts = self.svg.selectAll("text#nominee").data(data);

    texts.exit().remove();

    textsEnter = texts.enter().append("text");

    texts = texts.merge(textsEnter);

    texts.attr("x", function (d) {
        if (d.p == "I")
            return 20;
        else if (d.p == "D")
            if (data[0].p == "I")
                return xScale(data[0].y + d.y/2);
            else
                return xScale(d.y/8);
        else
            return xScale(100);
    })
        .attr("y", self.svgHeight/2 - 70)
        .text(function (d) {
            return d.nominee;
        })
        .attr("id", "nominee")
        .attr("class", function(d) { return self.chooseClass(d.p); })
        .classed("votesPercentageText", true);

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

};
