// COSC 3020 assignment 3
// Created by Jacob Williams and Chase Austin:W09115598, 4/29/2019
// Last modified: 4/29/2019
//2_opt 

//takes a graph that is an adjMatrix
function two_opt(graph){
	
  //route indexes the nodes in the adjacency matrix
	let route =[],	
    	cost=0,
	    new_cost=0,
	
  // Map all the routes that have been found 
	routes_found = new Map(),	
	check_done = 0;
		
	// Make a route for the graph from one node to all other nodes
	for(let i =0; i < graph.length;i++) {
		route.push(i);		
	}

	// Randomize the route
  route = shuffle(route);		
	for(let i = 0; i < route.length-1; i++) {
		k = i + 1;		
		
    // Add up the cost from the i node in route and i+1 node 
		cost += graph[route[i]][route[k]];				
	}
	
	// Add route and its cost to the map
	routes_found.set(route.join("-"),cost);	
	
	while (routes_found.size < (graph.length*graph.length) && check_done < 6) {
    if(graph.length < 4) {
		check_done++;	
		}

		// Find a new route
		let k =  Math.floor(Math.random()*route.length+1);
		let i =  Math.floor(Math.random()*k+1);
		route = two_opt_reversed(route,i,k);			

		// Check to see if the route was found before 
		if(!routes_found.has(route.join("-"))){
			// Sum up cost for the new route
			for( let i = 0; i < route.length-1; i++) {
				k = i + 1;
				// Add up the cost from the i node in route and i+1 node 
				new_cost += graph[route[i]][route[k]];							
			}
			
			// Set the new cost to cost if new cost is less then the old cost 			
			if(new_cost < cost){
			cost = new_cost ;
			}			
			routes_found.set(route.join("-"),new_cost);				
		}		
	// Set new cost to 0 
	new_cost =0;
	}	
	return cost;
}

//just reverse the route it does not change the  weights/cost of the over all route 
//based on some input indexes of the route i and k with the route. 
//returns the new route.   
function two_opt_reversed(route,i,k){	
	//temp array  copy of the input route  
	let copy = route.slice();	
	//reverse the section of the reverse between k and i
	for(let x = i-1, z=k-1; x< k; x++){	
		route[z] = copy[x]; 	
		z--;		
	}		
	return route;	
}

//found this, takes a array and takes the elements and randomness them 
//helps finds a random route 
//https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
function shuffle(array) {
	let i = array.length,
	temp, random_i;

	//While there remain elements to shuffle...
	while (0 !== i) {
		//Pick a remaining element...
		random_i = Math.floor(Math.random() * i);
		i--;
		//And swap it with the current element.
		temp = array[i];
		array[i] = array[random_i];
		array[random_i] = temp;
	}
	return array;
}


function graphMaker(length) {
  graph = new Array(length);

  for (let i = 0; i < length; i++) {
    graph[i] = new Array(length);
    graph[i][i] = 0;
    for (let j = 0; j < length; j++) {
      if (i !== j) graph[i][j] = Math.ceil(10*Math.random());
    }
  }

  return graph;
}



function test(){
	var t0,t1,t2,t3,graph,Held_Karp_shortest,two_opt_shortest;
	console.log("time is in milliseconds");
	console.log("size:\t Held_Karp route:\t 2_opt route:\t Held_Karp time:\t 2_opt time:\t");
	for(let i = 0; i , i < 10000; i++ ){
		graph = graphMaker(i)		
		t0 = Date.now();
		//Held_Karp_shortest = Held_Karp(graph);
		t1 = Date.now();	
		t2 = Date.now();
		two_opt_shortest = two_opt(graph);		
		t3 = Date.now();
		console.log(graph.length+":"+Held_Karp_shortest+":"+two_opt_shortest+":"+(t1-t0)+":"+(t3-t2));
		
	}
}

test();






	

	
