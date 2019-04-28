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
	//add the starting node to the route
	route.push(start);
	
	//finds a random route for the graph 
	for(let i =0; i < grap.length,i++){	
	route[i] =i;
	}
	//makes the route random 
	route = shuffle(route);
	
	for(let i = 0; i < route.length-1; i++){
		//adds up the cost from the i node in route and i+1 node 
		cost =+ graph[route[i]][route[i+1]];		
	}
	routes_found.push([route,cost]);	
	
	while(routes_found.length <(grap.length*grap.length) ){	
	
		let k =  math.floor(math.random()*grap.length+1),
		i =  math.floor(math.random()*k);
		
		//finds a new route
		route = 2_opt_reversed(route,i,k)
		
		//set new cost t o0 
		new_cost =0	
		
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




// TestHeldKarp.js
// Thomas Wise
// 24 April 2019

// Just copy and paste this code into your js file
// with your heldKarp algorithm. Then call the
// testHeldKarp function to test your stuff.
// Follow the instructions below for best results.
// DO NOT USE THIS TO TIME YOUR CODE! THIS IS DESIGNED
// TO MAKE SURE YOU ARE RETURNING THE RIGHT VALUE!




/*
 * Tests some heldKarp algorithm to see if it's computing the right
 * value. Assumes the "salesman" doesn't return home. i.e. The path
 * does not form a cycle, it simply visits every node. That's what it
 * says to do in the instructions.
 * 
 * heldKarp function must be in the form heldKarp(mtrx, start) where
 * mtrx is some adjacency matrix for the cities the salesman must visit
 * and start is where he starts. Or you can just modify my code to fit your
 * heldKarp function if you want. I'm not your dad.
 * 
 * testHeldKarp takes four arguments. You can see those by looking at it.
 * 
 * numTests is how many times you want to test your heldKarp function
 * (each time it's tested, the testHeldKarp function generates a random
 * adjacency matrix).
 * 
 * minMtrxSize and maxMtrxSize are the bounds of the matrix sizes
 * so if the min is 5 and the max is 8, then each randomly generated
 * matrix will have 5, 6, 7 or 8 vertices. If you want every matrix to
 * be the same size, just set the min and max to that size or modify my
 * code. I'm not your dad.
 * 
 * wantPercent should be a boolean (true or false). If true, it will
 * print out its progress every percent of the way throug testing all
 * numTests random matrices. If false, it won't do that.
 * 
 * Happy Testing!
 */
function testHeldKarp(numTests, minMtrxSize, maxMtrxSize, wantPercent) {
    // Tests the heldKarp function numTests times and reports
    // if any test fails
    var working = true;
    for (var testNum = 0; testNum < numTests && working; testNum++) {
        // Creates a random size and start node
        var size = Math.floor(Math.random() * (maxMtrxSize - minMtrxSize + 1) + minMtrxSize);
        var start = Math.floor(Math.random() * size);


        // randomly fills adjacency matrix
        var mtrx = Array(size);
        for (var i = 0; i < size; i++) {
            mtrx[i] = Array(size);
            for (var j = 0; j < size; j++) {
                mtrx[i][j] = Math.floor(Math.random() * 9 + 1);
            }
            mtrx[i][i] = 0;
        }

        // Gets the shortest path value for heldKarp and
        // the actual shortes path
        var heldKarpAnswer = heldKarp(mtrx, start);
        var dumbSalesmanAnswer = dumbSalesman(mtrx, start);

        // Reports if heldKarp was wrong. Displays the matrix
        // along with the heldKarp answer and the expected answer
        if (heldKarpAnswer != dumbSalesmanAnswer) {
            working = false;
            console.log("Failed on testNum " + testNum + ":");
            printMtrx(mtrx);
            console.log("heldKarpAnswer: " + heldKarpAnswer);
            console.log("dumbSalesmanAnswer: " + dumbSalesmanAnswer);
        }
        // Shows the progress of the tests for large numTests.
        if (wantPercent) {
            if ((testNum % (Math.floor(numTests / 100))) == 0) {
                console.log((testNum / Math.floor(numTests / 100)) + "%");
            }
        }
    }

    // Reports if the heldKarp function worked in all
    // test cases.
    if (working) {
        console.log("100%");
    }
    console.log("working for " + numTests + " tests: " + working);
}

// Prints a matrix all pretty.
// Matrix must have all numbers <= 2 digits
// or else it won't be as pretty.
function printMtrx(mtrx) {
    var horAxis = "    ";
    for (var i = 0; i < mtrx.length; i++) {
        horAxis += i + "   ";
    }
    console.log(horAxis);
    for (var i = 0; i < mtrx.length; i++) {
        var line = i + "[ ";
        for (var j = 0; j < mtrx.length; j++) {
            if ((mtrx[i][j] < 10 && mtrx[i][j] >= 0) || mtrx[i][j] == Infinity) {
                line += " ";
            }
            if (mtrx[i][j] == Infinity) {
                line += "_";
            }
            else {
                line += mtrx[i][j];
            }
            if (j < mtrx.length - 1) {
                line += ", ";
            }

            else {
                line += " ]";
            }
        }
        console.log(line);
    }
}

// Finds the traveling salesman path the slow and
// simple way for testing purposes.
//
// DO NOT COPY THIS TECHNIQUE FOR PROBLEM 1!
// THIS HAS A TIME AND MEMORY COMPLEXITY OF
// O(n!)! YOU DO NOT WANT THAT! THIS IS JUST
// AN EASY TO UNDERSTAND METHOD FOR TESTING PURPOSES!
function dumbSalesman(cities, start) {
    // Creates the set of every city except start
    // DO NOT COPY THIS TECHNIQUE FOR PROBLEM 1!
    // THIS HAS A TIME AND MEMORY COMPLEXITY OF
    // O(n!)! YOU DO NOT WANT THAT! THIS IS JUST
    // AN EASY TO UNDERSTAND METHOD FOR TESTING PURPOSES!
    var allButStart = [];
    for (var i = 0; i < cities.length; i++) {
        if (i != start) {
            allButStart.push(i);
        }
    }
    // DO NOT COPY THIS TECHNIQUE FOR PROBLEM 1!
    // THIS HAS A TIME AND MEMORY COMPLEXITY OF
    // O(n!)! YOU DO NOT WANT THAT! THIS IS JUST
    // AN EASY TO UNDERSTAND METHOD FOR TESTING PURPOSES!
    // Creates a list of all permutations of allButStart
    var allRoutes = [];
    addPerms(allRoutes, allButStart);

    // For every permuation, it adds the weight from the start to
    // the first element in the permutation, then the weight from
    // that to the second element, and so on until it reaches the end.
    // Returns the shortest path length.
    // DO NOT COPY THIS TECHNIQUE FOR PROBLEM 1!
    // THIS HAS A TIME AND MEMORY COMPLEXITY OF
    // O(n!)! YOU DO NOT WANT THAT! THIS IS JUST
    // AN EASY TO UNDERSTAND METHOD FOR TESTING PURPOSES!
    var min = Infinity;
    for (var i = 0; i < allRoutes.length; i++) {
        var currVal = cities[start][allRoutes[i][0]];
        for (var j = 0; j < allRoutes[i].length - 1; j++) {
            currVal += cities[allRoutes[i][j]][allRoutes[i][j + 1]];
        }
        if (currVal < min) {
            min = currVal;
        }
    }
    return min;
}

// Used in dumbSalesman for finding all
// permutations
function addPerms(allRoutes, combo) {
    perm(allRoutes, combo, []);
}

function perm(allroutes, combo, usedIndx) {
    if (usedIndx.length == combo.length) {
        var newComboPerm = Array(combo.length);
        for (var i = 0; i < newComboPerm.length; i++) {
            newComboPerm[i] = combo[usedIndx[i]];
        }
        allroutes.push(newComboPerm);
    }

    for (i = 0; i < combo.length; i++) {
        if (!usedIndx.includes(i)) {
            usedIndx.push(i);
            perm(allroutes, combo, usedIndx);
            usedIndx.pop();
        }
    }
}