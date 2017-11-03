$(function(){
    // var goodId = location.search.splice(1) 截取问号后面的
    // 获取该商品的ID， 唯一
    var ID = location.search.replace('?', ''); //  替换的方法，把问号替换成空字符
    var userName = ''; // 未登录时
    if($.cookie('loginUser')){
        userName = $.cookie('loginUser');// 登录时的用户名
    }
    console.log('产品ID：' + ID)
    console.log('登录用户:'+ userName)

    if( ID == ''){
        alert('没有产品');
    }else {
        getPageData();
    }

    // 获取数据的函数
    function getPageData(){
        $.getJSON({
            'url': '../json/goodlist.json',
            'success': function(res){
                //  respanse 是ajax 请求成功时的返回值 res 是缩写
                // 刷新页面 更新详情
                callback(res);
            },
            'error': function(){
                alert('请求失败');
            }

        });
    }

    // 拼装数据的函数
    function callback(json){
        //  console.log(json) [Array(6), Array(6), Array(6), Array(6), Array(6), Array(4)]
        // 循环遍历 拿到每一个数组里面的数据
        for(var i=0; i<json.length; i++){

                var arr = json[i]; // 第一次遍历得到的数组
                // 在循环遍历一遍， 得到数组中的对象
                for(var j=0; j<arr.length; j++){

                    var obj = arr[j]; // 第二次循环遍历得到的对象

                    // 判断对象的id是否对应这个页面的id
                    if(parseInt(obj.id) == ID){ // 获取指定的ID对象
                        console.log("对象ID:"+obj.id);
                        console.log("页面ID:"+ ID);

                        var smallImg = ''; // 小图容器
                        var bigImg = '';  //大图容器
                        var infoTitle = ''; // 信息标题容器
                        var infoSelect = ''; // 信息选择容器
                        var showBigImg = ''; // 放大图片容器

                        var objPhoto = obj.img
                        // 要得到4张图片 还要拿到在对象中的4张图片 ，得遍历
                        for(var x=0; x<objPhoto.length; x++){
                            smallImg += "<li>";
                            smallImg += '<div class=""><span></span></div>'
                            smallImg += '<img src="' +objPhoto[x].src + '" alt="">'
                            smallImg += '</li>';
                           
                            bigImg += '<li class=""><img src="'+objPhoto[x].src+'" alt="产品图片"><span></span></li>';
                           
                            showBigImg += '<li class=""><img src="'+objPhoto[x].src+'" alt="产品图片"></li>';
                        }

                        infoTitle += '<h3>'+ obj.discript +'</h3>';
                        infoTitle += '<p class="prices">'+ obj.price +'</p>';
                        infoTitle += '<p><span>已售：'+ obj.sale +'</span><span>评价：'+ obj.com +'</span></p>';      
                        
                        infoSelect += '<p class="cz">';
                        infoSelect += '<span>材质：</span>';
                        infoSelect += '<i class="hover">' + obj.material1 + '</i>';
                        infoSelect += '<i>'+ obj.material2 +'</i>';
                        infoSelect += '</p>';
                        
                    
                        $('.product .img-side-list').append(smallImg);
                        $('.product .img-content').append(bigImg);
                        $('.product .info-title').append(infoTitle);
                        $('.product .info-select').prepend(infoSelect);
                        $('.product .bigArea').append(showBigImg);
                        // 在第一个大图上加载 class=hover
                        $('.product .img-content').find('li').eq(0).addClass('hover');
                        $('.product .img-side-list').find('li div').eq(0).addClass('hover');
                    }
                }
        }
    
        // 左侧小图片淡入淡出切图效果
        var img_index = 0;
        $('.product .img-side-list li').on('mouseenter', function(){
            img_index = ($(this).index()+1);
            $(this).find('div').addClass('hover');
            $(this).siblings().find('div').removeClass('hover');

            $(this).parents('.product-img-ct').find('.img-content li').removeClass('hover');
            $(this).parents('.product-img-ct').find('.img-content li').eq($(this).index()).addClass('hover');

            $(this).parents('.product-img-ct').find('.bigArea li').removeClass('hover');
            $(this).parents('.product-img-ct').find('.bigArea li').eq($(this).index()).addClass('hover');
        })
    
        // 左侧图片点击切换效果
        $('.product .clickNext').on('click', function(e){
            e.preventDefault();
            $('.img-side-list li').eq(img_index).find('div').addClass('hover');
            $('.img-side-list li').eq(img_index).siblings().find('div').removeClass('hover');
            
            $('.img-content li').eq(img_index).addClass('hover');
            $('.img-content li').eq(img_index).siblings().removeClass('hover');

            $('.bigArea li').eq(img_index).addClass('hover');
            $('.bigArea li').eq(img_index).siblings().removeClass('hover');            

            img_index++;
            if(img_index > $('.img-side-list li').length-1){
                img_index = 0;
            }
        });

        // 放大镜效果
        function magnifier(){
            var _normalImg = $('.img-content'); // 正常区域节点
            var _smallArea = $('.img-content li').find('span'); // 小框节点
            var _bigImg = $('.bigArea img'); // 放大图片节点
            var _bigArea = $('.bigArea'); // 放大区域节点
    
           // 计算小区域的宽高 width() innerWidth() outerWidth()
            _smallArea.width( _bigArea.width() * _normalImg.width() / _bigImg.width());
            _smallArea.height( _bigArea.height() * 370 / _bigImg.height());
    
                // 放大倍数
                var gain = _bigImg.width()/_normalImg.width(); 
    
                // 在正常的图片上绑定一个鼠标放置事件
                $('.img-content li').on('mousemove', function(e){
                        
                        // 在大框区域显示的图片
                        $('.bigArea li').eq($(this).index()).addClass('hover');
                        $('.bigArea li').eq($(this).index()).siblings().removeClass('hover');
                
                        _smallArea.show(); // 显示小框区域
                        _bigArea.show(); // 显示大框区域
    
                        // x 可视区域的值 
                        // pageX 鼠标相对于文档左边的距离 
                        // offset().left 距离窗口左边距离
                        var x = e.pageX - _normalImg.offset().left - _smallArea.width()/2;
                        var y = e.pageY - _normalImg.offset().top - _smallArea.width()/2;
    
                        // 控制小框范围在正常图的范围内
                        if( x < 0){ // 不超出左边界
                            x = 0;
                        }else if( x > _normalImg.width()-_smallArea.width()){
                            x = _normalImg.width()-_smallArea.width();
                        }
    
                        if( y < 0){ // 不超出右边界
                            y = 0;
                        }else if( y > _normalImg.height() - _smallArea.height()){
                            y = _normalImg.height() - _smallArea.height();
                        }
    
                        // 小框移动
                        _smallArea.css({
                            left: x,
                            top: y
                        });
    
                        // 大框里图片的移动
                        _bigImg.css({
                            left: -x*gain,
                            top: -y*gain
                        });
    
                        // 鼠标移开时隐藏
                        _normalImg.mouseleave(function(){
                            _bigArea.hide();
                            _smallArea.hide();
                        });
    
                });
        };
        magnifier();

        // ------------右边材质效果
        $('.info-select .cz i').on('click', function(){
            $(this).addClass('hover').siblings().removeClass('hover');
        });
        // 右边刻字效果
            // --在输入框添加文字
        $('.info-select .kz i').on('click', function(){
            var str = $(this).text();
            var txt = $('.info-select .kz input[type="text"]').val();
            txt = txt + str;
            $('.info-select .kz input[type="text"]').val(txt);
        });
            // 预览效果
        $('.info-select .kz input[type="button"]').on('click', function(){
            if($('.info-select .kz input[type="text"]').val() !== ''){
            $('.product-info .preview').empty();
            $('.product-info .preview').css('display', 'block').text($('.info-select .kz input[type="text"]').val());
            }

            // 过5秒消失
            var timer = setTimeout(function(){
            $('.product-info .preview').hide();
            }, 5000);
        });

            // 右边 颜色选择
        $('.product .info-color li').on('click', function(){
            $(this).addClass('hover').siblings().removeClass('hover');
        });

        // 点击加入购物车效果
        $('.addShopCar').click(function(){
            if($('#size').val() === 0){
                alert('请选择尺寸');
                return ;
            }else {
                // 获取之前保存在cookie里面的购物车信息
                var arr = $.cookie('cart')?JSON.parse($.cookie('cart')):[];

                // 拿到要加入购物车的商品信息
                var goodsPrice = $('.info-title .prices').text(); // 商品价格
                var goodsDiscript = $('.info-title h3').text(); // 商品系列
                var goodsCutname = $('.info-selec .cutname').val(); // 用户自定义刻字
                var goodsHand = $('#size').val(); // 手寸

                var nameUser = ''; //表示未登录
                if($.cookie('loginUser')){
                    nameUser = $.cookie('loginUser'); // 登录了name为登录账户
                }

                // 遍历之前先看看之前是否在购物车 cookie 中存在即将要添加的商品
                var isExist = false; // 判断是否存在
                for(var i=0; i< arr.length; i++){
                    if(ID === arr[i].id){
                        arr[i].num++;
                        isExist = true; // 表示商品存在
                    }
                }

                // 如果不存在则添加一个商品
                if(!isExist){
                    var goods = {
                        id: ID,
                        discript: goodsDiscript,
                        price: goodsPrice,
                        cutname: goodsCutname,
                        hand: goodsHand,
                        nameuser: nameUser,
                        num: 1,
                        success: 1
                    };

                    arr.push(goods);
                }

                // 在新得到的数据保存到 cookie 中去
                $.cookie('cart', JSON.stringify(arr), {'expires': 7, 'path':'/'});
                console.log($.cookie('cart'));

                //跳转到购物车页面
			    location.href = "shopcart.html";
            }
            
        });
    };

    // 详情页的tab 切换
    $('.main-middle .tab li').on('click', function(){
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parents('.main-middle').find('.main-middle-content>li').eq($(this).index()).addClass('hover').siblings().removeClass('hover');

    });

    // 浏览记录轮换效果
    var browseNext = 0; // 浏览索引
    $('.annal-btns .down').on('click', function(){
        browseNext++;
        if(browseNext>$('.annal-content li').length-4){
            $('.annal-content').stop().animate({'left': 0}, 500);
            browseNext = 0;
        }else{
            move();
        }
        
    });
    $('.annal-btns .up').on('click', function(){
        browseNext--;
        if(browseNext<0){
            $('.annal-content').stop().animate({'left': 0}, 500);
            browseNext = 0;
        }else{
            move();
        }
    });

    // 调用移动函数
    function move(){
        $('.annal-content').stop().animate({
            'left': -browseNext*$('.annal-content li').outerWidth(true)
        },300);
    }

    // ================ 用户浏览之浏览记录显示 ===================
    var _cookie = $.cookie('BHD');
    if(_cookie){
        _cookie.JSON.parse($.cookie('BHD'));
        for(var i=0; i<_cookie.length; i++){
            var html = '';
            html += '<li>';
            html += '<a href="goodsinfo.html?'+_cookie[i].id+'"><img src="'+ _cookie[i].img+'"></a>';
            html += '<p>'+ _cookie[i].discript+'<p>';
            html += '</li>';
        }
        $('.annal-content').append(html);
    }

});