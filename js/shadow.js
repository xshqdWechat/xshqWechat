(function ($) {
    /**
     * 遮罩层
     * @param {string} popUpDiv 需要遮罩弹出的元素
     * @param {string} closeBtn 关闭按钮样式名
     * @param {string} okBtn    确定按钮样式名
     * @param {function} cloFun   关闭时回调函数
     * @param {function} okFun    确认时回调函数
     */
    function shadow(popDivPos,popUpDiv, closeBtn, okBtn, calFun, okFun) {
        var that = this;
        this.isOpen = false;
        this.position = popDivPos || 'bottom';
        console.log(this.position);
        if (popUpDiv !== undefined && typeof popUpDiv !== 'string') {
            Error.message = '需要传入弹出的层';
            throw Error;
        }
        if (closeBtn !== undefined && typeof closeBtn !== 'string') {
            Error.message = '需要传入负责关闭层的的元素';
            throw Error;
        }
        init(that, popUpDiv, closeBtn, okBtn, calFun, okFun);
    }

    function openWin(that, pc, sc, shadowDiv, pud) {
        shadowDiv.appendTo('body');
        sc.top = getH() - sc.height;
        shadowDiv.css(sc);
        //        默认底部
        pc.top = getH() - $(pud).height();
        
        if (that.position=='top') {
            //        顶部
            pc.top = getH() - getH(2)- $(pud).height();
        } else if (that.position=='center') {
            //        居中
            pc.top = getH() - getH(2) / 2 - $(pud).height() / 2;
        }

        pc.display = 'block';
        $(pud).css(pc);
        $('body').addClass('ovN');
        //点击遮罩层，关闭
        shadowDiv.on('click', function () {
            closeWin(that, pc, sc, shadowDiv, pud);
        });
        that.isOpen = false;
    }

    function closeWin(that, pc, sc, shadowDiv, pud) {
        shadowDiv.remove();
        pc.top = getH(1);
        $(pud).css(pc);
        that.isOpen = false;
        setTimeout(function () {
            $(pud).css('display', 'none');
            $('body').removeClass('ovN');

        }, 200);
    }

    function getH(getTH) {
        var rwh, wh, st, th;
        rwh = $(window).height();
        wh = window.innerHeight; // on iOS we need innerHeight
        wh = wh || rwh;
        st = $(window).scrollTop();
        th = $(document).height();

        if (getTH == 1) return th;
        if (getTH == 2) return wh;
        return wh + st;
    }

    function init(that, pud, cbtn, okBtn, calFun, okFun) {
        var pc = {},
            sc = {},
            ww, wh,
            shadowDiv = $('<div class="shaw"></div>');

        ww = $(window).width();
        wh = $(window).height();

        //        设置遮罩层样式
        sc.width = ww;
        sc.height = wh;
        sc.position = 'absolute';
        sc.backgroundColor = '#000';
        sc.opacity = .7;
        sc.zIndex = 1200;
        sc.top = getH() - wh;
        shadowDiv.css(sc);
        //        计算需要弹出层放置最底部
        pc.transition = 'top ease-in-out 0.26s';
        pc.top = getH(1);
        pc.position = 'absolute';
        pc.display = 'none';
        pc.zIndex = 1201;
        $(pud).css(pc);

        //        绑定关闭按钮
        $(cbtn).on('click', function () {
            closeWin(that, pc, sc, shadowDiv, pud);
            if (calFun) {
                calFun();
            }
        });

        $(okBtn).on('click', function () {
            closeWin(that, pc, sc, shadowDiv, pud);
            if (okFun) {
                okFun();
            }
        })

        //        绑定弹出
        $(that).on('click', function () {
            if (that.isOpen) {
                closeWin(that, pc, sc, shadowDiv, pud);
            } else {
                openWin(that, pc, sc, shadowDiv, pud);
            }
        })

    }

    $.fn.shadow = shadow;

}(jQuery))