## Welcome, This is bsie project Home.

### Introduce
bsie is a patch library for Bootstrap IE6 support, bootstrap is a good web UI library from [twitter.com](http://twitter.github.com/bootstrap)

At present, bsie support the most common feature of bootstrap on IE6, but not all ...

Following table is currently supported component & feature:
```
Component       Feature
-----------------------------------------------------------
grid            fixed, fluid
navbar          top, fixed
nav             list, tabs, pills
dropdown        dropdown (two level)
buttons         button, group color, size, dropdown-button, 
                (disable state is not dynamic)
form            default, horizontal, inline, all controls, 
                validation state
tables          hover
breadcrumbs     all
pagination      all
labels          all
badges          all
code            all
modal           most
tooltip         all
popover         all
alert           all
typeahead       all
progressbar     most
media           all
wells           all
hero unit       all
icons           all
```

### File summary


`bootstrap/css/bootstrap.css :`

  This is original bootstrap css.

`bootstrap/css/bootstrap.min.css :`

  This is compressed original bootstrap css.

`bootstrap/css/bootstrap-ie6.css :`

  This is bsie main css.

`bootstrap/css/bootstrap-ie6.min.css :`
  
  This is compressed bsie main css.

`bootstrap/css/ie.css :`
  
  This is bsie additional css patch, its most content can not be writen in .less file, it must follow bootstrap-ie6.css in `<head>` block.

`js/bootstrap-ie.js :`
  
  This javascript file patch some problem which can not be done by pure CSS approach.

`bootstrap/img/glyphicons-halflings.png-8.png :`
  
  This image file is transparent icons for IE6, it's a 8 bit png image, not very perfect, but I think it can be accepted.

`bootstrap/less-ie6 :`

  There are all patched .less files, you can compile bootstrap-ie6.less with lessc to get your patch css file -- bootstrap-ie6.css


### Demo

**In bsie root directory, these file is demo:**

`test-XXX.html`, for example test-buttons.html  test-form.html

`p-1.html`...`p-N.html`, these file is a copy of bootstrap example pages


### Manual

**Step 1, In `<head>` block, add following stylesheet:**
```
  <!-- Bootstrap css file v2.2.1 -->
  <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">

  <!--[if lte IE 6]>
  <!-- bsie css patch -->
  <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap-ie6.css">

  <!-- bsie additional css patch -->
  <link rel="stylesheet" type="text/css" href="bootstrap/css/ie.css">
  <![endif]-->
```
**Step 2, In end of the document, add following javascript:**
```
  <!-- jQuery 1.7.2 or higher -->
  <script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>

  <!-- Optional, bootstrap javascript library -->
  <script type="text/javascript" src="bootstrap/js/bootstrap.js"></script>
  
  <!--[if lte IE 6]>
  <!-- bsie js patch, it will only execute in IE6 -->
  <script type="text/javascript" src="js/bootstrap-ie.js"></script>
  <![endif]-->
```

**Step 3, Optional accoding to your situation:**
  
IE6   **Notice:** : call $.bootstrapIE6(el) for every new html snippet (for ajax html content)
```    
/**
 * make elements in container el to be compatible with IE6
 */
if ($.isFunction($.bootstrapIE6)) $.bootstrapIE6(el);
```

IE6    currently not support nested tabs control, because IE6 don't support child css selector 


### IE6-7 hack

**IE6 hack**
```
  _zoom:1;
```
**IE6-7 hack**
```
  *zoom:1;
```

### IE6 bug fix tip

**hasLayout (clear float):**
```
  .container 
  { 
    zoom:1; 
  }
```

**other css property which will trigger hasLayout:**
```  
  position:   absolute
  float:      left | right
  display:    inline-block
  width:      except 'auto'
  height:     except 'auto'
  zoom:       except 'normal'
  overflow:   hidden | scroll | auto
  overflow-x/-y: hidden | scroll | auto
  position:   fixed
  min-width:  any value
  max-width:  except 'none'
  min-height: any value
  max-height:  except 'none'
  writing-mode: tb-rl   /* only for MS */
```
  
**following css property will clear hasLayout:**
```  
  width:        auto;
  height:       auto;
  max-width:    none;   /* IE7 */
  max-height:   none;   /* IE7 */
  position:     static;
  float:        none;
  overflow:     visible;
  zoom:         normal;
  writing-mode: lr-t;
```

**In one selector, following css will not set hasLayout=false:**
```
  .element {
    display:inline-block;
    display:inline;
  }
```

**inline-block:**
```
  `.container 
  { 
    zoom:1; 
    display:inline;
  }
```

**transparent color:**
```
  .element
  {
    border-color:pink/* rarely used color */;
    filter:chroma(color:pink);
  }
  * notice: the filter will cause disappeared of absolute element which in relative container
```

**body background color:**
```
  body { /* Faild: Sometime, it will not render whole page by gray color  */
    background-color: gray;
  }
  * html { /* Success! */
    background-color: gray;
  }
```

IE6-7  ul.dropdown-menu must add this style: _*width:explicit-width_;
```
  /* for example */
  *width:180px;
```

### Support & Contact

If you have some patch for these library, Please send to:
ddouble.cn@gmail.com

Thanks.
