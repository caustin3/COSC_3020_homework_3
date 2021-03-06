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
let storedTours = new Array(2);                 // Store all tours and sub-tours
  storedTours[0] = new Array();
  storedTours[1] = new Array();

function heldKarp(graph,unvisited,start) {
  // Memoization check
  for (let i = 0; i < storedTours[0].length; i++) {
    if (sameSet(unvisited,storedTours[0][i])) {
      return storedTours[1][i];
    }
  }

  if (unvisited.length <= 1) return 0;          // No tours to consider

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

// We begin with helper functions: one to randomly reverse part of a given
// tour; and one to randomly generate a tour (e.g., to start the algorithm).


// Randomize the elements of an array to find a random starting tour
// Found at https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
function shuffle(array) {
	let i = array.length,
	    temp, 
      random_i;

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

// Stochastic 2-opt local search algorithm running 100*|V|^2 times.
// Takes as input an adjacency matrix and a start vertex.
function twoOptIter(graph,start) {

  // Small graph corner cases
  if (graph.length <= 1) return 0;

  // Function global variables
  let tour = new Array(graph.length),
      cost = Infinity,
      maxIter = 100*graph.length*graph.length;


  // Generate the random tour (save for the start vertex)
  for (let i = 0; i < tour.length; i++) tour[i] = i;
  tour = tour.filter(vert => vert !== start);

  tour = shuffle(tour);

  // Find the initial cost of the tour
  for (let i = 0; i < tour.length - 1; i++) {
    cost += graph[tour[i]][tour[i+1]];
  }
  
  // Add the distance to the start
  cost += graph[start][tour[0]];
  
  // Randomize the route, checking for convergence
  for (let numIter = 0; numIter < maxIter; numIter++) {

    // Temporary tour cost
    let tempCost = 0;

    // Boundaries on which to reverse the route
    let i = Math.ceil(tour.length*Math.random()),
        k = Math.ceil(tour.length*Math.random());

    // Construct partially reversed tour and find its cost
    tour = two_opt_reversed(tour,Math.min(i,k),Math.max(i,k));

    for (let i = 0; i < tour.length - 1; i++) {
      tempCost += graph[tour[i]][tour[i+1]];
    }

    tempCost += graph[start][tour[0]];


    if (tempCost < cost) cost = tempCost;
  }

  return cost;
}



///////////////////////////////////////////////////////////////////////////////
////              Asymptotic complexity of 2-opt local search              ////
///////////////////////////////////////////////////////////////////////////////

// The shuffle() function runs in time linear in the input size; in the worst
// case this shuffles the entire path, involving all vertices of the graph, so
// this is THETA(n). It also creates a single temporary variable, requiring 
// only THETA(1) extra memory.

// Likewise, the two_opt_reversed() function operates in time linear in the
// distance between the indices and creates a temporary array of the same size;
// in the worst case, this is THETA(n) in both time and space complexity.

// Finally, the twoOptIter() function runs exactly 100*n^2 times, where n is the
// number of vertices in the graph. We chose this value because the number of
// edges in the graph is on the order of n^2, so we believe we have a good
// chance of finding a nice approximation to the shortest tour. The algorithm
// calls shuffle() exactly once, but it calls two_opt_reversed() once for each
// run; it also requires THETA(n) time to calculate the updated cost. Apart
// from the extra space required by its helper functions, this function only
// requires constant extra memory.

// So the overall runtime of the 2-opt stochastic local search is THETA(n*n^2)
// = THETA(n^3), with THETA(n) space needed before the first run.





///////////////////////////////////////////////////////////////////////////////
////                      Testing and empirical runtime                    ////
///////////////////////////////////////////////////////////////////////////////

// Test the runtime for both algorithms on a sequence of graphs of increasing
// size


function test() {
	console.log("time is in milliseconds");
	console.log();
	console.log("size:\t Held_Karp route:\t 2_opt route:\t Held_Karp time:\t" +
      "2_opt time:\t");
	for (let i = 0; i , i < 9; i++) {
		let graph = graphMaker(i);
		let unvisited = new Array();
		for (let i = 0; i < graph.length; i++) unvisited.push(i);
		
		let start = Math.floor(graph.length*Math.random());
		graph = graphMaker(i);
    
		console.log("Start vertex: " + start);
		console.log(graph);    
		console.log();
		t2 = Date.now();
		two_opt_shortest = twoOptIter(graph,start);
		t3 = Date.now();		
		t0 = Date.now();
		Held_Karp_shortest = heldKarp(graph,unvisited,start);
		t1 = Date.now();					
		console.log(graph.length+":\t"+Held_Karp_shortest+":\t"+two_opt_shortest+
			":\t"+(t1-t0)+":\t"+(t3-t2));
	}
	console.log("size of the graph\t2_opt_shortest route\ttime")
	for (let i = 0; i , i < 1600; i = i+ 100) {
		let graph = graphMaker(i);		
		let start = Math.floor(graph.length*Math.random());
		graph = graphMaker(i);   		
		t2 = Date.now();
		two_opt_shortest = twoOptIter(graph,start);
		t3 = Date.now();		
		console.log(graph.length+":\t"+two_opt_shortest+":\t"+(t3-t2));
	}
	
	let graph = graphMaker(11);
	let unvisited = new Array();
	for (let i = 0; i < graph.length; i++) unvisited.push(i);
	let start = Math.floor(graph.length*Math.random());
	console.log("Start vertex: " + start);
	console.log(graph);    
	console.log();
	console.log("size of the graph\theldKarp route\ttime")
	t0 = Date.now();
	Held_Karp_shortest = heldKarp(graph,unvisited,start);
	t1 = Date.now();					
	console.log(graph.length+":\t"+Held_Karp_shortest+":\t"+(t1-t0));1	
}

// A test of a particular graph giving an old version of 2-opt trouble
function aParticularTest() {
  let graph = [[0,6,7,6,3],
               [6,0,10,6,9],
               [7,10,0,2,6],
               [6,6,2,0,2],
               [3,9,6,2,0]];
  let start = 4,
      unvisited = [0,1,2,3,4];

  let heldCost = heldKarp(graph,unvisited,start);
  //let twoOptCost = two_opt(graph);
  let twoOptCost = twoOptIter(graph,start);

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

test();
