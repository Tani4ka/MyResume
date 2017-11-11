jQuery(function() {
    initBgParallax();

    initPreloader();
    initWOW();
});


// comment
function initBgParallax() {
    jQuery('.bg-holder').parallaxBlock({
        image: 'img',
        fallbackClass: 'is-touch-device'
    });
}

                            /* Tanya scripts start */

/* Preloader */

function initPreloader() {
    var hellopreloader = document.getElementById("hellopreloader_preload");
    function fadeOutnojquery(el){
        el.style.opacity = 1;
        var interhellopreloader = setInterval(function(){
            el.style.opacity = el.style.opacity - 0.05;
            if (el.style.opacity <=0.05){
                clearInterval(interhellopreloader);
                hellopreloader.style.display = "none";}
        },16);
    }
    window.onload = function(){
        setTimeout(function(){
            fadeOutnojquery(hellopreloader);
        },1000);
    };
}

function initWOW() {
    new WOW().init();
}

jQuery(function() {

    /* Chrome Smooth Scroll */
    try {
        $.browserSelector();
        if ($("html").hasClass("chrome")) {
            $.smoothScroll();
        }
    } catch (err) {
    };


    /* Prevent Drag for a, img */
    $("img, a").on("dragstart", function (event) {
        event.preventDefault();
    });


    /* Scroll page to top */
    $(window).scroll(function () {
        if ($(this).scrollTop() > $(this).height()) {
            $('.top').addClass('active');
        } else {
            $('.top').removeClass('active');
        }
    });

    /* button to top */
    $('.top').click(function () {
        $('html, body').stop().animate({scrollTop: 0}, 'slow', 'swing');
    });


    /* Preloader */
    $(window).on('load', function () {
        $('.preloader').delay(1000).fadeOut('slow');
    });


    /* active social link */
    $('.soc__item').click(function () {
        $('.soc__item').addClass('soc__item_active');
    });


    /* fixed menu */
    var $menu = $(".drop-menu");
    $(window).scroll(function(){
        if ($(this).scrollTop() > 50 && $menu.hasClass("default")){
            $menu.fadeOut(0,function(){
                $(this).removeClass("default")
                  .addClass("fixed")
                  .fadeIn(0);
            });
        } else if($(this).scrollTop() <= 50 && $menu.hasClass("fixed")) {
            $menu.fadeOut(0,function(){
                $(this).removeClass("fixed")
                  .addClass("default")
                  .fadeIn(0);
            });
        }
    });


    /* buttom menu */
    var $mybtn = $('.drop-menu-btn');
    var $overflow = $('.drop-menu__over');
    var $effect = $('#header-menu');

    var open = false;
    $('#button').click(function() {
        if (open == true) {
            open = false
            $mybtn.css({'transform': 'translate(0px)', 'transition': 'all 0.5s linear'});
            $overflow.css({
                'width': '62px',
                'background': '#ED6866',
                'transition': 'all 0.5s linear'
            });
            $effect.css({'height': '0px', 'transition': 'all 0.5s ease-in'});
        } else {
            open = true
            $mybtn.css({'transform': 'translate(-50px)', 'transition': 'all 0.5s linear'});
            $overflow.css({
                'width': '185px',
                'background': '#ED6866',
                'transition': 'all 0.5s linear'
            });
            $effect.css({'height': '310px', 'transition': 'all 0.5s ease-in'});
        }
    });


    /* headings show */

    //$('.heading_wrap').fadeIn();
    //$('.heading_wrap').addClass('fadeInUp');


});// Tanya scripts end


/* jQuery BG Parallax plugin */

