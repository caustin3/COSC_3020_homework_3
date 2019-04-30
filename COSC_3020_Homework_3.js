// COSC 3020 assignment 3
// Held-Karp algorithm for modified Traveling Salesman Problem
// Created by Chase Austin and Jacob Williams, 4/27/2019
// Last modified: 4/30/2019

// Two algorithms to compute the shortest tour on a complete, undirected
// weighted graph (a variant of the Traveling Salesman Problem) are compared:
//    the dynamically programmed Held-Karp algorithm, 
//    implemented with memoization;
//    a heuristic algorithm, stochastic 2-opt local search.
// The worst-case asymptotic complexity and the empirical complexity of these
// algorithms are also compared.
//
// Note that the 2-opt algorithm is not guaranteed to produce the truly
// minimized solution, but that it is expected to run much more quickly than
// the Held-Karp algorithm (requiring less time and memory).



///////////////////////////////////////////////////////////////////////////////
////                    The memoized Held-Karp algorithm                   ////
///////////////////////////////////////////////////////////////////////////////

// We implement a data structure for storing the visited tours. The first entry
// stores a Set of edges in the tour; the second stores the cost of the tour.
function StoreTours(edges,cost) {
  this.edges = edges;
  this.cost = cost;
}

// For comparing two Sets of edges in (sub-)tours, we implement a check to see
// whether they are the same. This was taken from code found at
//    https://stackoverflow.com/questions/31128855.
// Returns TRUE if the sets are the same, FALSE otherwise.
function sameSet(set1,set2) {
  if (set1.size !== set2.size) return false; // obvious and quick check
  for (let x of set1) if (!set2.has(x)) return false;

  return true;
}


// The Held-Karp memoized algorithm, modified from pseudocode in the lectures.
// Parameters:
//  graph => an adjacency matrix for the undirected, weighted graph.
//  unvisited => a list of unvisited vertices, defaulting to all of them
//  start => a user-specified vertex from which the tour begins
let storedTours = new Array(2);       // Store all tours and sub-tours
  storedTours[0] = new Array();
  storedTours[1] = new Array();

function heldKarp(graph,unvisited,start) {
  // Memoization check
  for (let i = 0; i < storedTours[0].length; i++) {
    if (sameSet(unvisited,storedTours[0][i])) {
      return storedTours[1][i];
    }
  }

  if (unvisited.length <= 1) return 0;

  if (unvisited.length === 2) {
    let tour = new Set(unvisited);
    let cost = graph[unvisited[0]][unvisited[1]];

    storedTours[0].push(tour);
    storedTours[1].push(cost);
    return cost;
  } 
  
  else {
    // Filter out the start vertex
    let theRest = unvisited.filter(vert => vert !== start);

    let tour = new Set(theRest);
    let cost = Infinity;
    for (let i = 0; i < theRest.length; i++) {
      let testCost = heldKarp(graph,theRest,theRest[i]) + 
        graph[start][theRest[i]];

      if (testCost < cost) {
        cost = testCost;
      }
    }

    storedTours[0].push(tour);
    storedTours[1].push(cost);
    return cost;
  }
}



///////////////////////////////////////////////////////////////////////////////
////                    Held-Karp asymptotic complexity                    ////
///////////////////////////////////////////////////////////////////////////////

// We consider the worst-case asymptotic complexity of the Held-Karp algorithm
// as implemented above, both in time and in space.

// It is well known that there are 2^n subsets of a set of size n, so given a
// graph on n vertices as input, the memoization check requires THETA(2^n) 
// time. In addition, each entry in the memoized cache requires up to n + 1 
// numbers (up to n vertices in the edge set and one cost value), so the space
// complexity is THETA(n*2^n) = THETA(2^{n+1}).

// The main part of the algorithm runs exactly once for each possible subset
// (recalling that there are 2^n of these) because of the memoization check. 
// Filtering the unvisited set presumably requires linear time and is done once
// per iteration, and the base case takes only constant time; so this requires
// (no extra memory) and THETA(n*2^n) = THETA(2^{n+1}) time as well.

// Overall, our algorithm is THETA(2^{n+1}) in both time and space complexity,
// in the worst case.



///////////////////////////////////////////////////////////////////////////////
////                          Testing Held-Karp                            ////
///////////////////////////////////////////////////////////////////////////////

// Preliminary testing was done with the dumbSalesman() function uploaded by
// Thomas Wise to Piazza as part of TestHeldKarp.js. For space efficiency,
// this code has been deleted from the final version of this script; but we
// are nevertheless grateful to Mr. Wise for his assistance.


// Create a randomly weighted complete undirected graph for testing
function graphMaker(length) {
  let graph = new Array(length);

  for (let i = 0; i < length; i++) {
    graph[i] = new Array(length);
    graph[i][i] = 0;

    for (let j = i+1; j < length; j++) {
      graph[i][j] = Math.ceil(10*Math.random());
    }

    for (let j = 0; j < i; j++) {
      graph[i][j] = graph[j][i];
    }
  }

  return graph;
}


