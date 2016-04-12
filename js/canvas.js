$(function () {
	(function () {

		var rundatas = {
			step: {
				value: 0,
				id: '.cur-dataCol|.run-steps'
			},
			mileage: {
				value: 600,
				id: '.run-mileage-meters'
			},
			calorie: {
				value: 1000,
				id: '.run-calorie-kils'
			}
		}

		var myrun = new RunData(rundatas);


		var i = 0,
			j = 0,
			k = 0;


		setInterval(function () {
			i += 1;
			j++;
			k += 10;
			myrun.update({
				step: 0 + i
			});
			myrun.update({
				mileage: 600 + j
			});
			myrun.update({
				calorie: 1000 + k
			});
		}, 1000)




		//brief speeing
		var briefSleep = document.getElementById('sleeping'),
			briefSleepCanvas = briefSleep.getContext('2d'),
			sleepSource = 480,
			briefSleepData = [
				{
					value: 400,
					color: '#448aca'
						},
				{
					value: 60,
					color: '#00b7ee'
						},
				{
					value: 20,
					color: '#f05560'
						}
					],
			briefSleepOptin = {
				segmentShowStroke: false,
				percentageInnerCutout: 45,
				onAnimationComplete: function () {
					var dataShow = $('#datashow');
					var appendStr = '<div class="tac fs-18 fz-imp"><h6 class="fs-12 fz-hint">全天睡眠</h6><strong>' + sleepSource + '<span class="fs-15">分</span></strong></div>';
					dataShow.css({
						position: 'absolute',
						left: '50%',
						top: '50%'
					});
					dataShow.append(appendStr);
				}
			};

		var myBriefSleep = new Chart(briefSleepCanvas).Doughnut(briefSleepData, briefSleepOptin);

		
//		开关灯
		$('.light-btn').on('touchstart', function () {
			$(this).toggleClass('off');
		})

	}())

})