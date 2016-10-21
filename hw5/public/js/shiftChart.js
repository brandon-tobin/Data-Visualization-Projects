
/**
 * Constructor for the ShiftChart
 */
function ShiftChart(){
    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart;
 */
ShiftChart.prototype.init = function(){
    var self = this;
    self.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
};

/**
 * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
 *
 * @param selectedStates data corresponding to the states selected on brush
 */
ShiftChart.prototype.update = function(selectedStates){
    var self = this;

    // ******* PART V *******
    //Display the names of selected states in a list

    var statesArray = selectedStates;

    var states = "<ul>";

    for (var i = 0; i < statesArray.length; i++)
        states += "<li>" + statesArray[i] + "</li>";

    states += "</ul>";

    document.getElementById("stateList").innerHTML = states;
};
