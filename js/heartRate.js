//触击事件
;(function ($) {
    var touch = {},
        touchTimeout;

    function parentIfText(node) {
        return 'tagName' in node ? node : node.parentNode;
    }

    function swipeDirection(x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2),
            yDelta = Math.abs(y1 - y2);
        return xDelta > yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    var longTapDelay = 750,
        longTapTimeout;

    function lontTap() {
        longTapTimeout = null;
        if (touch.last) {
            touch.el.trigger('longTap');
            touch = {};
        }
    }

    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout);
        longTapTimeout = null;
    }

    $(function () {
        var now, delta;
        $(document.body).on('touchstart', function (e) {
                now = Date.now();
                delta = now - (touch.last || now);
                touch.el = $(parentIfText(e.target));
                touchTimeout && clearTimeout(touchTimeout);
                touch.x1 = e.originalEvent.touches[0].pageX;
                touch.y1 = e.originalEvent.touches[0].pageY;
                if (delta > 0 && delta < 250) touch.isDoubleTap = true;
                touch.last = now;
                longTapTimeout = setTimeout(lontTap, longTapDelay);
            })
            .on('touchmove', function (e) {
                cancelLongTap();
                touch.x2 = e.originalEvent.touches[0].pageX;
                touch.y2 = e.originalEvent.touches[0].pageY;
            })
            .on('touchend', function (e) {
                cancelLongTap();
                if (touch.isDoubleTap) {
                    touch.el.trigger('doubleTap');
                    touch = {};
                } else if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
                    touch.el.trigger('swipe', [touch]) && touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)), [touch]);
                    touch = {};
                } else if ('last' in touch) {
                    touch.el.trigger('tap');

                    touchTimeout = setTimeout(function () {
                        touchTimeout = null;
                        touch.el.trigger('singleTap');
                        touch = {};
                    }, 250)
                }
            })
            .on('touchcancel', function () {
                if (touchTimeout) clearTimeout(touchTimeout);
                if (longTapTimeout) clearTimeout(longTapTimeout);
                longTapTimeout = touchTimeout = null;
                touch = {};
            })
    })

    ;
    ['swipe', 'swipeLeft', 'swipeRight', 'swipUp', 'swipDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function (m) {
        $.fn[m] = function (callback) {
            return this.on(m, callback);
        }
    })

}(jQuery))

