(function($) {
  $.eb = $.eb || {};

  $.eb.ie = function (min,max) {
    // return true;
    if ($.browser.msie) {
      var v = Math.floor($.browser.version);
      if (v >= min && v <= max) {
        return true;
      }
    }
    return false;
  }

  $.eb.color = function () {
    var pad = function(num, totalChars) {
        var pad = '0';
        num = num + '';
        while (num.length < totalChars) {
            num = pad + num;
        }
        return num;
    };

    // Ratio is between 0 and 1
    this.changeColor = function(color, ratio, darker) {
        // Trim trailing/leading whitespace
        color = color.replace(/^\s*|\s*$/, '');

        // Expand three-digit hex
        color = color.replace(
            /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
            '#$1$1$2$2$3$3'
        );

        // Calculate ratio
        var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
            // Determine if input is RGB(A)
            rgb = color.match(new RegExp('^rgba?\\(\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '\\s*,\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '\\s*,\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '(?:\\s*,\\s*' +
                '(0|1|0?\\.\\d+))?' +
                '\\s*\\)$'
            , 'i')),
            alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

            // Convert hex to decimal
            decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
                /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
                function() {
                    return parseInt(arguments[1], 16) + ',' +
                        parseInt(arguments[2], 16) + ',' +
                        parseInt(arguments[3], 16);
                }
            ).split(/,/),
            returnValue;

        // Return RGB(A)
        return !!rgb ?
            'rgb' + (alpha !== null ? 'a' : '') + '(' +
                Math[darker ? 'max' : 'min'](
                    parseInt(decimal[0], 10) + difference, darker ? 0 : 255
                ) + ', ' +
                Math[darker ? 'max' : 'min'](
                    parseInt(decimal[1], 10) + difference, darker ? 0 : 255
                ) + ', ' +
                Math[darker ? 'max' : 'min'](
                    parseInt(decimal[2], 10) + difference, darker ? 0 : 255
                ) +
                (alpha !== null ? ', ' + alpha : '') +
                ')' :
            // Return hex
            [
                '#',
                pad(Math[darker ? 'max' : 'min'](
                    parseInt(decimal[0], 10) + difference, darker ? 0 : 255
                ).toString(16), 2),
                pad(Math[darker ? 'max' : 'min'](
                    parseInt(decimal[1], 10) + difference, darker ? 0 : 255
                ).toString(16), 2),
                pad(Math[darker ? 'max' : 'min'](
                    parseInt(decimal[2], 10) + difference, darker ? 0 : 255
                ).toString(16), 2)
            ].join('');
    };
    this.lighten = function(color, ratio) {
        return changeColor(color, ratio, false);
    };
    this.darken = function(color, ratio) {
        return changeColor(color, ratio, true);
    };
    return this;
  }();


  function bootstrapIE6(el) {
    function dropdownWidthFix(el) {
      el.each(function () {
        var w = 0;
        $(this).children('li').each(function() {
          var aw = $(this).outerWidth();
          if (aw > w) w = aw;
        });

        $(this).width(w);
      });
    }

    if ($.eb.ie(0,6)) {
      el = el || $('html');

      //-------------
      // dropdown 
      //-------------
      // fix for IE6 not support li:hover
      var lis = ['dropdown-submenu'];
      for (var i in lis) {
        var child = 'li.' + lis[i];
        var hover = lis[i] + '-hover';
        $('ul').on('mouseenter', child, function () {
          $(this).addClass(hover);
        }).on('mouseleave', child, function () {
          $(this).removeClass(hover);
        });
      }

      /// fix :after selector -- dropdown-submenu > a:after
      $('.dropdown-submenu > a').after('<span class="dropdown-tri"></span>');

      /// fix multi class selector -- .dropdown-submenu.pull-left
      $('.dropdown-submenu.pull-left').removeClass('pull-left').addClass('dropdown-submenu-pull-left');
      // $('.navbar .nav.pull-right').removeClass('pull-right').addClass('nav-pull-right');

      /// fix ul li 100% width bug, set ul width to max width of it's sub li
      dropdownWidthFix($('.dropdown-menu:visible', el));
      $('.dropdown-toggle', el).parent().on('propertychange', function() {
        dropdownWidthFix($('.dropdown-menu:visible', this));
      });

      //-------------
      // buttons
      //-------------
      var btnColorCls = ['btn-primary','btn-warning','btn-danger','btn-success','btn-info','btn-inverse'];
      var btnSizeCls = ['btn-mini','btn-small','btn-large'];
      $('.btn-group').parent().find('.btn-group:eq(0)').addClass('btn-group-first');
      $('.btn').parent().find('.btn:eq(0)').addClass('btn-first');

      // fix for IE6 not support button:hover
      $('body').on('mouseenter', '.btn', function () {
        var btn = $(this);
        var hover = 'btn-hover';
        btn.data('ie6hover',hover);
        $.each(btnColorCls, function (k,v) {
          if (btn.hasClass(v)) {
            hover = v + '-hover';
            btn.data('ie6hover',hover);
            return false;
          }
        });
        btn.addClass(hover);
      }).on('mouseleave', '.btn', function () {
        var btn = $(this);
        var hover = btn.data('ie6hover');
        btn.removeData('ie6hover');
        if (hover) btn.removeClass(hover);
      });

      // fix .btn.dropdown-toggle, .btn-primary.dropdown-toggle ...
      // fix .btn.dropdown-toggle, .btn-small.dropdown-toggle ...
      $('.btn.dropdown-toggle').each(function () {
        var btn = $(this);
        var ddt = 'btn-dropdown-toggle';
        btn.addClass(ddt);

        ddt = null;
        $.each(btnColorCls, function (k,v) {
          if (btn.hasClass(v)) {
            ddt = v + '-dropdown-toggle';
            return false;
          }
        });
        if (ddt) btn.addClass(ddt);

        ddt = null;
        $.each(btnSizeCls, function (k,v) {
          if (btn.hasClass(v)) {
            ddt = v + '-dropdown-toggle';
            return false;
          }
        });
        if (ddt) btn.addClass(ddt);

      });

      // Split button dropdown background color

      $('.btn + .btn.dropdown-toggle').each(function () {
        var btn = $(this);
        var c = btn.css('background-color');
        // alert($.eb.color.darken(c, .2));
        btn.css('background-color', $.eb.color.darken(c, .1));
      });

      // fix .btn-group.open
      $.each(['btn-group', 'dropdown'], function (k,cls) {
        $('.'+cls, el).on('propertychange', function(e) {
          var g = $(this);
          if (g.data('changeClass')) {
            g.removeData('changeClass');
            return;
          }
          // dropdownWidthFix($('.dropdown-menu:visible', this));
          if (g.hasClass('open') && !g.hasClass(cls+'-open')) {
            g.addClass(cls+'-open');
            g.data('changeClass', true);
          }
          else if (!g.hasClass('open') && g.hasClass(cls+'-open')) {
            g.removeClass(cls+'-open');
            g.data('changeClass', true);
          }
        });
      });


      //-------------
      // table
      //-------------
      $('table.table-hover').on('mouseenter', 'tr', function () {
        $(this).addClass('tr-hover');
      }).on('mouseleave', 'tr', function () {
        $(this).removeClass('tr-hover');
      });

    }
  }
  $.bootstrapIE6 = bootstrapIE6;


  $(document).ready(function () {
    bootstrapIE6();

    if ($.eb.ie(0,6)) {
      
      //-------------
      // dropdown 
      //-------------




      //-------------
      // buttons
      //-------------


    }

  });

})(jQuery);