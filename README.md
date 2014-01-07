smart_append_jquery_plugin
==========================

A jQuery plugin for appending/prepending an json-array of data to lists. It'll be very usefull in case, you need to inject json data (From API's, or regular AJAX-requests) into your html document.

It supports ul, ol and dl lists

A quick example
--------------

Let's say, you have json-array that you need to parse, and append to your list
```javascript
  json_doc = {"widgets": [
    {
      "url": "http://fooboo.com/problem/officer?problem_id=1&officer_id=42",
      "image": { 
        "src": "http://fooboo.com/Sun.png",
        "name": "sun1"
      }
    },
    {
      "url": "http://imagehosting.net/category/45/picture/986765443",
      "image": { 
        "src": "http://imagehosting.net/Sun.png",
        "name": "sun2"
      }
    },
    {
      "url": "http://flickr.com/image/24843444bvf32DBEfv2Ey",
      "image": { 
        "src": "http://flickr.com/template.jpg",
        "name": "sun3",
        "width": "30px"
      }
    }
  ]};
```
And here's our list
```html
  <ul id="list-fixture">
    <li class="list-item">
      <a href="#">
        data1
      </a>
    </li>
    <li class="list-item">
      <a href="#">
        data2
      </a>
    </li>
  </ul>
```
So, to append data from 'name'-attribute to our list, you have to call

```javascript
  // That one puts a content to the end
  $("#list-fixture").smartAppend(
    json_doc['widgets'], 
    {
      // 'node'-prefix tells to look for value in JSON
      'value': 'node:image/name',
    }
  );
  // This code puts data at the beginning of a list
  $("#list-fixture").smartPrepend(
    json_doc['widgets'], 
    {
      'value': 'node:image/name',
    }
  );
```

The result will be:
```html
<ul id="list-fixture">
  <li class="list-item">
    <a href="#">
      data1
    </a>
  </li>
  <li class="list-item">
    <a href="#">
      data2
    </a>
  </li>
  <li>sun1</li>
  <li>sun2</li>
  <li>sun3</li>
</ul>
```

Customization
-------------
As we saw, the original elements in our list had 'list-item' class, and the content was wraped in a link. But thats not a problem! smartAppend can do these things.

```javascript
  $("#list-fixture").smartAppend(
    json_doc['widgets'], 
    {
      'value': 'node:image/name',
      // Here, we can set the attributes for 'li'-s
      'attributes': {
        'class': 'list-item'
      },
      // And this one can wrap value into any html-tag
      'wrappedIn': {
        'tag_name': 'a',
        // Yes, we can also set attributes for a wrapper-tag, 
        'attributes': { 
          // As you see, the attribute values can be inserted from json
          'href': 'node:image/src',
          'class': 'api-image-link'
        }
      }
    }
  );
```
And here's the result:
```html
  <ul id="list-fixture">
    <li class="list-item">
      <a href="#">
        data1
      </a>
    </li>
    <li class="list-item">
      <a href="#">
        data2
      </a>
    </li>
    <li class="list-item">
      <a href="http://fooboo.com/Sun.png" class="api-image-link">sun1</a>
    </li>
    <li class="list-item">
      <a href="http://imagehosting.net/Sun.png" class="api-image-link">sun2</a>
    </li>
    <li class="list-item">
      <a href="http://flickr.com/template.jpg" class="api-image-link">sun3</a>
    </li>
  </ul>
```
Extra features
--------------

There's also an ability to insert tags before and after the value

```javascript
  $("#list-fixture").smartPrepend(
    json_doc['widgets'], 
    { 'value': 'node:image/src' },
    // Appears before value, inside link with
    'before': {
      'tag_name': 'a',
      'value': "some link",
      'attributes': {
        'href': "http://lalala/",
      },
    },
    // Just the text, that appears after value
    'after': 'my own teext'
  });
```

#### Image support

If you want to append some images from json to a list, it's possible to do (although, it's a little bit rusty). By now - it's more of a hack, but still:
```javascript
$("#list-fixture").smartAppend(
    json_doc['widgets'], 
    {
      // There's no 'node'-prefix in here, so, the plugin treats it as regular text
      // Since it's just a space, we'll not see it on our page
      'value': ' ',
      'attributes': {
        'class': 'list-item'
      },
      // Since, the value is empty - We just insert an image after
      'after': {
        'tag_name': 'img',
        'attributes': { 
          'src': 'node:image/src',
          'class': 'api-image-link'
        }
      }
    }
  );
```

Work in progress:
-----------------
1. I plan to implement table support, and modify plugin to insert images
2. The plugin is very young and requires testing. So, if you noticed an isuue or a bug (or even got the cool feature to implement) - feel free to report in here, or even submit some code.
