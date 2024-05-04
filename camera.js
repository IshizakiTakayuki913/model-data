
const camera = () => ({
	schema: {
		view_pres_rad: {type: 'vec3', default: {x:0, y:0, z:0}},
		dis: {type: 'vec2', default: {x:0, y:0}},
		camera_dist: {type: 'float', default: 0},
		rayCube: { type: 'selector' },
		rayFace: { type: 'selector' },
	},
	// dependency: ['raycaster'],

	init() {
		const btn1 = document.getElementById("btn1")
		const camera = document.getElementById("camera")
		const camera2 = document.getElementById("camera2")
		const canvas = document.getElementsByTagName('canvas')[0]
		const root = document.getElementById("root")

		this.data.camera_dist = camera2.object3D.position.z

		this.parts = undefined

		this.positionP = undefined
		this.zoom_mode = false
		this.root_mode = false

		this.mouse_or_touch = false

		this.plane = [
			document.getElementById('planeY'),
			document.getElementById('planeX'),
			document.getElementById('planeZ'),
		]

		this.index = ['planeY', 'planeX', 'planeZ']
		this.indexM = [
			{x:1, y:0, z:1},
			{x:0, y:1, z:1},
			{x:1, y:1, z:0},
		]

		this.atan = [
			["x","z"],
			["z","y"],
			["y","x"],
		]

		this.ziku = ['boxY', 'boxX', 'boxZ']
		this.rayFace
		this.targetFace = []
		this.startRad = []


		this.el.addEventListener('raycaster-intersection', (e) => {
			if (e.target !== this.data.rayFace) return; // 対応するレイキャスターのみ反応

			this.rayFace = e.target.components.raycaster
			for(let i=0;i<e.detail.els.length;i++){
				const ind = this.index.indexOf(e.detail.els[i].id)
				// console.log(`id [${e.detail.els[i].id}] index [${ind}]`)
				this.targetFace[ind] = e.detail.els[i]
			}
		})

		this.el.addEventListener('raycaster-intersection-cleared', (e) => {
			if (e.target !== this.data.rayFace) return; // 対応するレイキャスターのみ反応

			for(let i=0;i<e.detail.clearedEls.length;i++){
				const ind = this.index.indexOf(e.detail.clearedEls[i].id)
				this.targetFace[ind] = null
				// console.log(`id [${e.detail.clearedEls[i].id}] index [${ind}]`)
			}
		})

		root.addEventListener("mousedown", (e) => {
			if(this.root_mode)	return
			this.parts = e.target.parentElement.id
			// console.log(`mousedown ID [${e.target.parentElement.id}]`)

			const regex = /[^a-z]/g;
			const regex2 = /[^0-9]/g;
			const parts_type = this.parts.replace(regex, "")
			const be = this.parts.replace(regex2, "")
			if(!(parts_type === "edge" || parts_type === "center" || parts_type === "corner"))	return

			this.root_mode = true
			this.parts = be

			this.rayCube = this.data.rayCube.components.raycaster
			this.targetCube = e.target

			const pos = this.rayCube.getIntersection(this.targetCube)

			this.startRad[0] = Math.atan2(pos.point.x, pos.point.z)
			this.plane[0].object3D.position.y = pos.point.y
			this.plane[0].classList.add("ground")
			
			this.startRad[1] = Math.atan2(pos.point.z, pos.point.y)
			this.plane[1].object3D.position.x = pos.point.x
			this.plane[1].classList.add("ground")
			
			this.startRad[2] = Math.atan2(pos.point.y, pos.point.x)
			this.plane[2].object3D.position.z = pos.point.z
			this.plane[2].classList.add("ground")
		})

		this.el.addEventListener("raycaster-mouseup", (e) => {
			if(!this.root_mode)	return

			this.parts = undefined
			this.root_mode = false
			for(let i=0;i<3;i++)
				this.plane[i].classList.remove("ground")
			// console.log(`remove("clickable")`)
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
			this.mouse_or_touch = true
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
				camera.object3D.rotation.x = Math.max(Math.min(this.data.view_pres_rad.x - dx.y/150,85*Math.PI/180),-85*Math.PI/180)
			}
			else if(e.touches.length === 2 && this.zoom_mode){
				console.log(`touchmove 2 `)
				let pdx = Math.sqrt( Math.pow( e.touches[1].clientX - e.touches[0].clientX, 2) + Math.pow( e.touches[1].clientY - e.touches[0].clientY, 2) )
				let dx = Math.sqrt( Math.pow( this.positionP.x, 2) + Math.pow( this.positionP.y, 2) )
				camera2.object3D.position.z	= Math.max(this.data.camera_dist - ( pdx - dx )/70 , 0)
				
			}
		})

		canvas.addEventListener('touchend', (e) => {
			this.mouse_or_touch = false
			this.zoom_mode = false
			this.el.emit('raycaster-mouseup')
		})
		
		canvas.addEventListener('mousedown', (e) => {
			this.mouse_or_touch = true
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
				camera.object3D.rotation.x = Math.max(Math.min(this.data.view_pres_rad.x - dx.y/150,85*Math.PI/180),-85*Math.PI/180)
			}
		})
		
		canvas.addEventListener('mouseup', (e) => {
			this.mouse_or_touch = false
			this.el.emit('raycaster-mouseup')
			if(this.root_mode)	return
			// console.log(`mouseup target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
			this.mouse_ples = false
		})

		canvas.addEventListener('mouseleave', (e) => {
			this.mouse_or_touch = false
			if(e.target.tagName === 'CANVAS'){
				// console.log(`mouseleave target:${e.target.tagName} currentTarget:${e.currentTarget.tagName}`)
				this.mouse_ples = false
				this.el.emit('raycaster-mouseup')
			}
			if(this.root_mode)	return
		})

		canvas.addEventListener('wheel', (e) => {
			if(this.root_mode)	return
			this.data.camera_dist = camera2.object3D.position.z
			this.data.camera_dist += e.deltaY/200
			this.data.camera_dist = Math.max(this.data.camera_dist,0)
			camera2.object3D.position.z = this.data.camera_dist
		});
	},
	tick(){
		// console.log(this.targetFace)
		for(let i=0;i<3;i++){
			if (!this.rayFace || !this.targetFace[i]) continue;
			const item = this.rayFace.getIntersection(this.targetFace[i])
			// console.log(`  ${this.rayFace.id}`)
			// if(item === undefined || item == null)	continue
			const box = document.getElementById(this.ziku[i])
			box.object3D.position.copy({x:item.point.x * this.indexM[i].x, y:item.point.y * this.indexM[i].y, z:item.point.z * this.indexM[i].z})
			// console.log(Math.atan2(item.point[this.atan[i][0]], item.point[this.atan[i][1]]))

			// this.startRad[2] = 
			this.plane[i].children[0].setAttribute("value", (Math.atan2(item.point[this.atan[i][0]], item.point[this.atan[i][1]]) - this.startRad[i]) / (Math.PI/180))
			
		}
	},
	
})
