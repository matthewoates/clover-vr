// note: before implementing based off of this, you can instead grab the boneHand plugin, which does this all for you,
// better than the way it is done here.
// https://developer.leapmotion.com/gallery/bone-hands
// If you prefer to see exactly how it all works, read on..

          var rotation = new THREE.Matrix3();
          rotation.set(1,0,0,0,0,-1,0,-1,0);
  var colors = [0xff0000, 0x00ff00, 0x0000ff];
  var baseBoneRotation = (new THREE.Quaternion).setFromEuler(
      new THREE.Euler(Math.PI / 2, 0, 0)
      //new THREE.Euler(0, 0, 0)
  );
  var jointDefaultColor = 0x0088ce;
  Leap.loop({background: true}, {
    hand: function (hand) {
      console.log('hand()');
      console.log(hand.sphereRadius);
      var jointColor = jointDefaultColor;
      if(hand.sphereRadius < 40 /* magic number */ ) {
        jointColor = 0xff0000;
        var palmPosition = hand.palmPosition;
        var cameraPosition = camera.position;
        var intersectedBox = null;
        groups.forEach(function(item, i) {
          var itemBoundingBox = item.boundingBox;
          if(itemBoundingBox.min.x <= palmPosition.x + cameraPosition.x) {
            
          }
        })
      }
      hand.fingers.forEach(function (finger) {

        // This is the meat of the example - Positioning `the cylinders on every frame:
        finger.data('boneMeshes').forEach(function(mesh, i){
          var bone = finger.bones[i];

          mesh.position.fromArray(bone.center());

          mesh.setRotationFromMatrix(
            (new THREE.Matrix4).fromArray( bone.matrix() )
          );

          mesh.quaternion.multiply(baseBoneRotation);
          swapAxes(mesh.position);

          // swapAxes(mesh.rotation);
          mesh.position.x += camera.position.x;
          mesh.position.y += camera.position.y;
          mesh.position.z += camera.position.z;

        });

        finger.data('jointMeshes').forEach(function(mesh, i){
          var bone = finger.bones[i];

          if (bone) {
            mesh.position.fromArray(bone.prevJoint);
          }else{
            // special case for the finger tip joint sphere:
            bone = finger.bones[i-1];
            mesh.position.fromArray(bone.nextJoint);
          }
          mesh.material.color.setHex(jointColor);
          swapAxes(mesh.position);
          mesh.position.x += camera.position.x;
          mesh.position.y += camera.position.y;
          mesh.position.z += camera.position.z;
        });

      });

      // fix orientation here
      var armMesh = hand.data('armMesh');

      armMesh.position.fromArray(hand.arm.center());

      armMesh.setRotationFromMatrix(
        (new THREE.Matrix4).fromArray( hand.arm.matrix() )
      );



      armMesh.quaternion.multiply(baseBoneRotation);

      swapAxes(armMesh);

      // we want to rotate armMesh by some angle

      // var G = {
      //   // dT:{type:"f" , value:0},
      //   // time:{type:"f" , value:0},
      //   // t_matcap:{ type:"t" , value: matcapDark },
      //   // t_blood:{ type:"t" , value: matcapDark },
      //   // fogColor:{ type:"v3" , value: new THREE.Vector3() },
      //   // t_audio:{type:"t",value:null},
      //   fingers:{ type:"v3", value:[] }
      // }

      // for( var i = 0; i < 25; i++ ){
      //     var r = G.fingers.value[i];
      //     var bI =  i % 5 ;                     // Bone index
      //     var fI = Math.floor( i / 5 );     // finger index
      //     var p = leapToScene( frame , frame.hands[0].fingers[fI].positions[bI] );
      //     if( VR == true ){
      //         // z is y || x is x ||  y is -z
      //         tv1.set( -p[0] , -p[2] , -p[1] );
      //         r.copy( camera.position );
      //         tv1.applyQuaternion( camera.quaternion );
      //         r.add( tv1 );
      //     }
      //     else{ 
      //       r.copy( camera.position );
      //       tv1.set( p[0] , p[1] -.3 , p[2] - .3 );
      //       r.add( tv1 );
      //     }

      // } // stuff copy pasted from https://github.com/cabbibo/RainbowMembrane/blob/gh-pages/index.html
      armMesh.scale.x = hand.arm.width / 2;
      armMesh.scale.z = hand.arm.width / 4;

    renderer.render(scene, camera);

  }})
    // these two LeapJS plugins, handHold and handEntry are available from leapjs-plugins, included above.
    // handHold provides hand.data
    // handEntry provides handFound/handLost events.
  .use('handHold')
  .use('handEntry')
  .on('handFound', function(hand){
    console.log('hand found!');

    hand.fingers.forEach(function (finger) {

      var boneMeshes = [];
      var jointMeshes = [];

      finger.bones.forEach(function(bone) {

        // create joints

        // CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
        var boneMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(5, 5, bone.length),
            new THREE.MeshPhongMaterial()
        );

        boneMesh.material.color.setHex(0xffffff);
        // scene.add(boneMesh);
        // boneMeshes.push(boneMesh);
      });

      for (var i = 0; i < finger.bones.length + 1; i++) {

        var jointMesh = new THREE.Mesh(
            new THREE.SphereGeometry(8),
            new THREE.MeshPhongMaterial()
        );

        jointMesh.material.color.setHex(0x0088ce);
        scene.add(jointMesh);
        jointMeshes.push(jointMesh);

      }


      finger.data('boneMeshes', boneMeshes);
      finger.data('jointMeshes', jointMeshes);

    });

    if (hand.arm){ // 2.0.3+ have arm api,
      // CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
      var armMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, hand.arm.length, 64),
        new THREE.MeshPhongMaterial()
      );

      armMesh.material.color.setHex(0xffffff);

      // scene.add(armMesh);

      hand.data('armMesh', armMesh);

    }

  })
  .on('handLost', function(hand){

    hand.fingers.forEach(function (finger) {

      var boneMeshes = finger.data('boneMeshes');
      var jointMeshes = finger.data('jointMeshes');

      boneMeshes.forEach(function(mesh){
        scene.remove(mesh);
      });

      jointMeshes.forEach(function(mesh){
        scene.remove(mesh);
      });

      finger.data({
        boneMeshes: null,
        boneMeshes: null
      });

    });

    var armMesh = hand.data('armMesh');
    scene.remove(armMesh);
    hand.data('armMesh', null);

    renderer.render(scene, camera);

  })
  .connect();

    function leapToScene( frame , position  ){
    var p =  position;  
    return [ 
      p[0] * .001,
      p[1] * .001,
      p[2] * .001
    ]
  }

function swapAxes(a) {
  var previousx = a.x,
      previousy = a.y,
      previousz = a.z;

  a.x = -previousx;
  a.y = -previousz;
  a.z = -previousy;

}
