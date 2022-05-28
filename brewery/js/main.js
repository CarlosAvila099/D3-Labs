/*
*    main.js
*/

var margin = { left: 100, right: 10, top: 10, bottom: 100 }
var w = 600;
var h = 400;

var svg = d3.select("#chart-area").append("svg")
	.attr("width", w + margin.right + margin.left)
	.attr("height", h + margin.top + margin.bottom);

var group = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("data/revenues.json").then((data)=> {
	data.forEach((d)=>{
		d.revenue = +d.revenue;
	});

    revenue = d3.max(data, (d)=>{return d.revenue});
    months = data.map((d)=>{return d.month});

    var x = d3.scaleBand()
	    .domain(months)
	    .range([0,400])
	    .paddingInner(.3)
	    .paddingOuter(.3);

    var y = d3.scaleLinear()
	    .domain([revenue, 0])
	    .range([0, 400]);

	var months = group.selectAll("rect")
        .data(data);

    months.enter()
        .append("rect")
            .attr("x", (d)=>{return x(d.month);})
            .attr("y", (d)=>{return y(d.revenue);})
            .attr("height", (d)=>{return  h - y(d.revenue);})
            .attr("width", x.bandwidth())
            .attr("fill", "yellow");

    var bottom = d3.axisBottom(x);
    group.append("g")
        .attr("class", "bottom axis")
        .attr("transform", "translate(0, " + h + ")")
        .call(bottom)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
    	.attr("transform", "rotate(-20)");

    var left = d3.axisLeft(y)
		.ticks(11)
		.tickFormat((d)=>{return "$" + d/1000 + "K";});

    group.append("g")
        .attr("class", "left axis")
        .call(left);

    group.append("text")
        .attr("class", "x axis-label")
        .attr("x", (w / 2))
        .attr("y", h + 140)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(-120, -50)")
        .text("Month");

    group.append("text")
			.attr("class", "y axis-label")
			.attr("x", - (h / 2))
			.attr("y", -60)
			.attr("font-size", "20px")
			.attr("text-anchor", "middle")
			.attr("transform", "rotate(-90)")
			.text("Revenue (dlls.)");
}).catch((error)=>{
    console.log(error);
});