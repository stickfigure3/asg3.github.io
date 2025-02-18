const Brown = [.5,.3,.1, 1];
const DarkBrown = [.3,.2,.1, 1];
const White = [1,1,1, 1];
const Black = [0, 0, 0, 1];
const LightBrown = [.4, .2, .1, 1];
const Gray = [0.5, 0.5, 0.5, 1];
const DarkGray = [0.3, 0.3, 0.3, 1];


let backRightLegJoint1 = 0;
let backRightLegJoint2 = 0;
let backRightLegJoint3 = 0;
let backLeftLegJoint1 = 0;
let backLeftLegJoint2 = 0;
let backLeftLegJoint3 = 0;
let frontRightLegJoint1 = 0;
let frontRightLegJoint2 = 0;
let frontRightLegJoint3 = 0;
let frontLeftLegJoint1 = 0;
let frontLeftLegJoint2 = 0;
let frontLeftLegJoint3 = 0;
let bodyJoint = 0;
let headJoint = 0;


class Dog {
    constructor() {
        this.type = "dog";
        this.bodyMatrix = null;
        this.headMatrix = null;

        // Body parts
        this.body = null;
        this.underBody = null;
        this.head = null;
        this.tail = null;

        // Face features
        this.outerEye = null;
        this.innerEye = null;
        this.nose = null;
        this.earLeft = null;
        this.earRight = null;

        // Legs
        this.femur = null;
        this.tibia = null;
        this.foot = null;
    }

    generateCubes() {
        // Body
        this.body = new Cube();
        this.underBody = new Cube();

        // Head
        this.head = new Cube();
        this.tail = new Cube();

        // Facial features
        this.outerEye = new Cube();
        this.innerEye = new Cube();
        this.nose = new Cube();
        this.earLeft = new Cube();
        this.earRight = new Cube();

        // Legs
        this.femur = new Cube();
        this.tibia = new Cube();
        this.foot = new Cube();
    }

    translate(x, y, z) {
        if (this.body == null) {
            this.generateCubes();
        }
        this.body.matrix.setTranslate(x, y, z);
    }

    drawEyes(position) {
        // Outer eye
        this.outerEye.color = White;
        this.outerEye.matrix = new Matrix4(this.headMatrix);
        this.outerEye.matrix.translate(position[0], position[1], position[2]);
        let outerEyeMatrix = new Matrix4(this.outerEye.matrix);
        this.outerEye.matrix.scale(0.1, 0.1, 0.1);
        this.outerEye.render();

        // Inner eye (pupil)
        this.innerEye.color = Black;
        this.innerEye.matrix = new Matrix4(outerEyeMatrix);
        this.innerEye.matrix.translate(-0.025, 0.025, 0.025);
        this.innerEye.matrix.scale(0.05, 0.05, 0.05);
        this.innerEye.render();
    }

    drawBody() {
        this.body.color = Brown;
        this.body.matrix.translate(-0.1, -0.2, 0.0);
        this.body.matrix.rotate(bodyJoint, 0, 0, 1);
        this.bodyMatrix = new Matrix4(this.body.matrix);
        this.body.matrix.scale(1.2, 0.3, 0.6);
        this.body.render();

        this.underBody.color = DarkBrown;
        this.underBody.matrix = new Matrix4(this.bodyMatrix);
        this.underBody.matrix.translate(-0.1, -0.15, 0.0);
        this.underBody.matrix.scale(1.2, 0.1, 0.6);
        this.underBody.render();
    }

    drawHead() {
        this.head.color = Brown;
        this.head.matrix = new Matrix4(this.bodyMatrix);
        this.head.matrix.translate(-0.4, 0.15, -0.0501);
        this.head.matrix.rotate(headJoint, 0, 0, 1);
        this.headMatrix = new Matrix4(this.head.matrix);
        this.head.matrix.scale(0.5, 0.4, 0.5);
        this.head.render();

        // Nose
        this.nose.color = Black;
        this.nose.matrix = new Matrix4(this.headMatrix);
        this.nose.matrix.translate(-0.05, 0.1, 0.2);
        this.nose.matrix.scale(0.1, 0.1, 0.1);
        this.nose.render();

        // Ears
        this.earLeft.color = DarkBrown;
        this.earLeft.matrix = new Matrix4(this.headMatrix);
        this.earLeft.matrix.translate(-0.05, 0.4, 0.05);
        this.earLeft.matrix.scale(0.15, 0.2, 0.1);
        this.earLeft.render();

        this.earRight.color = DarkBrown;
        this.earRight.matrix = new Matrix4(this.headMatrix);
        this.earRight.matrix.translate(-0.05, 0.4, 0.35);
        this.earRight.matrix.scale(0.15, 0.2, 0.1);
        this.earRight.render();

        // Draw eyes
        this.drawEyes([-0.05, 0.2, 0.1]);
        this.drawEyes([-0.05, 0.2, 0.3]);
    }

