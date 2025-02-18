const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;
let MousePos = [0,0];
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_segments = 10;
let g_globalRotateAngle = -45;
let g_globalRotateAngleY = 0;
let globalRotateX = 0;
let globalRotateY = 0;
let g_animation = true;
let g_specialAnimation = false;
let g_specialAnimationStartTime = null;
let g_camera = null;
let g_key_d = false;
let g_key_a = false;
let g_key_w = false;
let g_key_s = false;
let g_key_q = false;
let g_key_e = false;
let g_map = [];

function drawMap(){
  let tempCube = new Cube();
  for(let i = 0; i < g_map.length; i++){
    for(let j = 0; j < g_map[i].length; j++){
      if(g_map[i][j] == 1){
        tempCube.textureNum = 2; // Use the new texture for the maze cubes
        tempCube.matrix.setTranslate(j - g_map.length/2, 0, i - g_map.length/2);
        tempCube.matrix.scale(1, 5, 1);
        tempCube.matrix.translate(-0.5, -0.75, -0.5);

        tempCube.render();
      }
    }
  }
}

function setupWebGL() {
	// Retrieve <canvas> element
	canvas = document.getElementById("webgl");

	// Get the rendering context for WebGL
	// gl = getWebGLContext(canvas, {preserveDrawingBuffer: true});
  gl = getWebGLContext(canvas, false)
	if (!gl) {
		console.log("Failed to get the rendering context for WebGL");
		return;
	}

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  u_FragColor = gl.getAttribLocation(gl.program, "a_vertexColor");
  if (u_FragColor < 0) {
    console.log("Failed to get the storage location of a_vertexColor");
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");

  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if (a_UV < 0) {
    console.log("Failed to get the storage location of a_UV");
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2"); // Ensure this is retrieved
  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");

  let identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}



function initTextures() {
  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  var texture1 = gl.createTexture();
  if (!texture1) {
    console.log('Failed to create the texture1 object');
    return false;
  }
  image.onload = function(){ sendImageToTexture(image, 0, texture1); };
  image.src = 'lib/imgs/hotsky.jpeg';

  var image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  var texture2 = gl.createTexture();
  if (!texture2) {
    console.log('Failed to create the texture2 object');
    return false;
  }
  image2.onload = function(){ sendImageToTexture(image2, 1, texture2); };
  image2.src = 'lib/imgs/desertfloor.jpeg';

  // Load the new cube texture
  var image3 = new Image();
  if (!image3) {
    console.log('Failed to create the image object');
    return false;
  }
  var texture3 = gl.createTexture();
  if (!texture3) {
    console.log('Failed to create the texture3 object');
    return false;
  }
  image3.onload = function(){ sendImageToTexture(image3, 2, texture3); };
  image3.src = 'lib/imgs/cactus.jpeg';  // Change to your actual image path

  return true;
}



function sendImageToTexture(img, n, texture){
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  switch(n){
    case 0: gl.activeTexture(gl.TEXTURE0); break;
    case 1: gl.activeTexture(gl.TEXTURE1); break;
    case 2: gl.activeTexture(gl.TEXTURE2); break; // New texture case
    default: console.log("Error: Texture number not recognized");
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }

  if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  switch(n){
    case 0: gl.uniform1i(u_Sampler0, 0); break;
    case 1: gl.uniform1i(u_Sampler1, 1); break;
    case 2: gl.uniform1i(u_Sampler2, 2); break; // New texture uniform
    default: console.log("Error: Texture number not found");
  }
}


let randX1;
let randZ1;
let randX2;
let randZ2;
let randX3;
let randZ3;
let g_model;

function main() {
  // Set up canvas and gl variables
	setupWebGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();
  g_camera = new Camera();

  makeMaze();

  randX1 = Math.floor(Math.random() * 40)-20;
  randZ1 = Math.floor(Math.random() * 40)-20;
  randX2 = Math.floor(Math.random() * 40)-20;
  randZ2 = Math.floor(Math.random() * 40)-20;
  randX3 = Math.floor(Math.random() * 40)-20;
  randZ3 = Math.floor(Math.random() * 40)-20;

  canvas.onmousedown = function(ev){
    if(ev.buttons == 1){
      g_camera.mouseDown(ev);
    }
   };

  canvas.onmousemove = function(ev){
    if(ev.buttons == 1){
      g_camera.mouseMove(ev);
    }
  }

  document.onkeydown = function(ev) { keydown(ev.key); };
  document.onkeyup = function(ev) { keyUp(ev.key); };
  
  initTextures();
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

var currentAngle = 0.0;

var g_startTime = performance.now()/1000;
var g_seconds = performance.now()/1000 - g_startTime;

// var g_pressTime = performance.now()/1000;

function tick(){
  g_camera.move();

  g_seconds = performance.now()/1000 - g_startTime;
  // console.log(g_seconds);

  updateAnimationAngles();
  renderAllShapes();

  requestAnimationFrame(tick);
}

function updateAnimationAngles(){
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX;
	var y = ev.clientY;
	var rect = ev.target.getBoundingClientRect();

	x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
	y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return([x,y]);
}

function resetKeys(){
  g_key_d = false;
  g_key_a = false;
  g_key_w = false;
  g_key_s = false;
  g_key_q = false;
  g_key_e = false;
}

function keydown(ev){
  if(ev == 'd'){
    g_key_d = true;
  }
  if(ev == 'a'){
    g_key_a = true;
  }
  if(ev == 'w'){
    g_key_w = true;
  }
  if(ev == 's'){
    g_key_s = true;
  }
  if(ev == 'q'){
    g_key_q = true;
  }
  if(ev == 'e'){
    g_key_e = true;
  }
  if(ev == 'g'){
    g_camera.removeBlock();
  }

}

function keyUp(ev){
  if(ev == 'd'){
    g_key_d = false;
  }
  if(ev == 'a'){
    g_key_a = false;
  }
  if(ev == 'w'){
    g_key_w = false;
  }
  if(ev == 's'){
    g_key_s = false;
  }
  if(ev == 'q'){
    g_key_q = false;
  }
  if(ev == 'e'){
    g_key_e = false;
  }
}

function renderAllShapes(){
  // Check the time at the start of this function
  var startTime = performance.now();

  g_camera.update();
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);

  var globalRotMat = new Matrix4().rotate(0, 0, 1, 0).rotate(0, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderScene();

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + duration.toFixed(2) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, id){
  var htmlElm = document.getElementById(id);
  if(!htmlElm){
    console.log("Error: could not find HTML element with id: " + id);
    return;
  }
  htmlElm.innerHTML = text;
}

function renderScene(){
  var Floor = new Cube();
  Floor.color = [1,0,0,1];
  Floor.textureNum = 1;
  Floor.matrix.translate(0, -.8, 0);
  Floor.matrix.scale(50, -0.1, 50);
  Floor.matrix.translate(-0.5, -0.5, -0.5);
  Floor.render();

  var Sky = new Cube();
  Sky.color = [1,0,0,1];
  Sky.textureNum = 0;
  Sky.matrix.scale(50, 50, 50);
  Sky.matrix.translate(-0.5, -0.1, -0.5);
  Sky.render();

  drawMap();
  gl.uniform1i(u_whichTexture, -2);
  let dog1 = new Dog();
  dog1.translate(randX1,-0.2,randZ1);
  dog1.body.color = [0.5, 0.3, 0.1, 1];
  dog1.render();


  let horse = new Horse();
  horse.translate(randX2,-0.2,randZ2);
  horse.body.color = [0.6, 0.4, 0.2, 1];
  horse.render();

  let elephant = new Elephant();
  elephant.translate(randX3,-0.2,randZ3);
  elephant.render();


  // currentAngle = animate(currentAngle); // Update current rotation angle
  // drawObj(gl, currentAngle, g_model);

}



function makeMaze(){
  var map = [];
  for(var i = 0; i < 50; i++){
    map.push([]);
    for(var j = 0; j < 50; j++){
      map[i].push(1);
    }
  }

  function divide(x, y, w, h){
    if(w < 2 || h < 2){
      return;
    }
    let wall;
    let hole;
    var dir = Math.floor(Math.random() * 2);
    if(dir == 0){
      wall = Math.floor(Math.random() * (h-1)) + 1;
      hole = Math.floor(Math.random() * w);
      for(var i = 0; i < w; i++){
        if(i != hole){
          map[y+wall][x+i] = 0;
        }
      }
      divide(x, y, w, wall);
      divide(x, y+wall, w, h-wall);
    }else{
      wall = Math.floor(Math.random() * (w-1)) + 1;
      hole = Math.floor(Math.random() * h);
      for(var i = 0; i < h; i++){
        if(i != hole){
          map[y+i][x+wall] = 0;
        }
      }
      divide(x, y, wall, h);
      divide(x+wall, y, w-wall, h);
    }
  }

  divide(0, 0, 50, 50);

  for(var i = 22; i < 28; i++){
    for(var j = 22; j < 28; j++){
      map[i][j] = 0;
    }
  }

  g_map = map;
}


var FSHADER_SOURCE = `
precision mediump float;
varying vec2 v_UV;
varying vec4 u_FragColor;

uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform sampler2D u_Sampler2;
uniform int u_whichTexture;

void main() {
    if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;  // Use vertex color
    } else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
        gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else {
        gl_FragColor = u_FragColor;  // Ensure color is applied by default
    }
}

`

var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_vertexColor;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  varying vec4 u_FragColor;

  // attribute vec4 a_Normal;
  // uniform mat4 u_NormalMatrix;

  // uniform mat4 u_MvpMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    u_FragColor = a_vertexColor;
    // vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
  }
`


