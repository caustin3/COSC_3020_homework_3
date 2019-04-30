// COSC 3020 assignment 3
// Held-Karp algorithm for modified Traveling Salesman Problem
// Created by Jacob Williams and Chase Austin, 4/29/2019
// Last modified: 4/29/2019

// Implements a memoized, top-down dynamically programmed Held-Karp algorithm
// on a weighted complete digraph. Finds the shortest tour of all n vertices
// from a specified start matrix, but not a cycle.


// We implement a data structure for storing the visited tours: each element
// has a Set object of edges in the path so far as well as the traversal cost.
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


// The Held-Karp memoized algorithm. Parameters:
//  graph => an adjacency matrix for the undirected, weighted graph.
//  unvisited => a list of unvisited vertices, defaulting to all of them
//  start => a user-specified vertex from which the tour begins
let storedTours = [];       // Store all tours and sub-tours when encountered

function heldKarpMemo(graph,unvisited,start) {
  return;
}


// Create a randomly weighted complete undirected graph for testing
function graphMaker(length) {
  graph = new Array(length);

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
