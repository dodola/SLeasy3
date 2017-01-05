// SLeasy3-viewport
;(function (SLeasy, $, device) {
    var $config = SLeasy.config(),
        $scope  = SLeasy.scope();

    //设置视口
    SLeasy.viewport = function () {
        //重置body
        $("body").css({"padding": 0, "margin": "0 0"});

        //适配策略
        var minWidth  = SLeasy.is('ios') ? 320 : 321,//最小宽度
            minHeight = 480,//最小高度
            ratio     = $(window).width() / $(window).height(),//当前设备屏幕高宽比
            viewport  = {
                'width': function () {
                    var width           = $config.viewport > minWidth ? $config.viewport : minWidth,
                        viewportContent = 'width=' + width + ',user-scalable=no';
                    return viewportContent;
                },
                'height': function (thresholdHeight) {
                    var width           = $config.viewport > minWidth ? $config.viewport : minWidth,
                        viewHeight      = (thresholdHeight || $config.height) * ($config.viewport / $config.width),
                        height          = viewHeight > minHeight ? viewHeight : minHeight,
                        //viewportContent = 'height=' + height + ',width=' + height * ratio + ',user-scalable=no';
                        viewportContent = 'width=' + height * ratio + ',user-scalable=no';
                    return viewportContent;
                },
                'auto': function () {
                    // ratio = $(window).width() / $(window).height();//刷新当前宽高比
                    var viewportContent = $config.width / $config.height >= ratio ? viewport.width() : viewport.height();
                    return viewportContent;
                },
                'scroll': function () {
                    var width           = $config.viewport > minWidth ? $config.viewport : minWidth,
                        viewportContent = 'width=' + width + ',user-scalable=no';
                    return viewportContent;
                },
                'threshold': function (threshold) {//阈值模式,当stageMode为指定数值的时候,按阈值高度等比缩放
                    // alert($config.width / threshold >= ratio)
                    var viewportContent = $config.width / threshold >= ratio ? viewport.width() : viewport.height(threshold);
                    return viewportContent;
                },
                'device-width':function () {
                    viewportContent = 'width=device-width,user-scalable=no';
                    return viewportContent;
                }
            };


        var _content = (typeof $config.stageMode == 'number') ? viewport['threshold']($config.stageMode) : viewport[$config.stageMode]();
        $("head").prepend('<meta id="SLeasy_viewport" name="viewport" content="' + _content + '"><meta name="format-detection" content="telephone=no, email=no,adress=no"/>');
        if ($config.stageMode == 'auto' || typeof $config.stageMode == 'number') {
            SLeasy.onResize = function () {
                $config.reloadMode && window.location.reload();
            }
        }

        var sliderBoxHeight = $config.height * $scope.viewScale;
        //$scope.fixHeight=$(window).height();//设置自适应全屏高度
        $scope.fixHeight = $(window).height() > sliderBoxHeight ? sliderBoxHeight : $(window).height();//设置自适应全屏高度
        if ($config.stageMode == 'scroll') {
            $scope.fixHeight = sliderBoxHeight;
        }
    }
})(
    window.SLeasy = window.SLeasy || {},
    jQuery,
    device
);