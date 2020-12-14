/**
 * 
 */

var accelerationSensor = tizen.sensorservice.getDefaultSensor('LINEAR_ACCELERATION');
var accMonitor = document.getElementById('acc-monitor');
var accAvg = document.getElementById('acc-avg');
var accVar = document.getElementById('acc-var');
var accData = [];

function accStartSuccess() {
	console.log('sensor started successfully');
}

function accStartFail(err) {
	console.log('sensor start failed', err);
}

function getAccSuccess(data) {
	accData.push(data);
	showAcceleration(accMonitor, data);
}

function accelerationStart() {
	console.log('acceleration measurement start');
	accData = [];
	var initData = {x:0,y:0,z:0};
	showAcceleration(accMonitor, initData);
	showAcceleration(accAvg, initData);
	showAcceleration(accVar, initData);
	accelerationSensor.start(accStartSuccess, accStartFail);
	accelerationSensor.setChangeListener(getAccSuccess, 1000, 0);
}

function accelerationEnd() {
	console.log('acceleration measurement end');
	accelerationSensor.unsetChangeListener();
	accelerationSensor.stop();
	calculateStat();
}

function calculateStat() {
	var sumX = 0;
	var sumXSq = 0;
	var sumY = 0;
	var sumYSq = 0;
	var sumZ = 0;
	var sumZSq = 0;
	var len = accData.length;
	for(var i = 0; i < len; i++) {
		sumX = sumX + accData[i].x;
		sumXSq = sumXSq + accData[i].x * accData[i].x;
		sumY = sumY + accData[i].y;
		sumYSq = sumYSq + accData[i].y * accData[i].y;
		sumZ = sumZ + accData[i].z;
		sumZSq = sumZSq + accData[i].z * accData[i].z;
	}
	var avgX = sumX/len;
	var avgY = sumY/len;
	var avgZ = sumZ/len;
	var varX = sumXSq/len - avgX * avgX;
	var varY = sumYSq/len - avgY * avgY;
	var varZ = sumZSq/len - avgZ * avgZ;
	showAcceleration(accAvg, {x: avgX, y: avgY, z:avgZ});
	showAcceleration(accVar, {x: varX, y: varY, z:varZ});
}

function showAcceleration(elem, data) {
	var x = Math.round(data.x * 10000000000) / 10000000000;
	var y = Math.round(data.y * 10000000000) / 10000000000;
	var z = Math.round(data.z * 10000000000) / 10000000000;
	elem.innerHTML = x + ", " + y + ", " + z;
}

// add event handlers
(function(){
	var accStartBtn = document.getElementById('acc-start');
	var accEndBtn = document.getElementById('acc-end');
	accStartBtn.addEventListener('click', accelerationStart, true);
	accEndBtn.addEventListener('click', accelerationEnd, true);
}());