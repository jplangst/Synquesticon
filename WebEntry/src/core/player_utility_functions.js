export function getCurrentTime() {
  var dt = new Date();
  return dt.getTime();
}

export function getFormattedCurrentTime() {
  var dt = new Date();
  var currentTime = dt.toUTCString();
  return currentTime;
}

var myStorage = window.localStorage;
export function getDeviceName() {
  return myStorage.getItem('deviceID');
}

export function pointIsInPoly(p, polygon) {
    var isInside = false;

    var minX = polygon[0][0], maxX = polygon[0][0];
    var minY = polygon[0][1], maxY = polygon[0][1];
    for (var n = 1; n < polygon.length; n++) {
        var q = polygon[n];
        minX = Math.min(q[0], minX);
        maxX = Math.max(q[0], maxX);
        minY = Math.min(q[1], minY);
        maxY = Math.max(q[1], maxY);
    }

    if (p[0] < minX || p[0] > maxX || p[1] < minY || p[1] > maxY) {
        return false;
    }

    //copyright: https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    var i = 0, j = polygon.length - 1;
    for (i, j; i < polygon.length; j = i++) {
        if ( (polygon[i][1] > p[1]) != (polygon[j][1] > p[1]) &&
                p[0] < (polygon[j][0] - polygon[i][0]) * (p[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0] ) {
            isInside = !isInside;
        }
    }

    return isInside;
}
