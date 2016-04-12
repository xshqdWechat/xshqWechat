(function () {
	'use strict'
	var root = this; //window
	//			var	previous = root.CamryChart;

	var CamryChart = function (context) {
		var camrychart = this; //CamryChart

		this.canvas = context.canvas;
		this.ctx = context; //CanvasRenderingContext2D

		var computeDimension = function (element, dimension) {

			if (element['offset' + dimension]) {
				return element['offset' + dimension];
			} else {
				return document.defaultView.getComputedStyle(element).getPropertyValue(dimension);
			}
		};

		var width = this.width = computeDimension(this.canvas, 'Width') || context.canvas.width;

		var height = this.height = computeDimension(this.canvas, 'Height') || context.canvas.height;

		//		高清屏中会重置canvas的高和宽
		width = this.width = context.canvas.width;
		height = this.height = context.canvas.height;

		//		aspectRation 高宽纵横比 在移动端高像素屏必须先乘以比然后缩放,否则会模糊
		this.aspectRation = this.width / this.height;

		//retinaScale()
		return this;

	}

	var helpers = CamryChart.helpers = {};
	var each = helpers.each = function (loopable, callback, self) {
			var additionalArgs = Array.prototype.slice.call(arguments, 3);
			if (loopable) {
				if (loopable.length === +loopable.length) {
					for (var i = 0, len = loopable.length; i < len; i++) {
						callback.apply(self, [loopable[i], i].concat(additionalArgs));
					}
				} else {
					for (var item in loopable) {
						callback.apply(self, [loopable[item], item].concat(additionalArgs));
					}
				}
			}
		},
		clone = helpers.each = function (obj) {
			var objClone = {};
			each(obj, function (value, key) {
				if (obj.hasOwnProperty(key)) {
					objClone[key] = value;
				}
			});
			return objClone;
		},
		extend = helpers.extend = function (base) {
			each(Array.prototype.slice.call(arguments, 1),
				function (extensionObject) {
					each(extensionObject, function (value, key) {
						if (extensionObject.hasOwnProperty(key)) {
							base[key] = value;
						}
					});
				});
			return base;
		},
		merge = helpers.merge = function (base, master) {
			var args = Array.prototype.slice.call(arguments, 0);
			args.unshift({});
			return extend.apply(null, args);
		},
		indexOf = helpers.indexOf = function (arrayToSearch, item) {
			if (Array.prototype.indexOf) {
				return arrayToSearch.indexOf(item);
			} else {
				for (var i = 0, len = arrayToSearch.length; i < len; i++) {
					if (arrayToSearch[i] === item) return i;
				}
				return -1;
			}
		},
		where = helpers.where = function (collection, filterCallback) {
			var filtered = [];

			helpers.each(collection, function (item) {
				if (filterCallback(item)) {
					filtered.push(item)
				}
			});
			return filtered;
		};

	root.CamryChart = CamryChart;


}).call(this);