/*
let graph = graphMaker(5);
console.log(graph);

let unvisited = new Array();
for (let i = 0; i < graph.length; i++) unvisited.push(i);

let start = Math.floor(graph.length*Math.random());

console.log("Start = " + start);
let finalCost = heldKarp(graph,unvisited,start);
*/



///////////////////////////////////////////////////////////////////////////////
////              The 2-opt stochastic local search algorithm              ////
///////////////////////////////////////////////////////////////////////////////

// 2-opt stochastic local search. Input graph: an adjacency matrix
function two_opt(graph) {
	
  // Route indexes the nodes in the adjMatrix (i.e. [0,1,2,3,4,5])
	let route =[],	
      cost=0,
      new_cost=0,
      routes_found = new Map(),	 //map of all the routes found
      check_done=0;
		
	// Make a route on the graph from one node to all other nodes
	for(let i =0; i < graph.length; i++) {	
		route.push(i);		
	}

	// Randomize the route
  route = shuffle(route);		
	for(let i = 0; i < route.length-1; i++) {
		// Sum the costs from the ith node in route and the i+1 node 
		cost += graph[route[i]][route[i+1]];				
	}
	
	// Add the route and its cost to the map
	routes_found.set(route.join("-"),cost);	
	
	while(routes_found.size < (graph.length*graph.length) && check_done < 6) {
		if(graph.length < 4) {
		check_done++;	
    }

		// Find a new route
		let k =  Math.floor(Math.random()*route.length+1);
		let i =  Math.floor(Math.random()*k+1);

		route = two_opt_reversed(route,i,k);

		// Check to see if the route was found before 
		if(!routes_found.has(route.join("-"))) {
			// Sum up for cost for the new route
			for(let i = 0; i < route.length-1; i++) {
				// Add up the cost from the ith node in route and the i+1 node 
				new_cost += graph[route[i]][route[i+1]];							
			}
			
			// Set the new cost to cost if new cost is less then the old cost 			
			if(new_cost < cost) {
			cost = new_cost;
			}

			routes_found.set(route.join("-"),new_cost);				
		}		
	
    // Set new cost to 0 
	new_cost =0;
	}	
	return cost;
}


// Reverse the part of the route between indices i and k, returning the
// new route.
function two_opt_reversed(route,i,k) {	
	
  // Temporary copy of the input route  
	let copy = route.slice();	

	// Reverse the section of the reverse between i and k
	for (let x = i-1, z=k-1; x < k; x++) {	
		route[z] = copy[x];
		z--;
	}		
	return route;	
}


// Randomize the elements of an array to find a random starting rout
// Found at https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
function shuffle(array) {
	let i = array.length,
	temp, random_i;

	// While there remain elements to shuffle...
	while (i !== 0) {
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



///////////////////////////////////////////////////////////////////////////////
////              Asymptotic complexity of 2-opt local search              ////
///////////////////////////////////////////////////////////////////////////////

// 





///////////////////////////////////////////////////////////////////////////////
////                      Testing and empirical runtime                    ////
///////////////////////////////////////////////////////////////////////////////

// Test the runtime for both algorithms on a sequence of graphs of increasing
// size

function test(){
	var t0,t1,t2,t3,graph,Held_Karp_shortest,two_opt_shortest;
	console.log("time is in milliseconds");
  console.log();
	console.log("size:\t Held_Karp route:\t 2_opt route:\t Held_Karp time:\t 2_opt time:\t");
	for(let i = 0; i , i < 8; i++ ){
		let graph = graphMaker(i);
		let unvisited = new Array();
		for (let i = 0; i < graph.length; i++) unvisited.push(i);
		let start = Math.floor(graph.length*Math.random());
		
		graph = graphMaker(i);
    console.log("Start vertex: " + start);
    console.log(graph);    
    console.log();
		t0 = Date.now();
		Held_Karp_shortest = heldKarp(graph,unvisited,start);
		t1 = Date.now();	
		t2 = Date.now();
		two_opt_shortest = two_opt(graph);		
		t3 = Date.now();
		console.log(graph.length+":\t"+Held_Karp_shortest+":\t"+two_opt_shortest+
        ":\t"+(t1-t0)+":\t"+(t3-t2));
		
	}
}

// A graph I saw, tested
function aParticularTest() {
  let graph = [[0,6,7,6,3],
               [6,0,10,6,9],
               [7,10,0,2,6],
               [6,6,2,0,2],
               [3,9,6,2,0]];
  let start = 4,
      unvisited = [0,1,2,3,4];

  let heldCost = heldKarp(graph,unvisited,start);
  let twoOptCost = two_opt(graph);

  console.log("The graph:");
  console.log(graph);
  console.log();

  console.log("Start vertex = " + start);
  console.log();

  console.log("Shortest path should be 17 (see paper)");
  console.log();
  console.log("Held-Karp shortest path = " + heldCost);
  console.log("2-opt shortest path = " + twoOptCost);
}

aParticularTest();

test();






	

	
