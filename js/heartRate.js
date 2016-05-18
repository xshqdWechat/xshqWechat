//触击事件
;
(function ($) {
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
;
(function () {
    var Root = this;

    function HeartRate(context, option) {
        this.ctx = context;
        this.x = 0;
        this.canvas = this.ctx.canvas;
        this.totalData = [];
        this.options = HeartRate.extend(HeartRate.extend({}, HeartRate.defalut), option);
        this.options.distance = this.canvas.width / this.options.distanceN;

        //        视网膜屏 通过设置CSS来缩放的目的
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.pixeRetina = window.devicePixelRatio || 1;

        HeartRate.retinaScale(this);

        this.getData = function () {
            return this.totalData;
        };

        this.getDataLen = function () {
            return this.totalData.length;
        };

        this.addData = function (value) {
            this.totalData.push(HeartRate.dataChange(this.height, value));
        };

        this.getOptions = function () {
            return this.options;
        };
    }

    HeartRate.defalut = {
        distanceN: 10,
        overMove: 9,
        pointFillColor: '#6174b0',
        pointStrokeColor: '#fff',
        pointWidth: 5,
        pointSrtokeWidth: 0,
        lineColor: '#5e6a8f',
        lineWidth: 2,
        bgColor: '#2a2e3c',
        bgLineColor: '#323644',
        bgSafeColor: '#3a4a32'
    };

    HeartRate.retinaScale = function (self) {
        if (window.devicePixelRatio) {
            self.canvas.style.width = self.width + 'px';
            self.canvas.style.height = self.height + 'px';
            self.canvas.width = self.width * self.pixeRetina;
            self.canvas.height = self.height * self.pixeRetina;
            self.ctx.scale(self.pixeRetina, self.pixeRetina);
        }
    };

    HeartRate.extend = function (orin, exten) {
        for (var name in exten) {
            if (exten.hasOwnProperty(name)) {
                orin[name] = exten[name];
            }
        }
        return orin;
    };

    HeartRate.dataChange = function (h, value) {
        return h - value;
    };

    HeartRate.prototype.draw = function (data, move) {
        //        不是数组格式转换成数组
        if (Object.prototype.toString.call(data).slice(8, -1) != 'Array') {
            data = [HeartRate.dataChange(this.canvas.height, data)];
        }

        //        填充数据
        if (!move) Array.prototype.push.apply(this.totalData, data);


        this.bg(60, 100);
        this.drawLine();
//        this.drawPoint();
    };

    //    背景
    HeartRate.prototype.bg = function (min, max) {
        var ctx = this.ctx,
            options = this.options,
            data = this.totalData,
            addtionW = options.distance * data.length;

        //        背景色
        ctx.save();
        ctx.fillStyle = options.bgColor;
        ctx.fillRect(0, 0, ctx.canvas.width + addtionW, ctx.canvas.height);
        ctx.restore();

        //        间隔线
        ctx.save();
        ctx.strokeStyle = options.bgLineColor;
        for (var i = 0, len = options.distanceN + 1 + data.length; i < len; i++) {
            ctx.beginPath();
            ctx.moveTo(i * options.distance, 0);
            ctx.lineTo(i * options.distance, ctx.canvas.height);
            ctx.stroke();
        }
        ctx.restore();


        //        安全线
//        ctx.save();
//        ctx.strokeStyle = options.bgSafeColor;
//        ctx.lineWidth = 1;
//        ctx.beginPath();
//        ctx.moveTo(0, ((this.height - min) - this.min) * this.altitude);
//        ctx.lineTo(this.width + addtionW, ((this.height - min) - this.min) * this.altitude);
//        ctx.moveTo(0, ((this.height - max) - this.min) * this.altitude);
//        ctx.lineTo(this.width + addtionW, ((this.height - max) - this.min) * this.altitude);
//        ctx.stroke();
//        ctx.restore();

        //        坐标
        ctx.save();
        ctx.fillStyle = '#465279';
        ctx.font = '13px Microsoft YaHei';
        ctx.textBaseline="hanging";
        ctx.fillText(this.height - this.min, (data.length - options.overMove > 0 ? data.length - options.overMove : 0) * options.distance+5, this.corrected / 2 * this.altitude);
        ctx.fillText(this.height - this.max, (data.length - options.overMove > 0 ? data.length - options.overMove : 0) * options.distance+5, (this.max - this.min + this.corrected / 2) * this.altitude);
        ctx.restore();

    };
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
            ctx.arc(i * options.distance, (data[i] - this.min + this.corrected / 2) * this.altitude, options.pointWidth, 0, 2 * Math.PI);
            ctx.fill();
            if (options.pointSrtokeWidth) ctx.stroke();

        }
        ctx.restore();
    };
    //连线
    HeartRate.prototype.drawLine = function () {
        var ctx = this.ctx,
            options = this.options,
            data = this.totalData;

        ctx.save();
        var grd = ctx.createLinearGradient((data.length - options.overMove > 0 ? data.length - options.overMove : 0) * options.distance, 0, data.length*options.distance, 0);
        grd.addColorStop(0, "#323644");
        grd.addColorStop(0.5, "#688c41");
        grd.addColorStop(1, "#91ff00");
        ctx.strokeStyle = grd;
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY=15;
        ctx.shadowColor = '#262936';
//        ctx.strokeStyle = options.lineColor;
        ctx.lineWidth = options.lineWidth;
        ctx.beginPath();
        for (var i = 0, len = data.length; i < len; i++) {
            ctx.moveTo(i * options.distance, (data[i] - this.min + this.corrected / 2) * this.altitude);
//            ctx.lineTo((i + 1) * options.distance, (data[i + 1] - this.min + this.corrected / 2) * this.altitude);
            ctx.bezierCurveTo(i * options.distance+options.distance/2,(data[i] - this.min + this.corrected / 2) * this.altitude,i * options.distance+options.distance/2,(data[i+1] - this.min + this.corrected / 2) * this.altitude,(i + 1) * options.distance, (data[i + 1] - this.min + this.corrected / 2) * this.altitude);

        }
        ctx.stroke();
        ctx.restore();
    };

    //    拖动
    function Move(context, obj) {
        this.ctx = context;
        this.width = parseInt(this.ctx.canvas.width) / window.devicePixelRatio;
        this.height = parseInt(this.ctx.canvas.height) / window.devicePixelRatio;
        this.x = this.curPos = 0;
        this.obj = obj;
        this.start = true;
        this.time = 1000;
        this.setInt;
    }

    //    当前视图中的点差值每单位间距
    Move.curViewDIF = function (self) {
        var totalDataMax, totalDataMin, curViewData, DIF;
        //			当前视图中的数据也就是目前OVERMOVE所呈现的数据,长度为overMove
        curViewData = self.obj.totalData.slice(-self.obj.options.overMove);
        //			当前数据中最大值
        self.obj.max = totalDataMax = Math.max.apply(null, curViewData);
        //			当前数据中最小值，同时保存在实例对象中，方便实例计算
        self.obj.min = totalDataMin = Math.min.apply(null, curViewData);
        //			根据最大最小值求出他们之间的差值,用以计算差值之间每单位所占的高度
        DIF = Math.abs(totalDataMax - totalDataMin);

        //        上下限修正 防止最小值在最下面，最大值在最上面

        self.obj.corrected = Math.ceil(DIF / 5);
        
        if(self.obj.corrected == 0){
            self.obj.corrected = 10;
        }

        //			用画布的高度除以差值，求出差之间每单位所占的高度，并保存在实例对象中
        self.obj.altitude = Math.floor(self.height / (DIF + self.obj.corrected));
        
    }

    Move.prototype.moveStart = function (callback) {

        var ctx = this.ctx,
            self = this;
        this.start = true;
        if (callback !== undefined) callback();
        this.setInt = setInterval(function () {
            ctx.save();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            if (self.obj.totalData.length > self.obj.options.overMove) {
                self.curPos = self.x = -(self.obj.totalData.length - self.obj.options.overMove) * self.obj.options.distance;
                ctx.translate(self.x, 0);
            }

            Move.curViewDIF(self);
            self.obj.draw(self.obj.totalData[self.obj.totalData.length - 1], true);
            ctx.restore();

        }, this.time);
    };

    Move.prototype.moveEnd = function (callback) {
        if (this.setInt) {
            this.start = false;
            clearInterval(this.setInt);
            if (callback !== undefined) callback();
        }
    };

    Move.prototype.drag = function (touch) {
        var ctx = this.ctx,
            self = this;
        this.moveEnd();
        var position = touch.x1 - touch.x2 > 0 ? -(Math.abs(touch.x1 - touch.x2)) : Math.abs(touch.x1 - touch.x2);

        this.curPos = position + this.curPos;
        if (this.curPos > 0) {
            this.curPos = 0;
        } else if (this.curPos < self.x) {
            this.curPos = self.x;
        }
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.translate(this.curPos, 0);
        Move.curViewDIF(self);
        self.obj.draw(self.obj.totalData, true);
        ctx.restore();
    };


    Root.HeartRate = HeartRate;
    Root.Move = Move;

}).call(this)

//心率范围
;
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
        aveg: 160,
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