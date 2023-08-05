(function() {
    var on = addEventListener
      , off = removeEventListener
      , $ = function(q) {
        return document.querySelector(q)
    }
      , $$ = function(q) {
        return document.querySelectorAll(q)
    }
      , $body = document.body
      , $inner = $('.inner')
      , client = (function() {
        var o = {
            browser: 'other',
            browserVersion: 0,
            os: 'other',
            osVersion: 0,
            mobile: false,
            canUse: null,
            flags: {
                lsdUnits: false,
            },
        }, ua = navigator.userAgent, a, i;
        a = [['firefox', /Firefox\/([0-9\.]+)/], ['edge', /Edge\/([0-9\.]+)/], ['safari', /Version\/([0-9\.]+).+Safari/], ['chrome', /Chrome\/([0-9\.]+)/], ['chrome', /CriOS\/([0-9\.]+)/], ['ie', /Trident\/.+rv:([0-9]+)/]];
        for (i = 0; i < a.length; i++) {
            if (ua.match(a[i][1])) {
                o.browser = a[i][0];
                o.browserVersion = parseFloat(RegExp.$1);
                break;
            }
        }
        a = [['ios', /([0-9_]+) like Mac OS X/, function(v) {
            return v.replace('_', '.').replace('_', '');
        }
        ], ['ios', /CPU like Mac OS X/, function(v) {
            return 0
        }
        ], ['ios', /iPad; CPU/, function(v) {
            return 0
        }
        ], ['android', /Android ([0-9\.]+)/, null], ['mac', /Macintosh.+Mac OS X ([0-9_]+)/, function(v) {
            return v.replace('_', '.').replace('_', '');
        }
        ], ['windows', /Windows NT ([0-9\.]+)/, null], ['undefined', /Undefined/, null]];
        for (i = 0; i < a.length; i++) {
            if (ua.match(a[i][1])) {
                o.os = a[i][0];
                o.osVersion = parseFloat(a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1);
                break;
            }
        }
        if (o.os == 'mac' && ('ontouchstart'in window) && ((screen.width == 1024 && screen.height == 1366) || (screen.width == 834 && screen.height == 1112) || (screen.width == 810 && screen.height == 1080) || (screen.width == 768 && screen.height == 1024)))
            o.os = 'ios';
        o.mobile = (o.os == 'android' || o.os == 'ios');
        var _canUse = document.createElement('div');
        o.canUse = function(property, value) {
            var style;
            style = _canUse.style;
            if (!(property in style))
                return false;
            if (typeof value !== 'undefined') {
                style[property] = value;
                if (style[property] == '')
                    return false;
            }
            return true;
        }
        ;
        o.flags.lsdUnits = o.canUse('width', '100dvw');
        return o;
    }())
      , trigger = function(t) {
        dispatchEvent(new Event(t));
    }
      , cssRules = function(selectorText) {
        var ss = document.styleSheets, a = [], f = function(s) {
            var r = s.cssRules, i;
            for (i = 0; i < r.length; i++) {
                if (r[i]instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)
                    (f)(r[i]);
                else if (r[i]instanceof CSSStyleRule && r[i].selectorText == selectorText)
                    a.push(r[i]);
            }
        }, x, i;
        for (i = 0; i < ss.length; i++)
            f(ss[i]);
        return a;
    }
      , thisHash = function() {
        var h = location.hash ? location.hash.substring(1) : null, a;
        if (!h)
            return null;
        if (h.match(/\?/)) {
            a = h.split('?');
            h = a[0];
            history.replaceState(undefined, undefined, '#' + h);
            window.location.search = a[1];
        }
        if (h.length > 0 && !h.match(/^[a-zA-Z]/))
            h = 'x' + h;
        if (typeof h == 'string')
            h = h.toLowerCase();
        return h;
    }
      , scrollToElement = function(e, style, duration) {
        var y, cy, dy, start, easing, offset, f;
        if (!e)
            y = 0;
        else {
            offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
            switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
            case 'default':
            default:
                y = e.offsetTop + offset;
                break;
            case 'center':
                if (e.offsetHeight < window.innerHeight)
                    y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2) + offset;
                else
                    y = e.offsetTop - offset;
                break;
            case 'previous':
                if (e.previousElementSibling)
                    y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset;
                else
                    y = e.offsetTop + offset;
                break;
            }
        }
        if (!style)
            style = 'smooth';
        if (!duration)
            duration = 750;
        if (style == 'instant') {
            window.scrollTo(0, y);
            return;
        }
        start = Date.now();
        cy = window.scrollY;
        dy = y - cy;
        switch (style) {
        case 'linear':
            easing = function(t) {
                return t
            }
            ;
            break;
        case 'smooth':
            easing = function(t) {
                return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
            }
            ;
            break;
        }
        f = function() {
            var t = Date.now() - start;
            if (t >= duration)
                window.scroll(0, y);
            else {
                window.scroll(0, cy + (dy * easing(t / duration)));
                requestAnimationFrame(f);
            }
        }
        ;
        f();
    }
      , scrollToTop = function() {
        scrollToElement(null);
    }
      , loadElements = function(parent) {
        var a, e, x, i;
        a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
        for (i = 0; i < a.length; i++) {
            a[i].contentWindow.location.replace(a[i].dataset.src);
            a[i].dataset.initialSrc = a[i].dataset.src;
            a[i].dataset.src = '';
        }
        a = parent.querySelectorAll('video[autoplay]');
        for (i = 0; i < a.length; i++) {
            if (a[i].paused)
                a[i].play();
        }
        e = parent.querySelector('[data-autofocus="1"]');
        x = e ? e.tagName : null;
        switch (x) {
        case 'FORM':
            e = e.querySelector('.field input, .field select, .field textarea');
            if (e)
                e.focus();
            break;
        default:
            break;
        }
    }
      , unloadElements = function(parent) {
        var a, e, x, i;
        a = parent.querySelectorAll('iframe[data-src=""]');
        for (i = 0; i < a.length; i++) {
            if (a[i].dataset.srcUnload === '0')
                continue;
            if ('initialSrc'in a[i].dataset)
                a[i].dataset.src = a[i].dataset.initialSrc;
            else
                a[i].dataset.src = a[i].src;
            a[i].contentWindow.location.replace('about:blank');
        }
        a = parent.querySelectorAll('video');
        for (i = 0; i < a.length; i++) {
            if (!a[i].paused)
                a[i].pause();
        }
        e = $(':focus');
        if (e)
            e.blur();
    };
    window._scrollToTop = scrollToTop;
    var thisUrl = function() {
        return window.location.href.replace(window.location.search, '').replace(/#$/, '');
    };
    var getVar = function(name) {
        var a = window.location.search.substring(1).split('&'), b, k;
        for (k in a) {
            b = a[k].split('=');
            if (b[0] == name)
                return b[1];
        }
        return null;
    };
    var errors = {
        handle: function(handler) {
            window.onerror = function(message, url, line, column, error) {
                (handler)(error.message);
                return true;
            }
            ;
        },
        unhandle: function() {
            window.onerror = null;
        }
    };
    var loadHandler = function() {
        setTimeout(function() {
            $body.classList.remove('is-loading');
            $body.classList.add('is-playing');
            setTimeout(function() {
                $body.classList.remove('is-playing');
                $body.classList.add('is-ready');
            }, 375);
        }, 100);
    };
    on('load', loadHandler);
    loadElements(document.body);
    var style, sheet, rule;
    style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    sheet = style.sheet;
    if (client.mobile) {
        (function() {
            if (client.flags.lsdUnits) {
                document.documentElement.style.setProperty('--viewport-height', '100svh');
                document.documentElement.style.setProperty('--background-height', '100lvh');
            } else {
                var f = function() {
                    document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
                    document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
                };
                on('load', f);
                on('orientationchange', function() {
                    setTimeout(function() {
                        (f)();
                    }, 100);
                });
            }
        }
        )();
    }
    if (client.os == 'android') {
        (function() {
            sheet.insertRule('body::after { }', 0);
            rule = sheet.cssRules[0];
            var f = function() {
                rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
            };
            on('load', f);
            on('orientationchange', f);
            on('touchmove', f);
        }
        )();
        $body.classList.add('is-touch');
    } else if (client.os == 'ios') {
        if (client.osVersion <= 11)
            (function() {
                sheet.insertRule('body::after { }', 0);
                rule = sheet.cssRules[0];
                rule.style.cssText = '-webkit-transform: scale(1.0)';
            }
            )();
        if (client.osVersion <= 11)
            (function() {
                sheet.insertRule('body.ios-focus-fix::before { }', 0);
                rule = sheet.cssRules[0];
                rule.style.cssText = 'height: calc(100% + 60px)';
                on('focus', function(event) {
                    $body.classList.add('ios-focus-fix');
                }, true);
                on('blur', function(event) {
                    $body.classList.remove('ios-focus-fix');
                }, true);
            }
            )();
        $body.classList.add('is-touch');
    }
    var scrollEvents = {
        items: [],
        add: function(o) {
            this.items.push({
                element: o.element,
                triggerElement: (('triggerElement'in o && o.triggerElement) ? o.triggerElement : o.element),
                enter: ('enter'in o ? o.enter : null),
                leave: ('leave'in o ? o.leave : null),
                mode: ('mode'in o ? o.mode : 3),
                offset: ('offset'in o ? o.offset : 0),
                initialState: ('initialState'in o ? o.initialState : null),
                state: false,
            });
        },
        handler: function() {
            var height, top, bottom, scrollPad;
            if (client.os == 'ios') {
                height = document.documentElement.clientHeight;
                top = document.body.scrollTop + window.scrollY;
                bottom = top + height;
                scrollPad = 125;
            } else {
                height = document.documentElement.clientHeight;
                top = document.documentElement.scrollTop;
                bottom = top + height;
                scrollPad = 0;
            }
            scrollEvents.items.forEach(function(item) {
                var bcr, elementTop, elementBottom, state, a, b;
                if (!item.enter && !item.leave)
                    return true;
                if (!item.triggerElement)
                    return true;
                if (item.triggerElement.offsetParent === null) {
                    if (item.state == true && item.leave) {
                        item.state = false;
                        (item.leave).apply(item.element);
                        if (!item.enter)
                            item.leave = null;
                    }
                    return true;
                }
                bcr = item.triggerElement.getBoundingClientRect();
                elementTop = top + Math.floor(bcr.top);
                elementBottom = elementTop + bcr.height;
                if (item.initialState !== null) {
                    state = item.initialState;
                    item.initialState = null;
                } else {
                    switch (item.mode) {
                    case 1:
                    default:
                        state = (bottom > (elementTop - item.offset) && top < (elementBottom + item.offset));
                        break;
                    case 2:
                        a = (top + (height * 0.5));
                        state = (a > (elementTop - item.offset) && a < (elementBottom + item.offset));
                        break;
                    case 3:
                        a = top + (height * 0.25);
                        if (a - (height * 0.375) <= 0)
                            a = 0;
                        b = top + (height * 0.75);
                        if (b + (height * 0.375) >= document.body.scrollHeight - scrollPad)
                            b = document.body.scrollHeight + scrollPad;
                        state = (b > (elementTop - item.offset) && a < (elementBottom + item.offset));
                        break;
                    }
                }
                if (state != item.state) {
                    item.state = state;
                    if (item.state) {
                        if (item.enter) {
                            (item.enter).apply(item.element);
                            if (!item.leave)
                                item.enter = null;
                        }
                    } else {
                        if (item.leave) {
                            (item.leave).apply(item.element);
                            if (!item.enter)
                                item.leave = null;
                        }
                    }
                }
            });
        },
        init: function() {
            on('load', this.handler);
            on('resize', this.handler);
            on('scroll', this.handler);
            (this.handler)();
        }
    };
    scrollEvents.init();
    var onvisible = {
        effects: {
            'blur-in': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity) {
                    this.style.opacity = 0;
                    this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.filter = 'none';
                },
            },
            'zoom-in': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transform = 'scale(' + (1 - ((alt ? 0.25 : 0.05) * intensity)) + ')';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'zoom-out': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transform = 'scale(' + (1 + ((alt ? 0.25 : 0.05) * intensity)) + ')';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'slide-left': {
                transition: function(speed, delay) {
                    return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function() {
                    this.style.transform = 'translateX(100vw)';
                },
                play: function() {
                    this.style.transform = 'none';
                },
            },
            'slide-right': {
                transition: function(speed, delay) {
                    return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function() {
                    this.style.transform = 'translateX(-100vw)';
                },
                play: function() {
                    this.style.transform = 'none';
                },
            },
            'flip-forward': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transformOrigin = '50% 50%';
                    this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? 45 : 15) * intensity) + 'deg)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'flip-backward': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transformOrigin = '50% 50%';
                    this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? -45 : -15) * intensity) + 'deg)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'flip-left': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transformOrigin = '50% 50%';
                    this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? 45 : 15) * intensity) + 'deg)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'flip-right': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transformOrigin = '50% 50%';
                    this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? -45 : -15) * intensity) + 'deg)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'tilt-left': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transform = 'rotate(' + ((alt ? 45 : 5) * intensity) + 'deg)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'tilt-right': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transform = 'rotate(' + ((alt ? -45 : -5) * intensity) + 'deg)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'fade-right': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity) {
                    this.style.opacity = 0;
                    this.style.transform = 'translateX(' + (-1.5 * intensity) + 'rem)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'fade-left': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity) {
                    this.style.opacity = 0;
                    this.style.transform = 'translateX(' + (1.5 * intensity) + 'rem)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'fade-down': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity) {
                    this.style.opacity = 0;
                    this.style.transform = 'translateY(' + (-1.5 * intensity) + 'rem)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'fade-up': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity) {
                    this.style.opacity = 0;
                    this.style.transform = 'translateY(' + (1.5 * intensity) + 'rem)';
                },
                play: function() {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'fade-in': {
                transition: function(speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function() {
                    this.style.opacity = 0;
                },
                play: function() {
                    this.style.opacity = 1;
                },
            },
            'fade-in-background': {
                custom: true,
                transition: function(speed, delay) {
                    this.style.setProperty('--onvisible-speed', speed + 's');
                    if (delay)
                        this.style.setProperty('--onvisible-delay', delay + 's');
                },
                rewind: function() {
                    this.style.removeProperty('--onvisible-background-color');
                },
                play: function() {
                    this.style.setProperty('--onvisible-background-color', 'rgba(0,0,0,0.001)');
                },
            },
            'zoom-in-image': {
                target: 'img',
                transition: function(speed, delay) {
                    return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function() {
                    this.style.transform = 'scale(1)';
                },
                play: function(intensity) {
                    this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
                },
            },
            'zoom-out-image': {
                target: 'img',
                transition: function(speed, delay) {
                    return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity) {
                    this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
                },
                play: function() {
                    this.style.transform = 'none';
                },
            },
            'focus-image': {
                target: 'img',
                transition: function(speed, delay) {
                    return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' + 'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function(intensity) {
                    this.style.transform = 'scale(' + (1 + (0.05 * intensity)) + ')';
                    this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
                },
                play: function(intensity) {
                    this.style.transform = 'none';
                    this.style.filter = 'none';
                },
            },
        },
        regex: new RegExp('([a-zA-Z0-9\.\,\-\_\"\'\?\!\:\;\#\@\#$\%\&\(\)\{\}]+)','g'),
        add: function(selector, settings) {
            var _this = this
              , style = settings.style in this.effects ? settings.style : 'fade'
              , speed = parseInt('speed'in settings ? settings.speed : 1000) / 1000
              , intensity = ((parseInt('intensity'in settings ? settings.intensity : 5) / 10) * 1.75) + 0.25
              , delay = parseInt('delay'in settings ? settings.delay : 0) / 1000
              , replay = 'replay'in settings ? settings.replay : false
              , stagger = 'stagger'in settings ? (parseInt(settings.stagger) >= 0 ? (parseInt(settings.stagger) / 1000) : false) : false
              , staggerOrder = 'staggerOrder'in settings ? settings.staggerOrder : 'default'
              , staggerSelector = 'staggerSelector'in settings ? settings.staggerSelector : null
              , state = 'state'in settings ? settings.state : null
              , effect = this.effects[style];
            if ('CARRD_DISABLE_ANIMATION'in window) {
                if (style == 'fade-in-background')
                    $$(selector).forEach(function(e) {
                        e.style.setProperty('--onvisible-background-color', 'rgba(0,0,0,0.001)');
                    });
                return;
            }
            $$(selector).forEach(function(e) {
                var children, enter, leave, targetElement, triggerElement;
                if (stagger !== false && staggerSelector == ':scope > *')
                    _this.expandTextNodes(e);
                children = (stagger !== false && staggerSelector) ? e.querySelectorAll(staggerSelector) : null;
                enter = function(staggerDelay=0) {
                    var _this = this, transitionOrig;
                    if (effect.target)
                        _this = this.querySelector(effect.target);
                    if (!effect.custom) {
                        transitionOrig = _this.style.transition;
                        _this.style.setProperty('backface-visibility', 'hidden');
                        _this.style.transition = effect.transition(speed, delay + staggerDelay);
                    } else
                        effect.transition.apply(_this, [speed, delay + staggerDelay]);
                    effect.play.apply(_this, [intensity, !!children]);
                    if (!effect.custom)
                        setTimeout(function() {
                            _this.style.removeProperty('backface-visibility');
                            _this.style.transition = transitionOrig;
                        }, (speed + delay + staggerDelay) * 1000 * 2);
                }
                ;
                leave = function() {
                    var _this = this, transitionOrig;
                    if (effect.target)
                        _this = this.querySelector(effect.target);
                    if (!effect.custom) {
                        transitionOrig = _this.style.transition;
                        _this.style.setProperty('backface-visibility', 'hidden');
                        _this.style.transition = effect.transition(speed);
                    } else
                        effect.transition.apply(_this, [speed]);
                    effect.rewind.apply(_this, [intensity, !!children]);
                    if (!effect.custom)
                        setTimeout(function() {
                            _this.style.removeProperty('backface-visibility');
                            _this.style.transition = transitionOrig;
                        }, speed * 1000 * 2);
                }
                ;
                if (effect.target)
                    targetElement = e.querySelector(effect.target);
                else
                    targetElement = e;
                if (children)
                    children.forEach(function(targetElement) {
                        effect.rewind.apply(targetElement, [intensity, true]);
                    });
                else
                    effect.rewind.apply(targetElement, [intensity]);
                triggerElement = e;
                if (e.parentNode) {
                    if (e.parentNode.dataset.onvisibleTrigger)
                        triggerElement = e.parentNode;
                    else if (e.parentNode.parentNode) {
                        if (e.parentNode.parentNode.dataset.onvisibleTrigger)
                            triggerElement = e.parentNode.parentNode;
                    }
                }
                scrollEvents.add({
                    element: e,
                    triggerElement: triggerElement,
                    initialState: state,
                    enter: children ? function() {
                        var staggerDelay = 0, childHandler = function(e) {
                            enter.apply(e, [staggerDelay]);
                            staggerDelay += stagger;
                        }, a;
                        if (staggerOrder == 'default') {
                            children.forEach(childHandler);
                        } else {
                            a = Array.from(children);
                            switch (staggerOrder) {
                            case 'reverse':
                                a.reverse();
                                break;
                            case 'random':
                                a.sort(function() {
                                    return Math.random() - 0.5;
                                });
                                break;
                            }
                            a.forEach(childHandler);
                        }
                    }
                    : enter,
                    leave: (replay ? (children ? function() {
                        children.forEach(function(e) {
                            leave.apply(e);
                        });
                    }
                    : leave) : null),
                });
            });
        },
        expandTextNodes: function(e) {
            var s, i, w, x;
            for (i = 0; i < e.childNodes.length; i++) {
                x = e.childNodes[i];
                if (x.nodeType != Node.TEXT_NODE)
                    continue;
                s = x.nodeValue;
                s = s.replace(this.regex, function(x, a) {
                    return '<text-node>' + a + '</text-node>';
                });
                w = document.createElement('text-node');
                w.innerHTML = s;
                x.replaceWith(w);
                while (w.childNodes.length > 0) {
                    w.parentNode.insertBefore(w.childNodes[0], w);
                }
                w.parentNode.removeChild(w);
            }
        },
    };
    function timer(id, options) {
        var _this = this, f;
        this.id = id;
        this.timestamp = options.timestamp;
        this.duration = options.duration;
        this.mode = options.mode;
        this.precision = options.precision;
        this.completeUrl = options.completeUrl;
        this.completion = options.completion;
        this.persistent = options.persistent;
        this.labelStyle = options.labelStyle;
        this.completed = false;
        this.status = null;
        this.$timer = document.getElementById(this.id);
        this.$parent = document.querySelector('#' + _this.$timer.id + ' ul');
        this.days = {
            $li: null,
            $digit: null,
            $components: null
        };
        this.hours = {
            $li: null,
            $digit: null,
            $components: null
        };
        this.minutes = {
            $li: null,
            $digit: null,
            $components: null
        };
        this.seconds = {
            $li: null,
            $digit: null,
            $components: null
        };
        this.init();
    }
    ;timer.prototype.init = function() {
        var _this = this, kt, kd;
        kt = this.id + '-timestamp';
        kd = this.id + '-duration';
        switch (this.mode) {
        case 'duration':
            this.timestamp = parseInt(Date.now() / 1000) + this.duration;
            if (this.persistent) {
                if (registry.get(kd) != this.duration)
                    registry.unset(kt);
                registry.set(kd, this.duration);
                if (registry.exists(kt))
                    this.timestamp = parseInt(registry.get(kt));
                else
                    registry.set(kt, this.timestamp);
            } else {
                if (registry.exists(kt))
                    registry.unset(kt);
                if (registry.exists(kd))
                    registry.unset(kd);
            }
            break;
        default:
            break;
        }
        window.setInterval(function() {
            _this.updateDigits();
            _this.updateSize();
        }, 250);
        this.updateDigits();
        on('resize', function() {
            _this.updateSize();
        });
        this.updateSize();
    }
    ;
    timer.prototype.updateSize = function() {
        var $items, $item, $digit, $components, $component, $label, $sublabel, $symbols, w, iw, h, f, i, j, found;
        $items = document.querySelectorAll('#' + this.$timer.id + ' ul li .item');
        $symbols = document.querySelectorAll('#' + this.$timer.id + ' .symbol');
        $components = document.querySelectorAll('#' + this.$timer.id + ' .component');
        h = 0;
        f = 0;
        for (j = 0; j < $components.length; j++) {
            $components[j].style.lineHeight = '';
            $components[j].style.height = '';
        }
        for (j = 0; j < $symbols.length; j++) {
            $symbols[j].style.fontSize = '';
            $symbols[j].style.lineHeight = '';
            $symbols[j].style.height = '';
        }
        for (i = 0; i < $items.length; i++) {
            $item = $items[i];
            $component = $item.children[0].children[0];
            w = $component.offsetWidth;
            iw = $item.offsetWidth;
            $digit = $item.children[0];
            $digit.style.fontSize = '';
            $digit.style.fontSize = (w * 1.65) + 'px';
            h = Math.max(h, $digit.offsetHeight);
            f = Math.max(f, (w * 1.65));
            if ($item.children.length > 1) {
                $label = $item.children[1];
                found = false;
                for (j = 0; j < $label.children.length; j++) {
                    $sublabel = $label.children[j];
                    $sublabel.style.display = '';
                    if (!found && $sublabel.offsetWidth < iw) {
                        found = true;
                        $sublabel.style.display = '';
                    } else
                        $sublabel.style.display = 'none';
                }
            }
        }
        if ($items.length == 1) {
            var x = $items[0].children[0]
              , xs = getComputedStyle(x)
              , xsa = getComputedStyle(x, ':after');
            if (xsa.content != 'none')
                h = parseInt(xsa.height) - parseInt(xs.marginTop) - parseInt(xs.marginBottom) + 24;
        }
        for (j = 0; j < $components.length; j++) {
            $components[j].style.lineHeight = h + 'px';
            $components[j].style.height = h + 'px';
        }
        for (j = 0; j < $symbols.length; j++) {
            $symbols[j].style.fontSize = (f * 0.5) + 'px';
            $symbols[j].style.lineHeight = h + 'px';
            $symbols[j].style.height = h + 'px';
        }
        this.$parent.style.height = '';
        this.$parent.style.height = this.$parent.offsetHeight + 'px';
    }
    ;
    timer.prototype.updateDigits = function() {
        var _this = this, x = [{
            class: 'days',
            digit: 0,
            label: {
                full: 'Days',
                abbreviated: 'Days',
                initialed: 'D'
            }
        }, {
            class: 'hours',
            digit: 0,
            label: {
                full: 'Hours',
                abbreviated: 'Hrs',
                initialed: 'H'
            }
        }, {
            class: 'minutes',
            digit: 0,
            label: {
                full: 'Minutes',
                abbreviated: 'Mins',
                initialed: 'M'
            }
        }, {
            class: 'seconds',
            digit: 0,
            label: {
                full: 'Seconds',
                abbreviated: 'Secs',
                initialed: 'S'
            }
        }, ], now, diff, zeros, status, i, j, x, z, t, s;
        now = parseInt(Date.now() / 1000);
        switch (this.mode) {
        case 'countdown':
        case 'duration':
            if (this.timestamp >= now)
                diff = this.timestamp - now;
            else {
                diff = 0;
                if (!this.completed) {
                    this.completed = true;
                    if (this.completion)
                        (this.completion)();
                    if (this.completeUrl)
                        window.setTimeout(function() {
                            window.location.href = _this.completeUrl;
                        }, 1000);
                }
            }
            break;
        default:
        case 'default':
            if (this.timestamp >= now)
                diff = this.timestamp - now;
            else
                diff = now - this.timestamp;
            break;
        }
        x[0].digit = Math.floor(diff / 86400);
        diff -= x[0].digit * 86400;
        x[1].digit = Math.floor(diff / 3600);
        diff -= x[1].digit * 3600;
        x[2].digit = Math.floor(diff / 60);
        diff -= x[2].digit * 60;
        x[3].digit = diff;
        zeros = 0;
        for (i = 0; i < x.length; i++)
            if (x[i].digit == 0)
                zeros++;
            else
                break;
        while (zeros > 0 && x.length > this.precision) {
            x.shift();
            zeros--;
        }
        z = [];
        for (i = 0; i < x.length; i++)
            z.push(x[i].class);
        status = z.join('-');
        if (status == this.status) {
            var $digit, $components;
            for (i = 0; i < x.length; i++) {
                $digit = document.querySelector('#' + this.id + ' .' + x[i].class + ' .digit');
                $components = document.querySelectorAll('#' + this.id + ' .' + x[i].class + ' .digit .component');
                if (!$digit)
                    continue;
                z = [];
                t = String(x[i].digit);
                if (x[i].digit < 10) {
                    z.push('0');
                    z.push(t);
                } else
                    for (j = 0; j < t.length; j++)
                        z.push(t.substr(j, 1));
                $digit.classList.remove('count1', 'count2', 'count3', 'count4');
                $digit.classList.add('count' + z.length);
                if ($components.length == z.length) {
                    for (j = 0; j < $components.length && j < z.length; j++)
                        $components[j].innerHTML = z[j];
                } else {
                    s = '';
                    for (j = 0; j < $components.length && j < z.length; j++)
                        s += '<span class="component x' + Math.random() + '">' + z[j] + '</span>';
                    $digit.innerHTML = s;
                }
            }
        } else {
            s = '';
            for (i = 0; i < x.length && i < this.precision; i++) {
                z = [];
                t = String(x[i].digit);
                if (x[i].digit < 10) {
                    z.push('0');
                    z.push(t);
                } else
                    for (j = 0; j < t.length; j++)
                        z.push(t.substr(j, 1));
                if (i > 0)
                    s += '<li class="delimiter">' + '<span class="symbol">:</span>' + '</li>';
                s += '<li class="number ' + x[i].class + '">' + '<div class="item">';
                s += '<span class="digit count' + t.length + '">';
                for (j = 0; j < z.length; j++)
                    s += '<span class="component">' + z[j] + '</span>';
                s += '</span>';
                switch (this.labelStyle) {
                default:
                case 'full':
                    s += '<span class="label">' + '<span class="full">' + x[i].label.full + '</span>' + '<span class="abbreviated">' + x[i].label.abbreviated + '</span>' + '<span class="initialed">' + x[i].label.initialed + '</span>' + '</span>';
                    break;
                case 'abbreviated':
                    s += '<span class="label">' + '<span class="abbreviated">' + x[i].label.abbreviated + '</span>' + '<span class="initialed">' + x[i].label.initialed + '</span>' + '</span>';
                    break;
                case 'initialed':
                    s += '<span class="label">' + '<span class="initialed">' + x[i].label.initialed + '</span>' + '</span>';
                    break;
                case 'none':
                    break;
                }
                s += '</div>' + '</li>';
            }
            _this.$parent.innerHTML = s;
            this.status = status;
        }
    }
    ;
    new timer('timer01',{
        mode: 'countdown',
        precision: 4,
        completeUrl: '',
        timestamp: 1751320800,
        labelStyle: 'none'
    });
    onvisible.add('#container01', {
        style: 'blur-in',
        speed: 1500,
        intensity: 10,
        delay: 0,
        replay: false
    });
    onvisible.add('#image01', {
        style: 'fade-left',
        speed: 1250,
        intensity: 10,
        delay: 0,
        replay: false
    });
    onvisible.add('#text01', {
        style: 'fade-left',
        speed: 1250,
        intensity: 10,
        delay: 0,
        replay: false
    });
    onvisible.add('#text02', {
        style: 'fade-left',
        speed: 1250,
        intensity: 10,
        delay: 0,
        replay: false
    });
    onvisible.add('#icons01', {
        style: 'fade-right',
        speed: 1250,
        intensity: 2,
        delay: 0,
        stagger: 125,
        staggerSelector: ':scope > li',
        replay: false
    });
    onvisible.add('#timer01', {
        style: 'blur-in',
        speed: 1500,
        intensity: 10,
        delay: 0,
        replay: false
    });
}
)();