;(function($){
    'use strict';
    var isTouchDevice = /MSIE 10.*Touch/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    var ParallaxController = (function() {
        var $win = $(window);
        var items = [];
        var winProps = {
            width: 0,
            height: 0,
            scrollTop: 0
        };
        return {
            init: function() {
                $win.on('load resize orientationchange', this.resizeHandler.bind(this));
                $win.on('scroll', this.scrollHandler.bind(this));

                this.resizeHandler();
            },
            resizeHandler: function() {
                winProps.width = $win.width();
                winProps.height = $win.height();

                $.each(items, this.calculateSize.bind(this));
            },
            scrollHandler: function() {
                winProps.scrollTop = $win.scrollTop();

                $.each(items, this.calculateScroll.bind(this));
            },
            calculateSize: function(i) {
                var item = items[i];

                item.height = Math.max(item.$el.outerHeight(), winProps.height);
                item.width = item.$el.outerWidth();
                item.topOffset = item.$el.offset().top;

                var styles = this.getDimensions({
                    imageRatio: item.imageRatio,
                    itemWidth: item.width,
                    itemHeight: item.height
                });
                item.$el.css({
                    backgroundSize: Math.round(styles.width) + 'px ' + Math.round(styles.height) + 'px'
                });
                this.calculateScroll(i);
            },
            calculateScroll: function(i) {
                var item = items[i];

                if (winProps.scrollTop + winProps.height > item.topOffset && winProps.scrollTop < item.topOffset + item.height) {
                    var ratio = (winProps.scrollTop + winProps.height - item.topOffset) / (winProps.height + item.height);

                    item.$el.css({
                        backgroundPosition: '50% ' + (winProps.height * (item.options.parallaxOffset / 100) - (winProps.height + item.height) * ratio * (item.options.parallaxOffset / 100)) + 'px'
                    });
                }
            },
            getDimensions: function(data) {
                var slideHeight = data.itemWidth / data.imageRatio;

                if (slideHeight < data.itemHeight) {
                    slideHeight = data.itemHeight;
                    data.itemWidth = slideHeight * data.imageRatio;
                }
                return {
                    width: data.itemWidth,
                    height: slideHeight,
                    top: (data.itemHeight - slideHeight) / 2,
                    left: (data.itemWidth - data.itemWidth) / 2
                };
            },
            getRatio: function(image) {
                if (image.prop('naturalWidth')) {
                    return image.prop('naturalWidth') / image.prop('naturalHeight');
                } else {
                    var img = new Image();
                    img.src = image.prop('src');
                    return img.width / img.height;
                }
            },
            imageLoaded: function(image, callback) {
                var self = this;
                var loadHandler = function() {
                    callback.call(self);
                };
                if (image.prop('complete')) {
                    loadHandler();
                } else {
                    image.one('load', loadHandler);
                }
            },
            add: function(el, options) {
                var $el = $(el);
                var $image = $el.find(options.image);

                this.imageLoaded($image, function() {
                    var imageRatio = this.getRatio($image);

                    $el.css({
                        backgroundImage: 'url(' + $image.attr('src') + ')',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: !isTouchDevice ? 'fixed' : 'scroll',
                        backgroundSize: 'cover'
                    });
                    $image.remove();

                    if (isTouchDevice) {
                        $el.addClass(options.fallbackClass);
                        return;
                    }
                    options.parallaxOffset = Math.abs(options.parallaxOffset);

                    var newIndex = items.push({
                        $el: $(el),
                        options: options,
                        imageRatio: imageRatio
                    });
                    this.calculateSize(newIndex - 1);
                });
            }
        };
    }());
    ParallaxController.init();

    $.fn.parallaxBlock = function(options){
        options = $.extend({
            parallaxOffset: 5, // percent from 0 - top 100 (from window height)
            fallbackClass: 'is-touch-device',
            image: 'img'
        }, options);

        return this.each(function() {
            if (this.added) {
                return;
            }

            this.added = true;
            ParallaxController.add(this, options);
        });
    };
}(jQuery));




    /* SVG Fallback */

    //if(!Modernizr.svg) {
    //    $("img[src*='svg']").attr("src", function() {
    //        return $(this).attr("src").replace(".svg", ".png");
    //    });
    //};

    /* picturefill */

   // picturefill({
   //     reevaluate: true,
   //     elements: [ document.getElementById("picture-bg") ]
   // });


    /* Retina cover plugin*/
    //$('.bg-stretch').retinaCover();



    /* E-mail Ajax Send example */

    ////Documentation & Example: https://github.com/agragregra/uniMail
    //$(".callback").submit(function() { //Change
    //    var th = $(this);
    //    $.ajax({
    //        //type: "POST",
    //        //url: "mail.php", //Change
    //        //data: th.serialize()     // need hostname with imail
    //
    //    }).done(function() {
    //        $('.success').addClass('visible');
    //        setTimeout(function() {
    //            th.trigger("reset");
    //            $('.success').removeClass('visible');
    //            $.magnificPopup.close();
    //        }, 3000);
    //    });
    //    //}).done(function() {
    //    //    $(th).find('.success').addClass('active').css('display', 'flex').hide().fadeIn(); // alert("Thank you!");
    //    //    setTimeout(function() {
    //    //        $(th).find('.success').removeClass('active').fadeOut();// Done Functions
    //    //        th.trigger("reset");
    //    //    }, 3000);
    //    //});
    //    return false;
    //});

    /* Equalheight without plug plugin */

    //(function ($) {
    //    $.fn.equalHeights = function () {
    //        var $items = $(this);
    //        function equalize() {
    //            $items.height('initial');
    //            var maxH = $items.eq(0).height();
    //            $items.each(function () {
    //                maxH = ($(this).height() > maxH) ? $(this).height() : maxH;
    //            });
    //            $items.height(maxH);
    //        }
    //        equalize();
    //        $(window).bind('resize', function () {
    //            equalize();
    //        });
    //    };
    //})(jQuery);
    //
    //// call equalHeights
    //$('.services__header').equalHeights();
    //$('.services__text').equalHeights();


    /* Fixed sidebar block */

    //$(function(){
    //    var topPos = $('#floating').offset().top; //расстояние от АйДи флоатинг до начала документа
    //    $(window).scroll(function() { //при скроллинге:
    //        var top = $(document).scrollTop(),//скролинг документа
    //            pip = $('footer').offset().top,//расстояние от футера до начала документа
    //            height = $('#floating').outerHeight();//высота черного блока
    //        console.log(topPos)//вывод в консоль любого значения
    //
    //        if (top > topPos && top < pip - height) {//проскролено больше расстояния от АйДи флоатинг до начала документа
    //            //и проскролено меньше чем расстояние от футера минус высота черного блоока
    //            $('#floating').addClass('fixed').fadeIn(300); //добавляем черному блоку класс фиксед и плавное проявление
    //        }
    //        else if (top > pip - height) {$('#floating').fadeOut(100);//скрытие черного блока при достижении футера
    //        }
    //        else {$('#floating').removeClass('fixed');}//убираем класс фиксед
    //    });
    //});


    /* Popup show hide */

    //$(document).ready(function(){
    //    PopUpHide();
    //});
    //function PopUpShow(){
    //    $("#popup1").show();
    //}
    //function PopUpHide(){
    //    $("#popup1").hide();
    //}


    /* Humburgers */

    //var $humburger = $(".hamburger");
    //var API = $menu.data( "mmenu" );
    //
    //$humburger.on( "click", function() {
    //    API.open();
    //});
    //
    //API.bind( "open:finish", function() {
    //    setTimeout(function() {
    //        $humburger.addClass( "is-active" );
    //    }, 100);
    //});
    //API.bind( "close:finish", function() {
    //    setTimeout(function() {
    //        $humburger.removeClass( "is-active" );
    //    }, 100);
    //});


    /* Owl-carousel (если карусель заружена, сделать блоки одинаковой высоты) */

    //$('.carousel-services').on('initialized.owl.carousel', function () {
    //    setTimeout(function () {
    //        carouselService()
    //    }, 100);
    //});

    //Owl-carousel

    //$('.carousel-services').owlCarousel({
    //    loop: true,
    //    nav: true,
    //    smartSpeed: 700,
    //    navText: ['<i class="fa fa-angle-double-left">', '<i class="fa fa-angle-double-right">'],
    //    responsiveClass: true,
    //    dots: false,
    //    responsive: {
    //        0: {
    //            items: 1
    //        },
    //        800: {
    //            items: 2
    //        },
    //        1100: {
    //            items: 3
    //        }
    //    }
    //});


    /* Blocks the same height for owl-carousel for images */

    //function carouselService() {
    //    $('.carousel-services__item').each(function () {
    //        var ths = $(this),
    //            thsh = ths.find('.carousel-services__content').outerHeight();
    //        ths.find('.carousel-services__image').css('min-height', thsh);
    //    });
    //}carouselService();


    /* Blocks the same height */

    //function carouselService() {
    //    var mh = 23;
    //    $('.services').each(function () {
    //        var ths = $(this),
    //            thsh = ths.find('.services__header').outerHeight();
    //        //console.log(thsh);
    //        if(thsh > mh) {
    //            mh = thsh;
    //        };
    //    });
    //
    //    $('.services__header').height(mh);
    //    //console.log($('.services__header').outerHeight());
    //}carouselService();


    /* Add last/first span for cms */

    //$('.carousel-services__composition .carousel-services__header').each(function () {
    //    var ths = $(this);
    //    ths.html(ths.html().replace(/(\S+)\s*$/, '<span>$1</span>')); // выделяет последнее слово в span
    //});


    //$('section .h2').each(function () {
    //    var ths = $(this);
    //    ths.html(ths.html().replace(/^(\S+)/, '<span>$1</span>'));  // выделяет первое слово в span
    //});


    //$('.start .heading__header').each(function () {
    //    var ths = $(this);
    //    ths.html(ths.html().replace(/(\w+\'\w+\s+\w+\!)$/, '<span>$1</span>')); // выделяет 2 последнее слово в span
    //});

    /* Selectize */
    //$('select').selectize();


    /* Resize Window (in the end) */

    //function onResize() {
    //    $('.carousel-services__content').equalHeights();  // for owl-carousel,
    //}onResize();
    //window.onresize = function () {
    //    onResize()
    //};


    /* Superfish */

    //$('.top-line .sf-menu').superfish({
    //    cssArrows: false,
    //    hoverClass: 'no-class',
    //    delay: 200
    //});


    /* Owl-carousel */

    //var owl = $('.slider');
    //owl.owlCarousel({
    //    loop: true,
    //    items: 1,
    //    itemClass: 'slide-wrap',
    //    nav: true,
    //    navText:'',  // if we have additional owl-nav, default owl-nav will be empty.
    //    dots: true,
    //    smartSpeed: 700
    //});
    //
    //// nav for additional owl-nav
    //$('.owl-nav__prev').click(function(){
    //    owl.trigger('prev.owl.carousel');
    //});
    //$('.owl-nav__next').click(function(){
    //    owl.trigger('next.owl.carousel');
    //});

    //<section class="s-slider">
    //    <div class="container">
    //        <div class="owl-nav">
    //            <div class="owl-nav__prew"><i class="fa fa-angle-left"></i></div>
    //            <div class="owl-nav__next"><i class="fa fa-angle-right"></i></div>
    //        </div>
    //    </div>
    //    <div class="slider">
    //        <div class="slide"></div>
    //        <div class="slide"></div>
    //        <div class="slide"></div>
    //    </div>
    //</section>


    /* Mmenu */

    //$(".mobile-mnu").after("<div id='my-menu'>");
    //$(".sf-menu").clone().appendTo("#my-menu");
    //$("#my-menu").find("*").attr("style", "");
    //$("#my-menu").find("ul").removeClass("sf-menu");
    //$("#my-menu").mmenu({
    //    extensions: [ 'theme-white', 'pagedim-black', 'fx-menu-slide'],    // 'widescreen' -don"t work
    //    navbar: {
    //        title: 'Меню'
    //    }
    //});


    /* Mmenu */

    //var $menu = $('#my-menu').mmenu({
    //    extensions: [ 'theme-black', 'effect-menu-slide', 'pagedim-black' ],    // 'widescreen' -don"t work
    //    navbar: {
    //        title: '<img src="img/logo.svg" alt="Салон красоты Смитлер">'
    //    },
    //    offCanvas: {
    //        position: 'right'
    //    }
    //});


    /* Gamburger for menu */

    // https://codepen.io/agragregra/pen/bEbbmZ
    //$(".mobile-mnu").click(function() {
    //    var mmApi = $("#my-menu").data( "mmenu" );
    //    mmApi.open();
    //    var thiss = $(this).find(".toggle-mnu");
    //    thiss.addClass("on");
    //    $(".main-mnu").slideToggle();
    //    return false;
    //});
    //
    //$(".ishome").click(function() {
    //    $(".toggle-mnu").removeClass("on");
    //});


    /* Magnific-popup */

    //$('.popup-with-move-anim').magnificPopup({
    //    type: 'inline',
    //    fixedContentPos: false,
    //    fixedBgPos: true,
    //    overflowY: 'auto',
    //    closeBtnInside: true,
    //    preloader: false,
    //    midClick: true,
    //    removalDelay: 300,
    //    mainClass: 'my-mfp-slide-bottom'
    //});


    /* What form did the application come from (for magnific-popup) */

    //$('a[href="#callback"]').click(function() {      // возьмет из кнопки зачение data-form и вставит в input[type=hidden] value с этим значением, чтобы знать с какой фрмы пришла заявка
    //    $('#callback .formname').val($(this).data('form'));
    //});


