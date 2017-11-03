// 手机和邮箱注册的切换

function tab(){
    var $headernode = $(document.querySelectorAll('.tab-reg li'));
    var $contentnode = $(document.querySelectorAll('.tab-ct li'));

    $headernode.on('click', function(){
        $(this).siblings().removeClass('hover');
        $(this).addClass('hover');

        $(this).parents('#registered').find('.tab-ct li').removeClass('hover');
        $(this).parents('#registered').find('.tab-ct li').eq($(this).index()).addClass('hover');
    });
}

tab();

// 用户注册 存入cookie中
// 点击注册按钮时要先判断上面所填信息是否正确， 如果不正确则高亮显示
// 1、 注册

var Registered = (function(){

    function _Registered($ct){
        this.$ct = $ct;
        this.init();
        this.Event();
    }

    _Registered.prototype = {
        init: function(){
            this.isEmail = /^[a-zA-Z_0-9]+@[a-zA-Z_0-9]+(\.[a-zA-Z_0-9]+)$/; // 邮箱验证
            this.isTel = /^[1][358][0-9]{9}$/;                               // 电话验证
            this.isPassword = /^[^\s]{6,20}$/;                              // 密码验证
            this.isChinese = /^[^\u4300-\u9fa5]*$/;
            

            this.$user = this.$ct.find('input.user');
            this.$info = this.$ct.find('.info');
            this.$pwd = this.$ct.find('input.pwd');

            this.$input = this.$ct.find('#regitered-form input');
            this.$addDr = this.$ct.find('#registered-form .btns-add');
            this.$info = this.$ct.find('#registered-form .info');           
            this.$user = this.$ct.find('#registered-form .user');
            this.$terms = this.$ct.find('#registered-form #terms');
            this.$pwd = this.$ct.find('#registered-form .pwd');
            this.$checkPwd = this.$ct.find('#registered-form .check-pwd');
            this.$phoneVerificationCode = this.$ct.find('#registered-form #phone-verification-code');
            this.$getCheckNum_phone = this.$ct.find('#registered-form #getCheckNum_phone');
            this.$otherLogin = this.$ct.find('.other_login');
        
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


            // 确认密码
            this.$checkPwd.on({
                blur:function(){
                    if(_this.$pwd.val() !== $(this).val()){
                        $(_this.$info).slideDown(200).text('两次密码输入不一致');
                        $(this).css('border', '1px solid red');
                        _this.$pwd.css('border', '1px solid red');
                    }else{
                        $(this).css('border', '');
                        _this.$pwd.css('border', '');
                    }
                }
            });

            // 生成验证码
            this.$getCheckNum_phone.val(this.checkNum());

            this.$getCheckNum_phone.on('click', function(){
                $(this).val(_this.checkNum());
            });

            //校验验证码
            this.$phoneVerificationCode.on('blur', function(){
                if($(this).val() !== _this.$getCheckNum_phone.val()){
                    _this.$info.slideDown(200).text('验证码输入有误，请重新输入！');
                    $(this).css('border', '1px solid red');
                }else{
                    _this.$info.hide();
                    $(this).css('border', '');
                }
            });
            
            // 提交注册
            this.$addDr.on('click', function(){
                if(!_this.$terms.prop('checked')){
                    alert('请勾选用户注册协议和隐私条款！');
                    return;
                }else if(!_this.isTel.test(_this.$user[0].value) && !_this.isEmail.test(_this.$user.val()) ){
                    _this.$info.slideDown(200).text('邮箱格式/手机号码不正确，请重新输入');
                    _this.$user.css('border', '1px solid red');
                    console.log('账号输入有误');
                    return;
                }else if(!_this.isPassword.test(_this.$pwd[0].value)){
                    _this.$info.slideDown(200).text('请输入长度为6-20位数的密码');
                    _this.$pwd.css('border', '1px solid red');
                    _this.$user.css('border', '');
                    console.log('密码输入有误');
                    return;
                }else if(_this.$pwd[0].value != _this.$checkPwd[0].value){
                    _this.$info.slideDown(200).text('两次密码输入不一致！');
                    _this.$checkPwd.css('border', '1px solid red');
                    return;
                }else if(_this.$phoneVerificationCode.val() != _this.$getCheckNum_phone.val()){
                    alert('验证码输入错误，大小写错误，请重新输入');
                    return;
                }else {
                    //获取之前保存的用户名
                   
                    var users = $.cookie('users')?JSON.parse($.cookie('users')):[];

                    //遍历users数组，判断是否存在该用户，如果存在则不能注册
                    for(var i = 0; i < users.length ; i++){
                        if($(_this.$user).val() === users[i].name){
                            alert('该用户已经存在，不能注册');
                            return;
                        };
                    };

                    //将需要的注册用户保存到 cookie 中去，用对象存储
                    var user = {
                        name: _this.$user.val(),
                        pwd: _this.$pwd.val()
                    }

                    users.push(user); // 添加新用户

                    //保存到 cookie 中去
                    $.cookie('users', JSON.stringify(users), {'expires':7, 'path':'/'});
                    console.log($.cookie('users'))
                    //清空数据跳转到登录界面
                    _this.$input.val('');
                    alert('注册成功');
                    location.href = "login.html";
                };

            });


        },
        // 随机生成一个 4 为数的字符串， 字符字符串的取值范围0-9a-zA-Z;
        checkNum: function(){
            var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var count = 4; //长度为4
            var newstr = ''; // 存放容器 
    
            function random(x,y){
                return Math.floor(Math.random()*(y-x))+x;
            }

            for(var i=0; i<count; i++){
                newstr+= str[random(0, str.length)];
            }

            return newstr;
        }

        
    };

    return {
        init: function($target){
            $target.each(function(index, node){
                new _Registered($(node));
            });
        }
    };

})();

Registered.init($('.phone-reg-content'));

Registered.init($('.email-reg-content'));