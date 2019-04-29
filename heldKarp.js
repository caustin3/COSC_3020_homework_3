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
// has an array of pairs of edges in the path as well as the value it takes to
// traverse it.
function storeTheTours(edgeList,cost) {
  this.edges = edgeList;
  this.cost = cost;
}

// Graph: an adjacency matrix
// Unvisited: set of all vertices not yet explored (default: all vertices)
// Start: the vertex from which the tour starts
// storedTours: the tours currently visited
heldKarp(graph,unvisited,start,storedTours=[]) {
  if (unvisited.length == 2) {
    storedTours.push([unvisited[0],unvisited[1]],
        graph[unvisited[0]][unvisited[1]]);
  }

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