//体重仪表
(function () {
	var root = this,
		helpers = this.CamryChart.helpers;
	var WeightIns = function (data) {
		this.init(data);
	};
	//	内部方法
	var checkNumber = function (n) {
			if (typeof n == 'undefined') {
				console.log('请输入值！');
			}
			if (!isNaN(n) && n >= 0 && n <= 180) {
				return true;
			}
			return false;
		},
		bindValue = function (cur, last, eleContainer) {
			var betweenVal = cur - last;

			if (parseInt(betweenVal) >= 0) {
				$(eleContainer[2]).find('span').eq(0).addClass('heavy').html(betweenVal.toFixed(1));
			} else {
				$(eleContainer[2]).find('span').eq(0).addClass('light').html(betweenVal.toFixed(1));
			}

			var vmLh = document.defaultView.getComputedStyle(document.querySelector('.vmbox')).getPropertyValue('line-height');

			$('.vmbox').css('line-height', vmLh.slice(0, -2) - 50 + 'px');
			$(eleContainer[2]).css('opacity', 1);
		},
		animationValue = function (value, eleContainer, data) {
			var start = 0,
				cur = start,
				end = value,
				speed, increaAddVal;
			if (end <= 90) {
				speed = 2;
				increaAddVal = 0.2;
			} else if (end > 90 && end <= 130) {
				speed = 1;
				increaAddVal = 0.2;
			} else if (end > 130 && end <= 180) {
				speed = 1;
				increaAddVal = 0.3;
			}
			var animValue = setInterval(function () {
				$(eleContainer[1]).html((cur += increaAddVal).toFixed(1));
				if (cur > end) {
					var str = end + '',
						pointInd = str.indexOf('.'),
						lastNum = str.slice(pointInd + 1, pointInd + 2);
					$(eleContainer[1]).html(str.slice(0, pointInd + 1) + lastNum);
					clearInterval(animValue);
					bindValue(data.value, data.lastTimeValue, eleContainer);
				}
			}, speed);
		},
		getId = function (id) {
			if (id.indexOf('|') != -1) {
				var eleContainer;
				return eleContainer = id.split('|');
			}
		};
	// 公共方法
	var weightMethod = {
		init: function (data) {
			var eleContainer = getId(data.id),
				initData = {
					value: data.value,
					rotateDeg: data.value,
					showLastTime: false,
					lastTimeValue: data.lastTimeValue
				};

			this.update(initData, eleContainer);
		},
		update: function (data, eleContainer) {
			//			角度
			if (checkNumber(data.rotateDeg)) {
				data.rotateDeg -= 90;
				$(eleContainer[0]).css('transform', 'translate(-50%, 11px) rotate(' + data.rotateDeg + 'deg)');
			}
			//			数值
			animationValue(data.value, eleContainer, data);


		}
	};

	helpers.extend(WeightIns.prototype, weightMethod);
	root.WeightIns = WeightIns;

}).call(this);

//步数
(function () {
	var root = this;

	var RunData = function (value) {
		var rundata = this;
		this._MAX_STEPS = 60000; //must be number of type
		this.data = value;
		this.eleContainer = {};
		this.init();
	};
	var method = RunData.method = {};
	var each = method.each = function (data, callback, self) {
			if (data) {
				if (data.length === +data.length) {
					for (var i = 0, len = data.length; i < len; i++) {
						callback.apply(self, [i, data[i]]);
					}
				} else {
					for (var item in data) {
						callback.apply(self, [item, data[item]]);
					}
				}
			}
		},
		isobj = method.isobj = function (value) {
			if (Object.prototype.toString.call(value) == '[object Object]') {
				return true;
			} else {
				return false;
			}
		},
		calulate = method.calulatae = function (stepValue) {
			var percentage = 0;
			if (isobj(stepValue)) {
				this.step = stepValue.value;
			} else {
				this.step = stepValue;
			}

			if (this.step === +this.step) {
				percentage = ((this.step / this._MAX_STEPS) * 100).toFixed(2);
				if (!isNaN(percentage)) {
					return percentage;
				}
			} else {
				throw '步数必须为数字类型';
			}
		},
		getId = method.getId = function (key, value) {
			if (isobj(value)) {
				if (value.id.indexOf('|') != -1) {
					this.eleContainer[key] = value.id.split('|');
				} else {
					this.eleContainer[key] = value.id;
					if (this.eleContainer[key] == 'undefined') {
						throw '请输入数据相关的elementID';
					} else {
						if ($(this.eleContainer[key]).length == 0) {
							console.log('该页面无该ID，请重新输入');
						}
					}
				}

			}
		},
		bindValue = method.bindValue = function (key, value) {
			getId.apply(this, [key, value]);
			$(this.eleContainer[key]).html(isobj(value) ? value.value : value)
		},
		runpro = method.runpro = function (key, value, percent) {
			getId.apply(this, [key, value]);
			if (key == 'step') {
				$(this.eleContainer[key][0]).css('width', percent + '%');
				$(this.eleContainer[key][1]).html(isobj(value) ? value.value : value);

			}
		},
		//保留draw方法 canvas实现
		draw = method.draw = function (id) {
			var ctx = $(id)[0].getContext('2d'),
				canvas = ctx.canvas;

		},
		update = method.update = function (newdata) {
			each(newdata, function (key, value) {
				//如果传入值为步数则需要计算
				if (key === 'step') {
					var percent = calulate.apply(this, [value]);
					runpro.apply(this, [key, value, percent]);

				} else {
					bindValue.apply(this, [key, value]);
				}
			}, this);
		},
		init = method.init = function () {
			this.update(this.data)
		};

	RunData.prototype = method;

	root.RunData = RunData;
}).call(this);