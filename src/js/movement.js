var perspective_movement = {
  x_velocity: 0,
  y_velocity: 0,
  z_velocity: 0,
  y_rotation: 0
};

var W = 87,
    A = 65,
    S = 83,
    D = 68,
    Q = 81,
    E = 69;

    DOWN_ARROW = 40,
    UP_ARROW = 38;

window.onkeydown = function(e) {
    switch(e.keyCode) {
      case W: perspective_movement.y_velocity = 1; break;
      case A: perspective_movement.x_velocity = -1; break;
      case S: perspective_movement.y_velocity = -1; break;
      case D: perspective_movement.x_velocity = 1; break;
      case Q: perspective_movement.y_rotation = 0.05; break;
      case E: perspective_movement.y_rotation = -0.05; break;
      case UP_ARROW: perspective_movement.z_velocity = -1; break;
      case DOWN_ARROW: perspective_movement.z_velocity = 1; break;

    }
}


window.onkeyup = function(e) {
    switch(e.keyCode) {
      case W: perspective_movement.y_velocity = 0; break;
      case A: perspective_movement.x_velocity = 0; break;
      case S: perspective_movement.y_velocity = 0; break;
      case D: perspective_movement.x_velocity = 0; break;
      case Q: perspective_movement.y_rotation = 0; break;
      case E: perspective_movement.y_rotation = 0; break;
      case UP_ARROW: perspective_movement.z_velocity = 0; break;
      case DOWN_ARROW: perspective_movement.z_velocity = 0; break;
    }
}
