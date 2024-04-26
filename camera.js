const camera = () => ({
	schema: {
		view_mode: {type: 'bool', default: false},
		btn_pos: {type: 'vec2', default: {x:0, y:0}},
		view_pres_rad: {type: 'vec3', default: {x:0, y:0, z:0}},
		view_rad: {type: 'vec3', default: {x:0, y:0, z:0}},
		dis: {type: 'vec2', default: {x:0, y:0}},
		camera_dist: {type: 'float', default: 0},
	},
	
	init() {
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

		btn1.addEventListener('click', () => {
			// rotate("F");
			rotate("R U R' F' R U R' U' R' F R2 U' R' U'")
		});

		btn2.addEventListener('mousedown', (e) => {
			// console.log("mousedown");
			screen.style.display = "block"
			// console.log("this.view_mode "+this.data.view_mode)
			this.data.view_mode = true

			this.data.btn_pos.x = e.clientX
			this.data.btn_pos.y = e.clientY

			this.data.view_pres_rad = {x:this.data.view_rad.x, y:this.data.view_rad.y, z:this.data.view_rad.z}
		});

		btn2.addEventListener('wheel', (e) => {
			this.data.camera_dist += e.deltaY/200
			this.data.camera_dist = Math.max(this.data.camera_dist,0)
			camera2.object3D.position.z = this.data.camera_dist
		});

		screen.addEventListener('mouseup', () => {
			screen.style.display = "none"
			this.data.view_mode = false
		});

		screen.addEventListener('mousemove', (e) => {
			this.data.dis.x = e.clientX - this.data.btn_pos.x
			this.data.dis.y = e.clientY - this.data.btn_pos.y
			// console.log("\nview_pres_rad.x:"+this.data.view_pres_rad.x+" view_pres_rad.y:"+this.data.view_pres_rad.y)
			// console.log("dis.x:"+this.data.dis.x+" dis.y:"+this.data.dis.y)

			this.data.view_rad.y = this.data.view_pres_rad.y - this.data.dis.y
			this.data.view_rad.y = Math.min(Math.max(-50,this.data.view_rad.y),50)

			this.data.view_rad.x = this.data.view_pres_rad.x - this.data.dis.x
			a = ((this.data.view_rad.x + 50 ) % 100 ) - 50
			a = Math.min(Math.max(-50,a),50)

			// console.log("view_rad.x:"+this.data.view_rad.x+" view_rad.y:"+this.data.view_rad.y)

			ctx.clearRect(0, 0, 200, 200);

			ctx.beginPath();
			ctx.fillStyle = "#0f0";
			ctx.ellipse(50, 50, Math.abs(a), 50, 0, Math.PI * 2, 0);
			ctx.stroke();

			ctx.beginPath();
			ctx.fillStyle = "#00f";
			ctx.ellipse(50, 50, 50, Math.abs(this.data.view_rad.y), 0, Math.PI * 2, 0);
			ctx.stroke();

			camera.setAttribute("rotation", {x:this.data.view_rad.y * 1.8, y:this.data.view_rad.x * 1.8, z:0})
		});
	},
})

// export {presskeyboard}