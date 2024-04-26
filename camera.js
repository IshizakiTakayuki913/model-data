const camera = () => ({
	schema: {
		view_pres_rad: {type: 'vec3', default: {x:0, y:0, z:0}},
		dis: {type: 'vec2', default: {x:0, y:0}},
		camera_dist: {type: 'float', default: 0},
	},
	
	init() {
		const body = document.getElementById("body")
		const screen = document.getElementById("screen")
		const btn1 = document.getElementById("btn1")
		const btn2 = document.getElementById("btn2")
		const camera = document.getElementById("camera")
		const camera2 = document.getElementById("camera2")
		
		this.data.btn_pos = {x: document.body.clientWidth - 100, y: 100}
		btn2.style.left = this.data.btn_pos.x
		btn2.style.top = this.data.btn_pos.y
		
		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");

		this.data.camera_dist = camera2.object3D.position.z

		this.positionP = undefined

		btn1.addEventListener('click', () => {
			// rotate("F");
			// rotate("R U R' F' R U R' U' R' F R2 U' R' U'")
				sul_mode = false
		})

		body.addEventListener('touchstart', (e) => {
			this.positionP = {x:e.touches[0].clientX , y:e.touches[0].clientY}
			this.data.view_pres_rad = {x:camera.object3D.rotation.x, y:camera.object3D.rotation.y, z:camera.object3D.rotation.z}
		})

		body.addEventListener('touchmove', (e) => {
			let dx = {x:e.touches[0].clientX - this.positionP.x, y:e.touches[0].clientY - this.positionP.y}
			camera.object3D.rotation.y = (this.data.view_pres_rad.y + dx.x/150) % (2*Math.PI)
			camera.object3D.rotation.x = Math.max(Math.min(this.data.view_pres_rad.x + dx.y/150,Math.PI/2),-Math.PI/2)
		})
		
		body.addEventListener('mousedown', (e) => {
			this.positionP = {x:e.clientX , y:e.clientY}
			this.data.view_pres_rad = {x:camera.object3D.rotation.x, y:camera.object3D.rotation.y, z:camera.object3D.rotation.z}
			this.mouse_ples = true
		})

		body.addEventListener('mousemove', (e) => {
			if(this.mouse_ples){
				let dx = {x:e.clientX - this.positionP.x, y:e.clientY - this.positionP.y}
				camera.object3D.rotation.y = (this.data.view_pres_rad.y + dx.x/150) % (2*Math.PI)
				camera.object3D.rotation.x = Math.max(Math.min(this.data.view_pres_rad.x + dx.y/150,Math.PI/3),-Math.PI/3)
			}
		})
		
		body.addEventListener('mouseup', (e) => {
			this.mouse_ples = false
		})

		btn2.addEventListener('click', () => {
			console.log(`click btn2`)
		})
	},
})

// export {presskeyboard}
