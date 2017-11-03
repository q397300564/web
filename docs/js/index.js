$(function(){
    //　获取 cityJSON 数据
    $.getJSON("../json/city.json", function(json){
        // 先遍历整个JSON,每一个数组都是一个li，然后在遍历该数组对象
        for(var i = 0; i<json.length; i++){
            var arr = json[i];

            for(var j = 0; j<arr.length; j++){
                $(".erea li").eq(i).find("p").append($('<span><a href="' +arr[j].href + '">' + arr[j].city + '</a></span>'));
            }
            $('.city').append($('<li><a href="'+json[0][i].href + '">' + json[0][i].city + '</a></li>'));
        }
    })

    // 获取　轮播图(carousel)的 JSON 数据
    function getCarouselData(){
        var _this = this;
        $.getJSON('../json/lunbo.json' , function(data){
            // 遍历得到数据
            for(var i = 0; i< data.length; i++){
                var obj = data[i];
                var img = obj.img;
                var id = obj.id;
                var href = obj.href;
                $('.carousel .img-ct').append('<li data='+(i)+'><a href="' + href+ '">'+ '<img src="'+ img + '"/></a></li>');
                $('.carousel .dots').append('<li></li>');
                if(i === 0){
                    $('.carousel .dots>li').first().addClass('hover');
                }
            };

            // 开启轮播
            Carousel.init($('.banner-layout .carousel'));
        });
    };
    getCarouselData();
    // 获取　轮播图(carousel)的 JSON 数据
    
    //身份证验证
    var timer = '';
    $('.search-box input[type="button"]').click(function(){
        // 点击之前先清除之前的定时器；
        clearInterval(timer);
        $('.search-box span').css('display', 'none');
        if(!IDCardCheck($('.search-content>input[type="text"]').val())){
            $('.search-content i').css('display', 'block');
                timer = setInterval(function(){
                    $('.search-content i').css('display', 'none');
                },2000);
        }else {
            clearInterval(timer);
        }

    });
    //身份证验证

    // 验证身份证的函数
    function IDCardCheck(num){
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        var num = num.toUpperCase(); //　把有可能１８为最后为字母的变为大写

        var isID = /(^\d{15}$)||(^\d{17}([0-9]||X)$)/; 　//判断是不是身份证号码１５位或１８位；
        if(!isID.test(num)){
            alert('输入的身份证号的长度不对，或者号码不符合规定！　１５位号应全是数字，１８位号末尾可能是数字，可能是ｘ');
            return false;
        }

        var len; // 长度
        var re;  // 验证的正则表达式
        len = num.length;

        if(len === 15){
            re = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
            var arrSplit = num.match(re); 

            // 检查生日日期是否正确
            var dateBirth = new Date('19' + arrSplit[2]+'/'+ arrSplit[3]+ '/'+arrSplit[4]);
            var isDate;
            isDate = (dateBirth.getFullYear() === Number("19"+arrSplit[2])) && ((dateBirth.getMonth()+1) === Number(arrSplit[3])) && (dateBirth.getDate() === Number(arrSplit[4]));
            
            if(!isDate){
                alert('输入身份证号码里的出生日期不正确');
                $('search-content i').html('输入的身份证号里出生日期不对！');
                return false;
            }else {
                return true;
            }
        };

        if(len === 18){
            re = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
            var arrSplit = num.match(re);

            // 检查生日日期是否正确
            var dateBirth = new Date(arrSplit[2]+"/"+arrSplit[3]+"/"+arrSplit[4]);

            var isDate;
            isDate = (dateBirth.getFullYear() === Number(arrSplit[2])) &&((dateBirth.getMonth()+1) === Number(arrSplit[3])) &&(dateBirth.getDate() === Number(arrSplit[4]));
            
            if(!isDate){
                 alert('输入身份证号码里的出生日期不正确');
                $('search-content i').html('输入的身份证号里出生日期不对！');
                return false;
            }else{
                return true;
            }
        };

    }
    // 验证身份证的函数


    //============ 登录成功后首页显示用户名 ==================

    // 判断cookie中是否有登录的用户名
    if($.cookie('loginUser')){
        var loginName = $.cookie('loginUser');
        $('#header .logIn a').text('Hi' +" "+ loginName);
    }else {
        $('#header .logIn a').text('登录');
    }
    //============ 登录成功后首页显示用户名 ==================


    //------------------- 城市联动动画效果

    function CityFlash(){
        $('.erea li').on('mouseenter', function(){
            $(this).siblings().removeClass('hover');
            $(this).addClass('hover');

            $(this).siblings().find("p").hide();
            $(this).find('p').show();


            if($(this).index() === 1){
                $(".slide-line img").stop().animate({
                    left: 75 + ($(this).width()+110)*($(this).index())
                });
            }else if($(this).index() === 5){
                $(".slide-line img").stop().animate({
                    left: 75 + ($(this).width()+105)*($(this).index())
                });
            }else {
                $(".slide-line img").stop().animate({
                    left: 75 + ($(this).width()+106)*($(this).index())
                });
            };
        });
    };

    CityFlash();
    //-------------------- 城市联动动画效果



    // ===================有侧边栏 的显隐
    function Floor($ct){
        this.$ct = $ct;
        this.hide();
        this.init();
        this.Event();
    }

    Floor.prototype = {
        init: function(){
            this.$car = this.$ct.find('div.car');
            this.$card = this.$ct.find('div.card');
            this.$mysave = this.$ct.find('div.mysave');
            this.$save = this.$ct.find('div.save');
            this.$mob = this.$ct.find('div.mob');
            this.$share = this.$ct.find('div.share');
            this.$goTop = this.$ct.find('div.back_top');
        },

        Event: function(){
            var _this = this;
            this.$car.on({
                mouseenter: function(){
                $(this).find('div').stop().css('display', 'block')
                                    .animate({
                                            width: '120px',
                                            opacity: '1'
                                        },400).text('购物车');
                },

                mouseleave: function(){
                    $(this).find('div').animate({
                                            width: '0',
                                            opacity: '0'
                                        },80);
                                    
                },

                click: function(){
                    location.href = 'shopcart.html?'+loginName;
                }
            });

            this.$card.on({
                mouseenter: function(){
                $(this).find('div').stop().css('display', 'block')
                                    .animate({
                                            width: '120px',
                                            opacity: '1'
                                        },400).text('我的订单');
                },

                mouseleave: function(){
                    $(this).find('div').animate({
                                            width: '0',
                                            opacity: '0'
                                        },80);
                                    
                }
            });

            this.$mysave.on({
                mouseenter: function(){
                $(this).find('div').stop().css('display', 'block')
                                    .animate({
                                            width: '120px',
                                            opacity: '1'
                                        },400).text('我的收藏');
                },

                mouseleave: function(){
                    $(this).find('div').animate({
                                            width: "0",
                                            opacity: '0'
                                        },80);
                                    
                },
            });

            this.$save.on({
                mouseenter: function(){
                $(this).find('div').stop().css('display', 'block')
                                    .animate({
                                            width: "120px",
                                            opacity: '1'
                                        },400).text('收藏网址');
                },

                mouseleave: function(){
                    $(this).find('div').animate({
                                            width: '0',
                                            opacity: '0'
                                        },80);
                                    
                },
            });

            this.$mob.on({
                mouseenter: function(){
                    $(this).find('div').stop().css({
                        'display':'block',
                        background: "url(../images/ewm.jpg) no-repeat",
                        height: '120px'
                    }).animate({
                        width: "246px",
                        opacity: '1'
                    },400);
                    
                },

                mouseleave: function(){
                    $(this).find('div').animate({
                                            width: "0px",
                                            opacity: '0'
                                        },80);
                                    
                },

                click: function(){
                    location.href = 'shopcart.html?'+ loginName;
                }
            });

            this.$share.on({
                mouseenter: function(){
                    $(this).find('div').stop().css({
                        'display': 'block',
                        background: '#fff url(../images/ico-shares.png) no-repeat 21px 8px'
                    }).animate({
                        width: "160px",
                        opacity: '1'
                    },400);
                                    
                },

                mouseleave: function(){
                    $(this).find('div').animate({
                                            width: "0px",
                                            opacity: '0'
                                        },80);
                                    
                },

                click: function(){
                    location.href = 'shopcart.html?'+ loginName;
                }
            });

            this.$goTop.on("click", function(){
                $('body').stop().animate({
                    scrollTop: 0
                }, 800);
            });

            
            $(window).on('scroll', function(){
                if($(this).scrollTop() > 300){
                    _this.$ct.slideDown();
                }else{
                    _this.$ct.slideUp();
                }
            });
        },

        hide: function(){
            this.$ct.hide();
        }
    };

    new Floor($('.floor'));
    // ===================有侧边栏 的显隐


    // --------------------曝光加载

    var lazy = (function(){
        
        function Exposure($target,callback){
            this.$target = $target;
            this.callback = callback;
            this.Event();
        };

        Exposure.prototype = {
            Event: function(){
                var _this = this;
                var clcok;
                $(window).on('scroll', function(){
                    if(clcok){
                        clearTimeout(clcok);
                    }
                    clcok = setTimeout(function(){
                        _this.check(_this.$target);
                    }, 300);
                })
            },

            check: function(){
                if(this.checkShow(this.$target) && !this.isLoad(this.$target)){
                    this.callback(this.$target);
                }
            },

            checkShow: function($node){
                var $scrollTop = $(window).scrollTop(); // 滑动高度
                var $windowHeight = $(window).height(); // 窗口高度
                var $nodeOffset = $node.offset().top;   // 节点位置

                if( $nodeOffset < $scrollTop + $windowHeight && $scrollTop < $nodeOffset){
                    return true;
                }else {
                    return false;
                }
            },

            isLoad: function($node){
                return  $node.attr('src') === $node.attr('data-src');
            },

            showImg: function($node){
                $node.attr('src', $node.attr('data-src'));
        
            }
        };

        return {
            init: function($target, callback){
                $target.each(function(idx, target){
                    new Exposure( $(target) , callback );
                });
            }
        };
    })();

    lazy.init($('.container div img'), function($node){
        this.showImg($node);
    });

    // ---------------------曝光加载


    // ========================= 右侧导航栏--我的收藏 =========================
    
    
 
        
    function Collection($ct){
        this.$ct = $ct;
        this.Event();
    };

    Collection.prototype = {
        //绑定事件
        Event: function(){
            var _this = this;
            //在收藏节点绑定一个点击事件
            $('body').on('click', '.btns-collection', function(){
                if(window.confirm('确认点击收藏!')){          
                    // ---飞如购物车的效果
                    _this.flyInCollection();
                    //------------飞车效果
    
                    // 数据的处理 
                    // 1 等到商品信息
                    // 2 判断 后台 是否存储过收藏数据
                    // 3 在存储收藏数据中查找是否有ID一样的， 如果一样就不在创建dom对象
                    // 4 没有存储时收藏数据放置在哪里
                    // 5 数据最后 全都存入 cookie
                     // 加入购物车的商品信息       
                    var goodsDiscript = $(this).closest('div.body').find('p').text(); // 系列
                    var goodsPrice = $(this).closest('.body').siblings('div.head').text(); //价格
                    var goodsId = $(this).closest('li').children('a').attr('href').replace('goodslist.html?',''); // Id
                    var goodsImg = $(this).parents('.goods-list').find('a img').attr('src'); // 图片地址

                    // 判断是否登录用 就是查看cookie是否有$.cookie('loginUser')
                    var name = ''; // 未登录时
                    if($.cookie('loginUser')){
                        name = JSON.parse($.cookie('loginUser')); // 登录时
                    }

                    //获取之前先判断cookie是否有
			  	    var arr1 = $.cookie("mycollection")?JSON.parse($.cookie('mycollection')):[];

                    // 判断是否收藏
                    var isCollection = false; // 是否收藏
                    
                    // 循环遍历 mycollection 判断是否id一样
                    for(i = 0; i< arr1.length; i++){
                        if(goodsId === arr1[i].id){
                            isCollection = true;  // 一样就是收藏过
                        }
                    }

                    // 是否重复，重复的跳过获取信息
                    if(!isCollection){
                        var goods = {
                            'id': goodsId,
                            'discript': goodsDiscript,
                            'price': goodsPrice,
                            'img': goodsImg,
                            'userName': name,
                            'num': 1,
                            '_success': 1
                        };
                        
                        arr1.push(goods);
                        // 调用创建收藏栏
                        _this.myCollection(goods);
                    };

                    // 存到 cookie 里面
                    $.cookie('mycollection', JSON.stringify(arr1), {'expires':7, 'path': '/'} );
                    console.log($.cookie('mycollection'));
                    
                }else{
                    return false;
                }
            });

            // 在收藏栏节点的图片上绑定一个点击事件
            $('body').on('click', '.cbox img', function(){
                location.href = 'listInfo.html';
            });
            // 在删除收藏节点绑定一个事件
            $('.cbox').on('click', '.delete-collection', function(){
                if(window.confirm('确认是否删除收藏！')){
                    var _index = $(this).closest('li').index(); // 得到删除的索引

                    //定义一个数组存储该cookie，然后操作该数组，最后将操作过后的数组重新覆盖原来的cookie即可	 
                    var arrCookie = new Array();
                    arrCookie = JSON.parse($.cookie('mycollection'));

                    arrCookie.splice(_index,1); // 删除索引所在的数组

                    // 重新覆盖原来的 cookie 
                    $.cookie('mycollection', JSON.stringify(arrCookie), {'expires':7, 'path':'/'});
                    console.log($.cookie('mycollection'))
                    $(this).parents('li').remove();
                }
            });

            // 在侧边栏的收藏箭上绑定一个显隐
            $('.mysave').on('click', function(){
                $('.cbox').toggle();

                // 判断是否登录用 就是查看cookie是否有$.cookie('loginUser')
                var name = ''; // 未登录时
                if($.cookie('loginUser')){
                    name = JSON.parse($.cookie('loginUser')); // 登录时
                }

                // 如果有 cookie mycollection
                if($.cookie('mycollection')){
                    $('.cbox').empty();
                    var _cookie = JSON.parse($.cookie('mycollection'));
                    var html = '';
                    for(var i=0; i< _cookie.length; i++){
                        if(_cookie[i].userName === name){
                            html += '<li class="collection-li" dataId="'+ _cookie[i].id +'">';
                            html += '<div class="cbox-img"><img src="'+  _cookie[i].img +'"></div>';
                            html += '<div class="cbox-text">';
                            html += '<p>价格：'+  _cookie[i].price +'<span class="delete-collection">X</span></p>';
                            html += '<p>系列：'+  _cookie[i].discript+'</p>';
                            html += '<p>数量：'+  _cookie[i].num+'</p>';
                            html += '</div>';
                            html += '</li>';
            
                            //  append 到页面上
                            $('.cbox').append(html);
                        }
                    }
                }
            });
        },
        
        // 飞入购物车效果
        flyInCollection: function(){
            //--- 克隆列表li的内容
            var clone = $(this).closest('li.goods-list').clone(false);
            var imgNode = clone.find('img').clone(false);
            $('.goods-list').append(clone);
            clone.css({
                'position': 'absolute',
                'top': this.$ct.find('.goods-list').offset().top,
                'left': this.$ct.find('.goods-list .btns-collection').offset().left,
                'width': 50,
                'height': 50,
                'border': '1px solid #ddd',
                'border-radius': '50%',
                
            });

            clone.stop().animate({
                'left': $('.floor').offset().left,
                'top': $('.floor mysave').offset.top,
                'width': 0,
                'height': 0,
                'opacity': 0.5
            }, 1200, function(){
                clone.remove();
            });
        },

        // 创建收藏栏中的  div 函数
        myCollection: function(data){
            // 看看是否登录
            var name = ''; // 未登录时
            if($.cookie('loginUser')){
                name = JSON.parse($.cookie('loginUser')); // 登录时
            }
            var html = ''; // 空的容器
            // 拼装到html里面
            html += '<li class="collection-li" dataId="'+ data.id +'">';
            html += '<div class="cbox-img"><img src="'+  data.img +'"></div>';
            html += '<div class="cbox-text">';
            html += '<p>价格：'+  data.price +'<span class="delete-collection">X</span></p>';
            html += '<p>系列：'+  data.discript+'</p>';
            html += '<p>数量：'+  data.num+'</p>';
            html += '</div>';
            html += '</li>';

            //  append 到页面上
            $('.cbox').append(html);
        },
    };

    new Collection($('.ct-listWrap'));

//     // ========================= 右侧导航栏--我的收藏 =========================

    // ================ 购物车中商品数量 ==============
	function myCar(){
		var name = ""; //默认表示未登录
		if($.cookie('loginUser')){
			console.log('cookie中存了用户名：'+$.cookie('loginUser'));
			name = $.cookie('loginUser'); //如果登录了， 则name为登录的账户
		}

		var cookieCar = $.cookie('cart');
		if(cookieCar){
			var num = 0;
			cookieCar = JSON.parse(cookieCar);

			for(var i=0;i<cookieCar.length;i++){
				if(cookieCar[i].userName == name){
					num += cookieCar[i].num
					$('.floor .car i').text(num);
				}
			}
		}
	}
	myCar();
// =================== 购物车中商品数量=====================
});