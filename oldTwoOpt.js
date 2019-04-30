// 2-opt stochastic local search. Input graph: an adjacency matrix
function two_opt(graph) {
	
  // Route indexes the nodes in the adjMatrix (i.e. [0,1,2,3,4,5])
	let route =[],	
      cost = 0,
      new_cost = 0,
      routes_found = new Map(),	 // Map of all the routes found
      check_done = 0;
		
	// Make a route on the graph from one node to all other nodes: this is an
  // array of the form [0,1,...,n-1]
	for (let i =0; i < graph.length; i++) {	
		route.push(i);		
	}

	// Randomize the route for starters (in linear time and space)
  route = shuffle(route);
 
  // Sum the costs from the ith node in route and the i+1 node in linear time
	for (let i = 0; i < route.length-1; i++) {
		cost += graph[route[i]][route[i+1]];				
	}
	
	// Add the route and its cost to the map
	routes_found.set(route.join("-"),cost);	
	
	while (routes_found.size < (graph.length*graph.length) && check_done < 6) {
		if (graph.length < 4) {
      check_done++;	
    }

		// Find a new route
		let k = Math.floor(Math.random()*route.length+1),
        i = Math.floor(Math.random()*k+1);

    // Reverse part of it
		route = two_opt_reversed(route,i,k);

		// Check to see if the route was found before 
		if (!routes_found.has(route.join("-"))) {
			for (let i = 0; i < route.length-1; i++) {
				new_cost += graph[route[i]][route[i+1]];							
			}
			
			// Set the new cost to cost if new cost is less then the old cost 			
			if(new_cost < cost) {
			  cost = new_cost;
			}
			
      routes_found.set(route.join("-"),new_cost);				
		}		
	
    new_cost = 0;
	}	
	return cost;
}