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
		}

		let new_ep = new Array(12);
		let new_eo = new Array(12);
		for(let i=0;i<12;i++){
			new_ep[i] = this.ep[move.ep[i]]
			new_eo[i] = (this.eo[move.ep[i]] + move.eo[i]) % 2;
		}
		
		return new State(new_cp, new_co, new_ep, new_eo);
	}
	
	hand_move(move) {
		let new_cp = new Array(8);
		let new_co = new Array(8);
		let graph = ". 今前位置 前向き 今、前位置の中にあるのがいる出来場所\n"
		for(let i=0;i<8;i++){
			new_cp[i] = move.cp.indexOf(this.cp[move.cp[i]])
			new_co[i] = (3+move.co[i]+this.co[move.cp[i]]-move.co[move.cp.indexOf(this.cp[move.cp[i]])])%3
			graph += [
				i,
				move.co[i],
				move.cp[i],
				this.co[move.cp[i]],
				this.cp[move.cp[i]],
				move.cp.indexOf(this.cp[move.cp[i]]),
				move.co[move.cp.indexOf(this.cp[move.cp[i]])],
				(3+move.co[i]+this.co[move.cp[i]]-move.co[move.cp.indexOf(this.cp[move.cp[i]])])%3,
			].join(' ')+"\n"
		}
		// console.log(graph)

		let new_ep = new Array(12);
		let new_eo = new Array(12);
		for(let i=0;i<12;i++){
			new_ep[i] = move.ep.indexOf(this.ep[move.ep[i]])
			new_eo[i] = (2+move.eo[i]+this.eo[move.ep[i]]-move.eo[move.ep.indexOf(this.ep[move.ep[i]])])%2
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

class Search {
	constructor(){
		this.current_solution = []	//今探索している手順を入れておくスタック
		// console.log(`this.current_solution [${this.current_solution}]`)
	}

	depth_limited_search(state,step, depth){
		// console.log(`depth ${depth}`)
		// state.data_print()
		if(depth === 0 && is_solved(state,step)){
				// console.log(`OK depth: ${depth}`)
				// state.data_print()
				return true
		}
		if(depth === 0){
				// console.log(`depth === 0 false`)
				return false
		}
	

		let prev_move = this.current_solution.length === 0 ? undefined :this.current_solution[this.current_solution.length - 1]   //# 1手前の操作
		// console.log(`prev_move [${prev_move}]`)

		for(const move_name of move_names){
			// console.log(`move_name [${move_name}]`)
			const a= is_move_available(prev_move, move_name)
			// console.log(`prev_move [${prev_move}] move [${move_name}] t ${a}`)
			if(!a){
				// console.log(`  next`)
				continue
			}

			this.current_solution.push(move_name)
			// console.log(this.current_solution)
			// state.data_print()
			if(this.depth_limited_search(state.apply_move(moves[move_name]),step, depth - 1))
				return true
			this.current_solution.pop()
		}
	}

	
	start_search(state,step, max_length=20){
		// """
		// 再帰関数、目標とする状態になるまで操作数を増やして探索する
		// """
		// # print(step)

		for(let depth=0;depth<max_length;depth++){
			// # print(f"# Start searching length {depth}")
			if(this.depth_limited_search(state,step, depth))
					return this.current_solution.join(' ')
		}
		return None
	}
}

inv_face = {
    "U": "D",
    "D": "U",
    "L": "R",
    "R": "L",
    "F": "B",
    "B": "F"
}

function is_move_available(prev_move, move){
	// """
	// 前の1手を考慮して次の1手として使える操作であるかを判定する
	// - 同じ面は連続して回さない (e.g. R' R2 は不可)
	// - 対面を回すときは順序を固定する (e.g. D Uは良いが、U Dは不可)
	// """
	if(prev_move == undefined)
			return true  //# 最初の1手はどの操作も可
	prev_face = prev_move[0]  //# 1手前で回した面
	if(prev_face == move[0])
			return false //# 同一面は不可
	if(inv_face[prev_face] == move[0])
			return prev_face < move[0] //# 対面のときは、辞書順なら可
	return true
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

function color_re_set(sulb){
	let new_color = new Array(color_data.length)
	for(let i=0;i<color_data.length;i++){
		new_color[i] = color_data[color_modes[sulb][i]]
	}
	return new_color
}

solv_step = [
	{
	"c":[],
	"e":[8, 9, 10, 11]
	},
	{
	"c":[6],
	"e":[2,8, 9, 10, 11]
	},
	{
	"c":[5,6],
	"e":[1,2,8, 9, 10, 11]
	},
	{
	"c":[4,5,6],
	"e":[0,1,2,8, 9, 10, 11]
	},
	{
	"c":[4,5,6,7],
	"e":[0,1,2,3,8, 9, 10, 11]
	}
]

function is_solved(state,step){
// 特定の場所の状態だけを調べる
	// console.log(`is_solved`)
	for(let i=0;i<solv_step[step]["c"].length;i++){
		if(state.cp[solv_step[step]["c"][i]] != solv_step[step]["c"][i] || state.co[solv_step[step]["c"][i]] != 0)
			return false
	}
	
	for(let i=0;i<solv_step[step]["e"].length;i++){
		if(state.ep[solv_step[step]["e"][i]] != solv_step[step]["e"][i] || state.eo[solv_step[step]["e"][i]] != 0)
			return false
	}
	return true
}

moves = {
	'U': new State(
		[3, 0, 1, 2, 4, 5, 6, 7],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'R': new State(
		[0, 2, 6, 3, 4, 1, 5, 7],
		[0, 1, 2, 0, 0, 2, 1, 0],
		[0, 5, 9, 3, 4, 2, 6, 7, 8, 1, 10, 11],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'L': new State(
		[4, 1, 2, 0, 7, 5, 6, 3],
		[2, 0, 0, 1, 1, 0, 0, 2],
		[11, 1, 2, 7, 4, 5, 6, 0, 8, 9, 10, 3],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'F': new State(
		[0, 1, 3, 7, 4, 5, 2, 6],
		[0, 0, 1, 2, 0, 0, 2, 1],
		[0, 1, 6, 10, 4, 5, 3, 7, 8, 9, 2, 11],
		[0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0]
	),
	'D': new State(
		[0, 1, 2, 3, 5, 6, 7, 4],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'B': new State(
		[1, 5, 2, 3, 0, 4, 6, 7],
		[1, 2, 0, 0, 2, 1, 0, 0],
		[4, 8, 2, 3, 1, 5, 6, 7, 0, 9, 10, 11],
		[1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
	),
	'x': new State(
		[3, 2, 6, 7, 0, 1, 5, 4],
		[2, 1, 2, 1, 1, 2, 1, 2],
		[7, 5, 9, 11, 6, 2, 10, 3, 4, 1, 8, 0],
		[0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
	),
	'y': new State(
		[3, 0, 1, 2, 7, 4, 5, 6],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[3, 0, 1, 2, 7, 4, 5, 6, 11, 8, 9, 10],
		[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
	),
	'z': new State(
		[4, 0, 3, 7, 5, 1, 2, 6],
		[1, 2, 1, 2, 2, 1, 2, 1],
		[8, 4, 6, 10, 0, 7, 3, 11, 1, 5, 2, 9],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	),
}

moves_face_c = [
	[0,1,2,3],
	[1,2,5,6],
	[0,3,4,7],
	[2,3,6,7],
	[4,5,6,7],
	[0,1,4,5],
	[0,1,2,3,4,5,6,7],
	[0,1,2,3,4,5,6,7],
	[0,1,2,3,4,5,6,7],
]

moves_face_e = [
	[4,5,6,7],
	[1,2,5,9],
	[0,3,7,11],
	[2,3,6,10],
	[8,9,10,11],
	[0,1,4,8],
	[0,1,2,3,4,5,6,7,8,9,10,11],
	[0,1,2,3,4,5,6,7,8,9,10,11],
	[0,1,2,3,4,5,6,7,8,9,10,11],
]

moves_face_cn = [
	[4],
	[1],
	[3],
	[2],
	[5],
	[0],
	[0,1,2,3,4,5],
	[0,1,2,3,4,5],
	[0,1,2,3,4,5],
]

let move_names = []
const faces = Object.keys(moves)
// console.log(faces)
// U D L R B F
// U R L F D B
const faces_rad = [-1, -1,1,  -1,   1,1,  -1,-1,-1]
for(let i=0;i<faces.length;i++){
	if(i < 6)	move_names.push(faces[i], faces[i] + '2', faces[i] + '\'')
	moves[faces[i] + '2'] = moves[faces[i]].apply_move(moves[faces[i]])
	moves[faces[i] + '\''] = moves[faces[i]].apply_move(moves[faces[i]]).apply_move(moves[faces[i]])
}
// console.log(move_names)
// console.log(move_names.length)
// console.log(typeof move_names)
color_data = ["#00f","#f00","#0f0","#f80","#fff","#ef0"]
// 						青     赤     緑     オ    白     黄      

let color_modes = {
	"x":[4,1,5,3,2,0],
	"y":[3,0,1,2,4,5],
	"z":[0,4,2,5,3,1],
}

const faces2 = Object.keys(color_modes)
// console.log(faces2)
for(let i=0;i<faces2.length;i++){
	let m = [...color_modes[faces2[i]]]
	for(let s=0;s<6;s++)		m[s] = color_modes[faces2[i]][m[s]]
	color_modes[`${faces2[i]}2`] = [...m]
	for(let s=0;s<6;s++)		m[s] = color_modes[faces2[i]][m[s]]
	color_modes[`${faces2[i]}'`] = m
}
// console.log(color_modes)

color_c = [
	[4,3,0],
	[4,0,1],
	[4,1,2],
	[4,2,3],
	[5,0,3],
	[5,1,0],
	[5,2,1],
	[5,3,2],
]

color_e = [
	[0,3],
	[0,1],
	[2,1],
	[2,3],
	[4,0],
	[4,1],
	[4,2],
	[4,3],
	[5,0],
	[5,1],
	[5,2],
	[5,3],
]

color_cn = [
	[0],
	[1],
	[2],
	[3],
	[4],
	[5],
]

let solved_state = new State(
	[0, 1, 2, 3, 4, 5, 6, 7],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
)

function rotate(roates ,time = 1000,dist_time = 50){
	const roat_list = roates.split(" ")
	let time_tank = 0
	for(let i=0;i<roat_list.length;i++){
		setTimeout(() => {
			// console.log(`rotate roat_list[i] [${roat_list[i]}]`)
			one_rotate_anim(roat_list[i],time)
		}, time_tank)

		setTimeout(() => {
			if(roat_list[i][0] > "Z"){
				// console.log(`小文字 [${roat_list[i]}]`)
				scrambled_state = scrambled_state.hand_move(moves[roat_list[i]])
				// console.log(color_data)
				color_data = color_re_set(roat_list[i])
				// console.log(`後`)
				// console.log(color_data)
			}
			else{
				scrambled_state = scamble2state(scrambled_state,roat_list[i])
			}
			one_rotate(scrambled_state, roat_list[i])
			// console.log("rotate")
			// scrambled_state.data_print()
		}, time_tank + time)
		time_tank += time + dist_time
	}
}

function one_rotate(sc_st,roate){
	// console.log("one_rotate")
	// scrambled_state.data_print()

	const index = faces.indexOf(roate[0])

	corner = document.getElementById("corner").children
	edge = document.getElementById("edge").children
	center = document.getElementById("center").children

	// console.log(moves_face_c[index])
	for(let i of moves_face_c[index]){
			corner[i].setAttribute('rotation', {x:0,y:0,z:0})
			corner[i].removeAttribute('animation')
		let F = corner[i].children
		for(let s=0;s<3;s++){
	  F[s].setAttribute('material', 'color', color_data[color_c[sc_st.cp[i]][(s + 3 - sc_st.co[i]) % 3]])
		}
	}

	for(let i of moves_face_e[index]){
		edge[i].setAttribute('rotation', {x:0,y:0,z:0})
		edge[i].removeAttribute('animation')
		let F = edge[i].children
		for(let s=0;s<2;s++){
	  F[s].setAttribute('material', 'color', color_data[color_e[sc_st.ep[i]][(s + 2 - sc_st.eo[i]) % 2]])
		}
	}

	for(let i of moves_face_cn[index]){
		center[i].setAttribute('rotation', {x:0,y:0,z:0})
		center[i].removeAttribute('animation')
		let F = center[i].children
	  F[0].setAttribute('material', 'color', color_data[i])
		// let F = center[i].children
		// for(let s=0;s<1;s++){
	  // F[s].setAttribute('material', 'color', color_data[color_e[sc_st.ep[i]][(s + 2 - sc_st.eo[i]) % 2]])
		// }
	}
	return sc_st
}

function color_set(sc_st){
	// console.log(`----- color_set ----`)
	corner = document.getElementById("corner").children
	edge = document.getElementById("edge").children
	center = document.getElementById("center").children

	for(let i=0;i<corner.length;i++){
		let F = corner[i].children
		for(let s=0;s<3;s++){
	  F[s].setAttribute('material', 'color', color_data[color_c[sc_st.cp[i]][(s + 3 - sc_st.co[i]) % 3]])
		}
	}

	for(let i=0;i<edge.length;i++){
		let F = edge[i].children
		for(let s=0;s<2;s++){
	  F[s].setAttribute('material', 'color', color_data[color_e[sc_st.ep[i]][(s + 2 - sc_st.eo[i]) % 2]])
		}
	}
	// console.log(center)
	for(let i=0;i<center.length;i++){
		let F = center[i].children
		// console.log(`i:${i}`)
		// console.log(F)
		// console.log(`color_cn[i][0]:${color_cn[i][0]} color_data[color_cn[i][0]]:${color_data[color_cn[i][0]]}`)
		// console.log(F[0])
	  F[0].setAttribute('material', 'color', color_data[i])

		// for(let s=0;s<2;s++){
	  // F[s].setAttribute('material', 'color', color_data[color_e[sc_st.ep[i]][(s + 2 - sc_st.eo[i]) % 2]])
		// }
	}
}

function one_rotate_anim(roate,time = 2000){
	const index = faces.indexOf(roate[0])
	const rad = roate[1]
	// console.log("roate "+roate+" len "+rotate.length+" index "+index+" rad "+rad)

	corner = document.getElementById("corner").children
	edge = document.getElementById("edge").children
	center = document.getElementById("center").children

						// URLFDB
	const vec = 'yxxzyzxyz'
	let size = 1
	if(rad == '\'')	size = -1
	else if(rad == '2')	size = 2

	// console.log(`one_rotate_anim index:${index} size:${size}`)
	// console.log(`one_rotate_anim moves_face_c[index] [${moves_face_c[index]}]`)
	// console.log(`vec.charAt(index) [${vec.charAt(index)}] faces_rad[index] [${faces_rad[index]}]`)

	for(let i of moves_face_c[index]){
		corner[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: 0,
			to: faces_rad[index] * 90 * size,
			// easing: 'easeOutSine',
			easing: 'linear',
		})
	}

	for(let i of moves_face_e[index]){
		edge[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: 0,
			to: faces_rad[index] * 90 * size,
			// easing: 'easeOutSine',
			easing: 'linear',
		})
	}

	for(let i of moves_face_cn[index]){
		center[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: 0,
			to: faces_rad[index] * 90 * size,
			// easing: 'easeOutSine',
			easing: 'linear',
		})
	}
}

scramble = "R F' U' F' B2 L' U' F2 B2 L' U' F2"
// sample_scramble = "R U R' F' R U R' U' R' F R2 U' R' U'"
// L B' L2 B' L D' L' D' L2


let scrambled_state = solved_state
// scrambled_state = scamble2state(scrambled_state,scramble)
// console.log(`is_solved ${is_solved(scrambled_state,0)}`)
// scrambled_state = scamble2state(scrambled_state,"R U' R2 U R U' F' U' F")
// console.log(is_solved(scrambled_state,1))


let search = new Search()
let sum_solution = []
let sum_solution2 = []
let btn_mode = 0

function AAA(){
	solved_state = scamble2state(solved_state,"R")
	scrambled_state = solved_state
	color_set(scrambled_state)
	// solved_state.data_print()
	// scamble2state(solved_state,"B' R B").data_print()
	// scamble2state(solved_state,"U' R U").data_print()
	// solved_state = scamble2state(solved_state,"B' R B")
	// console.log(`hand_move`)
	// solved_state = solved_state.hand_move(moves["x'"])
	// console.log(``)
	// color_set(solved_state)
	// solved_state.data_print()
}

function CCC(){
	console.log(`hand_move`)
	scrambled_state = scrambled_state.hand_move(moves["x'"])
	console.log(``)
	color_set(scrambled_state)
	scrambled_state.data_print()
}

function BBB(){
	solved_state = scrambled_state
	// solution = search.start_search(scrambled_state,0)
	console.log(`clos  [${search.start_search(solved_state,0, 20)}]`)
	sum_solution.push(search.current_solution)
	solved_state = scamble2state(solved_state,search.current_solution.join(' '))
	search.current_solution = []

	console.log(`f2l 1 [${search.start_search(solved_state,1, 20)}]`)
	sum_solution.push(search.current_solution)
	solved_state = scamble2state(solved_state,search.current_solution.join(' '))
	search.current_solution = []

	console.log(`f2l 2 [${search.start_search(solved_state,2, 20)}]`)
	sum_solution.push(search.current_solution)
	solved_state = scamble2state(solved_state,search.current_solution.join(' '))
	search.current_solution = []

	console.log(`f2l 3 [${search.start_search(solved_state,3, 20)}]`)
	sum_solution.push(search.current_solution)
	solved_state = scamble2state(solved_state,search.current_solution.join(' '))
	search.current_solution = []

	console.log(`f2l 4 [${search.start_search(solved_state,4, 20)}]`)
	sum_solution.push(search.current_solution)
	solved_state = scamble2state(solved_state,search.current_solution.join(' '))
	search.current_solution = []

	console.log(sum_solution)
	const sulveText = document.getElementById('sulves')
	table = sulveText.getElementsByTagName('td')

	// s = sum_solution.filter((sum_solution) => sum_solution.length > 0)
	for(let i=0;i<sum_solution.length;i++){
		if(sum_solution[i].length == 0)	continue
		// sulveText.innerHTML += "<div><p>" + solu.join("</p></div><div><p>") + "</p></div><br>"
		table[i].innerHTML = "<div><p>" + sum_solution[i].join("</p></div><div><p>") + "</p></div>"
	}

	sum_solution2 = sum_solution

	
	const solveDiv = sulveText.getElementsByTagName('div')
	console.log(solveDiv)
	btn_mode = 1
}

// console.log(`current_solution`)
// console.log(sum_solution)
// color_set(scrambled_state)
// solved_state.data_print()
// scrambled_state.data_print()

const M = {
	'KeyW':'U',
	'KeyX':'D',
	'KeyA':'L',
	'KeyD':'R',
	'KeyE':'B',
	'KeyC':'F',
	'Digit1':'x',
	'Digit2':'y',
	'Digit3':'z',
}
const Pre_movement = [
	"B'.1",
	"B'.1.b",
	"B'.1.f",
	"B.1",
	"B.1.f",
	"Change.1",
	"Change.2",
	"D'.1",
	"D'.1.b",
	"D'.1.f",
	"D.1",
	"D.1.f",
	"F'.1",
	"F'.1.f",
	"F'.2",
	"F'.2.b",
	"F'.2.f",
	"F.1",
	"F.1.b",
	"F.1.f",
	"Idole",
	"L.1",
	"L'.1",
	"U'.1",
	"U'.1.f",
	"U.1",
	"U.1.b",
	"U.1.f",
	"U.2",
	"U.2.b",
	"U.2.f",
]

const Pre_movement2 = {
	"B.1":	["",".f"],
	"D.1":	["",".f"],
	"F'.1":	["",".f"],
	"F'.2":	[".b","",".f"],
	"L.1":	[""],
	"L'.1":	[""],
	"U'.1":	["",".f"],
}

const Lhands = {
	"U'"  :"U'.1" ,
	"D"   :"D.1"  ,
	"L"   :"L.1"  ,
	"L'"  :"L'.1" ,
	"B"   :"B.1"  ,
	"F'"  :"F'.2" ,
}
const Lhandv = {
	"U'"  :0 ,
	"D"   :0  ,
	"L"   :0  ,
	"L'"  :1 ,
	"B"   :1  ,
	"F'"  :0 ,
}

const Rhands = {
	"U"   :"U'.1"  ,
	"D'"  :"D.1" ,
	"R"   :"L'.1"  ,
	"R'"  :"L.1" ,
	"B'"  :"B.1" ,
	"F"   :"F'.1"  ,
}
const Rhandv = {
	"U"   :0 ,
	"D'"  :0 ,
	"R"   :1 ,
	"R'"  :0 ,
	"B'"  :1 ,
	"F"   :1 ,
}

const Change = [
	{name:"Change.1", int:-1},
	{name:"Change.2", int: 1},
]

let h_v = [0,0]
let sul_mode = true
let movementCount = -1
let move180 = false
// console.log(`f2l 1 ${(sum_solution += search.start_search(solved_state,1, 20))}`)

function motions(){ //roates
	// console.log(`this.data.sul [${sum_solution2.join(' ')}] sulb ${sum_solution2[0]}`)
	// if(sum_solution2[0].length == 0){
	// 	sum_solution2.shift()
	// console.log(sum_solution2)
	// }
for(;sum_solution2.length > 0 && sum_solution2[0].length == 0;sum_solution2.shift());

	if(sum_solution2.length == 0){
		
	console.log(sum_solution)
		console.log(`sulb no`)
		btn_mode = 0
		movementCount = -1
		move180 = false
		return
	}
	
	// console.log(roates)
	// console.log(roates.length)
	// const roat_list = roates
	if(move180){
		movementCount -= 1
		move180 = false
	}

	if(sum_solution2[0][0][1] == '2'){
		// console.log(`?2 ${sum_solution2[0]}`)
		const S2 = sum_solution2[0].shift()
		sum_solution2[0].unshift(S2[0], S2[0])
		// movementCount=1
		move180 = true
	}


	let time_tank = 0
	time_tank += one_motion(sum_solution2[0][0])
	sum_solution2[0].shift()

	movementCount+=1
	const solveDiv = document.getElementById('sulves').getElementsByTagName('div')
	solveDiv[movementCount].classList.add('now-move')
	
	setTimeout(() => {
		// console.log(`time_tank:${time_tank}`)
		setTimeout(() => {
			sul_mode = false
		},time_tank)
	}, 10)
}

function one_motion(sulb){
	const speed=1000.0/500
	const Lhand = document.getElementById("L-hand")
	const Rhand = document.getElementById("R-hand")
	let hand,Su,hdvec,influence=undefined
	if(Rhands[sulb] != undefined){
		hand = Rhand
		hdvec = Rhandv
		influence = 1
		Su = Rhands[sulb]
	}
	else if(Lhands[sulb] != undefined){
		hand = Lhand
		hdvec = Lhandv
		influence = 0
		Su = Lhands[sulb]
	}
	else{
		// console.log(`one_motion sulb [${sulb}]`)
		rotate(sulb,500)
		return
	}

	// console.log(`Su ${Su}`)
	// console.log(`Pre_movement2.length ${Pre_movement2[Su].length}`)
	// console.log(Pre_movement2[Su])

	// hand.removeAttribute('animation-mixer')

	// console.log(`hdvec:${hdvec} vec:${hdvec[sulb]} influence:${influence} hand_vec:${h_v[influence]}`)
	// console.log(h_v[influence])
	// console.log(`sub:${hdvec[sulb]-h_v[influence]}`)
	let index = hdvec[sulb]-h_v[influence]
	let vec_count = h_v[influence]
	if(sulb[0] === 'R' || sulb[0] === 'L')	vec_count+=1
	// h_v[influence] = hdvec[sulb]
	// index = Math.max(index,0) + 1
	// "Change.1",
	// "Change.2",
	let time = 0
	index = Change.find((u) => u.int === index)
	// console.log(index)
	// index = Change.findIndex(({name}) => name === 'huga');

	if(index !== undefined){
		hand.setAttribute('animation-mixer', {
			clip: index.name,
			loop: 'once',
			timeScale: speed,
			clampWhenFinished: true,
		})
		time += 500
		vec_count += 1
	}
	h_v[influence] = vec_count % 2
	// console.log(`vec_count ${h_v[influence]}`)

	for(let i=0; i<Pre_movement2[Su].length; i++){
		// console.log("\nfor "+i+" [" + Pre_movement2[Su][i]+"] clip [" + Su + Pre_movement2[Su][i] +"]")
		setTimeout(() => {
			hand.setAttribute('animation-mixer', {
				clip: `${Su + Pre_movement2[Su][i]}`,
				loop: 'once',
				timeScale: speed,
				clampWhenFinished: true,
			})
			if(Pre_movement2[Su][i] == "")	
				rotate(sulb,500)
		}, time)
		time+=500
	}
	// console.log(`sulb:${sulb} time:${time}`)
	return time
}

function raycast_rotate(roate,rad){
	// console.log("one_rotate")
	// scrambled_state.data_print()

	const index = faces.indexOf(roate[0])
	const vec = 'yxxzyzxyz'
	corner = document.getElementById("corner").children
	edge = document.getElementById("edge").children
	center = document.getElementById("center").children
	// console.log(`roate [${roate}] rad [${rad}] index [${index}] vec[index] [${vec[index]}] rote {${corner[moves_face_c[index][0]].object3D.rotation[vec[index]]}}`)


	// console.log(moves_face_c[index])

	for(let i of moves_face_c[index]){
		corner[i].object3D.rotation[vec[index]] = rad
		// corner[i].setAttribute(`rotation.y`, rad * 57.29)
		// corner[i].setAttribute('rotation', {x:0,y:rad * 57.29,z:0})
	}

	for(let i of moves_face_e[index]){
		edge[i].object3D.rotation[vec[index]] = rad
		// edge[i].setAttribute(`rotation.y`, rad)
	}

	for(let i of moves_face_cn[index]){
		center[i].object3D.rotation[vec[index]] = rad
		// center[i].Object3D.rotation[vec[index]] = rad
		// center[i].setAttribute(`rotation.y`, rad)
	}
}