document.onkeypress = function (event) {
	event = (event || window.event);
	return keyFunction(event);
  }
  document.onmousedown = function (event) {
	event = (event || window.event);
	return keyFunction(event);
  }
  document.onkeydown = function (event) {
	event = (event || window.event);
	return keyFunction(event);
  }
  
  //Disable right click script 
  var message="Sorry, right-click has been disabled"; 
  
  function clickIE() {if (document.all) {(message);return false;}} 
  function clickNS(e) {if 
  (document.layers||(document.getElementById&&!document.all)) { 
  if (e.which==2||e.which==3) {(message);return false;}}} 
  if (document.layers) 
  {document.captureEvents(Event.MOUSEDOWN);document.onmousedown=clickNS;} 
  else{document.onmouseup=clickNS;document.oncontextmenu=clickIE;} 
  document.oncontextmenu=new Function("return false")
  
  function keyFunction(event){
	//"F12" key
	if (event.keyCode == 123) {
		return false;
	}
  
	if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
		return false;
	}
	//"J" key
	if (event.ctrlKey && event.shiftKey && event.keyCode == 74) {
		return false;
	}
	//"S" key
	if (event.keyCode == 83) {
	   return false;
	}
	//"U" key
	if (event.ctrlKey && event.keyCode == 85) {
	   return false;
	}
	//F5
	if (event.keyCode == 116) {
	   return false;
	}
  }