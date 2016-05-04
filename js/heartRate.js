(function () {
    var Root = this;

    var HeartRate = function (context) {
        var heartrate = this;

        this.canvas = context.canvas;
        this.ctx = context;

        var computeDimension = function (element, dimension) {
            if (element['offset' + dimension]) {
                return element['offset' + dimension];
            } else {
                return document.defaultView.getComputedStyle(element).getPropertyValue(dimension);
            }
        }

        var width = this.width = computeDimension(this.canvas, 'Width') || context.canvas.width;

        var height = this.height = computeDimension(this.canvas, 'Height') || context.canvas.height;


        width = HeartRate.width = this.width = context.canvas.width;
        height = HeartRate.height = this.height = context.canvas.height;

        console.log(width);
        console.log(height);

    }

    HeartRate.additionX = 0;
    HeartRate.default = {
        bgColor: '#414b69',
        distanceColor: '#525e7f',
        safeLineColor: '#44576f',
        lineColor: '#fff',
        pointFillColor: '#fff',
        pointStrockColor: '#fff',
        pointWidth: 4
    }

    HeartRate.extend = function (orin, exten) {
        for (var name in exten) {
            if (exten.hasOwnProperty(name)) {
                orin[name] = exten[name];
            }
        }
        return orin;
    }

    //    转换数据
    HeartRate.heightPro = function heightPro(data) {
        var dataAfter = [];

        if (data.length === undefined) {
            data = [data];
        }
        for (var i = 0, len = data.length; i < len; i++) {
            dataAfter[i] = this.height - data[i];
        }
        return dataAfter;
    }


    //    扩展公共方法
    var publicMethod = {
        draw: function (data, option) {
            var n = 10,
                distanW = this.width / n,
                ctx = this.ctx;

            this.options = HeartRate.extend(HeartRate.extend({}, HeartRate.default), option);
            this.historyData = {
                x: '',
                y: '',
                len: data.length
            }
            this.distanW = distanW;

            ctx.clearRect(0, 0, this.width, this.height);
            this.fillBg(n, distanW);
            this.bindData(data, n, distanW);
        },
        //        画背景
        fillBg: function (n, distanW) {

            var ctx = this.ctx;

            //            填充背景颜色
            ctx.save();
            ctx.fillStyle = this.options.bgColor;
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.restore();

            //            分割线
            ctx.save();
            ctx.globalAlpha = .5;
            for (var i = 1; i < n; i++) {
                ctx.save()
                ctx.beginPath();
                ctx.strokeStyle = this.options.distanceColor;
                ctx.lineWidth = 1;
                ctx.moveTo(i * distanW, 0);
                ctx.lineTo(i * distanW, this.height);
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();

            //            安全范围

            ctx.save();
            //     ctx.font = '12px Arial';
            //     ctx.fillStyle = '#53a065';
            //     ctx.fillText('60', 10, this.height - 60);
            //     ctx.fillText('100', 10, this.height - 100);
            ctx.globalAlpha = .5;
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#53a065';
            ctx.beginPath();
            ctx.moveTo(0, this.height - 60);
            ctx.lineTo(this.width, this.height - 60);
            ctx.moveTo(0, this.height - 100);
            ctx.lineTo(this.width, this.height - 100);
            ctx.stroke();
            ctx.restore();
        },
        //        填充数据数组
        bindData: function (data, n, distanW) {
            var ctx = this.ctx,
                self = this;

            data = HeartRate.heightPro(data);
            ctx.save();
            ctx.fillStyle = this.options.pointFillColor;

            //            绘制数据点
            for (var i = 0; i < data.length; i++) {
                ctx.beginPath();
                ctx.arc(i * distanW, data[i], this.options.pointWidth, 0, 2 * Math.PI);
                ctx.fill();
            }
            this.historyData.x = (i - 1) * this.distanW;
            this.historyData.y = data[i - 1];
            ctx.restore();

            ctx.save()

            //            绘制连线
            ctx.strokeStyle = this.options.lineColor;
            for (var i = 0; i < data.length; i++) {
                ctx.beginPath();
                ctx.moveTo(i * distanW, data[i]);
                ctx.lineTo((i + 1) * distanW, data[i + 1]);
                ctx.stroke();
            }
            ctx.restore();
        },
        //        填充单个数据
        addData: function (value) {
            var ctx = this.ctx,
                value = HeartRate.heightPro(value);
            ctx.save();
            ctx.fillStyle = this.options.pointFillColor;
            ctx.strokeStyle = this.options.lineColor;
            ctx.beginPath();
            ctx.arc(this.historyData.len * this.distanW, value, this.options.pointWidth, 0, 2 * Math.PI);
            ctx.fill();


            if (this.historyData.len > 1) {
                ctx.beginPath();
                ctx.moveTo(this.historyData.x, this.historyData.y);
                ctx.lineTo(this.historyData.len * this.distanW, value[0]);
                ctx.stroke();
            }
            this.historyData.x = this.historyData.len * this.distanW;
            this.historyData.y = value[0];
            this.historyData.len++;
//            this.extenCanvas()
        },
        extenCanvas: function () {
            var ctx = this.ctx;
            console.log(HeartRate.additionX);
            ctx.translate(HeartRate.additionX--,0);
//            if (this.historyData.len > 7) {
//                ctx.translate();
//            }
        }
    }



    HeartRate.extend(HeartRate.prototype, publicMethod);
    Root.HeartRate = HeartRate;

}).call(this);

(function () {
    var Root = this;

    var HeartCur = function (option) {
        var heartcur = this;

        this.options = HeartCur.extend(HeartCur.extend({}, HeartCur.defalut), option)
    }

    HeartCur.extend = function (orin, exten) {
        for (var name in exten) {
            if (exten.hasOwnProperty(name)) {
                orin[name] = exten[name];
            }
        }
        return orin;
    };

    HeartCur.defalut = {
        aveg: 225,
        hrTip: [['心率处于正常水平，合理的生活习惯让你的心脏更加健康。', '#c4d3ff'], ['当前心率处于过缓水平，需向专业医生咨询详细情况。', '#d25b5b'], ['当前心率处于过速水平，需向专业医生咨询详细情况。', '#d2c85b']]
    }

    var publicMethod = {
        setHRValueCur: function (hr) {
            this.hr = hr;
            //                滑动条
            var divRang = $('.hrFeedbackbar'),
                //                滑动块
                hrCur = $('.heartrateCur'),
                //                心率显示
                hrdisplay = $('.heartRateicon'),
                hrdate = $('.hrtime'),
                divRangW = parseInt(divRang.width()),
                //                平均值算法0-60 60-100 options.aveg-100
                //                avegW/60 avegW/40 avegW/options.aveg-100
                //                然后根据值选择各个区段的平均值
                avegW = divRangW / 3,
                //                过缓
                slowW = avegW / 60,
                //                正常
                NormalW = avegW / 40,
                //                过快
                fastW = avegW / (this.options.aveg - 100),
                hrZone, hrRangPos;

            if (hr.value >= 60 && hr.value <= 100) {
                hrZone = 0;
            } else if (hr.value < 60 && hr.value >= 0) {
                hrZone = 1;
            } else if (this.hr.value <= this.options.aveg && this.hr.value > 10) {
                hrZone = 2;
            } else {
                hrZone = -1;
            }


            if (hrZone === 0) {
                hrRangPos = avegW + NormalW * (hr.value - 60);
            } else if (hrZone === 1) {
                hrRangPos = slowW * hr.value;
            } else if (hrZone === 2) {
                hrRangPos = avegW * 2 + fastW * (hr.value - 100);
            }

            hrdisplay.html(hr.value);
            hrdate.html(hr.date);
            hrCur.css({
                left: hrRangPos
            });

            this.hrTip(hrZone);
        },
        hrTip: function (hrZone) {
            var divTip = $('.hrFeedbackbtext');
            if (hrZone === 0) {
                divTip.html(this.options.hrTip[0][0]);
                divTip.css({
                    color: this.options.hrTip[0][1]
                })
            } else if (hrZone === 1) {
                divTip.html(this.options.hrTip[1][0]);
                divTip.css({
                    color: this.options.hrTip[1][1]
                })
            } else if (hrZone === 2) {
                divTip.html(this.options.hrTip[2][0]);
                divTip.css({
                    color: this.options.hrTip[2][1]
                })
            } else {
                divTip.html('你的心率已超出地球人的理解范围，请咨询专业医生。');
            }
        }
    }

    HeartCur.extend(HeartCur.prototype, publicMethod)
    Root.HeartCur = HeartCur;
}).call(this)