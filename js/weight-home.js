$(function () {
	var weightIns = new WeightIns({
		id: '.insArrow|.insValueNum|.lasttime',
		lastTimeValue: 70.2,
		value: 100.889
	});

	var weight = document.getElementById('weight'),
		weightcanvas = weight.getContext('2d');

	var weightdata = {
		labels: ["3月2日", "5日", "8日", "16日", "1日", "5日", "12日"],
		datasets: [
			{
				fillColor: "rgba(151,187,205,0.5)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				data: [28, 48, 40, 19, 45, 27, 35]
		}
			]
	};

	var weightop = {
		pointDotRadius: 6,
		scaleFontSize: 12,
		scaleLineWidth:4,
		bezierCurve: false,
		pointDotStrokeWidth:2,
		scaleFontFamily: 'Microsoft YaHei',
		scaleFontColor: '#bfbfbf'
	};


	new Chart(weightcanvas).Line(weightdata, weightop);
})