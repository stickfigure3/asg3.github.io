class Camera{
    constructor(){
        this.tempVector = new Vector3();

        this.fov = 60;
        this.eye = new Vector3([0,0,.1]);
        this.at = new Vector3([0,0,0]);
        this.up = new Vector3([0,1,0]);
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();

        // MouseMove vars
        this.lastCoords = [0,0];

        this.dogScore = 0;
        this.horseScore=0;
        this.elephantScore=0;

        this.update();
    }

    moveForward(mul = 0.1){
        this.tempVector.set(this.at);
        this.tempVector.sub(this.eye);
        this.tempVector.normalize();
        this.tempVector.mul(mul);
        this.at.add(this.tempVector);
        this.eye.add(this.tempVector);
    }

    moveBackward(mul = 0.1){
        this.tempVector.set(this.at);
        this.tempVector.sub(this.eye);
        this.tempVector.normalize();
        this.tempVector.mul(mul);
        this.at.sub(this.tempVector);
        this.eye.sub(this.tempVector);
    }

    moveLeft(mul = 0.1){
        // tempVector is forward
        this.tempVector.set(this.at);
        this.tempVector.sub(this.eye);
        this.tempVector.normalize();
        let side = Vector3.cross(this.up, this.tempVector);
        side.normalize();  
        side.mul(mul);
        this.at.add(side);
        this.eye.add(side);
    }

    moveRight(mul = 0.1){
        // tempVector is forward
        this.tempVector.set(this.at);
        this.tempVector.sub(this.eye);
        this.tempVector.normalize();
        let side = Vector3.cross(this.up, this.tempVector);
        side.normalize();
        side.mul(mul);
        this.at.sub(side);
        this.eye.sub(side);
    }

    panLeft(value = 1){
        this.tempVector.set(this.at);
        this.tempVector.sub(this.eye);
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(1 * value, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.tempVector = rotationMatrix.multiplyVector3(this.tempVector);
        this.at.set(this.eye);
        this.at.add(this.tempVector);
    }

    panRight(value = 1){
        this.tempVector.set(this.at);
        this.tempVector.sub(this.eye);
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-1 * value, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.tempVector = rotationMatrix.multiplyVector3(this.tempVector);
        this.at.set(this.eye);
        this.at.add(this.tempVector);
    }

    panUp(value = 1){
        // tempVector is forward
        this.tempVector.set(this.at);
        this.tempVector.sub(this.eye);
        this.tempVector.normalize();
        let normal = Vector3.cross(this.tempVector, this.up);
        normal.normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(1 * value, normal.elements[0], normal.elements[1], normal.elements[2]);
        this.tempVector = rotationMatrix.multiplyVector3(this.tempVector);
        this.at.set(this.eye);
        this.at.add(this.tempVector);
    }

    panDown(value = 1){
        // tempVector is forward
        this.tempVector.set(this.at);
        this.tempVector.sub(this.eye);
        this.tempVector.normalize();
        let normal = Vector3.cross(this.tempVector, this.up);
        normal.normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-1 * value, normal.elements[0], normal.elements[1], normal.elements[2]);
        this.tempVector = rotationMatrix.multiplyVector3(this.tempVector);
        this.at.set(this.eye);
        this.at.add(this.tempVector);
    }

    checkContraints(){
        if(this.at.elements[1] < -0.2){
            this.at.elements[1] = -0.2;
        }
        if(this.eye.elements[1] < -0.2){
            this.eye.elements[1] = -0.2;
        }
    }

    checkWin() {
    let foundDog = false;
    let foundHorse = false;
    let foundElephant = false;

    // Check if player is near the dog
    if ((this.at.elements[0] > randX1 - 1 && this.at.elements[0] < randX1 + 1) &&
        (this.at.elements[2] > randZ1 - 1 && this.at.elements[2] < randZ1 + 1)) {
        foundDog = true;
        this.dogScore += 1;
        randX1 = Math.floor(Math.random() * 40) - 20;
        randZ1 = Math.floor(Math.random() * 40) - 20;
    }
    if ((this.at.elements[0] > randX3 - 1 && this.at.elements[0] < randX3 + 1) &&
        (this.at.elements[2] > randZ3 - 1 && this.at.elements[2] < randZ3 + 1)) {
        foundElephant = true;
        this.elephantScore += 1;
        randX3 = Math.floor(Math.random() * 40) - 20;
        randZ3 = Math.floor(Math.random() * 40) - 20;
    }

    // Check if player is near the horse
    if ((this.at.elements[0] > randX2 - 1 && this.at.elements[0] < randX2 + 1) &&
        (this.at.elements[2] > randZ2 - 1 && this.at.elements[2] < randZ2 + 1)) {
        foundHorse = true;
        this.horseScore += 1;
        randX2 = Math.floor(Math.random() * 40) - 20;
        randZ2 = Math.floor(Math.random() * 40) - 20;
    }

    // Update Scoreboard
    if (foundDog || foundHorse || foundElephant) {
        document.getElementById("DogScore").innerHTML = `Dogs Found: ${this.dogScore}`;
        document.getElementById("HorseScore").innerHTML = `Horses Found: ${this.horseScore}`;
        document.getElementById("ElephantScore").innerHTML = `Elephants Found: ${this.elephantScore}`;


        // Show dog icon if score > 0
        if (this.dogScore > 0) {
            document.getElementById("dogIcon").style.display = "block";
        }
        if (this.elephantScore > 0) {
            document.getElementById("elephantIcon").style.display = "block";
        }
        // Show horse icon if score > 0
        if (this.horseScore > 0) {
            document.getElementById("horseIcon").style.display = "block";
        }
    }

    if (this.dogScore>2 && this.elephantScore > 2 && this.horseScore > 2){
        alert("You have found all the animals!!");
        this.dogScore =0;
        this.horseScore =0;
        this.elephantScore = 0;

    }

}


    update(){
        this.checkContraints();
        this.checkWin();
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.projectionMatrix.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
    }

    mouseMove(ev){
        let [x,y] = convertCoordinatesEventToGL(ev);

        if(this.lastCoords[0] > x){
            this.panLeft(Math.abs(this.lastCoords[0] - x) * 100);
        } else if(this.lastCoords[0] < x){
            this.panRight(Math.abs(this.lastCoords[0] - x) * 100);
        }

        if(this.lastCoords[1] < y){
            this.panUp(Math.abs(this.lastCoords[1] - y) * 100);
         } else if (this.lastCoords[1] > y){
            this.panDown(Math.abs(this.lastCoords[1] - y) * 100);
        }
        this.lastCoords = [x,y];
    }

    mouseDown(ev){
        this.lastCoords = convertCoordinatesEventToGL(ev);
    }

    move(){
        if(g_key_d){ this.moveRight(); }
        if(g_key_a){ this.moveLeft(); }
        if(g_key_w){ this.moveForward(); }
        if(g_key_s){ this.moveBackward(); }
        if(g_key_q){ this.panLeft(); }
        if(g_key_e){ this.panRight(); }
    }

    removeBlock(){
        let x = this.at.elements[0];
        let y = this.at.elements[1];
        let z = this.at.elements[2];

        x = Math.floor(x);
        z = Math.floor(z);

        x += 25;
        z += 25;


        if(g_map[z][x] != 0  && (y < 1 && y > -1)){
            g_map[z][x] = 0;
        } else if(y < 1 && y > -1){
            g_map[z][x] = 1;
        }
    }
}