    drawLeg(position, right, front) {
        let angle1 = front ? frontRightLegJoint1 : backRightLegJoint1;
        let angle2 = front ? frontRightLegJoint2 : backRightLegJoint2;
        let angle3 = front ? frontRightLegJoint3 : backRightLegJoint3;

        this.femur.color = Brown;
        this.femur.matrix = new Matrix4(this.bodyMatrix);
        this.femur.matrix.translate(position[0], position[1], position[2]);

        if (right) {
            this.femur.matrix.rotate(angle1, 0, 0, 1);
        } else {
            this.femur.matrix.rotate(angle1, 0, 0, 1);
        }
        let tempFemurMatrix = new Matrix4(this.femur.matrix);
        this.femur.matrix.scale(0.15, -0.5, -0.15);
        this.femur.render();

        this.tibia.color = Brown;
        this.tibia.matrix = new Matrix4(tempFemurMatrix);
        this.tibia.matrix.translate(0, -0.5, 0);

        if (right) {
            this.tibia.matrix.rotate(angle2, 0, 0, 1);
        } else {
            this.tibia.matrix.rotate(angle2, 0, 0, 1);
        }
        let tempTibiaMatrix = new Matrix4(this.tibia.matrix);
        this.tibia.matrix.scale(0.15, -0.45, -0.1);
        this.tibia.render();

        this.foot.color = DarkBrown;
        this.foot.matrix = new Matrix4(tempTibiaMatrix);
        this.foot.matrix.translate(0, -0.45, 0);
        if (right) {
            this.foot.matrix.rotate(angle3, 0, 0, 1);
        } else {
            this.foot.matrix.rotate(angle3, 0, 0, 1);
        }
        this.foot.matrix.scale(0.15, 0.2, 0.1);
        this.foot.render();
    }

    drawTail() {
        this.tail.color = DarkBrown;
        this.tail.matrix = new Matrix4(this.bodyMatrix);
        this.tail.matrix.translate(0.9, 0.1, 0.2);
        this.tail.matrix.rotate(-45, 1, 0, 0);
        this.tail.matrix.scale(0.1, 0.4, 0.1);
        this.tail.render();
    }

    render() {
        if (this.body == null) {
            this.generateCubes();
        }

        this.drawBody();
        this.drawHead();
        this.drawTail();

        this.drawLeg([0.9, -0.2, 0.05], false, false);
        this.drawLeg([0.9, -0.2, 0.55], true, false);

        this.drawLeg([0.05, -0.1, 0.05], false, true);
        this.drawLeg([0.05, -0.1, 0.55], true, true);
    }
}



class Horse {
    constructor() {
        this.type = "horse";
        this.bodyMatrix = null;
        this.headMatrix = null;

        // Body parts
        this.body = null;
        this.underBody = null;
        this.head = null;
        this.tail = null;
        this.mane = null;

        // Face features
        this.outerEye = null;
        this.innerEye = null;
        this.nose = null;
        this.earLeft = null;
        this.earRight = null;

        // Legs
        this.femur = null;
        this.tibia = null;
        this.hoof = null;
    }

    generateCubes() {
        // Body
        this.body = new Cube();
        this.underBody = new Cube();

        // Head
        this.head = new Cube();
        this.tail = new Cube();
        this.mane = new Cube();

        // Facial features
        this.outerEye = new Cube();
        this.innerEye = new Cube();
        this.nose = new Cube();
        this.earLeft = new Cube();
        this.earRight = new Cube();

        // Legs
        this.femur = new Cube();
        this.tibia = new Cube();
        this.hoof = new Cube();
    }

