/*! jqueryanimatesprite - v1.3.5 - 2014-10-17
* http://blaiprat.github.io/jquery.animateSprite/
* Copyright (c) 2014 blai Pratdesaba; Licensed MIT */

//var debug = true; 

(function ($, window, undefined) {

    'use strict';
    var init = function (options) {

        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');

            // ASYNC
            // If we don't specify the columns, we
            // can discover using the background size
            var discoverColumns = function (cb) {
                var imageSrc = $this.css('background-image').replace(/url\((['"])?(.*?)\1\)/gi, '$2');
                var image = new Image();

                image.onload = function () {
                    var width = image.width,
                        height = image.height;
                    cb(width, height);
                };
                image.src = imageSrc;
            };

            if (!data) {
                $this.data('animateSprite', {
                    settings: $.extend({
                        width: undefined,
                        height: undefined,
                        totalFrames: false,
                        in_frame: 0, //fw
                        out_frame: 0, //fw
                        columns: false,
                        cols:0,
                        rows:0,
                        fps: 30,
                        complete: function () {},
                        loop: false,
                        autoplay: true,
                        forwards: true,
                        debug: false
                    }, options),
                    currentFrame: 0,
                    controlAnimation: function () {

                        var checkLoop = function (currentFrame, finalFrame, in_frame) {
                            if(this.settings.forwards==true){currentFrame++;}
                            if(this.settings.forwards==false){currentFrame--;}
                            if(this.settings.forwards==true){
                                if (currentFrame >= finalFrame) {
                                    if (this.settings.loop === true) {
                                        currentFrame = in_frame;
                                        data.controlTimer();
                                    } else {
                                        this.settings.complete();
                                    }
                                } else {
                                    data.controlTimer();
                                }
                            }
                            if(this.settings.forwards==false){
                                if (currentFrame <= finalFrame) {
                                    if (this.settings.loop === true) {
                                        currentFrame = in_frame;
                                        data.controlTimer();

                                    } else {
                                        this.settings.complete();
                                    }
                                } else {
                                    data.controlTimer();
                                }
                            }
                            return currentFrame;
                        };

                        if (this.settings.animations === undefined) {

                            $this.animateSprite('frame', this.currentFrame);
                            this.currentFrame = checkLoop.call(this, this.currentFrame, this.settings.out_frame, this.settings.in_frame); //fw
                        
                        } else {

                            if (this.currentAnimation === undefined) {
                                for (var k in this.settings.animations) {
                                    this.currentAnimation = this.settings.animations[k];
                                    break;
                                }
                            }
                            var newFrame  = this.currentAnimation[this.currentFrame];
                            $this.animateSprite('frame', newFrame);
                            this.currentFrame = checkLoop.call(this, this.currentFrame, this.settings.out_frame, this.settings.in_frame); //fw

                        }

                    },
                    controlTimer: function () {
                        // duration overrides fps
                        var speed = 1000 / data.settings.fps;

                        if (data.settings.duration !== undefined) {
                            speed = data.settings.duration / data.settings.totalFrames;
                        }

                        data.interval = setTimeout(function () {
                            data.controlAnimation();
                        }, speed);

                    }
                });


                data = $this.data('animateSprite');

                // Setting up columns and total frames
                if (!data.settings.columns) {
                    // this is an async function
                    discoverColumns(function (width, height) {

                        if(data.settings.totalFrames<10){
                            data.settings.cols = data.settings.totalFrames;
                            data.settings.rows = 1;
                        }else{
                            data.settings.cols = 10;
                            data.settings.rows = Math.floor(data.settings.totalFrames/10) + 1;
                        }

                        data.settings.out_frame = data.settings.stopAt;

                        if (data.settings.autoplay) {
                            data.controlTimer();
                        }
                    });
                } else {

                    // if everything is already set up
                    // we start the interval
                    if (data.settings.autoplay) {
                        data.controlTimer();
                    }
                }


            }

        });

    };

    var frame = function (frameNumber) {
        return this.each(function () {
            if ($(this).data('animateSprite') !== undefined) {
                var $this = $(this),
                    data  = $this.data('animateSprite'),
                    this_col = frameNumber % data.settings.cols,
                    this_row = Math.floor(frameNumber/10);

                    if(data.settings.debug){ console.log("Frame: "+frameNumber); }

                    $this.css('background-position', (-data.settings.width * this_col) + 'px ' + (-data.settings.height * this_row) + 'px');
            }
        });
    };

    var stop = function () {
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');
            clearTimeout(data.interval);
        });
    };

    var resume = function () {
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');

            // always st'op animation to prevent overlapping intervals
            $this.animateSprite('stopAnimation');
            data.controlTimer();
        });
    };

    var restart = function () {
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');

            $this.animateSprite('stopAnimation');
            data.currentFrame = data.settings.in_frame;
            data.controlTimer();
        });
    };

    var play = function (animationName) {
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');

            if (typeof animationName === 'string') {

                $this.animateSprite('stopAnimation');
                if (data.settings.animations[animationName] !== data.currentAnimation) {
                    data.currentFrame = 0;
                    data.currentAnimation = data.settings.animations[animationName];
                }
                data.controlTimer();
            } else {
                $this.animateSprite('stopAnimation');
                data.controlTimer();
            }

        });
    };

    var fps = function (val) {
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');
            // data.fps
            data.settings.fps = val;
        });
    };

    var set_in = function (val) { //fw
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');
            // data.fps
            data.settings.in_frame = val;
        });
    };

    var set_out = function (val) { //fw
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');
            // data.fps
            data.settings.out_frame = val;
        });
    };

    var set_direction = function (val) { //fw
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');
            // data.fps
            data.settings.forwards = val;
        });
    };

    var set_current_frame = function (val) { //fw
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');
            // data.fps
            this.currentFrame = val;
        });
    };

    var set_width_height = function (val) { //fw
        return this.each(function () {
            var $this = $(this),
                data  = $this.data('animateSprite');
            data.settings.width = val;
            data.settings.height = val;
        });
    };

    var methods = {
        init: init,
        frame: frame,
        stop: stop,
        resume: resume,
        restart: restart,
        play: play,
        stopAnimation: stop,
        resumeAnimation: resume,
        restartAnimation: restart,
        fps: fps,
        setIn: set_in, //fw
        setOut: set_out, //fw
        forwards: set_direction, //fw
        currentFrame: set_current_frame, //fw
        setWH: set_width_height, //fw
    };

    $.fn.animateSprite = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.animateSprite');
        }

    };

})(jQuery, window);