/* WOW-master */

(function() {
    var MutationObserver, Util, WeakMap, getComputedStyle, getComputedStyleRX,
      bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

    Util = (function() {
        function Util() {}

        Util.prototype.extend = function(custom, defaults) {
            var key, value;
            for (key in defaults) {
                value = defaults[key];
                if (custom[key] == null) {
                    custom[key] = value;
                }
            }
            return custom;
        };

        Util.prototype.isMobile = function(agent) {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
        };

        Util.prototype.createEvent = function(event, bubble, cancel, detail) {
            var customEvent;
            if (bubble == null) {
                bubble = false;
            }
            if (cancel == null) {
                cancel = false;
            }
            if (detail == null) {
                detail = null;
            }
            if (document.createEvent != null) {
                customEvent = document.createEvent('CustomEvent');
                customEvent.initCustomEvent(event, bubble, cancel, detail);
            } else if (document.createEventObject != null) {
                customEvent = document.createEventObject();
                customEvent.eventType = event;
            } else {
                customEvent.eventName = event;
            }
            return customEvent;
        };

        Util.prototype.emitEvent = function(elem, event) {
            if (elem.dispatchEvent != null) {
                return elem.dispatchEvent(event);
            } else if (event in (elem != null)) {
                return elem[event]();
            } else if (("on" + event) in (elem != null)) {
                return elem["on" + event]();
            }
        };

        Util.prototype.addEvent = function(elem, event, fn) {
            if (elem.addEventListener != null) {
                return elem.addEventListener(event, fn, false);
            } else if (elem.attachEvent != null) {
                return elem.attachEvent("on" + event, fn);
            } else {
                return elem[event] = fn;
            }
        };

        Util.prototype.removeEvent = function(elem, event, fn) {
            if (elem.removeEventListener != null) {
                return elem.removeEventListener(event, fn, false);
            } else if (elem.detachEvent != null) {
                return elem.detachEvent("on" + event, fn);
            } else {
                return delete elem[event];
            }
        };

        Util.prototype.innerHeight = function() {
            if ('innerHeight' in window) {
                return window.innerHeight;
            } else {
                return document.documentElement.clientHeight;
            }
        };

        return Util;

    })();

    WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = (function() {
          function WeakMap() {
              this.keys = [];
              this.values = [];
          }

          WeakMap.prototype.get = function(key) {
              var i, item, j, len, ref;
              ref = this.keys;
              for (i = j = 0, len = ref.length; j < len; i = ++j) {
                  item = ref[i];
                  if (item === key) {
                      return this.values[i];
                  }
              }
          };

          WeakMap.prototype.set = function(key, value) {
              var i, item, j, len, ref;
              ref = this.keys;
              for (i = j = 0, len = ref.length; j < len; i = ++j) {
                  item = ref[i];
                  if (item === key) {
                      this.values[i] = value;
                      return;
                  }
              }
              this.keys.push(key);
              return this.values.push(value);
          };

          return WeakMap;

      })());

    MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (MutationObserver = (function() {
          function MutationObserver() {
              if (typeof console !== "undefined" && console !== null) {
                  console.warn('MutationObserver is not supported by your browser.');
              }
              if (typeof console !== "undefined" && console !== null) {
                  console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
              }
          }

          MutationObserver.notSupported = true;

          MutationObserver.prototype.observe = function() {};

          return MutationObserver;

      })());

    getComputedStyle = this.getComputedStyle || function(el, pseudo) {
          this.getPropertyValue = function(prop) {
              var ref;
              if (prop === 'float') {
                  prop = 'styleFloat';
              }
              if (getComputedStyleRX.test(prop)) {
                  prop.replace(getComputedStyleRX, function(_, _char) {
                      return _char.toUpperCase();
                  });
              }
              return ((ref = el.currentStyle) != null ? ref[prop] : void 0) || null;
          };
          return this;
      };

    getComputedStyleRX = /(\-([a-z]){1})/g;

    this.WOW = (function() {
        WOW.prototype.defaults = {
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: true,
            live: true,
            callback: null,
            scrollContainer: null
        };

        function WOW(options) {
            if (options == null) {
                options = {};
            }
            this.scrollCallback = bind(this.scrollCallback, this);
            this.scrollHandler = bind(this.scrollHandler, this);
            this.resetAnimation = bind(this.resetAnimation, this);
            this.start = bind(this.start, this);
            this.scrolled = true;
            this.config = this.util().extend(options, this.defaults);
            if (options.scrollContainer != null) {
                this.config.scrollContainer = document.querySelector(options.scrollContainer);
            }
            this.animationNameCache = new WeakMap();
            this.wowEvent = this.util().createEvent(this.config.boxClass);
        }

        WOW.prototype.init = function() {
            var ref;
            this.element = window.document.documentElement;
            if ((ref = document.readyState) === "interactive" || ref === "complete") {
                this.start();
            } else {
                this.util().addEvent(document, 'DOMContentLoaded', this.start);
            }
            return this.finished = [];
        };

        WOW.prototype.start = function() {
            var box, j, len, ref;
            this.stopped = false;
            this.boxes = (function() {
                var j, len, ref, results;
                ref = this.element.querySelectorAll("." + this.config.boxClass);
                results = [];
                for (j = 0, len = ref.length; j < len; j++) {
                    box = ref[j];
                    results.push(box);
                }
                return results;
            }).call(this);
            this.all = (function() {
                var j, len, ref, results;
                ref = this.boxes;
                results = [];
                for (j = 0, len = ref.length; j < len; j++) {
                    box = ref[j];
                    results.push(box);
                }
                return results;
            }).call(this);
            if (this.boxes.length) {
                if (this.disabled()) {
                    this.resetStyle();
                } else {
                    ref = this.boxes;
                    for (j = 0, len = ref.length; j < len; j++) {
                        box = ref[j];
                        this.applyStyle(box, true);
                    }
                }
            }
            if (!this.disabled()) {
                this.util().addEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
                this.util().addEvent(window, 'resize', this.scrollHandler);
                this.interval = setInterval(this.scrollCallback, 50);
            }
            if (this.config.live) {
                return new MutationObserver((function(_this) {
                    return function(records) {
                        var k, len1, node, record, results;
                        results = [];
                        for (k = 0, len1 = records.length; k < len1; k++) {
                            record = records[k];
                            results.push((function() {
                                var l, len2, ref1, results1;
                                ref1 = record.addedNodes || [];
                                results1 = [];
                                for (l = 0, len2 = ref1.length; l < len2; l++) {
                                    node = ref1[l];
                                    results1.push(this.doSync(node));
                                }
                                return results1;
                            }).call(_this));
                        }
                        return results;
                    };
                })(this)).observe(document.body, {
                      childList: true,
                      subtree: true
                  });
            }
        };

        WOW.prototype.stop = function() {
            this.stopped = true;
            this.util().removeEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
            this.util().removeEvent(window, 'resize', this.scrollHandler);
            if (this.interval != null) {
                return clearInterval(this.interval);
            }
        };

        WOW.prototype.sync = function(element) {
            if (MutationObserver.notSupported) {
                return this.doSync(this.element);
            }
        };

        WOW.prototype.doSync = function(element) {
            var box, j, len, ref, results;
            if (element == null) {
                element = this.element;
            }
            if (element.nodeType !== 1) {
                return;
            }
            element = element.parentNode || element;
            ref = element.querySelectorAll("." + this.config.boxClass);
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
                box = ref[j];
                if (indexOf.call(this.all, box) < 0) {
                    this.boxes.push(box);
                    this.all.push(box);
                    if (this.stopped || this.disabled()) {
                        this.resetStyle();
                    } else {
                        this.applyStyle(box, true);
                    }
                    results.push(this.scrolled = true);
                } else {
                    results.push(void 0);
                }
            }
            return results;
        };

        WOW.prototype.show = function(box) {
            this.applyStyle(box);
            box.className = box.className + " " + this.config.animateClass;
            if (this.config.callback != null) {
                this.config.callback(box);
            }
            this.util().emitEvent(box, this.wowEvent);
            this.util().addEvent(box, 'animationend', this.resetAnimation);
            this.util().addEvent(box, 'oanimationend', this.resetAnimation);
            this.util().addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
            this.util().addEvent(box, 'MSAnimationEnd', this.resetAnimation);
            return box;
        };

        WOW.prototype.applyStyle = function(box, hidden) {
            var delay, duration, iteration;
            duration = box.getAttribute('data-wow-duration');
            delay = box.getAttribute('data-wow-delay');
            iteration = box.getAttribute('data-wow-iteration');
            return this.animate((function(_this) {
                return function() {
                    return _this.customStyle(box, hidden, duration, delay, iteration);
                };
            })(this));
        };

        WOW.prototype.animate = (function() {
            if ('requestAnimationFrame' in window) {
                return function(callback) {
                    return window.requestAnimationFrame(callback);
                };
            } else {
                return function(callback) {
                    return callback();
                };
            }
        })();

        WOW.prototype.resetStyle = function() {
            var box, j, len, ref, results;
            ref = this.boxes;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
                box = ref[j];
                results.push(box.style.visibility = 'visible');
            }
            return results;
        };

        WOW.prototype.resetAnimation = function(event) {
            var target;
            if (event.type.toLowerCase().indexOf('animationend') >= 0) {
                target = event.target || event.srcElement;
                return target.className = target.className.replace(this.config.animateClass, '').trim();
            }
        };

        WOW.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
            if (hidden) {
                this.cacheAnimationName(box);
            }
            box.style.visibility = hidden ? 'hidden' : 'visible';
            if (duration) {
                this.vendorSet(box.style, {
                    animationDuration: duration
                });
            }
            if (delay) {
                this.vendorSet(box.style, {
                    animationDelay: delay
                });
            }
            if (iteration) {
                this.vendorSet(box.style, {
                    animationIterationCount: iteration
                });
            }
            this.vendorSet(box.style, {
                animationName: hidden ? 'none' : this.cachedAnimationName(box)
            });
            return box;
        };

        WOW.prototype.vendors = ["moz", "webkit"];

        WOW.prototype.vendorSet = function(elem, properties) {
            var name, results, value, vendor;
            results = [];
            for (name in properties) {
                value = properties[name];
                elem["" + name] = value;
                results.push((function() {
                    var j, len, ref, results1;
                    ref = this.vendors;
                    results1 = [];
                    for (j = 0, len = ref.length; j < len; j++) {
                        vendor = ref[j];
                        results1.push(elem["" + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
                    }
                    return results1;
                }).call(this));
            }
            return results;
        };

        WOW.prototype.vendorCSS = function(elem, property) {
            var j, len, ref, result, style, vendor;
            style = getComputedStyle(elem);
            result = style.getPropertyCSSValue(property);
            ref = this.vendors;
            for (j = 0, len = ref.length; j < len; j++) {
                vendor = ref[j];
                result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
            }
            return result;
        };

        WOW.prototype.animationName = function(box) {
            var animationName, error;
            try {
                animationName = this.vendorCSS(box, 'animation-name').cssText;
            } catch (error) {
                animationName = getComputedStyle(box).getPropertyValue('animation-name');
            }
            if (animationName === 'none') {
                return '';
            } else {
                return animationName;
            }
        };

        WOW.prototype.cacheAnimationName = function(box) {
            return this.animationNameCache.set(box, this.animationName(box));
        };

        WOW.prototype.cachedAnimationName = function(box) {
            return this.animationNameCache.get(box);
        };

        WOW.prototype.scrollHandler = function() {
            return this.scrolled = true;
        };

        WOW.prototype.scrollCallback = function() {
            var box;
            if (this.scrolled) {
                this.scrolled = false;
                this.boxes = (function() {
                    var j, len, ref, results;
                    ref = this.boxes;
                    results = [];
                    for (j = 0, len = ref.length; j < len; j++) {
                        box = ref[j];
                        if (!(box)) {
                            continue;
                        }
                        if (this.isVisible(box)) {
                            this.show(box);
                            continue;
                        }
                        results.push(box);
                    }
                    return results;
                }).call(this);
                if (!(this.boxes.length || this.config.live)) {
                    return this.stop();
                }
            }
        };

        WOW.prototype.offsetTop = function(element) {
            var top;
            while (element.offsetTop === void 0) {
                element = element.parentNode;
            }
            top = element.offsetTop;
            while (element = element.offsetParent) {
                top += element.offsetTop;
            }
            return top;
        };

        WOW.prototype.isVisible = function(box) {
            var bottom, offset, top, viewBottom, viewTop;
            offset = box.getAttribute('data-wow-offset') || this.config.offset;
            viewTop = (this.config.scrollContainer && this.config.scrollContainer.scrollTop) || window.pageYOffset;
            viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
            top = this.offsetTop(box);
            bottom = top + box.clientHeight;
            return top <= viewBottom && bottom >= viewTop;
        };

        WOW.prototype.util = function() {
            return this._util != null ? this._util : this._util = new Util();
        };

        WOW.prototype.disabled = function() {
            return !this.config.mobile && this.util().isMobile(navigator.userAgent);
        };

        return WOW;

    })();

}).call(this);



















