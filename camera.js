const camera = () => ({
	schema: {
		view_pres_rad: {type: 'vec3', default: {x:0, y:0, z:0}},
		dis: {type: 'vec2', default: {x:0, y:0}},
		camera_dist: {type: 'float', default: 0},
	},
	
	init() {
		const body = document.getElementById("body")
		const btn1 = document.getElementById("btn1")
		// const btn2 = document.getElementById("btn2")
		const camera = document.getElementById("camera")
		const camera2 = document.getElementById("camera2")

		this.data.camera_dist = camera2.object3D.position.z

		this.positionP = undefined
		this.zoom_mode = false

		btn1.addEventListener('click', () => {
				// sul_mode = false
				// CCC()
				BBB()
		})

		body.addEventListener('touchstart', (e) => {
			if(e.touches.length === 1){
				this.positionP = {x:e.touches[0].clientX , y:e.touches[0].clientY}
				this.data.view_pres_rad = {x:camera.object3D.rotation.x, y:camera.object3D.rotation.y, z:camera.object3D.rotation.z}
				this.zoom_mode = false
			}
			else  if(e.touches.length === 2){
				this.positionP = {x:e.touches[1].clientX - e.touches[0].clientX , y:e.touches[1].clientY - e.touches[0].clientY}
				this.data.camera_dist = camera2.object3D.position.z		
				this.zoom_mode = true
			}
		})

		body.addEventListener('touchmove', (e) => {
			if(e.touches.length === 1 && !this.zoom_mode){
				let dx = {x:e.touches[0].clientX - this.positionP.x, y:e.touches[0].clientY - this.positionP.y}
				camera.object3D.rotation.y = (this.data.view_pres_rad.y - dx.x/150) % (2*Math.PI)
				camera.object3D.rotation.x = Math.max(Math.min(this.data.view_pres_rad.x - dx.y/150,Math.PI/2),-Math.PI/2)
			}
			else if(e.touches.length === 2){
				let pdx = Math.sqrt( Math.pow( e.touches[1].clientX - e.touches[0].clientX, 2) + Math.pow( e.touches[1].clientY - e.touches[0].clientY, 2) )
				let dx = Math.sqrt( Math.pow( this.positionP.x, 2) + Math.pow( this.positionP.y, 2) )
				camera2.object3D.position.z	= Math.max(this.data.camera_dist - ( pdx - dx )/70 , 0)
				
			}
		})
		
		body.addEventListener('mousedown', (e) => {
			this.positionP = {x:e.clientX , y:e.clientY}
			this.data.view_pres_rad = {x:camera.object3D.rotation.x, y:camera.object3D.rotation.y, z:camera.object3D.rotation.z}
			this.mouse_ples = true
		})

		body.addEventListener('mousemove', (e) => {
			if(this.mouse_ples){
				let dx = {x:e.clientX - this.positionP.x, y:e.clientY - this.positionP.y}
				camera.object3D.rotation.y = (this.data.view_pres_rad.y - dx.x/150) % (2*Math.PI)
				camera.object3D.rotation.x = Math.max(Math.min(this.data.view_pres_rad.x - dx.y/150,Math.PI/3),-Math.PI/3)
			}
		})
		
		body.addEventListener('mouseup', (e) => {
			// console.log(`mouseup target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
			this.mouse_ples = false
		})

		body.addEventListener('mouseleave', (e) => {
			if(e.target.tagName === 'BODY'){
				this.mouse_ples = false
				// console.log(`mouseleave target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
			}
		})

		body.addEventListener('wheel', (e) => {
			this.data.camera_dist += e.deltaY/200
			this.data.camera_dist = Math.max(this.data.camera_dist,0)
			camera2.object3D.position.z = this.data.camera_dist
		});
	},
})