    translate(x, y, z) {
        if (this.body == null) {
            this.generateCubes();
        }
        this.body.matrix.setTranslate(x, y, z);
    }

    drawEyes(position) {
        // Outer eye
        this.outerEye.color = White;
        this.outerEye.matrix = new Matrix4(this.headMatrix);
        this.outerEye.matrix.translate(position[0], position[1], position[2]);
        let outerEyeMatrix = new Matrix4(this.outerEye.matrix);
        this.outerEye.matrix.scale(0.1, 0.1, 0.1);
        this.outerEye.render();

        // Inner eye (pupil)
        this.innerEye.color = Black;
        this.innerEye.matrix = new Matrix4(outerEyeMatrix);
        this.innerEye.matrix.translate(-0.025, 0.025, 0.025);
        this.innerEye.matrix.scale(0.05, 0.05, 0.05);
        this.innerEye.render();
    }

    drawBody() {
        this.body.color = LightBrown;
        this.body.matrix.translate(-0.1, -0.3, 0.0);
        this.body.matrix.rotate(bodyJoint, 0, 0, 1);
        this.bodyMatrix = new Matrix4(this.body.matrix);
        this.body.matrix.scale(1.5, 0.4, 0.6);
        this.body.render();

        this.underBody.color = DarkBrown;
        this.underBody.matrix = new Matrix4(this.bodyMatrix);
        this.underBody.matrix.translate(-0.1, -0.2, 0.0);
        this.underBody.matrix.scale(1.5, 0.1, 0.6);
        this.underBody.render();
    }

    drawHead() {
        this.head.color = LightBrown;
        this.head.matrix = new Matrix4(this.bodyMatrix);
        this.head.matrix.translate(-0.6, 0.2, -0.0501);
        this.head.matrix.rotate(headJoint, 0, 0, 1);
        this.headMatrix = new Matrix4(this.head.matrix);
        this.head.matrix.scale(0.5, 0.35, 0.5);
        this.head.render();

        // Nose
        this.nose.color = Black;
        this.nose.matrix = new Matrix4(this.headMatrix);
        this.nose.matrix.translate(-0.05, 0.05, 0.2);
        this.nose.matrix.scale(0.15, 0.1, 0.1);
        this.nose.render();

        // Ears
        this.earLeft.color = DarkBrown;
        this.earLeft.matrix = new Matrix4(this.headMatrix);
        this.earLeft.matrix.translate(-0.05, 0.35, 0.1);
        this.earLeft.matrix.scale(0.1, 0.2, 0.1);
        this.earLeft.render();

        this.earRight.color = DarkBrown;
        this.earRight.matrix = new Matrix4(this.headMatrix);
        this.earRight.matrix.translate(-0.05, 0.35, 0.3);
        this.earRight.matrix.scale(0.1, 0.2, 0.1);
        this.earRight.render();

        // Draw eyes
        this.drawEyes([-0.05, 0.15, 0.1]);
        this.drawEyes([-0.05, 0.15, 0.3]);

        // Mane
        this.mane.color = Black;
        this.mane.matrix = new Matrix4(this.headMatrix);
        this.mane.matrix.translate(0.05, 0.35, 0.1);
        this.mane.matrix.scale(0.1, 0.3, 0.4);
        this.mane.render();
    }

    drawLeg(position, right, front) {
        let angle1 = front ? frontRightLegJoint1 : backRightLegJoint1;
        let angle2 = front ? frontRightLegJoint2 : backRightLegJoint2;
        let angle3 = front ? frontRightLegJoint3 : backRightLegJoint3;

        this.femur.color = LightBrown;
        this.femur.matrix = new Matrix4(this.bodyMatrix);
        this.femur.matrix.translate(position[0], position[1], position[2]);

        if (right) {
            this.femur.matrix.rotate(angle1, 0, 0, 1);
        } else {
            this.femur.matrix.rotate(angle1, 0, 0, 1);
        }
        let tempFemurMatrix = new Matrix4(this.femur.matrix);
        this.femur.matrix.scale(0.15, -0.6, -0.15);
        this.femur.render();

        this.tibia.color = LightBrown;
        this.tibia.matrix = new Matrix4(tempFemurMatrix);
        this.tibia.matrix.translate(0, -0.6, 0);

        if (right) {
            this.tibia.matrix.rotate(angle2, 0, 0, 1);
        } else {
            this.tibia.matrix.rotate(angle2, 0, 0, 1);
        }
        let tempTibiaMatrix = new Matrix4(this.tibia.matrix);
        this.tibia.matrix.scale(0.15, -0.5, -0.1);
        this.tibia.render();

        this.hoof.color = Black;
        this.hoof.matrix = new Matrix4(tempTibiaMatrix);
        this.hoof.matrix.translate(0, -0.5, 0);
        if (right) {
            this.hoof.matrix.rotate(angle3, 0, 0, 1);
        } else {
            this.hoof.matrix.rotate(angle3, 0, 0, 1);
        }
        this.hoof.matrix.scale(0.15, 0.2, 0.1);
        this.hoof.render();
    }

