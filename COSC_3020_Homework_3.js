// COSC 3020 assignment 3
// Held-Karp algorithm for modified Traveling Salesman Problem
// Created by Jacob Williams and Chase Austin, 4/29/2019
// Last modified: 4/29/2019

// Implements a memoized, top-down dynamically programmed Held-Karp algorithm
// on a weighted complete digraph. Finds the shortest tour of all n vertices
// from a specified start matrix, but not a cycle.


///////////////////////////////////////////////////////////////////////////////
////                            The algorithm                              ////
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
  // Memoization check (slow)
  for (let i = 0; i < storedTours[0].length; i++) {
    if (sameSet(unvisited,storedTours[0][i])) {
      return storedTours[1][i];
    }
  }

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
////                            The algorithm for 2_opt                    ////
///////////////////////////////////////////////////////////////////////////////

//takes a graph that is an adjMatrix
function two_opt(graph){
	//route is the indexes of the nodes in the adjMatrix (i.e. 1,2,3,4,5,6)
	let route =[],	
	cost=0,
	new_cost=0,
	//map of all the route that have been found 
	routes_found = new Map(),	
	check_done=0;
		
	//makes a route for the graph from one node to all other nodes
	for(let i =0; i < graph.length;i++){	
		route.push(i);		
	}	
	//makes the route random 	
	route = shuffle(route);		
	for(let i = 0; i < route.length-1; i++){
		k = i +1		
		//adds up the cost from the i node in route and i+1 node 
		cost += graph[route[i]][route[k]];				
	}
	
	//add the route and it's cost to the map
	routes_found.set(route.join("-"),cost);	
	
	while(routes_found.size <(graph.length*graph.length)&& check_done < 6){			 	
		if(graph.length < 4){
		check_done++;	
		}
		//finds a new route
		let k =  Math.floor(Math.random()*route.length+1);
		let i =  Math.floor(Math.random()*k+1);
		route = two_opt_reversed(route,i,k);			
		//checks to see if the route was found before 
		if(!routes_found.has(route.join("-"))){
			//sums up for cost for the new route
			for(let i = 0; i < route.length-1; i++){
				k = i +1;
				//adds up the cost from the i node in route and i+1 node 
				new_cost += graph[route[i]][route[k]];							
			}
			
			//set the new cost to cost if new cost is less then the old cost 			
			if(new_cost < cost){
			cost = new_cost ;
			}			
			routes_found.set(route.join("-"),new_cost);				
		}		
	//set new cost to 0 
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


//tests the time it takes for the algorithms to f


function test(){
	var t0,t1,t2,t3,graph,Held_Karp_shortest,two_opt_shortest;
	console.log("time is in milliseconds");
	console.log("size:\t Held_Karp route:\t 2_opt route:\t Held_Karp time:\t 2_opt time:\t");
	for(let i = 0; i , i < 11; i++ ){
		let graph = graphMaker(i);
		let unvisited = new Array();
		for (let i = 0; i < graph.length; i++) unvisited.push(i);
		let start = Math.floor(graph.length*Math.random());
		
		graph = graphMaker(i)		
		t0 = Date.now();
		Held_Karp_shortest = heldKarp(graph,unvisited,start);
		t1 = Date.now();	
		t2 = Date.now();
		two_opt_shortest = two_opt(graph);		
		t3 = Date.now();
		console.log(graph.length+":"+Held_Karp_shortest+":"+two_opt_shortest+":"+(t1-t0)+":"+(t3-t2));
		
	}
}

test();






	

	
