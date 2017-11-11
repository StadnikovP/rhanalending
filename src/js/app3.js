var $window, $document, $html, swiperBlog;

var pageApp = {
    'init': function(){
        var $thisApp = $('#app');
        var curApp = $thisApp.attr('data-app');
        this.globalPollifil();
        if (pageApp[curApp]) { pageApp[curApp]($thisApp); }
    },
    'page-address':function($thisApp){
        var $mapPlace = $thisApp.find('[data-target="ymap"]');
        ymaps.ready(function() {

            var mapLat = 55.751244;
            var mapLng = 37.618423;
            var mapZoom = 16;

            var map = new ymaps.Map($mapPlace[0], {
                center: [mapLat, mapLng],
                zoom: mapZoom,
                type: 'yandex#publicMap',
                controls: [],
                behaviors: ['drag', 'dblClickZoom']
            });

            map.controls.add(
                new ymaps.control.ZoomControl(),
                {
                    float: "none",
                    position: {
                        top: 30,
                        right: 30
                    }
                }
            );

            var marker = new ymaps.Placemark(map.getCenter(), {

            }, {
                iconLayout: 'default#image',
                iconImageHref: '/assets/img/map-pin.png',
                iconImageSize: [50,64],
                hideIconOnBalloonOpen: false
            });



            map.geoObjects.add(marker);


        });
    },
    'globalPollifil': function(){
        if (!('classList' in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
            Object.defineProperty(HTMLElement.prototype, 'classList', {
                get: function() {
                    var self = this;

                    function update(fn) {
                        return function(value) {
                            var classes = self.className.split(/\s+/);
                            var index = classes.indexOf(value);

                            fn(classes, index, value);
                            self.className = classes.join(' ');
                        };
                    }

                    var ret = {
                        add: update(function(classes, index, value) {
                            ~index || classes.push(value);
                        }),

                        remove: update(function(classes, index) {
                            ~index && classes.splice(index, 1);
                        }),

                        toggle: update(function(classes, index, value) {
                            ~index ? classes.splice(index, 1) : classes.push(value);
                        }),

                        contains: function(value) {
                            return !!~self.className.split(/\s+/).indexOf(value);
                        },

                        item: function(i) {
                            return self.className.split(/\s+/)[i] || null;
                        }
                    };

                    Object.defineProperty(ret, 'length', {
                        get: function() {
                            return self.className.split(/\s+/).length;
                        }
                    });

                    return ret;
                }
            });
        }

        (function() {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                    || window[vendors[x]+'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame)
                window.requestAnimationFrame = function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                        timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };

            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
        }());
    },
};

var moduleApp = {
    'init': function () {
        this.executeModules();
        this.executeSFX();
        this.globalActions();
        this.toolsGlobalSubscribe();
        this.pageLoader();
        this.startupMessage();
        this.scrollHeader();
        this.modalWindow();
        // this.vue();
        this.openWindow();
        // this.googleMap();
        // this.formValidation();
        // this.resizeWindow();
    },
    'executeModules':function(){
        $('[data-is]').each(function(i,thisModule){
            var $thisModule = $(thisModule);
            var thisModuleName = $thisModule.attr('data-is');
            if(moduleApp[thisModuleName]) { moduleApp[thisModuleName]($thisModule); }
        });
    },
    'executeSFX':function(){
        if (appConfig.mobileVersion || device.tablet()) { return false; }
        $('[data-sfx]').each(function(i,thisModule){
            var $thisModule = $(thisModule);
            var thisModuleName = $thisModule.attr('data-sfx');
            if(moduleApp.SFXModules[thisModuleName]) { moduleApp.SFXModules[thisModuleName]($thisModule); }
        });
    },
    'globalActions':function(){

        // fancybox close
        $document.on('click','.js-fancy-close',function(e){
            e.preventDefault();
            $.fancybox.close();
        });


        // feedback form
        $('[data-gclick="feedbackForm"]').on('click',function(e){
            e.preventDefault();
            var template = $('#fb-feedback-form').html();
            $.fancybox.open({
                wrapCSS : 'fb-fancy-default',
                content: template,
                padding: 0,
                autoScale: false,
                fitToView: false,
                openEffect  : 'drop',
                closeEffect: 'drop',
                nextEffect: 'fade',
                prevEffect : 'fade',
                openSpeed: 300,
                closeSpeed: 300,
                nextSpeed: 300,
                prevSpeed: 300,
                beforeShow:function(){
                    var $thisFancy = $('.fancybox-inner');

                    var $thisChosen = $thisFancy.find('[data-is="chosen"]');
                    moduleApp.chosen($thisChosen);

                    var $cityTarget = $thisFancy.find('.js-fb-city-target');

                    $thisFancy.find('.js-fb-city-action').on('change',function(){
                        var action = !!($(this).find('option:selected').attr('data-city'));
                        if (action) {
                            $cityTarget.slideDown(200, function(){
                                if (!$cityTarget.hasClass('state-inited')) {
                                    $cityTarget.addClass('state-inited');
                                    $cityTarget.find('select').chosen({
                                        no_results_text: "Нет результатов"
                                    });
                                }
                            });
                        }
                        else {
                            $cityTarget.slideUp(200);
                        }
                    });


                    var $thisSubmit = $thisFancy.find('.js-fb-submit');
                    moduleApp.formValidation($thisSubmit);



                }
            });
        });


        // find filial form
        $('[data-gclick="findFilialForm"]').on('click',function(e){
            e.preventDefault();
            var template = $('#fb-filial-form').html();

            $.fancybox.open({
                wrapCSS : 'fb-fancy-default',
                content: template,
                padding: 0,
                autoScale: false,
                fitToView: false,
                openEffect  : 'drop',
                closeEffect: 'drop',
                nextEffect: 'fade',
                prevEffect : 'fade',
                openSpeed: 300,
                closeSpeed: 300,
                nextSpeed: 300,
                prevSpeed: 300,
                beforeShow:function(){
                    var $thisFancy = $('.fancybox-inner');

                    var $thisChosen = $thisFancy.find('[data-is="chosen"]');
                    moduleApp.chosen($thisChosen);

                    var $thisSubmit = $thisFancy.find('.js-fb-submit');
                    moduleApp.formValidation($thisSubmit, function($form){
                        var template = '';

                        $form.find('.js-fb-prod-type').each(function(i,thisSelect){
                            var $thisSelect = $(thisSelect);

                            var thisSelectedArray = $thisSelect.val() || [];
                            if (thisSelectedArray.length === 0) { return true; }

                            template += $.trim($thisSelect.closest('.is-form-select').find('.form-item-label').html()) + ':';

                            $.each(thisSelectedArray, function(i,thisType){

                                if (i===0) {
                                    template += ' ' + thisType;
                                } else {
                                    template += ', ' + thisType;
                                }

                            });

                            template += '\n\r';
                        });

                        $('.js-fb-prod-area').html(template);
                        $form.submit();
                    });
                }
            });
        });
    },
    'toolsGlobalSubscribe':function($thisModule){
        $document.on('click','.ts-submit',function(e){
            e.preventDefault();
            var $this = $(this);
            var $parent =  $this.closest('.is-tools-subscribe');
            var $thisInput = $parent.find('.ts-input');
            var regexEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;


            if (regexEmail.test($thisInput.val()) && $thisInput.val().length > 0) {
                $parent.find('.ts-form').submit();
            } else {
                $thisInput.addClass('state-bounce');
                setTimeout(function(){
                    $thisInput.removeClass('state-bounce').focus();
                }, 400);
            }

        });
    },
    'pageLoader': function(){
        $document.on('click','a',function(){
            var $this = $(this);
            var noProgress = false;

            var href = $this.attr('href');
            var targetBlank = $this.attr('target') || false;
            var inSwiper = $this.closest('.swiper-container').length;
            var downloadAttr = $this.attr('download');
            if (typeof downloadAttr !== typeof undefined && downloadAttr !== false) {
                noProgress = true;
            }

            if (
                !href ||
                href.indexOf('mailto') > -1 ||
                href.indexOf('#') > -1 ||
                href.indexOf('javascript') > -1 ||
                href.indexOf('tel') > -1 ||
                $this.hasClass('no-preloader') ||
                $this.hasClass('js-fancy-image') ||
                href.length === 0 ||
                href === 'undefined' ||
                targetBlank ||
                inSwiper
            ) { noProgress = true; }

            if (noProgress) {
                return true;
            } else {
                $("#body").removeClass('jsfx-loaded');
                return true;
            }
        });

        $("#body").addClass('jsfx-loaded');
    },
    'startupMessage':function(){
        if (appConfig.startupMessage.title && appConfig.startupMessage.message) {
            var template = '<div class="fb-modal-default">';
            template += '<div class="fbp-title">'+appConfig.startupMessage.title+'</div>';
            template += '<div class="fbp-message">'+appConfig.startupMessage.message+'</div>';
            template += '<div class="cntr"><a href="#" class="is-button-a js-fancy-close"><span>Ок</span></a></div>';
            template += '</div>';

            $.fancybox.open({
                wrapCSS : 'fb-fancy-default fb-fancy-no-close',
                content: template,
                padding: 0,
                autoScale: false,
                fitToView: false,
                openEffect  : 'drop',
                closeEffect: 'drop',
                nextEffect: 'fade',
                prevEffect : 'fade',
                openSpeed: 300,
                closeSpeed: 300,
                nextSpeed: 300,
                prevSpeed: 300
            });
        }
    },
    'scrollHeader': function(){
        $window.bind('scroll',function(){
            if($window.scrollTop() > 30){
                $('.wrapper-header').addClass('up-header');
            }
            else{
                $('.wrapper-header').removeClass('up-header');
            }

            if($window.scrollTop() > 200){
                $('.wrapper-header').addClass('small-header');
            }
            else{
                $('.wrapper-header').removeClass('small-header');
            }
        });
    },
    'SFXModules':{
        'sfx-a':function($thisModule){
            var gfxFromLeft = {
                'data-when':'enter',
                'data-from':'.8',
                'data-to':'0',
                'data-translatex':'-40'
            };

            var gfxFromRight = {
                'data-when':'enter',
                'data-from':'.8',
                'data-to':'0',
                'data-translatex':'40'
            };

            $thisModule.find('.lt-column-left .lt-tile').addClass('scrollme animateme').attr(gfxFromLeft);
            $thisModule.find('.lt-column-right .lt-tile').addClass('scrollme animateme').attr(gfxFromRight);
        },
        'sfx-b':function($thisModule){
            var gfxFromLeft = {
                'data-when':'enter',
                'data-from':'.8',
                'data-to':'0',
                'data-translatex':'-40'
            };

            var gfxFormRight = {
                'data-when':'enter',
                'data-from':'.8',
                'data-to':'0',
                'data-translatex':'40'
            };

            $thisModule.find('.lt-row:even').find('.lt-row-content-inner').addClass('scrollme animateme').attr(gfxFromLeft);
            $thisModule.find('.lt-row:even').find('.lt-row-image').addClass('scrollme animateme').attr(gfxFormRight);
            $thisModule.find('.lt-row:odd').find('.lt-row-content-inner').addClass('scrollme animateme').attr(gfxFormRight);
            $thisModule.find('.lt-row:odd').find('.lt-row-image').addClass('scrollme animateme').attr(gfxFromLeft);
        },
        'sfx-c':function($thisModule){
            var gfxFromRight = {
                'data-when':'enter',
                'data-from':'.8',
                'data-to':'0',
                'data-translatex':'40'
            };

            $thisModule.addClass('scrollme animateme').attr(gfxFromRight);
        },
        'sfx-d':function($thisModule){
            return false;
            var gfxFromLeft = {
                'data-when':'enter',
                'data-from':'.8',
                'data-to':'0',
                'data-translatex':'-40'
            };

            var gfxFormRight = {
                'data-when':'enter',
                'data-from':'.8',
                'data-to':'0',
                'data-translatex':'40'
            };

            $thisModule.find('.lt-row:even').find('.lt-row-content-inner').addClass('scrollme animateme').attr(gfxFromLeft);
            $thisModule.find('.lt-row:even').find('.lt-row-image').addClass('scrollme animateme').attr(gfxFormRight);
            $thisModule.find('.lt-row:odd').find('.lt-row-content-inner').addClass('scrollme animateme').attr(gfxFormRight);
            $thisModule.find('.lt-row:odd').find('.lt-row-image').addClass('scrollme animateme').attr(gfxFromLeft);
        },
        'sfx-e':function($thisModule){

            var gfxFromLeft = {
                'data-when':'enter',
                'data-from':'.8',
                'data-to':'0',
                'data-opacity':'0'
            };
            $thisModule.find('.hc-year-box').addClass('scrollme animateme').attr(gfxFromLeft);
        }
    },
    'formValidation': function ($submitBtn, submitFunction, customAnimation) {
        console.log('formValidation');
        var params = {
            'formValidationAttr':'data-validation',
            'formInputClass':'form-element-wrapper',
            'formCheckboxClass':'is-form-checkbox',
            'formShowErrorClass':'show-error',
            'submitDisabledClass':'state-disabled',
            'submitProgressClass':'state-progress'
        };

        $submitBtn = $submitBtn || $('.js-form-submit');
        submitFunction = submitFunction || false;
        customAnimation = customAnimation || false;
        $submitBtn.closest('form').addClass('is-form-validation');
        $submitBtn.click(function(e){
            e.preventDefault();
            var $this = $(this);
            if ($this.hasClass(params.submitDisabledClass) || $this.hasClass(params.submitProgressClass)) {
                return false;
            }
            var $form = $this.closest('form');
            var $forms = $form.find('['+params.formValidationAttr+']');
            var result = formChecking($forms, true);
            if (result) {
                if (submitFunction) {
                    submitFunction($form);
                } else {
                    $this.addClass(params.submitProgressClass);
                    $form.submit();
                }
            } else {
                if(customAnimation == true){
                    $form.addClass('status-bounce');
                    setTimeout(function(){
                        $form.removeClass('status-bounce');
                    },400);
                }
                $forms.on('keyup keypress change', function(){
                    var $current = $(this);
                    setTimeout(function(){ formChecking($current); }, 50);

                });
            }
            return false;
        });

        $(document).on('keydown', function (e) {
            return true;
            if (e.keyCode == 13) {
                var $thisFocus = $(document.activeElement);
                if ($thisFocus.is('textarea')) {
                    return true;
                }
                if ($thisFocus.closest('.form-select').length) {
                    return true;
                }
                if ($thisFocus.closest('.is-form-validation').length) {
                    $submitBtn.trigger('click');
                }
                return false;
            }
        });

        function formChecking($inp, onFocus) {


            onFocus = onFocus || false;

            var noError = true;

            $inp.each(function (ind, elm) {
                var $this = $(elm);

                var mask = $this.attr(params.formValidationAttr);
                var value = $this.val();
                var placeHolder = $this.attr('placeholder');
                var regex;
                var subError = true;

                if (mask == 'text') {
                    if ((value.length < 1) || (value == placeHolder)) {
                        noError = false;
                        $this.closest('.'+params.formInputClass).addClass(params.formShowErrorClass);
                        if (onFocus) {
                            $this.focus();
                            onFocus = false;
                        }
                    } else {
                        $this.closest('.'+params.formInputClass).removeClass(params.formShowErrorClass);
                    }
                }

                if (mask == 'textarea') {
                    if ((value.length < 10) || (value == placeHolder)) {
                        noError = false;
                        $this.closest('.'+params.formInputClass).addClass(params.formShowErrorClass);
                        if (onFocus) {
                            $this.focus();
                            onFocus = false;
                        }
                    } else {
                        $this.closest('.'+params.formInputClass).removeClass(params.formShowErrorClass);
                    }
                }

                if (mask == 'text-visible') {
                    if ($this.is(':visible') && ((value.length < 1) || (value == placeHolder))) {
                        noError = false;
                        $this.closest('.'+params.formInputClass).addClass(params.formShowErrorClass);
                        if (onFocus) {
                            $this.focus();
                            onFocus = false;
                        }
                    } else {
                        $this.closest('.'+params.formInputClass).removeClass(params.formShowErrorClass);
                    }
                }

                if (mask == 'email') {
                    regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                    if (!regex.test(value) || (value == placeHolder)) {
                        noError = false;
                        $this.closest('.'+params.formInputClass).addClass(params.formShowErrorClass);
                        if (onFocus) {
                            $this.focus();
                            onFocus = false;
                        }
                    } else {
                        $this.closest('.'+params.formInputClass).removeClass(params.formShowErrorClass);
                    }
                }

                if (mask == 'price') {
                    regex = /^\d+$/;
                    if (!regex.test(value) || (value == placeHolder)) {
                        noError = false;
                        $this.closest('.'+params.formInputClass).addClass(params.formShowErrorClass);
                        if (onFocus) {
                            $this.focus();
                            onFocus = false;
                        }
                    } else {
                        $this.closest('.'+params.formInputClass).removeClass(params.formShowErrorClass);
                    }
                }

                if (mask == 'email-visible') {
                    regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                    if ($this.is(':visible') && (!regex.test(value) || (value == placeHolder))) {
                        noError = false;
                        $this.closest('.'+params.formInputClass).addClass(params.formShowErrorClass);
                        if (onFocus) {
                            $this.focus();
                            onFocus = false;
                        }
                    } else {
                        $this.closest('.'+params.formInputClass).removeClass(params.formShowErrorClass);
                    }
                }

                if (mask == 'opt-email') {
                    regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                    if(value != ''){
                        if (!regex.test(value) || (value == placeHolder)) {
                            noError = false;
                            $this.closest('.'+params.formInputClass).addClass(params.formShowErrorClass);
                            if (onFocus) {
                                $this.focus();
                                onFocus = false;
                            }
                        } else {
                            $this.closest('.'+params.formInputClass).removeClass(params.formShowErrorClass);
                        }
                    } else {
                        $this.closest('.'+params.formInputClass).removeClass(params.formShowErrorClass);
                    }
                }

                if (mask == 'file') {
                    var parts = $(this).val().split('.');
                    if (parts==""){
                        noError = false;
                        $this.closest('.'+params.formInputClass).addClass(params.formShowErrorClass);
                        if (onFocus) {
                            $this.focus();
                            onFocus = false;
                        }
                    }
                    else {
                        $this.closest('.'+params.formInputClass).removeClass(params.formShowErrorClass);
                    }
                }

                if (mask == 'checkbox') {
                    if ($this.is(':visible') && (!$this.is(':checked'))) {
                        noError = false;
                        $this.closest('.'+params.formCheckboxClass).addClass(params.formShowErrorClass);
                    } else {
                        $this.closest('.'+params.formCheckboxClass).removeClass(params.formShowErrorClass);
                    }
                }

                if (mask == 'vacancy-file-link') {

                    var $thisGroup = $('['+params.formValidationAttr+'="vacancy-file-link"]:visible');

                    if ($thisGroup.length === 0) { return true; }

                    $thisGroup.each(function(i,e){
                        if ($(e).val().length > 0) { subError = false; }
                    });

                    if (subError) {
                        noError = false;
                        $thisGroup.closest('.'+params.formInputClass).addClass(params.formShowErrorClass);
                    } else {
                        $thisGroup.closest('.'+params.formInputClass).removeClass(params.formShowErrorClass);
                    }

                }

            });

            return noError;
        }


        // add mask

        $submitBtn.closest('form').find('[data-mask]').each(function(i,thisForm){
            var $thisForm = $(thisForm);
            var thisMask = $thisForm.attr('data-mask');
            if (thisMask=="phone") { $thisForm.addClass('state-with-mask').mask("+7 (999) 999 99 99", {placeholder:"–"}); }
        });
    },
    'popupOpen': function (content, style, beforeFunction, afterFunction, beforeClose, $subject) {
        $subject = $subject || $;
        content = content || '';
        style = style || 'fb-default-style';
        beforeFunction = beforeFunction || '';
        afterFunction = afterFunction || false;
        beforeClose = beforeClose || false;
        var configFancy = {
            content: content,
            wrapCSS: style,
            padding: 0,
            margin: 10,
            fitToView: false,
            openEffect: 'drop',
            closeEffect: 'drop',
            scrolling: 'auto',
            maxWidth: 1100,
            // maxHeight: 800,
            autoHeight: true,
            'beforeShow': function () {
                if (beforeFunction) {
                    beforeFunction();
                }
                hasPlaceholderSupport = function () {
                    var input = document.createElement('input');
                    return ('placeholder' in input);
                }
            },
            'afterShow': function () {
                $('.fancybox-wrap').addClass('fancybox-wrap-open');
                if (afterFunction) {
                    afterFunction();
                }
            },
            'beforeClose': function () {
                var $thisWrapper = $('.fancybox-wrap');
                if ($thisWrapper.hasClass('fancybox-wrap-close')) {
                    return true;
                } else {
                    if (beforeClose) {
                        beforeClose();
                    }
                    $thisWrapper.addClass('fancybox-wrap-close');
                    setTimeout(function () {
                        $.fancybox.close();
                    }, 300);
                    return false;
                }
            }
        };

        $subject.fancybox(configFancy);
    },
    'main-slider': function($thisModule){
        var configMain = {
            slidesPerView: 1,
            centeredSlides: false,
            spaceBetween: 0,
            'nextButton': $thisModule.find('.is-slider-swiper-next')[0],
            'prevButton': $thisModule.find('.is-slider-swiper-prev')[0]
        };

        $thisModule.find('.swiper-container').swiper(configMain);
    },
    'quote-slider': function($thisModule){
        var configQuote = {
            slidesPerView: 1,
            centeredSlides: false,
            paginationClickable: true,
            spaceBetween: 0,
            pagination: '.swiper-pagination',
            'nextButton': $thisModule.find('.is-slider-swiper-next')[0],
            'prevButton': $thisModule.find('.is-slider-swiper-prev')[0]
        };
        $thisModule.find('.swiper-container').swiper(configQuote);
        // if($('.js-main-slider .swiper-slide').length > 1){
        //     var $quoteSwiper = $quoteSlider.swiper(configQuote);
        // }
    },
    'resizeWindow': function(){
        $(window).resize(function(){
            console.log('resize');
        });
    },
    'animationModalWindow': function(nameModal){
            var $activeElement = $('.'+nameModal);
            var $parent = $activeElement.closest('.js-modal-window');

            $activeElement.toggleClass('active-window');
            $parent.toggleClass('active-modal-window');

            if($parent.hasClass('right')){
                $('body').addClass('open-right-modal-window');
            }
            else{
                $('body').addClass('open-left-modal-window');
            }
        },
    'closeModalWindow': function () {
        $('.js-modal-window').removeClass('active-modal-window');
        $('body').removeClass('open-right-modal-window open-left-modal-window');
        setTimeout(function(){
            $('.js-modal-window .active-window').removeClass('active-window');
        },500);

    },
    'modalWindow': function(){
        $('.js-btn-modal-window').on('click', function(e){
            e.preventDefault();

            var nameModal = $(this).attr('data-modal');
            moduleApp.animationModalWindow(nameModal);

            setTimeout(function(){
                $(window).trigger('resize');
                if($('.page-blog').length > 0){
                    swiperBlog.onResize();
                }
            },500);
        });

        $('.js-close-modal-window').on('click', function(e){
            e.stopPropagation();
            moduleApp.closeModalWindow();
        });

        $('.js-overlay-modal-window').on('click', function(e) {
            e.stopPropagation();
            moduleApp.closeModalWindow();
        });

    },
    'selectric' : function ($this) {
        // $this.selectric();
        $('.js-selectric').selectric();
    },
    'sticky-kit': function($this){
        $this.stick_in_parent();
    },
    'vue': function(){
        var catalogElements = new Vue({
            el: '.js-filter-result',
            data: {
                todos: [
                    {
                        type: 'element',
                        link: '#1',
                        img: '/dist/img/catalog-1.jpg',
                        title: 'Фотограф',
                        name: 'Алексей Журавлев',
                        price: '30 000–100 000 ₽'
                    },
                    {
                        type: 'element',
                        link: '#2',
                        img: '/dist/img/catalog-2.jpg',
                        title: 'Фотограф',
                        name: 'Алексей Журавлев',
                        price: '30 000–100 000 ₽'
                    },
                    {
                        type: 'element',
                        link: '#3',
                        img: '/dist/img/catalog-3.jpg',
                        title: 'Фотограф',
                        name: 'Алексей Журавлев',
                        price: '30 000–100 000 ₽'
                    },
                    {
                        type: 'element',
                        link: '#4',
                        img: '/dist/img/catalog-4.jpg',
                        title: 'Фотограф',
                        name: 'Алексей Журавлев',
                        price: '30 000–100 000 ₽'
                    },
                    {
                        type: 'element',
                        link: '#5',
                        img: '/dist/img/catalog-5.jpg',
                        title: 'Фотограф',
                        name: 'Алексей Журавлев',
                        price: '30 000–100 000 ₽'
                    },
                    {
                        type: 'element',
                        link: '#6',
                        img: '/dist/img/catalog-6.jpg',
                        title: 'Фотограф',
                        name: 'Алексей Журавлев',
                        price: '30 000–100 000 ₽'
                    },
                    {
                        type: 'banner',
                        text: 'Создайте заявку на поиск специалиста',
                        btn_text: 'Создать заявку'
                    },
                    {
                        type: 'element',
                        link: '#4',
                        img: '/dist/img/catalog-7.jpg',
                        title: 'Фотограф',
                        name: 'Алексей Журавлев',
                        price: '30 000–100 000 ₽'
                    },
                    {
                        type: 'element',
                        link: '#5',
                        img: '/dist/img/catalog-8.jpg',
                        title: 'Фотограф',
                        name: 'Алексей Журавлев',
                        price: '30 000–100 000 ₽'
                    },
                    {
                        type: 'element',
                        link: '#6',
                        img: '/dist/img/catalog-9.jpg',
                        title: 'Фотограф',
                        name: 'Алексей Журавлев',
                        price: '30 000–100 000 ₽'
                    },
                    {
                        type: 'element',
                        link: '#6',
                        img: '/dist/img/catalog-10.jpg',
                        title: 'Фотограф',
                        name: 'Алексей Журавлев',
                        price: '30 000–100 000 ₽'
                    },
                ]
            },
        });

        // var elementsFilter = new Vue({
        //     el:'.filter-list-items',
        //     data:{
        //
        //     }
        // })

        var filter = new Vue({
           el:'.js-global-filter',
            data:{
                price_from: '',
                price_to: '',
                checkedNames: [],
                selected: '0',
                result : [],
                elements:[
                    {
                        title: 'Свадебные салоны и дизайнеры',
                        count: '180',
                        value: 'салоны',
                        name: 'salon',
                        city: '1'
                    },
                    {
                        title: 'Фотографы',
                        count: '150',
                        value: 'Фотографы',
                        name: 'salon2',
                        city: '2'
                    },
                    {
                        title: 'Транспорт',
                        count: '80',
                        value: 'Транспорт',
                        name: 'salon3',
                        city: '1'
                    },
                    {
                        title: 'Ведущие',
                        count: '100',
                        value: 'Ведущие',
                        name: 'salon4',
                        city: '2'
                    },
                ],
                question: '',
            },
            watch: {
                // эта функция запускается при любом изменении Формы
                question: function (newQuestion) {
                    // this.result = 'Ожидаю, когда вы выберете'
                    // this.getAnswer()
                    // console.log(this.selected);
                    this.changeElementFilter(this.selected);
                }
            },
            methods:{
                number: function(evt) {
                    var regex = new RegExp("^[0-9]+$");
                    var key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
                    if (!regex.test(key)) {
                        event.preventDefault();
                        return false;
                    }
                },
                changeElementFilter: function(val){
                    console.log(val);
                },
                // getAnswer: _.debounce(
                //     function () {
                //         var vm = this
                //         vm.answer = 'Думаю...'
                //         axios.get('https://yesno.wtf/api')
                //             .then(function (response) {
                //                 vm.answer = _.capitalize(response.data.answer)
                //             })
                //             .catch(function (error) {
                //                 vm.answer = 'Ошибка! Не могу связаться с API. ' + error
                //             })
                //     },
                //     // Это количество миллисекунд, после которого мы считаем, что пользователь прекратил печатать:
                //     500
                // )
            }
        });

        // moduleApp.selectric();
    },
    'global-tabs': function(){
        $(document).on('click', '.js-tabs-controls', function(e){
            e.preventDefault();

            var $item = $(this).closest('.tabs-controls-item'),
                $parent = $(this).closest('.js-tabs-wrapper'),
                $contentItem = $parent.find('.js-tabs-item'),
                itemNumber = $item.index();

            $contentItem.eq(itemNumber)
                .add($item)
                .addClass('active')
                .siblings()
                .removeClass('active');
        });
    },
    'global-accordion': function($thisModule){
        $thisModule.find('.js-accordion-trigger').on('click', function(e){
            e.preventDefault();

            var $this = $(this),
                item = $this.closest('.accordion-item'),
                list = $this.closest('.accordion-list'),
                items = list.find('.accordion-item'),
                content = item.find('.accordion-inner'),
                otherContent = list.find('.accordion-inner'),
                duration = 300;

            if (!item.hasClass('active')) {
                items.removeClass('active');
                item.addClass('active');

                otherContent.stop(true, true).slideUp(duration);
                content.stop(true, true).slideDown(duration);

            } else {
                content.stop(true, true).slideUp(duration);
                item.removeClass('active');
            }

        });
    },
    'video-container': function(){
        $('.js-play-video').on('click', function(e){
            e.preventDefault();

            var $cntVideo = $(this).parent('.video-container').find('video')[0];
            $cntVideo.play();
            $(this).css('display','none');
        });

        $('video').on('click', function(e){
            e.preventDefault();

            var $cntVideo = $(this)[0];
            $cntVideo.pause();
            $(this).parent('.video-container').find('.js-play-video').css('display','block');
        });
    },
    'fotorama-box': function($this){

        var $fotoramaDiv = $this.find('.fotorama').fotorama(),
            fotorama = $fotoramaDiv.data('fotorama'),
            $prev  = $this.find('.js-fotorama-prev'),
            $next = $this.find('.js-fotorama-next');

        $next.on('click', function(){
            fotorama.show('>');
        });

        $prev.on('click', function(){
            fotorama.show('<');
        });
    },
    'sliderBlog': function($thisModule){
        var configBlog = {
            slidesPerView: 1,
            centeredSlides: false,
            spaceBetween: 0,
            'nextButton': $thisModule.find('.is-slider-swiper-next')[0],
            'prevButton': $thisModule.find('.is-slider-swiper-prev')[0]
        };

        swiperBlog = $thisModule.find('.swiper-container').swiper(configBlog);
    },
    'blog-category': function($thisModule){
        var urlAjax = $thisModule.attr('data-ajax');

        $thisModule.find('.js-category-blog').on('click', function(){
            var $this = $(this),
                type = $this.attr('data-type');
            $.ajax({
                url:urlAjax,
                data:
                    {
                        type: type
                    },
                type: 'POST',
                dataType: 'html',
                success: function (result) {
                    if(result){
                        clearList(result);
                    }
                }
            });

            function clearList(result){
                $('.js-ajax-wrapper').addClass('deleted');
                setTimeout(function(){
                    addList(result);
                    $('.js-ajax-wrapper.deleted').remove();
                },400);
            }

            function addList(result){
                $('.container-blog-list').append(result);
                setTimeout(function() {
                    $('.js-ajax-wrapper.appended').removeClass('appended');
                },100);
            }
        });
    },
    'sliderAbout': function ($thisModule) {
        var configAbout = {
            slidesPerView: 1,
            centeredSlides: false,
            spaceBetween: 0,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            'nextButton': $thisModule.find('.is-slider-swiper-next')[0],
            'prevButton': $thisModule.find('.is-slider-swiper-prev')[0]
        };

        var swiperAbout = $thisModule.find('.swiper-container').swiper(configAbout);
    },
    'openWindow': function(){
        $('.js-open-popUp').on('click', function(){

            var nameWindow = $(this).attr('data-open'),
                $template = $('#'+nameWindow),
                $temp = $('#'+nameWindow);

            moduleApp.popupOpen($template, '', function(){
                console.log($(this));
                if($temp.find('form').length > 0){
                    moduleApp.formValidation($('.fancybox-inner .js-form-reviews'));
                }
            }, '', function(){
                //после закрытия поп-апа
                $template.find('form input').each(function(ind,elt){
                    $(elt).val('');
                });
            });
        });
    },
    'customValidation': function(){
        console.log('valid');
        moduleApp.formValidation($('.js-form-custom-submit'),function($thisForm){
            $thisForm.submit();
        },true);
    },
    'formApplication': function(){
        //слайдер в форме
        var $slider = $('.application-slider'),
            configApplication = {
                slidesPerView: 1,
                centeredSlides: false,
                spaceBetween: 0,
                autoHeight: true,
                simulateTouch: false,
                // nextButton: $slider.find('.js-next-step')[0],
                prevButton: $slider.find('.js-prev-step')[0]
            };

        var $swiperApplication =  $slider.swiper(configApplication);

        //календарь для поля даты
        $('.datetimepicker').datetimepicker({
            lang:'ru',
            timepicker:false,
            format:'d.m.Y',
            minDate:'0'
        });
        $.datetimepicker.setLocale('ru');

        //валидация полей
        moduleApp.formValidation($('.js-submit-modal-window'), function($thisForm){
            console.log('true');
            var urlAjax = $thisForm.attr('action'),
                value = $thisForm.serializeArray();

            $('.js-submit-modal-window').addClass('loading');
            sendAjax(value,urlAjax);
        });

        // открыть форму
        $('.js-open-application').on('click', function(){
            $('html').addClass('open-full-modal-window');
        });

        //закрыть форму
        $('.js-close-modal-window').on('click', function(){
            closeModalWindow();
        });

        //изменение города
        $('.js-gfw-select').on('change', function(){
            var index = $(this).val(),
                arrayCheckBox = _services[index],
                length = arrayCheckBox['count'],
                template = '<div class="two-columns"><div class="columns">',
                count = 0;

            if(length%2 != 0){length++;}

            $.each(arrayCheckBox, function(ind,elt){
                if(ind != 'count' ){
                    if(length/2 == length-count){
                        template += '</div><div class="columns">';
                    }
                    template += '<div class="form-checkbox"><input class="js-checkbox-application" type="checkbox" name="'+ind+'" id="'+ind+'"><label for="'+ind+'"><svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><use xlink:href="#checkbox-icon"/></svg>'+elt+'</label></div>'
                }
                count++;
            });

            template += '</div></div>';
            $('.gfw--servicess-wrapper').html(template);
            $swiperApplication.update();
            countCheckBox();
        });

        //изменение состояния чекбокосв
        $(document).on('change', '.js-checkbox-application', function(){
            countCheckBox();
        });

        //проверка на выбраный хотя бы один чекбокс
        function countCheckBox(){
            var count = $('.js-checkbox-application:checked').length;

            if(count > 0){$('.js-next-step').removeClass('disabled');}
            else{$('.js-next-step').addClass('disabled');}
        };

        //следущий слайд
        $('.js-next-step').on('click', function(){
            if(!$(this).hasClass('disabled')){
                $swiperApplication.slideNext();
            }
        });

        //отправка формы
        function sendAjax(value,urlAjax) {
            $.ajax({
                url: urlAjax,
                data:
                    {val: value},
                type: 'POST',
                dataType: 'JSON',
                success: function (result) {
                    console.log('ajax');
                    if(result == true){
                        $('.message-wrapper').prepend('<h3>Ваша заявка успешно отправлена!</h3><p>Наш консультант свяжется с вами в ближайшее время и предложит вам лучших специалистов!</p>');
                        $swiperApplication.slideNext();
                        $('.js-submit-modal-window').removeClass('loading');
                    }
                    else{
                        $('.message-wrapper').prepend('<h3>Ваша заявка не отправлена!</h3><p>Мы приносим свои извинения. Произошёл технический сбой. Попробуйте чуть позже.</p>');
                        $swiperApplication.slideNext();
                        $('.js-submit-modal-window').removeClass('loading');
                    }
                }
            })
        }

        function closeModalWindow(){
            $('html').removeClass('open-full-modal-window');
            setTimeout(function(){
                $swiperApplication.slideTo(0);
            },500);

            $('.gfw--create-application .message-wrapper h3').remove();
            $('.gfw--create-application .message-wrapper p').remove();
        }
    },
    'googleMapContacts': function(){

        var cityActive = $('.js-select-city-map').val(),
            activeElementArray = _mapPointArray[cityActive],
            map,
            markerIcon = "/dist/img/icon-map.png",
            mapIsInteractive = true,
            markers = [],
            lat = parseFloat(activeElementArray['lat']),
            long = parseFloat(activeElementArray['long']),
            style = [
                {
                    "featureType": "landscape",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "stylers": [
                        {
                            "hue": "#00aaff"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "gamma": 2.15
                        },
                        {
                            "lightness": 12
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "lightness": 24
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "lightness": 57
                        }
                    ]
                }
            ],
            Options = {
                center: {lat: lat, lng: long},
                zoom: 13,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: style,
                scrollwheel: true,
                zoomControl: true,
                draggable: false,
                title: ''
            };

        initMap();

        $('.js-select-city-map').on('change', function(){
            cityActive = $(this).val();
            activeElementArray = _mapPointArray[cityActive];
            lat = parseFloat(activeElementArray['lat']);
            long = parseFloat(activeElementArray['long']);
            Options.center = {lat: lat, lng: long};

            initMap()
            overwrite();
        });

        function initMap(){
            map = new google.maps.Map(document.getElementById("map"), Options);

            google.maps.event.addListener(map, 'click', function () {
                if (!mapIsInteractive) {
                    map.setOptions({scrollwheel: true, draggable: true});
                    mapIsInteractive = true;
                } else {
                    map.setOptions({scrollwheel: false, draggable: false});
                    mapIsInteractive = false;
                }
            });

            var lat = activeElementArray['lat'],
                long = activeElementArray['long'],
                _marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, long),
                    map: map,
                    icon: markerIcon
                });

            markers.push(_marker);
            // map.setZoom(15);
        }

        function overwrite(){
            var $container = $('.js-contacts-content');
            var phone = '',
                email = '',
                email2 = '',
                address = '',
                btn = '';

            phone = '<a href="#">'+activeElementArray['phone']+'</a>';
            email = '<span>Для связи:</span> <a href="#">'+activeElementArray['email']+'</a>';
            email2 = '<span>Сотрудничество/реклама:</span> <a href="#">'+activeElementArray['email2']+'</a>';
            address = '<p>'+activeElementArray['address']+'</p>';
            btn = '<div class="btn-default btn-white js-callback-phone" data-open="callback-phone" data-type="'+cityActive+'">Обратный звонок</div>'

            $container.html('<div class="contacts-phone">'+phone+'</div><div class="contacts-email"><div class="line">'+email+'</div><div class="line">'+email2+'</div></div><div class="contacts-address">'+address+'</div>'+btn);
        }

        $(document).on('click', '.js-callback-phone', function(){
           var $this = $(this),
               index = $this.attr('data-type'),
               nameWindow = $this.attr('data-open'),
               template = $('#'+nameWindow).html();

           moduleApp.popupOpen(template, '', function(){
               console.log(cityActive);
               $('.fancybox-inner .js-city-type').val(index);
               moduleApp.formValidation($('.fancybox-inner .js-form-reviews'));
           });
        });
    },
    'pageForm': function($thisModule){
        moduleApp.formValidation($thisModule.find('.js-form-submit-page'));
    },
    'socialShare': function($thisModule){
        $thisModule.find('[data-service]').on('click', function(e){
            e.preventDefault();

            var $this = $(this),
                shareService = $this.attr('data-service'),
                windowLink = '';

            windowLink += 'http://share.yandex.ru/go.xml?service=' + shareService;
            windowLink += '&title=' + encodeURIComponent(_pageShare.title);

            if (shareService === 'twitter') {
                windowLink += ' ' + encodeURIComponent(_pageShare.twitter_description);
                windowLink += '&url=' + _pageShare.link;
                windowLink += '&link=' + _pageShare.link;
            }
            else if (shareService === 'livejournal'){
                windowLink = 'http://www.livejournal.com/update.bml?';
                windowLink += 'subject=' + encodeURIComponent(_pageShare.title);
                windowLink += '&event=' + encodeURIComponent(_pageShare.description) + ' <a href="' + _pageShare.link + '">' + _pageShare.link + '</a>';
            } else {
                windowLink += '&url=' + _pageShare.link;
                windowLink += '&link=' + _pageShare.link;
                windowLink += '&description=' + encodeURIComponent(_pageShare.description);
                windowLink += '&image=' + _pageShare.image;
            }

            window.open(windowLink,'','toolbar=0,status=0,width=625,height=435');
        });

        $thisModule.find('[data-like]').on('click', function(e){
            e.preventDefault();

            var $this = $(this),
                urlAjax = $this.attr('data-ajax'),
                indexPage = $this.attr('data-type');

            sendAjaxLK(urlAjax, indexPage);
        });

        function sendAjaxLK(url, indexPage){
            $.ajax({
                url:url,
                data:{value: indexPage},
                type: 'POST',
                dataType: 'html',
                success: function (result) {
                    animationLike();
                }
            });
        };

        function animationLike(){
            var $this = $('[data-like]');
            if($this.hasClass('active')){
                $this.removeClass('active');
            }
            else{
                $this.addClass('active');
            }
        };
    },
    'calculator-page': function(){

        $('.js-send-calculator').on('click', function(){

            var nameWindow = $(this).attr('data-open'),
                $template = $('#'+nameWindow);

            moduleApp.popupOpen($template, '', function(){
                //после открытия поп-апа
                if($template.find('form').length > 0){
                    $template.find('.calculator-value').val(JSON.stringify(globalListSection));
                    moduleApp.formValidation($('.fancybox-inner .js-form-reviews'));
                }
            }, '', function(){
                //после закрытия поп-апа
                if($template.find('form').length > 0) {
                    $template.find('form input').each(function (ind, elt) {
                        $(elt).val('');

                    });

                    $template.find('.form-input').each(function (ind, elt) {
                        $(elt).removeClass('show-error');
                        if(ind > 1){
                            $(elt).remove();
                        }
                    });

                    $template.find('.js-add-email-input').slideDown(300);
                }
            });
        });

        $(document).on('click', '.js-add-email-input', function(){
            var name = '',
                $thisForm = $(this).closest('form'),
                countEmail = 0;

            var tempalte = '<div class="form-input form-element-wrapper"><div class="delete-email js-delete-email"></div><label><span class="form-item-label">E-mail</span><input type="text" name="" data-type="email" data-validation="email"></label><div class="form-item-error">Исправьте ошибку в поле ввода</div></div>';

            $thisForm.find('.list-email').append(tempalte);

            $thisForm.find('input').each(function(ind,elt){
                if($(elt).attr('data-type') == 'email'){
                    $(elt).attr('name', 'email_' + ind);
                    countEmail++;
                }
            });

            if(countEmail === 3){
                $(this).slideUp(300);
            }

            $.fancybox.update();
        });

        $(document).on('click', '.js-delete-email', function(){
            var $thisForm = $(this).closest('form');

            $(this).closest('form').find('.js-add-email-input').slideDown(300);
            $(this).closest('.form-input').remove();

            $thisForm.find('input').each(function(ind,elt){
                $(elt).attr('name', 'email_' + ind);
            });

        });
    },
    'video': function(){

        console.log('test');

        var configBlurCanvas= {
            blur: 'stack',
            scale: 32,
            radius: 3,
            iterations: 2
        }

        var Stats = function() {

            var l = Date.now()
                , m = l
                , g = 0
                , n = Infinity
                , o = 0
                , h = 0
                , p = Infinity
                , q = 0
                , r = 0
                , s = 0
                , f = document.createElement("div");
            f.id = "stats";
            f.addEventListener("mousedown", function(b) {
                b.preventDefault();
                t(++s % 2)
            }, !1);
            f.style.cssText = "width:80px;opacity:0.9;cursor:pointer";
            var a = document.createElement("div");
            a.id = "fps";
            a.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#002";
            f.appendChild(a);
            var i = document.createElement("div");
            i.id = "fpsText";
            i.style.cssText = "color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
            i.innerHTML = "FPS";
            a.appendChild(i);
            var c = document.createElement("div");
            c.id = "fpsGraph";
            c.style.cssText = "position:relative;width:74px;height:30px;background-color:#0ff";
            for (a.appendChild(c); 74 > c.children.length; ) {
                var j = document.createElement("span");
                j.style.cssText = "width:1px;height:30px;float:left;background-color:#113";
                c.appendChild(j)
            }
            var d = document.createElement("div");
            d.id = "ms";
            d.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";
            f.appendChild(d);
            var k = document.createElement("div");
            k.id = "msText";
            k.style.cssText = "color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
            k.innerHTML = "MS";
            d.appendChild(k);
            var e = document.createElement("div");
            e.id = "msGraph";
            e.style.cssText = "position:relative;width:74px;height:30px;background-color:#0f0";
            for (d.appendChild(e); 74 > e.children.length; )
                j = document.createElement("span"),
                    j.style.cssText = "width:1px;height:30px;float:left;background-color:#131",
                    e.appendChild(j);
            var t = function(b) {
                s = b;
                switch (s) {
                    case 0:
                        a.style.display = "block";
                        d.style.display = "none";
                        break;
                    case 1:
                        a.style.display = "none",
                            d.style.display = "block"
                }
            };
            return {
                REVISION: 11,
                domElement: f,
                setMode: t,
                begin: function() {
                    l = Date.now()
                },
                end: function() {
                    var b = Date.now();
                    g = b - l;
                    n = Math.min(n, g);
                    o = Math.max(o, g);
                    k.textContent = g + " MS (" + n + "-" + o + ")";
                    var a = Math.min(30, 30 - 30 * (g / 200));
                    e.appendChild(e.firstChild).style.height = a + "px";
                    r++;
                    b > m + 1E3 && (h = Math.round(1E3 * r / (b - m)),
                        p = Math.min(p, h),
                        q = Math.max(q, h),
                        i.textContent = h + " FPS (" + p + "-" + q + ")",
                        a = Math.min(30, 30 - 30 * (h / 100)),
                        c.appendChild(c.firstChild).style.height = a + "px",
                        m = b,
                        r = 0);
                    return b
                },
                update: function() {
                    l = this.end()
                }
            }
        };

        ;(function(window) {
            var Blur = {};
            Blur.superfast = (function() {
                var mul_table = [1, 57, 41, 21, 203, 34, 97, 73, 227, 91, 149, 62, 105, 45, 39, 137, 241, 107, 3, 173, 39, 71, 65, 238, 219, 101, 187, 87, 81, 151, 141, 133, 249, 117, 221, 209, 197, 187, 177, 169, 5, 153, 73, 139, 133, 127, 243, 233, 223, 107, 103, 99, 191, 23, 177, 171, 165, 159, 77, 149, 9, 139, 135, 131, 253, 245, 119, 231, 224, 109, 211, 103, 25, 195, 189, 23, 45, 175, 171, 83, 81, 79, 155, 151, 147, 9, 141, 137, 67, 131, 129, 251, 123, 30, 235, 115, 113, 221, 217, 53, 13, 51, 50, 49, 193, 189, 185, 91, 179, 175, 43, 169, 83, 163, 5, 79, 155, 19, 75, 147, 145, 143, 35, 69, 17, 67, 33, 65, 255, 251, 247, 243, 239, 59, 29, 229, 113, 111, 219, 27, 213, 105, 207, 51, 201, 199, 49, 193, 191, 47, 93, 183, 181, 179, 11, 87, 43, 85, 167, 165, 163, 161, 159, 157, 155, 77, 19, 75, 37, 73, 145, 143, 141, 35, 138, 137, 135, 67, 33, 131, 129, 255, 63, 250, 247, 61, 121, 239, 237, 117, 29, 229, 227, 225, 111, 55, 109, 216, 213, 211, 209, 207, 205, 203, 201, 199, 197, 195, 193, 48, 190, 47, 93, 185, 183, 181, 179, 178, 176, 175, 173, 171, 85, 21, 167, 165, 41, 163, 161, 5, 79, 157, 78, 154, 153, 19, 75, 149, 74, 147, 73, 144, 143, 71, 141, 140, 139, 137, 17, 135, 134, 133, 66, 131, 65, 129, 1];
                var shg_table = [0, 9, 10, 10, 14, 12, 14, 14, 16, 15, 16, 15, 16, 15, 15, 17, 18, 17, 12, 18, 16, 17, 17, 19, 19, 18, 19, 18, 18, 19, 19, 19, 20, 19, 20, 20, 20, 20, 20, 20, 15, 20, 19, 20, 20, 20, 21, 21, 21, 20, 20, 20, 21, 18, 21, 21, 21, 21, 20, 21, 17, 21, 21, 21, 22, 22, 21, 22, 22, 21, 22, 21, 19, 22, 22, 19, 20, 22, 22, 21, 21, 21, 22, 22, 22, 18, 22, 22, 21, 22, 22, 23, 22, 20, 23, 22, 22, 23, 23, 21, 19, 21, 21, 21, 23, 23, 23, 22, 23, 23, 21, 23, 22, 23, 18, 22, 23, 20, 22, 23, 23, 23, 21, 22, 20, 22, 21, 22, 24, 24, 24, 24, 24, 22, 21, 24, 23, 23, 24, 21, 24, 23, 24, 22, 24, 24, 22, 24, 24, 22, 23, 24, 24, 24, 20, 23, 22, 23, 24, 24, 24, 24, 24, 24, 24, 23, 21, 23, 22, 23, 24, 24, 24, 22, 24, 24, 24, 23, 22, 24, 24, 25, 23, 25, 25, 23, 24, 25, 25, 24, 22, 25, 25, 25, 24, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 23, 25, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 24, 22, 25, 25, 23, 25, 25, 20, 24, 25, 24, 25, 25, 22, 24, 25, 24, 25, 24, 25, 25, 24, 25, 25, 25, 25, 22, 25, 25, 25, 24, 25, 24, 25, 18];
                return function(imageData, width, height, radius, iterations) {
                    if (isNaN(radius) || radius < 1)
                        return;
                    radius |= 0;
                    if (isNaN(iterations)) {
                        iterations = 1;
                    }
                    iterations |= 0;
                    if (iterations > 3) {
                        iterations = 3;
                    }
                    if (iterations < 1) {
                        iterations = 1;
                    }
                    var pixels = imageData.data;
                    var rsum;
                    var gsum;
                    var bsum;
                    var asum;
                    var x;
                    var y;
                    var i;
                    var p;
                    var p1;
                    var p2;
                    var yp;
                    var yi;
                    var yw;
                    var idx;
                    var wm = width - 1;
                    var hm = height - 1;
                    var wh = width * height;
                    var rad1 = radius + 1;
                    var r = [];
                    var g = [];
                    var b = [];
                    var mul_sum = mul_table[radius];
                    var shg_sum = shg_table[radius];
                    var vmin = [];
                    var vmax = [];
                    while (iterations-- > 0) {
                        yw = yi = 0;
                        for (y = 0; y < height; y++) {
                            rsum = pixels[yw] * rad1;
                            gsum = pixels[yw + 1] * rad1;
                            bsum = pixels[yw + 2] * rad1;
                            for (i = 1; i <= radius; i++) {
                                p = yw + (((i > wm ? wm : i)) << 2);
                                rsum += pixels[p++];
                                gsum += pixels[p++];
                                bsum += pixels[p++];
                            }
                            for (x = 0; x < width; x++) {
                                r[yi] = rsum;
                                g[yi] = gsum;
                                b[yi] = bsum;
                                if (y == 0) {
                                    vmin[x] = ((p = x + rad1) < wm ? p : wm) << 2;
                                    vmax[x] = ((p = x - radius) > 0 ? p << 2 : 0);
                                }
                                p1 = yw + vmin[x];
                                p2 = yw + vmax[x];
                                rsum += pixels[p1++] - pixels[p2++];
                                gsum += pixels[p1++] - pixels[p2++];
                                bsum += pixels[p1++] - pixels[p2++];
                                yi++;
                            }
                            yw += (width << 2);
                        }
                        for (x = 0; x < width; x++) {
                            yp = x;
                            rsum = r[yp] * rad1;
                            gsum = g[yp] * rad1;
                            bsum = b[yp] * rad1;
                            for (i = 1; i <= radius; i++) {
                                yp += (i > hm ? 0 : width);
                                rsum += r[yp];
                                gsum += g[yp];
                                bsum += b[yp];
                            }
                            yi = x << 2;
                            for (y = 0; y < height; y++) {
                                pixels[yi] = (rsum * mul_sum) >>> shg_sum;
                                pixels[yi + 1] = (gsum * mul_sum) >>> shg_sum;
                                pixels[yi + 2] = (bsum * mul_sum) >>> shg_sum;
                                if (x == 0) {
                                    vmin[y] = ((p = y + rad1) < hm ? p : hm) * width;
                                    vmax[y] = ((p = y - radius) > 0 ? p * width : 0);
                                }
                                p1 = x + vmin[y];
                                p2 = x + vmax[y];
                                rsum += r[p1] - r[p2];
                                gsum += g[p1] - g[p2];
                                bsum += b[p1] - b[p2];
                                yi += width << 2;
                            }
                        }
                    }
                    return imageData;
                }
                    ;
            })();
            Blur.stack = (function() {
                var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
                var shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
                return function(imageData, width, height, radius) {
                    if (isNaN(radius) || radius < 1)
                        return;
                    radius |= 0;
                    var pixels = imageData.data;
                    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, r_out_sum, g_out_sum, b_out_sum, r_in_sum, g_in_sum, b_in_sum, pr, pg, pb, rbs;
                    var div = radius + radius + 1;
                    var w4 = width << 2;
                    var widthMinus1 = width - 1;
                    var heightMinus1 = height - 1;
                    var radiusPlus1 = radius + 1;
                    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
                    var stackStart = {
                        r: 0,
                        g: 0,
                        b: 0,
                        next: null
                    };
                    var stack = stackStart;
                    for (i = 1; i < div; i++) {
                        stack = stack.next = {
                            r: 0,
                            g: 0,
                            b: 0,
                            next: null
                        };
                        if (i == radiusPlus1)
                            var stackEnd = stack;
                    }
                    stack.next = stackStart;
                    var stackIn = null;
                    var stackOut = null;
                    yw = yi = 0;
                    var mul_sum = mul_table[radius];
                    var shg_sum = shg_table[radius];
                    for (y = 0; y < height; y++) {
                        r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
                        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
                        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
                        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
                        r_sum += sumFactor * pr;
                        g_sum += sumFactor * pg;
                        b_sum += sumFactor * pb;
                        stack = stackStart;
                        for (i = 0; i < radiusPlus1; i++) {
                            stack.r = pr;
                            stack.g = pg;
                            stack.b = pb;
                            stack = stack.next;
                        }
                        for (i = 1; i < radiusPlus1; i++) {
                            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                            r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
                            g_sum += (stack.g = (pg = pixels[p + 1])) * rbs;
                            b_sum += (stack.b = (pb = pixels[p + 2])) * rbs;
                            r_in_sum += pr;
                            g_in_sum += pg;
                            b_in_sum += pb;
                            stack = stack.next;
                        }
                        stackIn = stackStart;
                        stackOut = stackEnd;
                        for (x = 0; x < width; x++) {
                            pixels[yi] = (r_sum * mul_sum) >> shg_sum;
                            pixels[yi + 1] = (g_sum * mul_sum) >> shg_sum;
                            pixels[yi + 2] = (b_sum * mul_sum) >> shg_sum;
                            r_sum -= r_out_sum;
                            g_sum -= g_out_sum;
                            b_sum -= b_out_sum;
                            r_out_sum -= stackIn.r;
                            g_out_sum -= stackIn.g;
                            b_out_sum -= stackIn.b;
                            p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
                            r_in_sum += (stackIn.r = pixels[p]);
                            g_in_sum += (stackIn.g = pixels[p + 1]);
                            b_in_sum += (stackIn.b = pixels[p + 2]);
                            r_sum += r_in_sum;
                            g_sum += g_in_sum;
                            b_sum += b_in_sum;
                            stackIn = stackIn.next;
                            r_out_sum += (pr = stackOut.r);
                            g_out_sum += (pg = stackOut.g);
                            b_out_sum += (pb = stackOut.b);
                            r_in_sum -= pr;
                            g_in_sum -= pg;
                            b_in_sum -= pb;
                            stackOut = stackOut.next;
                            yi += 4;
                        }
                        yw += width;
                    }
                    for (x = 0; x < width; x++) {
                        g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
                        yi = x << 2;
                        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
                        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
                        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
                        r_sum += sumFactor * pr;
                        g_sum += sumFactor * pg;
                        b_sum += sumFactor * pb;
                        stack = stackStart;
                        for (i = 0; i < radiusPlus1; i++) {
                            stack.r = pr;
                            stack.g = pg;
                            stack.b = pb;
                            stack = stack.next;
                        }
                        yp = width;
                        for (i = 1; i <= radius; i++) {
                            yi = (yp + x) << 2;
                            r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
                            g_sum += (stack.g = (pg = pixels[yi + 1])) * rbs;
                            b_sum += (stack.b = (pb = pixels[yi + 2])) * rbs;
                            r_in_sum += pr;
                            g_in_sum += pg;
                            b_in_sum += pb;
                            stack = stack.next;
                            if (i < heightMinus1) {
                                yp += width;
                            }
                        }
                        yi = x;
                        stackIn = stackStart;
                        stackOut = stackEnd;
                        for (y = 0; y < height; y++) {
                            p = yi << 2;
                            pixels[p] = (r_sum * mul_sum) >> shg_sum;
                            pixels[p + 1] = (g_sum * mul_sum) >> shg_sum;
                            pixels[p + 2] = (b_sum * mul_sum) >> shg_sum;
                            r_sum -= r_out_sum;
                            g_sum -= g_out_sum;
                            b_sum -= b_out_sum;
                            r_out_sum -= stackIn.r;
                            g_out_sum -= stackIn.g;
                            b_out_sum -= stackIn.b;
                            p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;
                            r_sum += (r_in_sum += (stackIn.r = pixels[p]));
                            g_sum += (g_in_sum += (stackIn.g = pixels[p + 1]));
                            b_sum += (b_in_sum += (stackIn.b = pixels[p + 2]));
                            stackIn = stackIn.next;
                            r_out_sum += (pr = stackOut.r);
                            g_out_sum += (pg = stackOut.g);
                            b_out_sum += (pb = stackOut.b);
                            r_in_sum -= pr;
                            g_in_sum -= pg;
                            b_in_sum -= pb;
                            stackOut = stackOut.next;
                            yi += width;
                        }
                    }
                    return imageData;
                }
                    ;
            })();
            window.Blur = Blur;
        })(window);

        (function() {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }
            if (!window.requestAnimationFrame)
                window.requestAnimationFrame = function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                }
                ;
            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                }
                ;
        }());

        ;(function(window, document) {
            // var blurInput;
            // var scaleInput;
            // var radiusInput;
            // var iterationsInput;
            var mp4;
            var webm;
            var video;
            var buffer;
            var canvas;
            var context;
            var wrapper;
            var stats;
            var req;
            var blurMethod;
            function init() {
                // blurInput = document.getElementById('blur');
                // scaleInput = document.getElementById('scale');
                // radiusInput = document.getElementById('radius');
                // iterationsInput = document.getElementById('iterations');
                mp4 = document.getElementById('mp4');
                webm = document.getElementById('webm');
                video = document.getElementById('video');
                buffer = document.createElement('canvas').getContext('2d');
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');
                wrapper = document.getElementById('canvas-container');
                wrapper.appendChild(canvas);
                stats = new Stats();
                stats.setMode(0);
                document.body.appendChild(stats.domElement);
                video.addEventListener('click', function() {
                    video[video.paused ? 'play' : 'pause']();
                }, false);
                video.addEventListener('play', draw, false);
                video.play();
                blurMethod = configBlurCanvas.blur;
                // blurInput.addEventListener('change', toggle, false);
            }
            function toggle() {
                blurMethod = this.value;
                if (!blurMethod) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
            function draw() {
                console.log('draw');
                if (video.paused) {
                    return;
                }
                req = requestAnimationFrame(draw);
                stats.begin();
                if (!blurMethod) {
                    stats.end();
                    return;
                }
                var scale = +configBlurCanvas.scale;
                var radius = +configBlurCanvas.radius;
                var iterations = +configBlurCanvas.iterations;
                var videoWidth = video.videoWidth;
                var videoHeight = video.videoHeight;
                var videoOffsetLeft = 0;
                var videoOffsetTop = 0;
                var videoOffsetRight = videoWidth;
                var videoOffsetBottom = videoHeight;
                var videoClipWidth = videoOffsetRight - videoOffsetLeft;
                var videoClipHeight = videoOffsetBottom - videoOffsetTop;
                var canvasWidth = Math.round(videoClipWidth / scale);
                var canvasHeight = Math.round(videoClipHeight / scale);
                var canvasOffsetLeft = 0;
                var canvasOffsetTop = 0;
                var canvasOffsetRight = canvasWidth;
                var canvasOffsetBottom = canvasHeight;
                var imageData;
                buffer.width = canvasWidth;
                buffer.height = canvasHeight;
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                buffer.drawImage(video, videoOffsetLeft, videoOffsetTop, videoClipWidth, videoClipHeight, canvasOffsetLeft, canvasOffsetTop, canvasOffsetRight, canvasOffsetBottom);
                imageData = buffer.getImageData(canvasOffsetLeft, canvasOffsetTop, canvasWidth, canvasHeight);
                if (radius > 0) {
                    imageData = Blur[blurMethod](imageData, canvasWidth, canvasHeight, radius, iterations);
                }
                context.putImageData(imageData, canvasOffsetLeft, canvasOffsetTop);
                stats.end();
            }
            init();
        })(window, document);

        Stats();

    },
    'search': function(){
        $('.js-search-btn').on('click', function(e){
            e.preventDefault();

            var $this = $(this),
                value = $this.siblings('.search-input').val();

            console.log(value);
            $.ajax({
                url:'/ajax/search.php',
                data:value,
                type:'POST',
                daraType:'json',
                success: function(result){
                    listSearch = result;
                }
            });
        });
    },
    'mobile_menu': function(){
        $('.js-m-btn-menu').on('click', function(){
            $(this).toggleClass('active');

            $('.container-mobile-menu').toggleClass('active');

            $('body').toggleClass('open-menu');
        });

    },
    'mobileCatalog': function($thisModule){
        $thisModule.on('click', function(){
            $(this).siblings('.filter-list-inner').slideToggle();
        });
    }

};


$(document).ready(function(){
    // init globals
    $window = $(window);
    $document = $(document);
    $html = $('html');

    pageApp.init();
    moduleApp.init();

});