    drawTail() {
        this.tail.color = Black;
        this.tail.matrix = new Matrix4(this.bodyMatrix);
        this.tail.matrix.translate(1.3, 0.15, 0.25);
        this.tail.matrix.rotate(-45, 1, 0, 0);
        this.tail.matrix.scale(0.1, 0.4, 0.1);
        this.tail.render();
    }

    render() {
        if (this.body == null) {
            this.generateCubes();
        }

        this.drawBody();
        this.drawHead();
        this.drawTail();

        this.drawLeg([1.2, -0.3, 0.05], false, false);
        this.drawLeg([1.2, -0.3, 0.55], true, false);

        this.drawLeg([0.05, -0.2, 0.05], false, true);
        this.drawLeg([0.05, -0.2, 0.55], true, true);
    }
}


class Elephant {
    constructor() {
        this.type = "elephant";
        this.bodyMatrix = null;
        this.headMatrix = null;

        // Body parts
        this.body = null;
        this.head = null;
        this.underBody = null;
        this.tail = null;

        // Face features
        this.outerEye = null;
        this.innerEye = null;
        this.earLeft = null;
        this.earRight = null;
        this.trunk = null;
        this.tuskLeft = null;
        this.tuskRight = null;

        // Legs
        this.femur = null;
        this.tibia = null;
        this.foot = null;
    }

    generateCubes() {
        // Body
        this.body = new Cube();
        this.underBody = new Cube();

        // Head
        this.head = new Cube();
        this.tail = new Cube();
        this.trunk = new Cube();
        this.tuskLeft = new Cube();
        this.tuskRight = new Cube();

        // Facial features
        this.outerEye = new Cube();
        this.innerEye = new Cube();
        this.earLeft = new Cube();
        this.earRight = new Cube();

        // Legs
        this.femur = new Cube();
        this.tibia = new Cube();
        this.foot = new Cube();
    }

    translate(x, y, z) {
        if (this.body == null) {
            this.generateCubes();
        }
        this.body.matrix.setTranslate(x, y, z);
    }

    drawEyes(position) {
        // Outer eye
        this.outerEye.color = White;
        this.outerEye.matrix = new Matrix4(this.headMatrix);
        this.outerEye.matrix.translate(position[0], position[1], position[2]);
        let outerEyeMatrix = new Matrix4(this.outerEye.matrix);
        this.outerEye.matrix.scale(0.15, 0.15, 0.15);
        this.outerEye.render();

        // Inner eye (pupil)
        this.innerEye.color = Black;
        this.innerEye.matrix = new Matrix4(outerEyeMatrix);
        this.innerEye.matrix.translate(-0.05, 0.05, 0.05);
        this.innerEye.matrix.scale(0.05, 0.05, 0.05);
        this.innerEye.render();
    }

    drawBody() {
        this.body.color = Gray;
        this.body.matrix.translate(-0.2, -0.4, 0.0);
        this.body.matrix.rotate(bodyJoint, 0, 0, 1);
        this.bodyMatrix = new Matrix4(this.body.matrix);
        this.body.matrix.scale(2, 0.6, 1.2);
        this.body.render();

        this.underBody.color = DarkGray;
        this.underBody.matrix = new Matrix4(this.bodyMatrix);
        this.underBody.matrix.translate(-0.1, -0.3, 0.0);
        this.underBody.matrix.scale(2, 0.2, 1.2);
        this.underBody.render();
    }

