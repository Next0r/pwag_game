const utilities = require("./engine.utilities");
const GL = utilities.getGLContext();

const clearWindow = () => {
  if (!GL) {
    return;
  }
  GL.clearColor(0, 0, 0, 1);
  GL.clear(GL.COLOR_BUFFER_BIT);
};

exports.clearWindow = clearWindow;
