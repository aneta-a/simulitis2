function Particle(city, state=Particle.STATES.HEALTHY, isolated = false) {
	
	this.city = city;

	this.size = this.city.params.particleSize;
	
	this.setState(state);
	this.isolated = ((this.state == Particle.STATES.CRITICAL || this.state == Particle.STATES.DEAD) ? true : isolated);
	
	this.r = {x: Math.random()*this.city.params.canvasWidth, y: Math.random()*this.city.params.canvasHeight}
	var phi = Math.random()*Math.PI*2;
	this.v = {dx: this.isolated ? 0 : this.city.params.speed*Math.cos(phi), dy: this.isolated ? 0 : this.city.params.speed*Math.sin(phi)}
	
	this.draw = function () {
		if (this.state == Particle.STATES.DEAD) {
			this.city.ctx.beginPath();
			this.city.ctx.moveTo(this.r.x, this.r.y-5);
			this.city.ctx.lineTo(this.r.x, this.r.y+10);
			this.city.ctx.moveTo(this.r.x-5, this.r.y);
			this.city.ctx.lineTo(this.r.x+5, this.r.y);
			this.city.ctx.moveTo(this.r.x-2, this.r.y+3);
			this.city.ctx.lineTo(this.r.x+2, this.r.y+7);
			this.city.ctx.lineWidth = 1;
			this.city.ctx.strokeStyle = Particle.STATE_COLORS[Particle.STATES.DEAD];
			this.city.ctx.stroke();
		} else if (this.state == Particle.STATES.CRITICAL){
			this.city.ctx.beginPath();
			this.city.ctx.moveTo(this.r.x-8, this.r.y);
			this.city.ctx.lineTo(this.r.x+8, this.r.y);
			this.city.ctx.moveTo(this.r.x, this.r.y-8);
			this.city.ctx.lineTo(this.r.x, this.r.y+8);
			this.city.ctx.lineWidth = 5;
			this.city.ctx.strokeStyle = Particle.STATE_COLORS[Particle.STATES.CRITICAL];
			this.city.ctx.stroke();
			if (!this.nonCared) {
				this.city.ctx.beginPath();
				this.city.ctx.arc(this.r.x, this.r.y, 10, 0, 2*Math.PI, false);
				this.city.ctx.lineWidth = 1;
				this.city.ctx.stroke();
			}
		} else {
			this.city.ctx.beginPath();
			this.city.ctx.arc(this.r.x, this.r.y, this.size/2, 0, 2*Math.PI, false);
			this.city.ctx.fillStyle = Particle.STATE_COLORS[this.state];
			this.city.ctx.fill();
			//this.city.ctx.strokeStyle = "#00000000";
			//this.city.ctx.stroke();
		}
	}
	
	this.city.addParticle(this); 

}
Particle.prototype = new Object();

var pp = Particle.prototype;

pp.update = function () {
	if (this.r.x < -this.v.dx || this.r.x > this.city.canvas.width - this.v.dx) this.v.dx = -this.v.dx;
	if (this.r.y < -this.v.dy || this.r.y > this.city.canvas.height - this.v.dy) this.v.dy = -this.v.dy;
	this.r.x += this.v.dx;
	this.r.y += this.v.dy;
	this.updateState();
	this.draw();
	//console.log("update particle", this.r);
}

pp.updateState = function() {
	this.stateTime ++;
	if (this.state == Particle.STATES.SICK && this.stateTime > this.city.params.criticalStart && Math.random() < this.city.params.criticalRate) {
		this.setState(Particle.STATES.CRITICAL);
	}
	if (this.state == Particle.STATES.SICK && this.stateTime > this.city.params.recoveryTime) {
		this.setState(Particle.STATES.RECOVERED);
	}
	if (this.state == Particle.STATES.CRITICAL && this.stateTime > this.city.params.criticalTime) {
		this.setState(Particle.STATES.RECOVERED);
	}
	if (this.state == Particle.STATES.CRITICAL) {
		if (!this.city.isCareFull()) this.nonCared = false;
		var deathRate = this.nonCared ? this.city.params.nonCaredFatality : this.city.params.caredFatality;
		if (Math.random() < deathRate) this.setState(Particle.STATES.DEAD);
	}

}
pp.setState = function(state){
	this.state = state;
	if (this.state == Particle.STATES.RECOVERED) this.isolate(false);
	if (this.state == Particle.STATES.CRITICAL) {
		this.isolate(true);
		this.nonCared = this.city.isCareFull();
	}
	this.stateTime = 0;
}

pp.isolate = function (arg) {
	this.isolated = arg;
	if (this.isolated)
		this.v = {dx: 0, dy: 0}
	else {
		var phi = Math.random()*Math.PI*2;
		this.v = {dx: this.city.params.speed*Math.cos(phi), dy: this.city.params.speed*Math.sin(phi)}
	}
}

pp.checkCollision = function ( p ) {

	if (this.state != Particle.STATES.DEAD && p.state != Particle.STATES.DEAD) {

		var dr = {x: p.r.x - this.r.x, y: p.r.y - this.r.y}
		var rx2 = dr.x**2;
		var ry2 = dr.y**2;
		var r = Math.sqrt(rx2 + ry2);
		
		if (r < (this.city.params.particleSize)) {
			var dv = {dx: p.v.dx - this.v.dx, dy: p.v.dy - this.v.dy}
			if (dv.dx*dr.x + dv.dy*dr.y < 0) {
				Particle.exchangeState(this, p);
			
				var rxy = dr.x*dr.y/r**2;
				rx2/=r**2;
				ry2/=r**2;
				var deltaV = {dx:rx2*dv.dx+rxy*dv.dy,  dy:rxy*dv.dx+ry2*dv.dy}
				
				if (this.isolated && !p.isolated) {
					p.v.dx -= 2*deltaV.dx;
					p.v.dy -= 2*deltaV.dy;
				} else if (p.isolated) {
					this.v.dx += 2*deltaV.dx;
					this.v.dy += 2*deltaV.dy;
				} else {
					this.v.dx += deltaV.dx;
					this.v.dy += deltaV.dy;
					p.v.dx -= deltaV.dx;
					p.v.dy -= deltaV.dy;
				}
			}	
		}
	}
}

Particle.STATES = {HEALTHY: "Healthy", SICK: "Sick", RECOVERED: "Recovered", CRITICAL: "Critical", DEAD: "Dead"}
Particle.STATE_COLORS = {Healthy: "gray", 
							Sick: "brown", 
							Recovered: "green", 
							Critical: "red", 
							Dead: "black"}

Particle.STATES_SORTED = [Particle.STATES.CRITICAL, Particle.STATES.SICK, Particle.STATES.HEALTHY, Particle.STATES.RECOVERED, Particle.STATES.DEAD ];
							
Particle.exchangeState = function(p1, p2) {
	if (p1.state == Particle.STATES.CRITICAL || p1.state == Particle.STATES.SICK) {
		if (p2.state == Particle.STATES.HEALTHY) p2.setState(Particle.STATES.SICK);
	}
	if (p2.state == Particle.STATES.CRITICAL || p2.state == Particle.STATES.SICK) {
		if (p1.state == Particle.STATES.HEALTHY) p1.setState(Particle.STATES.SICK);
	}
	
}
							
Particle.CollisionDuration = 5;
