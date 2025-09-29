let bgImage;
let thumbsImage;
let approvedImage;
let glassesImage;
let isPointing = false;
// ----=  HANDS  =----
function prepareInteraction() {
  bgImage = loadImage('/images/background.png');
  thumbsImage = loadImage('/images/thumbs_up.png');
  approvedImage = loadImage('/images/approved_bg.png');
  glassesImage = loadImage('/images/glasses.png');
}

function drawInteraction(faces, hands) {

  // hands part
  // USING THE GESTURE DETECTORS (check their values in the debug menu)
  // detectHandGesture(hand) returns "Pinch", "Peace", "Thumbs Up", "Pointing", "Open Palm", or "Fist"

  // for loop to capture if there is more than one hand on the screen. This applies the same process to all hands.
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    if (showKeypoints) {
      drawPoints(hand)
      drawConnections(hand)
    }
    // console.log(hand);
    let indexFingerTipX = hand.index_finger_tip.x;
    let indexFingerTipY = hand.index_finger_tip.y;

    let middleFingerMcpX = hand.middle_finger_mcp.x;
    let middleFingerMcpY = hand.middle_finger_mcp.y;

    /*
    Start drawing on the hands here
    */
   let whatGesture = detectHandGesture(hand)

    // if (whatGesture == "Peace") {
    //   fill(255, 38, 219) // pink
    // }
    if (whatGesture == "Thumbs Up") {
      image(thumbsImage, middleFingerMcpX, middleFingerMcpY, 200, 200);
      image(approvedImage, 0, 0, width/5, height/5);
    }
    if (whatGesture == "Pointing") {
      // Draw glasses on all detected faces when pointing gesture is detected
      isPointing = true;
    }else{
      isPointing = false;
    }
    // if (whatGesture == "Open Palm") {
    //   fill(0, 255, 255) // cyan
    // }

    if (hand.handedness === "Right") {
      //rect(middleFingerMcpX, middleFingerMcpY, 100)
    }

    if (hand.handedness === "Left") {
     //ellipse(middleFingerMcpX, middleFingerMcpY, 100)
    }

    // pinchCircle(hand)
    fill(225, 225, 0);
    ellipse(indexFingerTipX, indexFingerTipY, 30, 30);

    /*
    Stop drawing on the hands here
    */
  }



  //------------------------------------------------------------
  //facePart
  // for loop to capture if there is more than one face on the screen. This applies the same process to all faces. 
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i]; // face holds all the keypoints of the face
    if (showKeypoints) {
      drawPoints(face)
    }
    // console.log(face);
    /*
    Once this program has a face, it knows some things about it.
    This includes how to draw a box around the face, and an oval. 
    It also knows where the key points of the following parts are:
     face.leftEye
     face.leftEyebrow
     face.lips
     face.rightEye
     face.rightEyebrow
    */

    /*
    Start drawing on the face here
    */

    // Here are some variables you may like to use. 
    // Face basics
    let faceCenterX = face.faceOval.centerX;
    let faceCenterY = face.faceOval.centerY;
    let faceWidth = face.faceOval.width;
    let faceheight = face.faceOval.height;
    // Left eye
    let leftEyeCenterX = face.leftEye.centerX;
    let leftEyeCenterY = face.leftEye.centerY;
    let leftEyeWidth = face.leftEye.width;
    let leftEyeHeight = face.leftEye.height;
    // Left eyebrow
    let leftEyebrowCenterX = face.leftEyebrow.centerX;
    let leftEyebrowCenterY = face.leftEyebrow.centerY;
    let leftEyebrowWidth = face.leftEyebrow.width;
    let leftEyebrowHeight = face.leftEyebrow.height;

    // Lips
    let lipsCenterX = face.lips.centerX;
    let lipsCenterY = face.lips.centerY;
    let lipsWidth = face.lips.width;
    let lipsHeight = face.lips.height;

    // Right eye
    let rightEyeCenterX = face.rightEye.centerX;
    let rightEyeCenterY = face.rightEye.centerY;
    let rightEyeWidth = face.rightEye.width;
    let rightEyeHeight = face.rightEye.height;

    // Right eyebrow
    let rightEyebrowCenterX = face.rightEyebrow.centerX;
    let rightEyebrowCenterY = face.rightEyebrow.centerY;
    let rightEyebrowWidth = face.rightEyebrow.width;
    let rightEyebrowHeight = face.rightEyebrow.height;

    let noseTipX = face.keypoints[4].x;
    let noseTipY = face.keypoints[4].y;

    fill(225, 225, 0);
    ellipse(leftEyeCenterX, leftEyeCenterY, leftEyeWidth, leftEyeHeight);
    if (isPointing) {
    drawPoints(face.leftEye);
    drawPoints(face.leftEyebrow);
    drawPoints(face.lips);
    drawPoints(face.rightEye);
    drawPoints(face.rightEyebrow);
    }
    /*
    Stop drawing on the face here
    */

  }
  //------------------------------------------------------
  // You can make addtional elements here, but keep the face drawing inside the for loop. 

}

function areTheseTouching(x1, y1, x2, y2, threshhold) {
  let d = dist(x1, y1, x2, y2)

  if (d < threshhold) {
    return true;
  } 
  else {
    return false;
  }
}


function drawConnections(hand) {
  // Draw the skeletal connections
  push()
  for (let j = 0; j < connections.length; j++) {
    let pointAIndex = connections[j][0];
    let pointBIndex = connections[j][1];
    let pointA = hand.keypoints[pointAIndex];
    let pointB = hand.keypoints[pointBIndex];
    stroke(255, 0, 0);
    strokeWeight(2);
    line(pointA.x, pointA.y, pointB.x, pointB.y);
  }
  pop()
}

function pinchCircle(hand) { // adapted from https://editor.p5js.org/ml5/sketches/DNbSiIYKB
  // Find the index finger tip and thumb tip
  let finger = hand.index_finger_tip;
  //let finger = hand.pinky_finger_tip;
  let thumb = hand.thumb_tip;

  // Draw circles at finger positions
  let centerX = (finger.x + thumb.x) / 2;
  let centerY = (finger.y + thumb.y) / 2;
  // Calculate the pinch "distance" between finger and thumb
  let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

  // This circle's size is controlled by a "pinch" gesture
  fill(0, 255, 0, 200);
  stroke(0);
  strokeWeight(2);
  circle(centerX, centerY, pinch);

}


// This function draw's a dot on all the keypoints. It can be passed a whole face, or part of one. 
function drawPoints(feature) {

  push()
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 5);
  }
  pop()

}