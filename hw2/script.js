/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)

function staircase() {

    var bars = document.getElementById("bars-a").children;
    var widthValues = [];

    for (i of bars)
         widthValues.push(parseInt(i.getAttribute("width")));

    widthValues.sort(function(a, b){return a - b});

    var i = 0;

    for (j of bars)
    {
        j.setAttribute("width", widthValues[i]);
        i++;
    }
}

function update(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()
        data.forEach(function (d) {
            d.a = parseInt(d.a);
            d.b = parseFloat(d.b);
        });
    }

    // Set up the scales
    var aScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 150]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 150]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // Select and update the 'a' bar chart bars
    var svg = d3.selectAll("#bars-a");

    var bars = svg.selectAll("rect").data(data);

    bars.exit()
        .transition()
        .duration(1000)
        .attr("opacity", 0)
        .remove();

    bars = bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(3000)
        .attr("opacity", 1);

    bars.attr("x", 0)
        .attr("y", function (d, i) {
            return iScale(i) + 10;
        })
        .attr("width", function (d) {
            var test = aScale(d.a);
            return aScale(d.a);
        })
        .attr("height", 10)
        .style("fill", "steelblue");


    // Select and update the 'b' bar chart bars
    var svg = d3.selectAll("#bars-b");

    var bars = svg.selectAll("rect").data(data);

    bars.exit()
        .transition()
        .duration(1000)
        .attr("opacity", 0)
        .remove();

    bars = bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(3000)
        .attr("opacity", 1);

    bars.attr("x", 0)
        .attr("y", function (d, i) {
            return iScale(i) + 10;
        })
        .attr("width", function (d) {
            return bScale(d.b);
        })
        .attr("height", 10)
        .style("fill", "steelblue")
        .attr("opacity", 1);

    // Select and update the 'a' line chart path using this line generator
    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScale(d.a);
        });

    var svg = d3.selectAll("svg#line-a");

    svg.selectAll("path")
        .data(data)
        .attr("d", aLineGenerator(data));

    // TODO: Select and update the 'b' line chart path (create your own generator)
    var bLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return bScale(d.b);
        });

    var svg = d3.selectAll("svg#line-b");

    svg.selectAll("path")
        .data(data)
        .attr("d", bLineGenerator(data));

    // Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return aScale(d.a);
        });

    var svg = d3.selectAll("svg#area-a");

    svg.selectAll("path")
        .data(data)
        .attr("d", aAreaGenerator(data));

    // Select and update the 'b' area chart path (create your own generator)
    var bAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return bScale(d.b);
        });

    var svg = d3.selectAll("svg#area-b");

    svg.selectAll("path")
        .data(data)
        .attr("d", bAreaGenerator(data));

    // TODO: Select and update the scatterplot points
    var svg = d3.selectAll("svg#scatter");

    var circles = svg.selectAll("circle").data(data);

    circles.exit()
        .transition()
        .duration(1000)
        .attr("opacity", 0)
        .remove();

    circles = circles.enter()
        .append("circle")
        .merge(circles);

    circles
        .transition()
        .duration(3000)
        .attr("opacity", 1);

    circles.attr("cx", function (d) {
            return aScale(d.a);
        })
        .attr("cy", function (d) {
            return bScale(d.b);
        })
        .attr("r", 5);


    // PART IV

    // Change bar color on hover
    d3.selectAll("rect")
        .on("mouseover", function (d) {
            d3.select(this)
                .style("fill", "Red");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("fill", "steelblue");
        });

    // Scatter Plot Click / Hover
    var coordView = d3.select("body").append("div")
        .attr("class", "coordView")
        .style("opacity", 0);

    svg.selectAll("circle")
        .on("click", function(d) {
            var x = aScale(d.a);
            var y = bScale(d.b);
            console.log("You Clicked on Scatter Point: " + x + "," + y);
        })
        .on("mouseover", function (d) {
            coordView.transition()
                .style("opacity", 1);
            coordView.html("Mouse is Over Scatter Point: <br /> (" + aScale(d.a) + ", " + bScale(d.b) + ")")
                .style("left", (d3.event.pageX) + 10 + "px")
                .style("top", (d3.event.pageY) + 10 + "px");
        })
        .on("mouseout", function () {
            coordView.transition()
                .duration(400)
                .style("opacity", 0);
        });
}

function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else{
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            var subset = [];
            data.forEach(function (d) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            });
            update(error, subset);
        });
    }
    else{
        changeData();
    }
}