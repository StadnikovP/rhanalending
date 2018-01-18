var $window, $document, $html;
var lang = 'rus',
    init = false;

var myMap,
    myPlacemark;

var pageApp = {
    'init': function(){
        var $thisApp = $('#app');
        var curApp = $thisApp.attr('data-app');
        this.globalPollifil();
        if (pageApp[curApp]) { pageApp[curApp]($thisApp); }
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
        this.firstScreenAnimation();
        this.animationInview();
        this.clickReedText();
        this.navigationScroll();
        this.videoBg();
        this.menuButton();
        this.swiperPress();
        this.swiperNews();
        this.changeLanguage();
    },
    'firstScreenAnimation': function(){

        $('.header-wrapper').addClass('active');
        $('.js-video').attr('autoplay', 'true');
    },
    'animationInview': function(){
        //one or on
        $('.js-animation-view').on('inview', function(event, isInView) {
            if (isInView) {
                $(this).addClass('active');
                // element is now visible in the viewport
            } else {
                // element has gone out of viewport
            }
        });
    },
    'clickReedText': function(){
        $('.js-pseudo-link').on('click', function(e){
            e.preventDefault();
            var $this = $(this);
            var $parent = $this.parents('.element-reed-text');
            var $wrapper = $parent.find('.js-wrapper-text');
            var heightText = $parent.find('.inner-content').height();

            if(!$this.hasClass('active')){
                // if(heightText > $wrapper.height){
                    $wrapper.css('height', heightText)
                // }

                $this.addClass('active');
                $this.html('Свернуть');
            }
            else{
                $this.removeClass('active');
                $this.html('Читать еще');
                $wrapper.css('height', $wrapper.attr('data-height'));
            }



        });
    },
    'videoBg': function(){

        $('#video').YTPlayer({
            fitToBackground: true,
            videoId: 'slsSrYlhLLs',
            pauseOnScroll: false,
            playerVars: {
                autohide: 1,
                loop: 1,
                playlist: 'slsSrYlhLLs',
                modestbranding: 0,
                rel: 0,
                showinfo: 0,
                controls: 0,
                disablekb: 1,
                enablejsapi: 0,
                iv_load_policy: 3
            },
            events: {
                'onStateChange': initVideo,
            }
        });

        function initVideo(){
            $('#video').addClass('active');

        }
    },
    'navigationScroll': function(){
        $('.js-link-nav').on('click', function (e) {
            e.preventDefault();

            console.log('click');
            var $this = $(this),
                url = $this.attr('href'),
                $section = $(url),
                topPositionSection = $section.offset().top;

            $('html,body').animate({'scrollTop': topPositionSection}, 500);

            setTimeout(function () {
                $('.mobile-nav-bar').removeClass('active');
                $('.js-m-btn-menu').removeClass('active');
            },500);

        });
    },
    'menuButton': function(){
        $('.js-m-btn-menu').on('click', function () {
            $(this).toggleClass('active');
            $('.mobile-nav-bar').toggleClass('active');
            // $('body').toggleClass('open-menu');
        });
    },
    'swiperPress': function(){
        var configPress = {
            slidesPerView: 'auto',
            spaceBetween: 80,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints:{
                480: {
                    slidesPerView: 1,
                    spaceBetween: 0
                }
            },
            autoplay: {
                delay: 5000,
            },
        };

        var mySwiper = new Swiper('.js-slider-press', configPress);
    },
    'swiperNews': function(){
        // var initGlobalNew = false;
        var configNews = {
            slidesPerView: 1,
            pagination: {
                el: '.js-slider-news .swiper-pagination',
                clickable: true,
            },
        };

        function initGlobalNewsSlider(){
            $('.js-slider-news').each(function(ind,elt){
                var $elt = $(elt);

                var mySwiper = new Swiper($elt, configNews);

                $elt.find('.swiper-button-next').on('click', function(){
                    mySwiper.slideNext();
                });
                $elt.find('.swiper-button-prev').on('click', function(){
                    mySwiper.slidePrev();
                });
            });
        }

        initGlobalNewsSlider();

        var configGlobalNews = {
            slidesPerView: 2,
            spaceBetween: 60,
            navigation: {
                nextEl: '.js-news-next',
                prevEl: '.js-news-prev',
            },
            pagination: {
                el: '.js-slider-global-news .swiper-pagination',
                clickable: true,
            },
            breakpoints:{
                850: {
                    slidesPerView: 1,
                    spaceBetween: 0
                }
            },
            on: {
                init: function () {
                    initGlobalNewsSlider()
                }
            }
        };

        var SwiperGlobalNews = new Swiper('.js-slider-global-news', configGlobalNews);



    },
    'changeLanguage': function(){
        $('.js-language').on('click', function(){

            var $this = $(this),
                $parent = $('.js-event-moscow'),
                version = $this.attr('data-change'),
                $eventContainer = $('.event-container');

            $parent.attr('data-lang',version);
            $eventContainer.addClass('preload');
            setTimeout(function(){
                $('.event-version').addClass('disabled');
                $('[data-version =' + version +']').addClass('hidden').removeClass('disabled');
                setTimeout(function () {
                    $('[data-version =' + version +']').removeClass('hidden');
                },200);
                setTimeout(function () {
                    $eventContainer.removeClass('preload');
                },300);
            },300);

        });
    }
};

var mapApp = {
    'init': function(){
        this.initMap();
    },
    'initMap': function(){
        myMap = new ymaps.Map("map", {
            center: [55.77445, 37.61034],
            zoom: 14,
            controls: ["zoomControl", "typeSelector"]
        });

        myPlacemark = new ymaps.Placemark([55.77445, 37.61034]);

        myMap.geoObjects.add(myPlacemark);
    }
}

$(document).ready(function(){
    // init globals
    $window = $(window);
    $document = $(document);
    $html = $('html');

    pageApp.init();
    moduleApp.init();

    ymaps.ready(function(){
        mapApp.init()
    });

});