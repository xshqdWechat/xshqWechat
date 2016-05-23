(function ($) {
    function shadow(popUpDiv, closeBtn,okBtn) {
        var that = this;
        this.isOpen = false;
        if (popUpDiv !== undefined && typeof popUpDiv !== 'string') {
            Error.message = '需要传入弹出的层';
            throw Error;
        }
        if (closeBtn !== undefined && typeof closeBtn !== 'string') {
            Error.message = '需要传入负责关闭层的的元素';
            throw Error;
        }
        init(that, popUpDiv, closeBtn,okBtn);
    }

    function openWin(pc, sc, shadowDiv, pud) {
        shadowDiv.appendTo('body');
        pc.top = getH() - $(pud).height();
        pc.display = 'block';
        $(pud).css(pc);
        $('body').addClass('ovN');

    }

    function closeWin(pc, sc, shadowDiv, pud) {
        shadowDiv.remove();
        pc.top = getH(1);
        $(pud).css(pc);
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

        if (getTH) return th;
        return wh + st;
    }

    function init(that, pud, cbtn,okBtn) {
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
        sc.top = 0;
        shadowDiv.css(sc);
        //        计算需要弹出层放置最底部
        pc.top = getH(1);
        pc.position = 'absolute';
        pc.display = 'none';
        pc.zIndex = 1201;
        $(pud).css(pc);

        //        绑定关闭按钮
        $(cbtn).on('click', function () {
            closeWin(pc, sc, shadowDiv, pud);
            that.isOpen = false;
        });
        
        $(okBtn).on('click',function(){
            closeWin(pc, sc, shadowDiv, pud);
            that.isOpen = false;
        })

        //        绑定弹出
        $(that).on('click', function () {
            if (that.isOpen) {
                closeWin(pc, sc, shadowDiv, pud);
                that.isOpen = false;
            } else {
                openWin(pc, sc, shadowDiv, pud);
                that.isOpen = true;
            }
        })
    }
    
    $.fn.shadow = shadow;
    
}(jQuery))