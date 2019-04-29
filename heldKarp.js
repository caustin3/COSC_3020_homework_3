// COSC 3020 assignment 3
// Held-Karp algorithm for modified Traveling Salesman Problem
// Created by Jacob Williams and Chase Austin, 4/29/2019
// Last modified: 4/29/2019

// Implements a memoized, top-down dynamically programmed Held-Karp algorithm
// on a weighted complete digraph. Finds the shortest tour of all n vertices
// from a specified start matrix, but not a cycle.

// The dynamic programming aspect is that we store all existing paths (and
// their costs) in memory and do not have to recompute the same path.

// Now, in the worst case we will still have to investigate all possible
// tours of the n vertices in every possible order, which gives (n choose 0) +
// (n choose 1) + ... + (n choose n) = 2^n possible tours. Investigating each
// tour takes linear time (as we compute the longer path for each of the n 
// edges to the subtours), so our worst-case time complexity is THETA(n*2^n) =
// THETA(2^(n+1)).
// We may have to store all the tours in memory as well, so the worst-case
// space complexity is THETA(2^n).

// We implement a data structure for storing the visited tours: each element
// has an array of edges in the path so far as well as the traversal cost.
function StoreTours(edges,cost) {
  this.edges = edges;
  this.cost = cost;
}

// Factorial function, used for computing some sizes of arrays. Taken from
// lecture slides; is tail-recursive for speed.
function fact(n,acc=1) {
  if (n === 0) return acc;
  else return fact(n-1,acc*n);
}

// graph: an adjacency matrix
// unvisited: set of all vertices not yet explored (default: all vertices)
// start: the vertex from which the tour starts
// storedTours: a matrix of StoreTours visited so far: in row i are stored
//  the sub-paths of length i+2.

heldKarp(graph,unvisited,start,storedTours=new Array(graph.length-1)) {

  // Store all the tours of length 2: from start to each other vertex


  // Store all the full-length tours to find the minimum
  let allTours = new Array(fact(graph.length-1)); 
  for (let i = 0; i < allTours.length; i++) {
    allTours[i] = storedTours[storedTours.length][i].cost;
  }

  // Finding the minimum: via stackoverflow.com/questions/11301438
  let minCost = allTours[0];
  let minIndex = 0;
  for (let i = 0; i < allTours.length; i++) {
    if (allTours[i] < minCost) {
      minCost = allTours[i];
      minIndex = 0;
    }
  }

  return storedTours[storedTours.length][minIndex];

}

// Create a randomly weighted complete digraph for testing
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

console.log(fact(10));
