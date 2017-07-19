function draw(data){		
		var width = 640;
		var height = 330; 
		var color = d3.scale.category20();
		var tree = d3.layout.tree();


		var connect_network = d3.select(".network")
								.append("svg")
								.attr("width",width)
								.attr("height",height);

		var graph = data;
		
			var nodes = tree.nodes(graph);
			var edges = tree.links(nodes);

			var force = d3.layout.force()
								 .nodes(nodes)
								 .links(edges)
								 .size([width, height])
								 .gravity(0.05)
								 .linkDistance(50)
								 .charge([-550])
								 .start();
			
			var svgEdge = connect_network.selectAll('line')
							 .data(edges)
							 .enter()
							 .append('line')
							 .style('stroke', '#ccc')
							 .style('stroke-width', 5);

			var svgNode = connect_network.selectAll('circle')
							 .data(nodes)
							 .enter()
							 .append('circle')
							 .attr('r',12)
							 .style("fill",function(d,i){
						         return color(i);
						     })
						     .style('stroke', '#fff')
						     .style('stroke-width', 3)
						     .on("click", function(d) { 
						     	jumpTo(d); 
					        });
			
			var svgText = connect_network.selectAll('text')
							 .data(nodes)
							 .enter()
							 .append('text')
							 .style('fill', 'black')
							 .attr('dx', 20)
							 .attr('dy', 8)
							 .text(function(d){
							 	return d.name;
							 })

			force.on('tick', function(){
				//更新连线坐标
	   			svgEdge.attr("x1",function(d){ return d.source.x; })
				       	 .attr("y1",function(d){ return d.source.y; })
				         .attr("x2",function(d){ return d.target.x; })
				         .attr("y2",function(d){ return d.target.y; });												
	 
			    //更新节点坐标
			    svgNode.attr("cx",function(d){ return d.x; })
	        			 .attr("cy",function(d){ return d.y; });
	 
			    //更新文字坐标
			    svgText.attr("x", function(d){ return d.x; })
	        			 .attr("y", function(d){ return d.y; });
			});

			function jumpTo(d){
				sessionStorage.setItem("gene_name",d.name);
				window.location.href='./gene_info.html';
			}
}