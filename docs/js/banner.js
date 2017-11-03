

var Carousel = (function(){

    function _Carousel($ct){
        this.$ct = $ct;
        this.init();
        this.Event();
    }

    _Carousel.prototype = {
        init: function(){
            var _this = this;
            this.$imgCt = this.$ct.find('.img-ct'); // 图片容器节点
            this.$imgs = this.$ct.find('.img-ct li'); // 图片节点
            this.$up = this.$ct.find('.btn .up'); // 上一页节点
            this.$down = this.$ct.find('.btn .down'); //下一页节点
            this.$dotss = this.$ct.find('.dots>li'); //圆点上节点
            this.$dots = this.$ct.find('.dots');

            this.pageIndex = 0; //第几张
            this.isScroll = false; // 判断是否滚动

            this.quantity = this.$imgs.length; // 数量
            this.imgWidth = this.$imgs.width(); // 图片宽度

            this.$imgCt.append(this.$imgs.first().clone()); // 克隆第一张放置到最后面
            this.$imgCt.prepend(this.$imgs.last().clone()); // 克隆最后一张放置到最前面
            this.$imgCt.css({left: -this.imgWidth}); // 显示第一张

            this.timer = setInterval(function(){ _this.playDown(1) }, 2000);
            
        },

        Event: function(){
            var _this = this;
            // 上一页
            this.$up.on('click', function(e){
                e.preventDefault();
                _this.playUp(1);
                clearInterval(_this.timer);
            });
            // 下一页
            this.$down.on('click', function(e){
                e.preventDefault();
                _this.playDown(1);
                clearInterval(_this.timer);
            });
            // 圆点跳转
            this.$dotss.on('click', function(){
                _this.jump();
                var index = $(this).index();
                if(index < _this.pageIndex){
                    _this.playUp(_this.pageIndex - index);
                }else if(index > _this.pageIndex){
                    _this.playDown(index - _this.pageIndex);
                }
            });

            this.$imgs.on({
                'mouseenter': function(){
                    clearInterval(_this.timer);
                },
                'mouseleave': function(){
                    _this.timer = setInterval(function(){ _this.playDown(1) }, 2000);
                }
            });
            

        },

        playUp: function(len){
            var _this = this;
            if(this.isScroll){
                return;
            }
            this.isScroll = true;

            this.$imgCt.animate({
                left: "+=" + len*this.imgWidth
            }, function(){
                _this.pageIndex -= len;
                if(_this.pageIndex === -1){
                    _this.pageIndex = 2;
                    _this.$imgCt.css({left: -_this.imgWidth*_this.quantity});
                }
                _this.isScroll = false;
                _this.jump();
            });
        },

        playDown: function(len){
            var _this = this;
            if(this.isScroll){
                return;
            }

            this.isScroll = true;

            this.$imgCt.animate({
                left: "-=" + len*this.imgWidth
            }, function(){
                _this.pageIndex += len;
                if(_this.pageIndex === _this.quantity){
                    _this.pageIndex = 0;
                    _this.$imgCt.css({left: -_this.imgWidth});
                }
                _this.isScroll = false;
                _this.jump();
            });
            
        },

        jump: function(){
            this.$dotss.removeClass('hover')
                       .eq(this.pageIndex)
                       .addClass('hover');         
        },
    };


    return {
        init: function($node){
            $node.each(function(index, node){
                new _Carousel($(node));              
            });
        } 
    };

})();
