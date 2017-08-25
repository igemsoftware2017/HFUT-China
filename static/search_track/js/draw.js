function draw(data){
    $('.div_graph').empty();
    var width = $('.wrap').width(),
        height = document.body.clientHeight - $(".navbar").height(),
		color = d3.scale.category20(),
		tree = d3.layout.tree();
    var x,y,s;
    var zoom = d3.behavior.zoom()
                          .translate([width/2, height/2])   //  move distance
                          .scaleExtent([0.2, 6])  			//  scale range
                          .scale(1)             			//  scale times
                          .on("zoom", zoomed);
    function zoomed() {
        x=d3.event.translate[0];    //  dista in time
        y=d3.event.translate[1];    //  dista in time
        s=d3.event.scale;           //  scale times in time
        recommend_network.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    }
    var tooltip = d3.select("body")				//	add related text shhow bar
					.append("div")
					.attr("class","tooltip")
					.style("opacity",0.0);

    var svg = d3.select('.div_graph')			//	father svg
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.call(zoom);

	var recommend_network = svg.append('g');			//	network graph svg

	show(data);				//	start to show network graph


	function show(source){			//redraw network graph
		/*
		part_1  transform data by layout-tree
		*/
		var nodes = tree.nodes(data);
		var links = tree.links(nodes);

		var force = d3.layout.force()
							 .nodes(nodes)
							 .links(links)							 
							 .size([width, height])
							 .gravity(0.04)
							 .linkDistance(175)
							 .charge([-550])
							 .start();

		/*
		part_2  handle links
		*/

		var svgEdge = recommend_network.selectAll('line')
						.data(links)
						.enter()
						.append('line')
						.style('stroke', '#ccc')
						.style('stroke-width', 5)
						.on("mouseover", function(d){
							tooltip.html(d["source"].name + "-" + d["target"].relations + "-" + d["target"].name)
									.style("left", (d3.event.pageX) + "px")
									.style("top", (d3.event.pageY + 20) + "px")
									.style("opacity",1.0);
						})
						.on("mousemove",function(d){
							tooltip.style("left", (d3.event.pageX) + "px")
								   .style("top", (d3.event.pageY + 40) + "px");
						})
						.on("mouseout",function(d){
							tooltip.style("opacity",0.0);
						})
						.on("click",function(d){
							jumpToRD(d);
						});
			      		      

		/*
		part_3  handle nodes
		*/

		var svgNode = recommend_network.selectAll('circle')
				        .data(nodes)
				        .enter()
				        .append('a')
				        .append('circle')
				        .attr('r',function(d){
				        	cr= 24 - 8 * (d.depth - 1);
							return cr;
						})
						.style("fill",function(d,i){
							return color(i);
				        })
				        .style('stroke', '#fff')
				        .style('stroke-width', 3)
				        .on("mouseover",function(d,i){
				        	d3.select(this).style('fill', 'yellow');
				        })
				        .on("mouseout",function(d, i){
				        	d3.select(this).style('fill', color(i))
				        })
		                .on("contextmenu", function(d){
		                	jumpTo(d);
		                });

		var svgText = recommend_network.selectAll('text')
						.data(nodes)
						.enter()
						.append('text')
						.style('fill', 'black')
						.attr('dx', 20)
						.attr('dy', 8)
						.text(function(d){
							return d.name;
						})

        force.on('tick', function(){		// renew axis of edge node and text

	   			svgEdge.attr("x1",function(d){ return d.source.x; })
				       	 .attr("y1",function(d){ return d.source.y; })
				         .attr("x2",function(d){ return d.target.x; })
				         .attr("y2",function(d){ return d.target.y; });												
	 
			    svgNode.attr("cx",function(d){ return d.x; })
	        			 .attr("cy",function(d){ return d.y; });
	 
			    svgText.attr("x", function(d){ return d.x; })
	        			 .attr("y", function(d){ return d.y; });

		});
		
	}	//	func redraw(data) end

	function jumpTo(d){
		sessionStorage.setItem("gene_name",d.name);
		window.location.href='../gene_info/gene_info.html';
	}
	
	function jumpToRD(d){
		sessionStorage.setItem("source_name",d.source.name);
		sessionStorage.setItem("target_name",d.target.name);
		window.location.href='../relationship_detail/relationship_detail.html';
	}
}
