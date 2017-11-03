

// 登录页面

var loginPage = (function(){

    function Login($ct){
        this.$ct = $ct;
        this.init();
        this.Event();
    };

    Login.prototype = {
        init: function(){
            this.isEmail = /^[a-zA-Z_0-9]+@[a-zA-Z_0-9]+(\.[a-zA-Z_0-9]+)$/; // 邮箱验证
            this.isTel = /^[1][358][0-9]{9}$/;                               // 电话验证
            this.isPassword = /^[^\s]{6,20}$/;                              // 密码验证
            this.isChinese = /^[^\u4300-\u9fa5]*$/;                            // 是否中文验证
            
            // 节点
            this.$user = this.$ct.find('input.user');
            this.$info = this.$ct.find('.info');
            this.$pwd = this.$ct.find('input.pwd');
            this.$btns = this.$ct.find('.btns-login');
        },

        Event: function(){
            var _this = this;

            // 账户验证
            this.$user.on({
                blur: function(){
                    if(_this.$user.val() === ''){
                        _this.$info.slideDown(200).text('账号不能为空!');
                        _this.$user.css('border', '1px solid red');

                    }else if(!_this.isEmail.test(_this.$user.val()) && !_this.isTel.test(_this.$user.val())){
                        _this.$info.slideDown(200).text('邮箱格式/手机号码不正确，请重新输入');
                        _this.$user.css('border', '1px solid red');
                        _this.$pwd.css('border', '');
                    }else{
                        _this.$user.css('border', '1px solid #ddd');
                        _this.$info.hide();
                    }
                }
            });

            // 密码验证
            this.$pwd.on({
                blur: function(){
                    if(_this.$pwd.val() === ''){
                        _this.$pwd.css('border', '1px solid red');
                        _this.$info.slideDown(200).text('密码不能为空!');
                    }else if(!_this.isPassword.test( $('input.pwd').val()) && !_this.isChinese.test($('input.pwd').val())){
                       _this.$pwd.css('border', '1px solid red');
                        _this.$info.slideDown(200).text('请输入长度为6-20位数的密码');
                        _this.$user.css('border', '');
                    }else{
                        _this.$pwd.css('border', '1px solid #ddd');
                        _this.$info.hide();
                    }
                }
            });

            // 记住账号密码
            if($.cookie('remberNum')){
               var arr2_cookie = JSON.parse($.cookie('remberNum'));
                _this.$user.val(arr2_cookie.name);
                _this.$pwd.val(arr2_cookie.pwd);
            }
            // 忘记密码
            $('.forget-pwd').on('click', function(){
                $.cookie('remberNum', '', {'expires':0, 'path':'/'});
                _this.$user.val('');
                _this.$pwd.val('');
            });

            //登录 --判断用户是否存在于cookie中，有就可以登录
            this.$btns.on('click', function(){
                var arrList = []; // 保存用户名的容器
                var users = $.cookie('users');　//取值
                
                if(users){
                    // 反序列化，将JSON字符串转化为对象
                    users = JSON.parse(users);

                        // 遍历查找是否匹配的用户
                        var isExit = false;  // 表示是否存在该用户
                        for(var i = 0; i< users.length; i++){
                            if($('#loginForm .user').val() === users[i].name && $('#loginForm .pwd').val() === users[i].pwd){
                                console.log('登录成功');
                                isExit = true;

                                // 保存最新的登录的用户名　－－　用于首页显示
                                $.cookie('loginUser', users[i].name, {'expires':22, 'path':'/'})
                                console.log('loginUser');
                                location.href = 'index.html'; // 跳转到首页并且把用户名传递过去
                            }

                            arrList.push(users[i].name);
                        };

                        //如果用户不存在时
                        if(!isExit){
                            alert('请输入正确的用户名和密码！');
                            return;
                        }

                        // 保存每一个用户名
                        $.cookie('listUserName', JSON.stringify(arrList), {"expires": 3, "path":'/'});
                        console.log($.cookie('listUserName'));

                        //记住账号密码
                        if($('#checkbox').prop('checked')){
                            var arr2 = {
                                name: $('.user').val(),
                                pwd: $('.pwd').val()
                            }

                            $.cookie('remberNum', JSON.stringify(arr2), {"expires":2 , "path": "/"});
                        }
                    
                }else {
                    alert('请输入正确的账号密码！');
                }
                
            });
            //登录 --判断用户是否存在于cookie中，有就可以登录

            // 更具用户输入自动填充表单
            var list_cookie = $.cookie('listUserName');
            if(list_cookie){
                list_cookie = JSON.parse(list_cookie);
                for(var i = 0; i< list_cookie.length; i++){
                    var optionNode = $('<option></option>')
                    $('#account').append(optionNode.val(list_cookie[i]));
                }
            }
        }
    };

    return {
        init: function($target){
            $target.each(function(idx, node){
                new Login($(node));
            });
        }
    };

})();

loginPage.init($('#login'));