    drawHead() {
        this.head.color = Gray;
        this.head.matrix = new Matrix4(this.bodyMatrix);
        this.head.matrix.translate(-0.7, 0.3, -0.05);
        this.head.matrix.rotate(headJoint, 0, 0, 1);
        this.headMatrix = new Matrix4(this.head.matrix);
        this.head.matrix.scale(0.7, 0.5, 0.6);
        this.head.render();

        // Trunk
        this.trunk.color = DarkGray;
        this.trunk.matrix = new Matrix4(this.headMatrix);
        this.trunk.matrix.translate(-0.3, -0.25, 0.25);
        this.trunk.matrix.scale(0.3, 0.5, 0.2);
        this.trunk.render();

        // Tusks
        this.tuskLeft.color = White;
        this.tuskLeft.matrix = new Matrix4(this.headMatrix);
        this.tuskLeft.matrix.translate(-0.4, -0.1, 0.1);
        this.tuskLeft.matrix.scale(0.2, 0.1, 0.1);
        this.tuskLeft.render();

        this.tuskRight.color = White;
        this.tuskRight.matrix = new Matrix4(this.headMatrix);
        this.tuskRight.matrix.translate(-0.4, -0.1, 0.4);
        this.tuskRight.matrix.scale(0.2, 0.1, 0.1);
        this.tuskRight.render();

        // Ears
        this.earLeft.color = DarkGray;
        this.earLeft.matrix = new Matrix4(this.headMatrix);
        this.earLeft.matrix.translate(-0.1, 0.3, 0.0);
        this.earLeft.matrix.scale(0.2, 0.4, 0.05);
        this.earLeft.render();

        this.earRight.color = DarkGray;
        this.earRight.matrix = new Matrix4(this.headMatrix);
        this.earRight.matrix.translate(-0.1, 0.3, 0.55);
        this.earRight.matrix.scale(0.2, 0.4, 0.05);
        this.earRight.render();

        // Draw eyes
        this.drawEyes([-0.1, 0.2, 0.1]);
        this.drawEyes([-0.1, 0.2, 0.4]);
    }

    drawLeg(position, right, front) {
        let angle1 = front ? frontRightLegJoint1 : backRightLegJoint1;
        let angle2 = front ? frontRightLegJoint2 : backRightLegJoint2;
        let angle3 = front ? frontRightLegJoint3 : backRightLegJoint3;

        this.femur.color = Gray;
        this.femur.matrix = new Matrix4(this.bodyMatrix);
        this.femur.matrix.translate(position[0], position[1], position[2]);

        this.femur.matrix.rotate(angle1, 0, 0, 1);
        let tempFemurMatrix = new Matrix4(this.femur.matrix);
        this.femur.matrix.scale(0.2, -0.7, -0.2);
        this.femur.render();

        this.tibia.color = Gray;
        this.tibia.matrix = new Matrix4(tempFemurMatrix);
        this.tibia.matrix.translate(0, -0.7, 0);

        this.tibia.matrix.rotate(angle2, 0, 0, 1);
        let tempTibiaMatrix = new Matrix4(this.tibia.matrix);
        this.tibia.matrix.scale(0.2, -0.6, -0.15);
        this.tibia.render();

        this.foot.color = DarkGray;
        this.foot.matrix = new Matrix4(tempTibiaMatrix);
        this.foot.matrix.translate(0, -0.6, 0);
        this.foot.matrix.rotate(angle3, 0, 0, 1);
        this.foot.matrix.scale(0.2, 0.2, 0.15);
        this.foot.render();
    }

    drawTail() {
        this.tail.color = DarkGray;
        this.tail.matrix = new Matrix4(this.bodyMatrix);
        this.tail.matrix.translate(1.7, 0.1, 0.5);
        this.tail.matrix.rotate(-45, 1, 0, 0);
        this.tail.matrix.scale(0.1, 0.5, 0.1);
        this.tail.render();
    }

    render() {
        if (this.body == null) {
            this.generateCubes();
        }

        this.drawBody();
        this.drawHead();
        this.drawTail();

        this.drawLeg([1.5, -0.4, 0.1], false, false);
        this.drawLeg([1.5, -0.4, 0.9], true, false);

        this.drawLeg([0.2, -0.3, 0.1], false, true);
        this.drawLeg([0.2, -0.3, 0.9], true, true);
    }
}




