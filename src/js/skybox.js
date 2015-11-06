function prepareSkybox() {
    THREE.ImageUtils.loadTexture('img/bg-clouds.jpg', null, function (texture) {
        var shader = THREE.ShaderLib.cube;
        var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
        var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
        var geometry = new THREE.BoxGeometry( 100, 100, 100 );
        var object = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000, 1, 1, 1, null, true), material);

        object.position.x = 0;
        object.position.y = 0;
        object.position.z = 0;

        scene.add(object);
    }, function (error) {
        alert('error loading texture');
    });
};