//心率图
;(function () {
    var Root = this;

    function HeartRate(context, option) {
        this.ctx = context;
        this.x = 0;
        this.canvas = this.ctx.canvas;
        this.totalData = [];
        this.options = HeartRate.extend(HeartRate.extend({}, HeartRate.defalut), option);
        this.options.distance = this.canvas.width / this.options.distanceN;


        this.getData = function () {
            return this.totalData;
        }

        this.getDataLen = function () {
            return this.totalData.length;
        }

        this.getOptions = function () {
            return this.options;
        }
    }


    HeartRate.defalut = {
        distanceN: 10,
        overMove: 6,
        pointFillColor: '#fff',
        pointStrokeColor: '#fff',
        pointWidth: 5,
        pointSrtokeWidth: 0,
        lineColor: '#fff',
        bgColor: '#414b69',
        bgLineColor: '#525e7f',
        bgSafeColor: '#44576f'
    }

    HeartRate.extend = function (orin, exten) {
        for (var name in exten) {
            if (exten.hasOwnProperty(name)) {
                orin[name] = exten[name];
            }
        }
        return orin;
    }

    HeartRate.dataChange = function (h, value) {
        return h - value;
    }

    HeartRate.prototype.draw = function (data, move) {
        //        不是数组格式转换成数组
        if (Object.prototype.toString.call(data).slice(8, -1) != 'Array') {
            data = [HeartRate.dataChange(this.canvas.height, data)];
        }

        //        填充数据
        if (!move) Array.prototype.push.apply(this.totalData, data);


        this.bg(70, 100);
        this.drawPoint();
        this.drawLine();
    }

    //    背景
    HeartRate.prototype.bg = function (min, max) {
            var ctx = this.ctx,
                options = this.options,
                data = this.totalData,
                addtionW = options.distance * data.length;

            ctx.save();
            //        背景色
            ctx.fillStyle = options.bgColor;
            ctx.fillRect(0, 0, ctx.canvas.width + addtionW, ctx.canvas.height);
            ctx.restore();

            ctx.save();
            //        间隔线
            ctx.strokeStyle = options.bgLineColor;
            for (var i = 0, len = options.distanceN + 1 + data.length; i < len; i++) {
                ctx.beginPath();
                ctx.moveTo(i * options.distance, 0);
                ctx.lineTo(i * options.distance, ctx.canvas.height);
                ctx.stroke();
            }
            ctx.restore();

            ctx.save();
            //        安全线
            ctx.strokeStyle = options.bgSafeColor;
            ctx.beginPath();
            ctx.moveTo(0, ctx.canvas.height - min);
            ctx.lineTo(ctx.canvas.width + addtionW, ctx.canvas.height - min);
            ctx.moveTo(0, ctx.canvas.height - max);
            ctx.lineTo(ctx.canvas.width + addtionW, ctx.canvas.height - max);
            ctx.stroke();
            ctx.restore();
        }
        //点
    HeartRate.prototype.drawPoint = function () {
            var ctx = this.ctx,
                options = this.options,
                data = this.totalData;

            ctx.save();
            ctx.fillStyle = options.pointFillColor;
            ctx.strokeColor = options.pointStrokeColor;
            ctx.lineWidth = options.pointSrtokeWidth;
            for (var i = 0, len = data.length; i < len; i++) {
                ctx.beginPath();
                ctx.arc(i * options.distance, data[i], options.pointWidth, 0, 2 * Math.PI);
                ctx.fill();
                if (options.pointSrtokeWidth) ctx.stroke();

            }
            ctx.restore();
        }
        //连线
    HeartRate.prototype.drawLine = function () {
        var ctx = this.ctx,
            options = this.options,
            data = this.totalData;

        ctx.save();
        ctx.strokeStyle = options.lineColor;
        ctx.beginPath();
        for (var i = 0, len = data.length; i < len; i++) {
            ctx.moveTo(i * options.distance, data[i]);
//            ctx.lineTo((i + 1) * options.distance, data[i + 1]);
            ctx.bezierCurveTo(10+i * options.distance,-10+data[i],(i + 1) * options.distance, data[i + 1]);
        }
        ctx.stroke();
        ctx.restore();
    }

    //    拖动
    function Move(context, obj) {
        this.ctx = context;
        this.x = this.curPos = 0;
        this.obj = obj;
        this.time = 1000;
        this.setInt;
    }

    Move.prototype.moveStart = function (callback) {
        var ctx = this.ctx,
            self = this;
        if (callback) callback();
        this.setInt = setInterval(function () {
            ctx.save();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if (self.obj.totalData.length > self.obj.options.overMove) {
                self.curPos = self.x -= self.obj.options.distance;
                ctx.translate(self.x, 0);
            }
            var v = parseInt(Math.random() * 120) + 1;
            self.obj.draw(v);
            ctx.restore();
            console.log(self.curPos);

        }, this.time);
    }

    Move.prototype.moveEnd = function (callback) {
        if (this.setInt) {
            clearInterval(this.setInt);
            if (callback) callback();
        }
    }

    Move.prototype.drag = function (touch) {
        var ctx = this.ctx,
            self = this;
        this.moveEnd();
        var position = touch.x1 - touch.x2 > 0 ? -(Math.abs(touch.x1 - touch.x2)) : Math.abs(touch.x1 - touch.x2);

        this.curPos = position + this.curPos;
        if (this.curPos > 0) {
            this.curPos = 0;
        }else if(this.curPos < self.x){
            this.curPos = self.x;
        }
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.translate(this.curPos, 0);
        self.obj.draw(self.obj.totalData, true);
        ctx.restore();
    }


    Root.HeartRate = HeartRate;
    Root.Move = Move;

}).call(this)

//心率范围
;(function () {
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