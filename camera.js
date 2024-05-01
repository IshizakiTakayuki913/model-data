const touchMove = [
	{4:"B'",7:"L",8:"B",11:"L'",},
	{4:"B",5:"R'",8:"B'",9:"R",},
	{5:"R",6:"F'",9:"R'",10:"F",},
	{6:"F",7:"L'",10:"F'",11:"L",},
	{0:"B",1:"B'",5:"U",7:"U'",},
	{1:"R",2:"R'",4:"U'",6:"U",},
	{2:"F",3:"F'",5:"U'",7:"U",},
	{0:"L'",3:"L",4:"U",6:"U'",},
	{0:"B'",1:"B'",9:"D'",11:"D",},
	{1:"R'",2:"R",8:"D",10:"D'",},
	{2:"F'",3:"F",9:"D",11:"D'",},
	{0:"L",3:"L'",8:"D'",10:"D",},
]

const camera = () => ({
	schema: {
		view_pres_rad: {type: 'vec3', default: {x:0, y:0, z:0}},
		dis: {type: 'vec2', default: {x:0, y:0}},
		camera_dist: {type: 'float', default: 0},
	},
	
	init() {
		// const screen = document.getElementById("screen")
		const btn1 = document.getElementById("btn1")
		const camera = document.getElementById("camera")
		const camera2 = document.getElementById("camera2")
		const canvas = document.getElementsByTagName('canvas')[0]
		const root = document.getElementById("root")

		this.data.camera_dist = camera2.object3D.position.z

		this.parts = ""

		this.positionP = undefined
		this.zoom_mode = false
		this.root_mode = false

		root.addEventListener("mousedown", (e) => {
			if(this.root_mode)	return
			this.parts = e.target.parentElement.id
			// console.log(`mousedown ID [${e.target.parentElement.id}]`)
			this.touch_list = e.TouchList
			this.root_mode = true
		})

		root.addEventListener("mouseup", (e) => {
			if(!this.root_mode)	return
			const regex = /[^0-9]/g;
			const be = parseInt(this.parts.replace(regex, ""))
			const af = parseInt(e.target.parentElement.id.replace(regex, ""))
			console.log(`mouseup [${this.parts}] for[${e.target.parentElement.id}] move [${touchMove[be][af]}]`)

			this.root_mode = false

			if(touchMove[be][af] != undefined){
				one_motion(touchMove[be][af])
			}
		})

		btn1.addEventListener('click', () => {
			if(btn_mode < 0)	return
			else if(btn_mode === 1)	sul_mode = false
			else if(btn_mode === 0)	{
				btn_mode = -1
				BBB()
			}
		})

		canvas.addEventListener('touchstart', (e) => {
			if(this.root_mode)	return
			// console.log(`touchstart target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
			if(e.touches.length === 1 && !this.zoom_mode){
				// console.log(`touchstart 1 len[${e.touches.length}]`)
				this.positionP = {x:e.touches[0].clientX , y:e.touches[0].clientY}
				this.data.view_pres_rad = {x:camera.object3D.rotation.x, y:camera.object3D.rotation.y, z:camera.object3D.rotation.z}
				this.zoom_mode = true
			}
			else if(e.touches.length === 2 && this.zoom_mode){
				console.log(`touchstart 2 len[${e.touches.length}]`)
				this.positionP = {x:e.touches[1].clientX - e.touches[0].clientX , y:e.touches[1].clientY - e.touches[0].clientY}
				this.data.camera_dist = camera2.object3D.position.z		
				// this.zoom_mode = true
			}
		})

		canvas.addEventListener('touchmove', (e) => {
			if(this.root_mode)	return

			if(e.touches.length === 1 && this.zoom_mode){
				let dx = {x:e.touches[0].clientX - this.positionP.x, y:e.touches[0].clientY - this.positionP.y}
				camera.object3D.rotation.y = (this.data.view_pres_rad.y - dx.x/150) % (2*Math.PI)
				camera.object3D.rotation.x = Math.max(Math.min(this.data.view_pres_rad.x - dx.y/150,Math.PI/2),-Math.PI/2)
			}
			else if(e.touches.length === 2 && this.zoom_mode){
				console.log(`touchmove 2 `)
				let pdx = Math.sqrt( Math.pow( e.touches[1].clientX - e.touches[0].clientX, 2) + Math.pow( e.touches[1].clientY - e.touches[0].clientY, 2) )
				let dx = Math.sqrt( Math.pow( this.positionP.x, 2) + Math.pow( this.positionP.y, 2) )
				camera2.object3D.position.z	= Math.max(this.data.camera_dist - ( pdx - dx )/70 , 0)
				
			}
		})

		canvas.addEventListener('touchend', (e) => {
			this.zoom_mode = false
		})
		
		canvas.addEventListener('mousedown', (e) => {
			if(this.root_mode)	return
			// console.log(`mousedown target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
			// console.log(e.target)
			// console.log(e.currentTarget)

			this.positionP = {x:e.clientX , y:e.clientY}
			this.data.view_pres_rad = {x:camera.object3D.rotation.x, y:camera.object3D.rotation.y, z:camera.object3D.rotation.z}
			this.mouse_ples = true
		})

		canvas.addEventListener('mousemove', (e) => {
			if(this.root_mode)	return
			// console.log(`mousemove target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)

			if(this.mouse_ples){
				let dx = {x:e.clientX - this.positionP.x, y:e.clientY - this.positionP.y}
				camera.object3D.rotation.y = (this.data.view_pres_rad.y - dx.x/150) % (2*Math.PI)
				camera.object3D.rotation.x = Math.max(Math.min(this.data.view_pres_rad.x - dx.y/150,Math.PI/3),-Math.PI/3)
			}
		})
		
		canvas.addEventListener('mouseup', (e) => {
			if(this.root_mode)	return
			// console.log(`mouseup target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
			this.mouse_ples = false
		})

		canvas.addEventListener('mouseleave', (e) => {
			if(this.root_mode)	return
			if(e.target.tagName === 'BODY'){
				this.mouse_ples = false
				// console.log(`mouseleave target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
			}
		})

		canvas.addEventListener('wheel', (e) => {
			if(this.root_mode)	return
			this.data.camera_dist = camera2.object3D.position.z
			this.data.camera_dist += e.deltaY/200
			this.data.camera_dist = Math.max(this.data.camera_dist,0)
			camera2.object3D.position.z = this.data.camera_dist
		});
	},
})
