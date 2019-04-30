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

let graph = graphMaker(7);
console.log(graph);

let unvisited = new Array();
for (let i = 0; i < graph.length; i++) unvisited.push(i);

let start = Math.floor(graph.length*Math.random());

console.log("Start = " + start);
let finalCost = heldKarp(graph,unvisited,start);
console.log(finalCost);
