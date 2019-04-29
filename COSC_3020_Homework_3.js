//Chase_Austin 
//Date 23/April/2019
//COSC_3020_Homework_3

function Held_Karp(graph, start){
	var nb_nodes = graph.length;			
}


//graph need to be an adjMatrix, and start is the index of the node that is the start
function 2_opt(graph, start){
	//route is the indexes of the nodes in the adjMatrix (i.e. 1,2,3,4,5,6)
	let route =[],	
	cost,
	new_cost,
	routes_found = [];
	
	
	
	//finds a random route for the graph 
	for(let i =0; i < grap.length,i++){	
		if(i !== start ){
			route[i] =i;
		}
	}
	//add the starting node to the route
	route.unshift(start);
	//makes the route random 
	route = shuffle(route);
	
	for(let i = 0; i < route.length-1; i++){
		//adds up the cost from the i node in route and i+1 node 
		cost =+ graph[route[i]][route[i+1]];		
	}
	routes_found.push([route,cost]);	
	
	while(routes_found.length <(grap.length*grap.length) ){	
	
		let k =  math.floor(math.random()*grap.length),
		i =  math.floor(math.random()*k+1);
		
		//finds a new route
		route = 2_opt_reversed(route,i,k)
		
		//set new cost t o0 
		new_cost =0	
		//checks to see if the route was found before 
		if(!routes_found.includes(route)){
			//sums up for cost for the new route
			for(let i = 0; i < route.length-1; i++){
				//adds up the cost from the i node in route and i+1 node 
				new_cost =+ graph[route[i]][route[i+1]];		
			}
			
			//set the new cost to cost if new cost is less then the old cost 
			if(new_cost < cost){
			 cost = new_cost ;
			}
			routes_found.push([route,new_cost]);
		}		
	}
	return cost;
}

//just reverse the route it does not change the  weights/cost of the over all route 
//based on some input indexes of the route i and k with the route. 
//returns the new route.   
function 2_opt_reversed(route,i,k){
	//temp array  copy of the input route  
	let copy = route.slice();
	//reverse the section of the reverse between k and i  
	for(let x = i, z=k-1; x< k+1; x++){	
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
		temp = array[Index];
		array[i] = array[random_i];
		array[random_i] = temp;
	}
	return array;
};


testHeldKarp(10,2,10,true);

function test(){	
var t1 = performance.now();
var t0 = performance.now();

var graph =
   [[0 ,0 ,3 ,9 ,0],
	[0 ,0 ,20,0 ,5 ],
	[3 ,20,0 ,15,1 ],
	[9 ,0 ,15,0 ,0 ],
	[0 ,5 ,1 ,0 ,0 ]];

	
console.log("Held_Karp's shortest path :");
t0 = performance.now();

console.log(Held_Karp(graph));

t1 = performance.now();

console.log("Held_Karp; graph of size: "+graph.length +"Call to took: " + (t1 - t0));
console.log("\n");

console.log("2_opt's shortest path :");
t0 = performance.now();

console.log(2_opt(graph));

t1 = performance.now();
console.log("graph of size: "+graph.length +"Call to took: " + (t1 - t0));
console.log("\n");
}
