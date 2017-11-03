$(function(){
    // 登录成功后显示用户名
    if($.cookie('loginUser')){
        var loginUser = $.cookie('loginUser');
        $('#shopcart .my-dr').text('Hi,'+loginUser);
    }else{
        $('#shopcart .my-dr').text("我的DR");
    }

    // 点击退出 删除cookie中 loginUser
    $('#charcart .quit').on('click', function(){
        $.cookie('loginUser', '', {'expires':7, 'path':'/'});
        location.href = 'index.html';
    });
    
    $('.shopheader .logo img').click(function(){
        location.href = 'index.html';
    })
    
    // 调用函数
    shopCar();

    // --------------从cookie中获取数据并创建动态节点添加数据----------

    function shopCar(){
        // 看是否登录
        var name = ''; // 默认表示未登录，name为空;
        if($.cookie('loginUser')){
            console.log('cookie中存了用户名：'+$.cookie('loginUser'));
            name = $.cookie('loginUser'); // 如果登录了， 则name为登录的账户
        }

        $('#shopcart .show').empty() // 先清空表内的数据，因为每一次都是从cookie中从新获取；

        /* 
	    错误提示：Uncaught SyntaxError: Unexpected token u
		检查js代码中是否含有json解析的代码
		如JSON.parse，JSON.parse在传参数是未定义时会出现该异常
        */
        
        var _cookie = $.cookie('cart'); // 防止清空cookie后,出现未定义 json解析

        if(_cookie){
            _cookie = JSON.parse($.cookie('cart'));  // 从cookie中湖区数据并转换成对象，反序列化

            if(_cookie.length > 0){ // JSON解析之后 cookie 才是对象数组，才能通过长度来判断
                var $show = $('#shopcart .show'); // shopcart的容器节点
                var num = 0; // 数量
                var sumPrice = 0; // 总价格
                
                // 从商品列表的json中获取数据
                $.getJSON('../json/goodlist.json', function(json){
                    
                    for(var i=0; i< _cookie.length; i++){

                        var id = _cookie[i].id;
                        
                        if(_cookie[i].nameuser == name){ // 如果它的用户名时
                            
                            for(var j=0; j<json.length; j++){ // 遍历JSON中的数据
                                var arr =  json[j];
                                
                                for(var x=0; x<arr.length; x++){ //遍历JOSN的每一个对象
                                    var obj = arr[x];
                                    
                                    if(obj.id == _cookie[i].id){ //匹配对应id，并创建对应节点获取相应的信息
                                        
                                        // 创建节点
                                        var html= '';
                                        html += '<li class="shoplist">';
                                        html += '<span class="sp">';
                                        html += '<a href="listInfo.html?"'+ obj.id +'><input type="checkbox"></a>';
                                        html += '<img src="'+ obj.src +'" alt="">';
                                        html += '<a href="listInfo.html?"'+ obj.id +'>'+ obj.title+'</a>';
                                        html += '<div class="number">';
                                        html += '<span class="btns active">+</span>';
                                        html += '<b>1件</b>';
                                        html += '<span class="btns">-</span>';
                                        html += '</div>';
                                        html += '</span>';
                                        html += '<span class="cz">PTV</span>';
                                        html += '<span class="cc">12</span>';
                                        html += '<span class="kz">刻字</span>';
                                        html += '<span class="price">￥'+ obj.price+'</span>';
                                        html += '<span class="close">x</span>';
                                        html += '</li>';
                                        
                                        
                                        $('.shop_cart .show').append(html);

                                        // 如果cookie中的价格和指定价格相同，则执行相应的函数
                                        if(_cookie[i].price == obj.price1){
                                            $show.find('.shoplist .cz').text(obj.material1);
                                        }else if(_cookie[i].price == obj.price2){
                                            $show.find('.shoplist .cz').text(obj.material2);
                                        }

                                        // 如果没有刻字， 默认无
                                        
                                        if(_cookie[i].cutname == ''){
                                            $show.find('.shoplist .kz').text('无');
                                        }else {
                                            $show.find('.shoplist .kz').text(_cookie[i].cutname);
                                        }
                                    }

                                }
                                
                            }
                            //  获取购物车商品总数量
                            num += _cookie[i].num
                            $('.statement .num').text(num);

                            // 总计数 -- 计算商品的总价值
                            sumPrice += parseInt(_cookie[i].price*_cookie[i].num);
                            $('.statement .sum').text(sumPrice);
                        }
    
                    }

                    //点击结算弹出遮罩层
                    $('body').on('click','.statement .settlement',function(){
                        popUp(num,sum);
                        return false;
                        console.log(1)
                    });

                });

                

            }else {
                $('.statement .num').text('零');
                $('.statement .sum').text('￥0');
                num = 0;
                sum = 0;
            }
        };
    };

    // 继续购买
    $('.statement .gobuy').on('click', function(){
        location.href = 'listInfo.html';
    });

    // -----清空购物车
    $('.show .clear').on('click', function(){
        $('.show').empty();
        $('.statement .num').text('零');
        $('.statement .sum').text('￥0');
        $($.cookie('cart','',{'expires': 0, 'path':'/'}))
    });

    // 点击×删除该商品
        // 动态创建对象之前或之后通过事件委托添加事件，先找到该对象已存在的父元素，然后绑定事件
    $('body').on('click', 'span.close', function(){
        // 1、获取点击删除项目的下标
        // 2、定义一个数组存储cookie
        // 3、删除对应cookie中指定下标的数据
        // 4、重新覆盖原来的cookie
        //cookie:  [{1}, {2}, {3}]
        //如果删除第1个数据， 则删除cookie数组中的第一个：{1}
        //-> [{2}, {3}] -> 重新覆盖原来的cookie

        if(window.confirm('是否确认删除！')){
            var arrCookie = [];
            var _index = $(this).parents('li.shoplist').index(); // 获取删除商品的索引

            arrCookie = JSON.parse($.cookie('cart')); //定义一个数组存储该cookie，然后操作该数组，最后将操作过后的数组重新覆盖原来的cookie即可	

            var removeCookie = arrCookie.splice(_index, 1);//删除指定下标的cookie,removeCookie是被删除的条目

            //重新调用原来的 cookie
            $.cookie('cart', JSON.stringify(arrCookie), {'expires':7, 'path':'/'});

            shopCar();//重新调用该函数，动态创建修改后的数据

        }else{
            return false; 
        }
    });

    /*============== 点击复选框删除指定信息 ==============*/			
    //1、遍历所有的复选框，找到所有没有被选中的项，获取其下标，
    //2、然后通过下标获取对应cookie中的对象，并一一添加到空数组arr1中
    //3、将新数组重新覆盖原来的cookie
    //4、调用shorCar()函数创建cookie中对象
    $('.statement .cbox').on('click', function(){
        // 没数据
        if(JSON.parse($.cookie('cart')).length == 0){
            alert('购物车已经清空，快去挑选商品吧！');
            return;
        }
        // 有数据
        var arr1 = [];
        $('.show input[text="checkbox"]').each(function(){
            if(!$(this).prop('checked')){
                var index = $(this).parents('.show .shoplist').index();

                arr1.push(JSON.parse($.cookie('cart'))[index]);
            }
        });

        //把没有删除的从数据重新存入 cookie
        $.cookie('cart', JSON.stringify(arr1), {'expires':7 , 'path':'/'});
        // 在调用shopcat
        shopCar();

    });

    // -------------------------弹出结算遮罩层-----------------------
    function popUp(num, sumPrice){
        // 显示内容
        $('.shop_cart_mask').css('display','block');
        var html = '';
        html += '<div class="count_box">';
        html += '<a href="#" class="count_del">&times;</a>';
        html += '<div class="count_con">';
        html += '<p class="count_box_num"></p>';
        html += '<p class="count_box_price"></p>';
        html += '<span class="j_shop">继续购物</span>';
        html += '<span class="q_confirm">确定</span>';
        html += '</div>';
        html += '</div>';

        $('.shop_cart_mask').append(html);
        //获取数据
        $('.shop_cart_mask .count_box_num').text('商品总数：'+num);
        $('.shop_cart_mask .count_box_price').text('商品总价：'+sumPrice);
    
        // x点击事件
        $('.shoop_cart_mask .count_del').on('click', function(){
            $('.shop_cart_mask').empty();
            $('.shop_cart_mask').css('display', 'none');
        });

        $('.j_shop').on('click', function(){
            location.href = 'listInfo.html';
        });
        $('.q_confirm').on('click', function(){
            if($.cookie('loginUser')){
                alert('thank you');
                location.href = 'index.html';
            }else{
                alert('请先登录！');
                location.href = 'login.html';
            }
        });
    
    }

});