$(function(){
    // 页数
    var pageNum = 0;

    //  全局变量存储JSON数据
    var str = [];

    // 商品总数量
    var count = 0;

    // 获取 JSON 中的数据
    $.getJSON('../json/goodlist.json', function(data){
        // 把数据保存在一个全局变量中，方便其他函数调用
        str = data;
        console.log(str);

        // 更新界面的回调函数，动态创建li并获取对应的数据
        refreshPage(str);

        // 计算总的商品数
        for( var i = 0 ; i< str.length; i++){
            count+=str[i].length;
            // console.log(count);
        }

        // 总页数的节点
        $('.pageCount').html(count);

        // 创建页码列表函数
        createPageList(str);

    });

    // 更新界面的回调函数
    function refreshPage(json){
        // 显示当前页数
        $('.pageNum').html((pageNum+1)+'/'+json.length);

        // 添加新的节点 数据
        var arr = json[pageNum];
        createShopList(arr);
    };

    // ================  创建商品列表函数  ==================
    function createShopList(arr){
        // 清除原来的节点 
        $('.ct-listWrap').html('');

        // 添加新的节点
        var html = '';
        for(var x = 0; x < arr.length; x++){
            html += '<li class="goods-list">';
            html += '<a href="goodsinfo.html?' + arr[x].id +'"><img src="'+ arr[x].src+'" alt=""></a>';
            html += '<div class="goods-list-info">';      
            html += '<div class="head">'+ arr[x].price +'</div>';           
            html += '<div class="body">';            
            html += '<p>'+ arr[x].discript+'</p>';                
            html += '<span class="btns-collection">收藏</span>';                
            html += '<a href="goodsinfo.html?'+ arr[x].id+'"><span>购买</span></a>';                
            html += '</div>';           
            html += '<div class="foot"><span class="sale">已售:&nbsp;'+ arr[x].sale +'&nbsp;</span><span class="com">评价:&nbsp;'+ arr[x].com +'&nbsp;</span></div>';            
            html += '</div>';        
            html += '</li>';    
        }
        
        $('.ct-listWrap').append(html);

    }
    // ================  创建商品列表函数  ==================

    // ================  创建页码列表函数  ==================
    function createPageList(str){
        // 清除原来的页
        $('.ct-paging').html('');

        // 添加新的节点
        var html = '';
        for(var a = 0; a < str.length; a++){
            if(a === 0){
                html += '<li class="indexPage hover">' +(a+1)+ '</li>';
            }else if(a === (str.length-1)){
                html += '<li class="indexPage">' +"..."+ '</li>';
            }else{
                html += '<li class="indexPage">' +(a+1)+ '</li>';
            } 
        }
        $('.ct-paging').append(html);
        
    }
    // ================  创建页列表函数  ==================

    // ==================== 上下翻页按钮 ===================
        $('.Up-page').click(function(){
            if(pageNum <= 0){
                return false;
            }else {
                pageNum -= 1;
            }
            $('.ct-paging li').eq(pageNum).addClass('hover').siblings().removeClass('hover');
            refreshPage(str);
        });

        $('.Down-page').click(function(){
            console.log(str.length);
            if(pageNum >= (str.length-1)){
                return false;
            }else {
                pageNum += 1;
            }
            
            $('.ct-paging li').eq(pageNum).addClass('hover').siblings().removeClass('hover');
            refreshPage(str);
        });

    // ==================== 上下翻页按钮 ===================

    // ==================== 点击页数选项翻页 ================
        $('.ct-paging').on('click', 'li',function(){
            console.log(pageNum);
            pageNum = $(this).index();
            $('.ct-paging li').eq(pageNum).addClass('hover').siblings().removeClass('hover');
            refreshPage(str);
        });

    // ==================== 点击页数选项翻页 ================


    //------------------------------------------------------

    var clickCount = 0; // 点击次数
    //=================== 按价格排序 =====================
    $('.ct-breadcrumbs .links-price').on('click',function(){
        var a;
        clickCount++;
        $(this).addClass('active').siblings().removeClass('active')
        for(var i = 0 ; i< str[pageNum].length; i++){
            for(var j = 0; j < str[pageNum].length; j++){
                if( clickCount%2 === 0){
                    if(parseInt(str[pageNum][i].price) > parseInt(str[pageNum][j].price)){
                        a = str[pageNum][i]
                        str[pageNum][i]=str[pageNum][j]
                        str[pageNum][j]=a;
                    } 
                }else {
                    if(parseInt(str[pageNum][i].price) < parseInt(str[pageNum][j].price)){
                        a = str[pageNum][i]
                        str[pageNum][i]=str[pageNum][j]
                        str[pageNum][j]=a;
                    } 
                }            
            }
        }
        createShopList(str[pageNum]);
    });
    //=================== 按价格排序 =====================

    //=================== 按销量排序 =====================
    $('.ct-breadcrumbs .links-sale').on('click',function(){
        var a;
        clickCount++;
        $(this).addClass('active').siblings().removeClass('active')
        for(var i = 0 ; i< str[pageNum].length; i++){
            for(var j = 0; j < str[pageNum].length; j++){
                if( clickCount%2 === 0){
                    if(parseInt(str[pageNum][i].sale) > parseInt(str[pageNum][j].sale)){
                        a = str[pageNum][i]
                        str[pageNum][i]=str[pageNum][j]
                        str[pageNum][j]=a;
                    } 
                }else {
                    if(parseInt(str[pageNum][i].sale) < parseInt(str[pageNum][j].sale)){
                    a = str[pageNum][i]
                    str[pageNum][i]=str[pageNum][j]
                    str[pageNum][j]=a;
                } 
                }            
            }
        }
        createShopList(str[pageNum]);
    });
    //=================== 按销量排序 =====================

    //=================== 按人气排序 =====================
    $('.ct-breadcrumbs .links-com').click(function(){
        var a;
        clickCount++;
        $(this).addClass('active').siblings().removeClass('active')
        for(var i = 0 ; i< str[pageNum].length; i++){
            for(var j = 0; j < str[pageNum].length; j++){
                if( clickCount%2 === 0 ){
                    if(parseInt(str[pageNum][i].com) > parseInt(str[pageNum][j].com)){
                        a = str[pageNum][i]
                        str[pageNum][i]=str[pageNum][j]
                        str[pageNum][j]=a;
                    }   
                }else {
                    if(parseInt(str[pageNum][i].com) < parseInt(str[pageNum][j].com)){
                        a = str[pageNum][i]
                        str[pageNum][i]=str[pageNum][j]
                        str[pageNum][j]=a;
                    }  
                }
                          
            }
        }
        createShopList(str[pageNum]);
    });
    //=================== 按人气排序 =====================
    //------------------------------------------------------

    // ========= 点击过的商品保存起来作为浏览记录的来源 ================
		$('body').on('click','.goods-list li a img',function(){
			console.log($(this).parents('li').find('p').text()+'==='+$(this).attr('src'));
			var _cookie = $.cookie('BHD')?JSON.parse($.cookie('BHD')):[];
                
                // 如果有过了这个记录就不保存了
                for(var i=0;i<_cookie.length;i++){
					if($(this).attr('src') == _cookie[i].img){
						return;
					}
                }
                // 保存记录
				var Bro = {
					img:$(this).attr('src'),
					title:$(this).parents('li').find('p').text()
				}
				_cookie.unshift(Bro);

				$.cookie('BHD',JSON.stringify(_cookie),{'expires':1,'path':'/'});
				console.log($.cookie('BHD'));	
		})
		// ========= 点击过的商品保存起来作为浏览记录的来源 ================
		  
   
});