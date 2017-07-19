function draw(dataset){
    $('#my-svg').empty();
    var drawGem = function(dataset) {
            //Width and height and radius
            var w = 800;
            var h = 600;
            var rad = 10;
            //Initialize a default force layout, using the nodes and edges in   dataset
            var force = d3.layout.force()
                                .nodes(dataset.nodes)
                                .links(dataset.edges)
                                .size([w, h])
                                .linkDistance([150])
                                .charge([-300])
                                .start();

            var colors = d3.scale.category10();

            //Create SVG element
            var svg = d3.select("#my-svg")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

            //Create tips window -- add by Wang_haipeng 2016_8_10 pm
            var tooltip = d3.select("body")
                            .append("div")
                            .attr("class","tooltip")
                            .style("opacity",0.0);

            //Create edges as lines
            var edges = svg.selectAll("line")
                .data(dataset.edges)
                .enter()
                .append("line")
                .style("stroke", "#ccc")
                .style("stroke-width", 1)
                .on("mouseover", function(d){
                    tooltip.html(d["target"].relations)
                           .style("left", (d3.event.pageX) + "px")
                           .style("top", (d3.event.pageY + 20) + "px")
                           .style("opacity",1.0);         
                })
                .on("mousemove",function(d){
                    tooltip.style("left", (d3.event.pageX) + "px")
                           .style("top", (d3.event.pageY + 20) + "px");
                })
                .on("mouseout",function(d){
                    tooltip.style("opacity",0.0);
                });
                            

/*
            var edges_text = svg.selectAll(".linetext")
                                .data(dataset.edges)
                                .enter()
                                .append("text")
                                .attr("class","linetext")
                                .text(function(d){
                                    return d.relation;
                                });
*/

            //Create labels
            var text_dx = -20;
            var text_dy = 20;
            var drag = force.drag()
                            .on("dragstart",function(d,i){
                                d.fixed = true;
                            })
            var nodes_text = svg.selectAll(".nodetext")
                                .data(dataset.nodes)
                                .enter()
                                .append("text")
                                .attr("class","nodetext")
                                .attr("dx",text_dx)
                                .attr("dy",text_dy)
                                .text(function(d){
                                    return d.name;
                                });
            //Create nodes as circles
            var nodes = svg.selectAll("circle")
                .data(dataset.nodes)
                .enter()
                .append("circle")
                .attr("r", rad)
                .style("fill", function(d, i) {
                    return colors(i);
                })
                /*
                .on("mouseover",function(d,i){
                    edges_text.style("fill-opacity",function(edge){
                        if( edge.source === d || edge.target === d ){
                            return 1.0;
                        }
                    });
                })
                .on("mouseout",function(d,i){
                    edges_text.style("fill-opacity",function(edge){
                    if( edge.source === d || edge.target === d ){
                        return 0.0;
                        }
                    });
                })
                */
                .on("click", function(d, i){
                    var $scope = angular.element('#wrapper').scope();
                    var tag = d.id.charAt(0);
                    if (tag == "C") {
                    	$scope.getCompoundInfo(d.id);
                    } else{
                    	$scope.getGeneInfo(d.id);
                    }
                    $scope.$apply();
                })
                .on("dblclick",function(d,i){
                    d.fixed = false;
                })
                .call(force.drag);
            //Every time the simulation "ticks", this will be called
            force.on("tick", function() {
                dataset.nodes.forEach(function(d,i){
                    d.x = d.x - rad < 0     ? rad : d.x ;
                    d.x = d.x + rad > w ? w - rad : d.x ;
                    d.y = d.y - rad < 0      ? rad : d.y ;
                    d.y = d.y + rad + text_dy > h ? h - rad - text_dy : d.y ;
                });
                edges.attr("x1", function(d) { return d.source.x; })
                	.attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
                nodes.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
                nodes_text.attr("x",function(d){ return d.x });
                nodes_text.attr("y",function(d){ return d.y + 10});
                /*
                edges_text.attr("x",function(d){ return (d.source.x + d.target. x) / 2 ; });
                edges_text.attr("y",function(d){ return (d.source.y + d.target. y) / 2 ; });
                */
            });
        }
        drawGem(dataset);
}