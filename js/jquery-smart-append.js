/**
 * SmartAppend v0.2 - A jQuery plugin for appending/perpending data from array/json into lists
 *
 * https://github.com/vtl-pol/smart_append_jquery_plugin
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * 
 * Free for commercial use
 *
 * (c) 2013, vtl-pol
 */

(function( $ ) {

/********* FUNCTIONS BLOCK *********/

  /**
   * Returns opening and closing tags as a string
   */
  function tagOpener(tag, attributes) {
    var opener = '<' + tag;
    if (attributes == undefined) {
      return opener + ">";
    }

    jQuery.each(attributes, function(attr, val) {
      if (val != undefined) {
        opener += " " + attr + "=\"" + String(val).replace(/"/g, "&quot;") + "\" ";
      }
    })

    return opener + ">";
  }
  function tagCloser(tag) {
    return "</" + tag + ">";
  }

  /**
   * Checks if a given keyexists in JSON
   * I just don't like all the "if (var != 'undefined' && json_object.hasOwnProperty('name'))" constructions
   */
  function keyInJson(key, json_obj) {
    if(json_obj[key] != '' && json_obj[key] != {} && json_obj[key] != undefined) {
      return true;
    }
    return false;
  }

  /**
   * Returns value form json object by given node
   */
  function valueFromJSON(node, json_obj) {

    var node = node.replace('node:', '');
    var valueNodes = node.split('/');
    var result;

    result = json_obj[valueNodes[0]];
    valueNodes.splice(0, 1);
    jQuery.each(valueNodes, function(i, key) {
      result = result[key];
    })

    return result;
  }

  /**
   * Checks if a value is a node in JSON object or just a string.
   * Returns a value  in JSON, or a given one if it's not a node
   */
  function parseValue(value, json_obj) {
    var result = value;
    if (result.indexOf('node:') !== -1) {
      return valueFromJSON(result, json_obj);            
    }
    return result;
  }

  /**
   * Returns completly initialised value to paste in a tag
   * Includes all possible params for a whole plugin
   */
  function initializeValue(value, params) {
    var result;

    if (!keyInJson("value", params)) {
      result = value;
    }
    else {
      result = parseValue(params['value'], value);
    }

    if (keyInJson("wrappedIn", params)) {
      result = wrapInTag( params['wrappedIn'], result, value );
    }

    if (keyInJson('before', params)) {
      result = addTag(params["before"], value) + result;
    }

    if (keyInJson('after', params)) {
      result = result + addTag(params["after"], value);
    }

    return result;
  }

  /**
   * Returns completly initialised value to paste in a tag
   * Includes all possible params for a whole plugin
   */
  function initializeTable(value, params) {
    var result;
    console.log(value);
    console.log(params);
    jQuery.each(params['value'], function(key, column) {
      result += tagOpener('td') + initializeValue(column['value'], column['params']) + tagCloser('td');
    });

    return result;
  }

  /**
   * Wraps given value around given tag
   */
  function wrapInTag(tagData, value, json_obj) {
    if (jQuery.type(tagData) == "string") {
      // just a tag
      return tagOpener(tagData) + value + tagCloser(tagData);
    }
    else {
      // tag with a attributes
      var tag_attributes = {};

      if (keyInJson('attributes', tagData)) {
        jQuery.each(tagData["attributes"], function(attr, val) {
          tag_attributes[attr] = parseValue(val, json_obj);
        });
      }
      return tagOpener(tagData["tag_name"], tag_attributes) + value + tagCloser(tagData['tag_name'])
    }
  }

  /**
   * Adds a data before or after the main value
   * Returns initialized data as a string
   */
  function addTag(data, json_obj) {

    if (keyInJson('value', data)) {
      return wrapInTag(data, data['value'], json_obj)
    }
    else if (keyInJson('attributes', data)) {
        var tag_attributes = {};
        jQuery.each(data['attributes'], function(attribute, content) {
          tag_attributes[attribute] = parseValue(content, json_obj);

        });
        return tagOpener(data['tag_name'], tag_attributes)
    }
    else {
      return data;
    }
  }

  function performAction(entry, elements, params, action) {

    var currentList = entry;
    var params = params;

    var tag = currentList.prop("tagName").toLowerCase();
    var main_tag_attributes = {};
    var supportedTags = ['ul', 'ol', 'dl'];
    var tagsDependencies = {'ul': 'li',
                            'ol': 'li',
                            'dl': 'dt'}
                            // 'table': 'tr'}

    if (currentList.length > 1) {
      jQuery.error("smartAppend can't be used on array of elements");
    }
    if (jQuery.inArray(tag, supportedTags) == -1) {
      jQuery.error("Unsupported element. smartAppend supports only '" + supportedTags.join("', '") + "'!");
    }

    tag = tagsDependencies[tag];

    jQuery.each(elements, function(index, value) {

      result = initializeValue(value, params);
      
      if (keyInJson('attributes', params)) {
        jQuery.each(params['attributes'], function(attribute, content) {
          main_tag_attributes[attribute] = parseValue(content, value);
        });
      }

      if (action == 'append') {
        currentList.append(tagOpener(tag, main_tag_attributes) + result + tagCloser(tag));
      }
      else if (action == 'prepend') {
        currentList.prepend(tagOpener(tag, main_tag_attributes) + result + tagCloser(tag));
      }
    });
  };


  $.fn.smartAppend = function( elements, params ) {
    params = (typeof(params) !== 'undefined') ? params : {};

    performAction(this, elements, params, "append");

    return this;
  };

  $.fn.smartPrepend = function( elements, params ) {
    params = (typeof(params) !== 'undefined') ? params : {};

    performAction(this, elements, params, "prepend");

    return this;
  };


}( jQuery ));