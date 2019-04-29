// COSC 3020 assignment 3
// Created by Jacob Williams and Chase Austin W09115598, 4/29/2019
// Last modified: 4/29/2019
//2_opt 

//takes a graph that is an adjMatrix
function two_opt(graph){
	//route is the indexes of the nodes in the adjMatrix (i.e. 1,2,3,4,5,6)
	let route =[],	
	cost=0,
	new_cost=0,
	//map of all the route that have been found 
	routes_found = new Map();	
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
	while(routes_found.size <(graph.length*graph.length)){		
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
};



function test(){	
var t1 = performance.now();
var t0 = performance.now();

var graph ;

	
console.log("Held_Karp's shortest path :");
t0 = performance.now();

console.log(Held_Karp(graph));

t1 = performance.now();

console.log("Held_Karp; graph of size: "+graph.length +"Call to took: " + (t1 - t0));
console.log("\n");

console.log("two_opt's shortest path :");
t0 = performance.now();

console.log(two_opt(graph));

t1 = performance.now();
console.log("graph of size: "+graph.length +"Call to took: " + (t1 - t0));
console.log("\n");

}






	

	
