class State {
	constructor(cp, co, ep, eo) {
		this.cp = cp
		this.co = co
		this.ep = ep
		this.eo = eo
		// console.log(cp, co, ep, eo);
	}
	apply_move(move) {
		let new_cp = new Array(8);
		let new_co = new Array(8);
		for(let i=0;i<8;i++){
			new_cp[i] = this.cp[move.cp[i]];
			new_co[i] = (this.co[move.cp[i]] + move.co[i]) % 3;
			// new_co = [(self.co[p] + move.co[i]) % 3 for i, p in enumerate(move.cp)]
		}

		let new_ep = new Array(12);
		let new_eo = new Array(12);
		for(let i=0;i<12;i++){
			new_ep[i] = this.ep[move.ep[i]]
			new_eo[i] = (this.eo[move.ep[i]] + move.eo[i]) % 2;
		}
		
		
		return new State(new_cp, new_co, new_ep, new_eo);
	}
	
	data_print() {
		console.log(this.cp)
		console.log(this.co)
		console.log(this.ep)
		console.log(this.eo)
	}
}

function scamble2state(S_S,scramble){
	let scrambled_state = S_S
	if(scramble == "")
		return scrambled_state
	
	const scr = scramble.split(" ")
	for(let i=0;i<scr.length;i++){
			const move_state = moves[scr[i]]
			scrambled_state = scrambled_state.apply_move(move_state)
	}
	return scrambled_state
}

moves = {
	'U': new State(
		[3, 0, 1, 2, 4, 5, 6, 7],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'D': new State(
		[0, 1, 2, 3, 5, 6, 7, 4],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'L': new State(
		[4, 1, 2, 0, 7, 5, 6, 3],
		[2, 0, 0, 1, 1, 0, 0, 2],
		[11, 1, 2, 7, 4, 5, 6, 0, 8, 9, 10, 3],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'R': new State(
		[0, 2, 6, 3, 4, 1, 5, 7],
		[0, 1, 2, 0, 0, 2, 1, 0],
		[0, 5, 9, 3, 4, 2, 6, 7, 8, 1, 10, 11],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'B': new State(
		[1, 5, 2, 3, 0, 4, 6, 7],
		[1, 2, 0, 0, 2, 1, 0, 0],
		[4, 8, 2, 3, 1, 5, 6, 7, 0, 9, 10, 11],
		[1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
	),
	'F': new State(
		[0, 1, 3, 7, 4, 5, 2, 6],
		[0, 0, 1, 2, 0, 0, 2, 1],
		[0, 1, 6, 10, 4, 5, 3, 7, 8, 9, 2, 11],
		[0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0]
	),
}

moves_face_c = [
	[0,1,2,3],
	[4,5,6,7],
	[0,3,4,7],
	[1,2,5,6],
	[0,1,4,5],
	[2,3,6,7],
]

moves_face_e = [
	[4,5,6,7],
	[8,9,10,11],
	[0,3,7,11],
	[1,2,5,9],
	[0,1,4,8],
	[2,3,6,10],
]

let move_names = []
const faces = Object.keys(moves)
const faces_rad = [-1,1,1,-1,1,-1]
for(let i=0;i<faces.length;i++){
	move_names += [faces[i], faces[i] + '2', faces[i] + '\'']
	moves[faces[i] + '2'] = moves[faces[i]].apply_move(moves[faces[i]])
	moves[faces[i] + '\''] = moves[faces[i]].apply_move(moves[faces[i]]).apply_move(moves[faces[i]])
}

color_data = ["#fff","#ef0","#f80","#f00","#00f","#0f0"]

color_c = [
	[0,2,4],
	[0,4,3],
	[0,3,5],
	[0,5,2],
	[1,4,2],
	[1,3,4],
	[1,5,3],
	[1,2,5],
]

color_e = [
	[4,2],
	[4,3],
	[5,3],
	[5,2],
	[0,4],
	[0,3],
	[0,5],
	[0,2],
	[1,4],
	[1,3],
	[1,5],
	[1,2],
]

let solved_state = new State(
	[0, 1, 2, 3, 4, 5, 6, 7],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
);

function rotate(roates ,time = 500,dist_time = 30){
	const roat_list = roates.split(" ")
	let time_tank = 0
	for(let i=0;i<roat_list.length;i++){
		setTimeout(() => {
			one_rotate_anim(roat_list[i],time)
		}, time_tank)

		setTimeout(() => {
			scrambled_state = scamble2state(scrambled_state,roat_list[i])
			one_rotate(scrambled_state, roat_list[i])
			// console.log("rotate")
			scrambled_state.data_print()
		}, time_tank + time)
		time_tank += time + dist_time
	}
}

function one_rotate(scrambled_state,roate){
	// console.log("one_rotate")
	scrambled_state.data_print()

	const index = faces.indexOf(roate[0])

	center = document.getElementById("corner").children
	edge = document.getElementById("edge").children

	// console.log(moves_face_c[index])
	for(let i of moves_face_c[index]){
			center[i].setAttribute('rotation', {x:0,y:0,z:0})
			center[i].removeAttribute('animation')
		let F = center[i].children
		for(let s=0;s<3;s++){
	  F[s].setAttribute('material', 'color', color_data[color_c[scrambled_state.cp[i]][(s + 3 - scrambled_state.co[i]) % 3]])
		}
	}

	for(let i of moves_face_e[index]){
		edge[i].setAttribute('rotation', {x:0,y:0,z:0})
		edge[i].removeAttribute('animation')
		let F = edge[i].children
		for(let s=0;s<2;s++){
	  F[s].setAttribute('material', 'color', color_data[color_e[scrambled_state.ep[i]][(s + 2 - scrambled_state.eo[i]) % 2]])
		}
	}
	return scrambled_state
}

function one_rotate_anim(roate,time = 2000){
	const index = faces.indexOf(roate[0])
	const rad = roate[1]
	// console.log("roate "+roate+" len "+rotate.length+" index "+index+" rad "+rad)

	center = document.getElementById("corner").children
	edge = document.getElementById("edge").children

	const vec = 'yyxxzz'
	let size = 1
	if(rad == '\'')	size = -1
	else if(rad == '2')	size = 2

	for(let i of moves_face_c[index]){
		center[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: 0,
			to: faces_rad[index] * 90 * size,
			easing: 'easeOutSine',
		})
	}

	for(let i of moves_face_e[index]){
		edge[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: 0,
			to: faces_rad[index] * 90 * size,
			easing: 'easeOutSine',
		})
	}
	
	// setTimeout(() => {
	// 	for(let i of moves_face_c[index]){
	// 		center[i].setAttribute('rotation', {x:0,y:0,z:0})
	// 		center[i].removeAttribute('animation')
	// 	}

	// 	for(let i of moves_face_e[index]){
	// 		edge[i].setAttribute('rotation', {x:0,y:0,z:0})
	// 		edge[i].removeAttribute('animation')
	// 	}
	// }, time)
}

// scramble = "R F' U' F' B2 L' U' F2 B2 L' U' F2"
sample_scramble = "R U R' F' R U R' U' R' F R2 U' R' U'"

let scrambled_state = solved_state
// let scrambled_state = scamble2state(solved_state,scramble)

// scrambled_state.data_print()
