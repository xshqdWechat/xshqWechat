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


        width = this.width = context.canvas.width;
        height = this.height = context.canvas.height;

        console.log(width);
        console.log(height);

    }


    HeartRate.default = {
        bgColor: '#414b69',
        distanceColor: '#525e7f',
        safeLineColor: '#44576f',
        lineColor: '#fff',
        pointFillColor: '#fff',
        pointStrockColor: '#fff'
    }

    HeartRate.extend = function (orin, exten) {
        for (var name in exten) {
            if (exten.hasOwnProperty(name)) {
                orin[name] = exten[name];
            }
        }
        return orin;
    }


    var publicMethod = {
        draw: function (data, option) {
            var options = HeartRate.extend(HeartRate.extend({}, HeartRate.default), option);
            var n = 10,
                distanW = this.width / n;
            this.fillBg(options, n, distanW);
            this.bindData(data, n, distanW);
        },
        fillBg: function (options, n, distanW) {

            var ctx = this.ctx;

            //            填充背景颜色
            ctx.save();
            ctx.fillStyle = options.bgColor;
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.restore();

            //            分割线
            ctx.save();
            ctx.globalAlpha = .5;
            for (var i = 1; i < n; i++) {
                ctx.save()
                ctx.beginPath();
                ctx.strokeStyle = options.distanceColor;
                ctx.lineWidth = 1;
                ctx.moveTo(i * distanW, 0);
                ctx.lineTo(i * distanW, this.height);
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();

            //            安全范围

            ctx.save();
//                                    ctx.font = '12px Arial';
//                                    ctx.fillStyle = '#53a065';
//                                    ctx.fillText('60', 10, this.height - 60);
//                     ctx.fillText('100', 10, this.height - 100);
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
        bindData: function (data, options, n, distanW) {
            var ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = options.pointFillColor;
            for(var i=0;i<data.length;i++){
                ctx.arc()
            }
            

        }
    }



    HeartRate.extend(HeartRate.prototype, publicMethod);
    Root.HeartRate = HeartRate;

}).call(this)