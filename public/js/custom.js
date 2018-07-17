(function ($) {
    'use strict';

    $(document).on('ready', function () {
        $('#demo').carousel({interval: 10000});
        // -----------------------------
        //  Client Slider
        // -----------------------------
        $('.clients-slider').owlCarousel({
            loop:true,
            margin:20,
            nav:true,
            dots:false,
            autoplay:true,
            navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
            responsive:{
                0:{
                    nav:false,
                    items:1
                },
                400:{
                    nav:false,
                    items:2
                },
                600:{
                    nav:false,
                    items:3
                },
                1000:{
                    items:6
                }
            }
        });
        // -----------------------------
        //  Post Slider
        // -----------------------------
        $('.post-slider').owlCarousel({
            items:1,
            loop:true,
            margin:20,
            nav:true,
            navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
            dots:false,
            autoplay:true
        });
        // -----------------------------
        //  Select Box
        // -----------------------------
        $('.select-box').selectbox();
        // -----------------------------
        //  Video Replace
        // -----------------------------
        $('.video-box img').click(function() {
            var video = '<iframe allowfullscreen src="' + $(this).attr('data-video') + '"></iframe>';
            $(this).replaceWith(video);
        });
        // -----------------------------
        //  Coupon type Active switch
        // -----------------------------
        $('.coupon-types li').click(function () {
            $('.coupon-types li').not(this).removeClass('active');
            $(this).addClass('active');
        });
        // -----------------------------
        // Datepicker Init
        // -----------------------------
        $('.input-group.date').datepicker({
            format: 'dd/mm/yy'
        });
        // -----------------------------
        // Datepicker Init
        // -----------------------------
        $('#top').click(function() {
          $('html, body').animate({ scrollTop: 0 }, 'slow');
          return false;
        });
        // -----------------------------
        // Button Active Toggle
        // -----------------------------
        $('.btn-group > .btn, #favorite').click(function(){
            $(this).find('i').toggleClass('btn-active');
        });
         $('.favorite').click(function(){
            $(this).toggleClass('btn-active');
         });
         $('.favorite').click(function(){
            $.notify({
                // options
                message: 'Successfully Added to favorites!!!'
            },{
                // settings
                type: 'success'
            });
         });
        // function notify(){
        //     $.notify({
        //     // options
        //     message: 'Successfully Added to favorites!!!'
        //     },{
        //     // settings
        //     type: 'success'
        //     });
        // }

        // -----------------------------
        // Coupon Type Select
        // -----------------------------
        $('#online-code').click(function(){
            $('.code-input').fadeIn(500);
        });
        $('#store-coupon, #online-sale').click(function(){
            $('.code-input').fadeOut(500);
        });
        /***ON-LOAD***/
        jQuery(window).on('load', function () {

        });

    });

})(jQuery);
