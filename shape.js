var socket = (function() {
  var socket_;
  var data;

  var connect = function() {
    socket_ = new WebSocket('ws://literature.uncontext.com:80');
    socket_.onmessage = function(d) {
      data = JSON.parse(d.data);
      animate.newFrame(data);
    }
  }

  return {
    'connect': connect
  }

}());

var animate = (function() {
  var containers;
  var squares;
  var rotationPos = 0;
  var rotationNeg = 0;
  var dashOffset = 0;

  var rotateContainers = function(deg) {
    rotationPos += deg;
    rotationNeg -= deg;
    for (var i = 0; i < containers.length; i++) {
      if (i % 2) {
        containers[i].style.transform = 'rotate(' + rotationPos + 'deg)';
      } else {
        containers[i].style.transform = 'rotate(' + rotationNeg + 'deg)';
      }
    }
  }

  var modifyStroke = function(offset) {
    dashOffset += offset;
    for (var i = 0; i < squares.length; i++) {
      squares[i].style.strokeDashoffset = dashOffset;
    }
  }

  var newFrame = function(data) {
    rotateContainers(data.a);
    modifyStroke(data.b);
  }

  var init = function() {
    containers  = document.getElementsByClassName('container');
    squares     = document.getElementsByClassName('square');
    socket.connect();
  }

  return {
    'init': init,
    'newFrame': newFrame
  }
}());

var shape = (function() {

  var square = function(inner) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    el.setAttribute('class', 'square');
    el.setAttribute('x', 0);
    el.setAttribute('y', 0);
    el.setAttribute('width', inner);
    el.setAttribute('height', inner);
    el.setAttribute('stroke-width', 4);
    el.setAttribute('stroke', 'white');
    el.style.strokeDasharray = inner * 4 + 'px';

    return el;
  }

  return {
    'square': square
  }

}());

var canvas = (function() {
  var docWidth,
      docHeight;

  var container = document.getElementById('artboard');

  // ct -> container (SVG container)
  var ctInner   = 70;
  var ctMargin  = ctInner / 3;
  var ctOuter   = ctInner + ctMargin;

  var ctXCount,
      ctYCount,
      ctXOffset,
      ctYOffset;

  var setDimensions = function() {
    docWidth  = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    docHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    ctXCount  = Math.floor(docWidth / ctOuter);
    ctYCount  = Math.floor(docHeight / ctOuter);

    ctXOffset = (docWidth - (ctOuter * ctXCount)) / 2;
    ctYOffset = (docHeight - (ctOuter * ctYCount)) / 2;
  }

  var drawContainersL1 = function() {
    for (x = 0; x < ctXCount; x++) {
      for (y = 0; y < ctYCount; y++) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        el.setAttribute('class', 'container');
        el.setAttribute('width', ctInner);
        el.setAttribute('height', ctInner);
        el.style.left = Math.floor(ctXOffset + (ctOuter * x)) + (ctMargin / 2) + 'px';
        el.style.top = Math.floor(ctYOffset + (ctOuter * y)) + (ctMargin / 2) + 'px';

        var square = shape.square(ctInner);
        el.appendChild(square);

        container.appendChild(el);
      }
    }
  }

  var drawContainersL2 = function() {

  }

  var init = function() {
    setDimensions();
    drawContainersL1();
  }

  return {
    'init': init
  }

}());

canvas.init();
animate.init();