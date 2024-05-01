const presskeyboard = () => ({
	schema: {
		Space_key: {type: 'bool', default: false},
		// sul_mode: {type: 'bool', default: true}, 
		sul: {type: 'array', default: []},  // type: "array"
	},
	
	init() {
		const body = document.getElementById("body")
		const Lhand = document.getElementById("L-hand")
		const Rhand = document.getElementById("R-hand")

		const key_ples = {
			'KeyW':false,
			'KeyX':false,
			'KeyA':false,
			'KeyD':false,
			'KeyE':false,
			'KeyC':false,
			'Digit1':false,
			'Digit2':false,
			'Digit3':false,
		}



		body.addEventListener("keydown", (e) => {
			const A = e.code

			if(e.code == "Space")
				this.data.Space_key = true
			if(key_ples[e.code]) return
			key_ples[e.code]= true
			if(M[A] == undefined)	return


			let sulb = M[A]
			if(e.shiftKey) sulb += "'"
			else if(this.data.Space_key) sulb += "2"
			
			// console.log(`sulb [${sulb}]`)

			// this.data,hand_vec = one_motion(sulb,this.data.hand_vec)
			one_motion(sulb)
		})
		
		body.addEventListener("keyup", (e) => {
			if(e.code == "Space")
				this.data.Space_key = false
			key_ples[e.code] = false

			if(e.code == "KeyP"){
				// sul_mode = false
				// motions(search.current_solution)
			}
		})

		// Rhand.addEventListener('animationbegin',(e) => {
		// 	console.log(e)
		// 	console.log(e.name)
		// })
	},
	tick() {
		if(!sul_mode){
				motions()
				sul_mode = true
			}
	},
})
