var morphlib = (function () {
  'use strict';

  function processText(event, selection, prefs) {
      debug = prefs.getdebugstatus();
      test = window.getSelection();
      if (selection.isCollapsed) {
          if (debug) {
              console.log("Process Text: No Data Found");
          }
          return;
      }
      text = test.toString();
      //TODO check to see if site has set word to be ignored
      //TODO add disable for areas of the page to be ignored
      //TODO add rule for mixed site
      parentNode = test.anchorNode.parentNode.textContent;
      //TODO add check for whitespace
      //TODO check if treebank exists
      results = "HTML RESULTS(placeholder)"; //TODO return real result
      popupwindow = createPopup();
  }
  function createPopup() {
      debug = true; //TODO get debug stetting from preference file
      //TODO take window name from preference file
      var myWindow = window.open("", "morplibWindow", "width=600,height=400");
      if (!myWindow) {
          if (debug) {
              console.log("Warning popup window failed to create popup window");
          }
          alert("Morphology Library failed to create a popup");
          return;
      }
      if (debug) {
          console.log("Popup window created successfully");
      }
      return myWindow;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /**
   * Just an XmlHttpRequest helper
   *
   * @function
   * @memberOf CTS.utils
   * @name xhr
   *
   * @param  {string}     method             HTTP Method
   * @param  {string}     url                HTTP URI to call
   * @param  {?function}  options.success    Function to call when request is done.
   * @param  {string}     options.type       Type of data wished (default: text/xml)
   * @param  {any}        options.data       Data to send
   * @param  {?function}  options.error      Function to call when request gave an error.
   *
   */

  function async(method, url, options) {
      var xhr,
          _this = this;

      if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === undefined) {
          options = {};
      }
      if (typeof options.type === "undefined") {
          options.type = "text/xml";
      }
      if (typeof options.async === "undefined") {
          options.async = true;
      }

      if (window && window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      } else if (window && window.ActiveXObject) {
          var names, i;

          if (window.ActiveXObject) {
              names = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];

              for (i in names) {
                  try {
                      return new ActiveXObject(names[i]);
                  } catch (e) {}
              }
          }
      } else {
          return null;
      }
      try {
          xhr.open(method, url, options.async);

          xhr.onerror = function () {
              if (typeof options.error === "function") {
                  options.error(xhr.status, xhr.statusText);
              }
          };

          xhr.onreadystatechange = function () {
              if (xhr.status === 500 || xhr.status === 401 || xhr.status === 403 || xhr.status === 404 || xhr.status === 400) {
                  if (typeof options.error === "function") {
                      options.error(xhr.status, xhr.statusText);
                  }
              } else {
                  if (xhr.readyState === 4) {
                      if (typeof options.success === "function") {
                          if (options.type === "text/xml") {
                              if (xhr.responseXML !== null && xhr.responseXML.innerHtml) {
                                  try {
                                      var xml = new DOMParser().parseFromString(xhr.responseText, "text/xml");
                                  } catch (e) {
                                      options.error(e);
                                  }
                              } else {
                                  options.success(xhr.responseXML);
                              }
                          } else if (options.type === "text" || options.type === "plain/text" || options.type === "text/plain") {
                              options.success(xhr.responseText);
                          }
                      }
                  }
              }
          };
          if ((typeof options.data !== "undefined" || options.data !== null) && method === "POST") {
              xhr.overrideMimeType("multipart/form-data");
              xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;");
              xhr.send(CTS.utils.dataEncode(options.data));
          } else {
              xhr.send();
          }
      } catch (err) {
          if (typeof options.error === "function") {
              options.error(err);
          }
      }
  }

  var preferences = function () {
      function preferences(prefFile) {
          classCallCheck(this, preferences);

          var prefdata = async("GET", prefFile, { "type": "text" });
          prefs = JSON.parse(prefdata);
      }

      createClass(preferences, [{
          key: "setMouseAction",
          value: function setMouseAction(lang, newAction) {
              installedlangs = prefs.languages[2];
              for (var intlang in installedlangs["installedlangs"]) {
                  if (installedlangs["installedlangs"][intlang]["code"] == lang) {
                      installedlangs["installedlangs"][intlang]["mouseaction"] == newAction;
                  }
              }
          }
      }, {
          key: "getMouseAction",
          value: function getMouseAction(lang) {
              installedlangs = prefs.languages[2];
              for (var intlang in installedlangs["installedlangs"]) {
                  if (installedlangs["installedlangs"][intlang]["code"] == lang) {
                      return installedlangs["installedlangs"][intlang]["mouseaction"];
                  }
              }
          }
      }, {
          key: "getdebugstatus",
          value: function getdebugstatus() {
              return prefs.debug;
          }
      }]);
      return preferences;
  }();

  var morphlib = function () {
      function morphlib(base) {
          classCallCheck(this, morphlib);

          //Default Language the Alphieos Morphology library will use
          this.defaultLang = "";
          //Holds the morphlib.response object
          this.response = "";
          //holds the location of the morphology provider
          this.morphService = "";
          //holds the locations of the short definition provider
          this.shortDefService = "";
          //holds the location of the disambugation provider
          this.disambugationProvider = "";
          //Copyright information
          this.copyrightInfo = "";
          //a list of element @id and @class values regions of the page to be ignored by the library
          this.ignoreElements = false;
          //a list of element @id and @class values the page to which to limit the activity of the library
          this.focusElements = false;
          //setup preferences from saved preference file
          this.prefs = new preferences("preferences.json");
      }

      //Initialize function for the class. Adds the even listener for to run morphlib when a page is loaded


      createClass(morphlib, [{
          key: "init",
          value: function init() {
              window.addEventListener("load", this.onLoad, false);
          }

          /*
          TODO add check for dependencies
           */

      }, {
          key: "onload",
          value: function onload() {
              this.enable();
          }

          /*
          enables the library to run on a browser window
           */

      }, {
          key: "enable",
          value: function enable() {
              lang = false;
              //TODO check is lang is set if not detect
              trigger = "default"; //TODO add call the get from language tool so it can be langauge specfic
              this.setPopupTrigger(lang, trigger);
          }

          /*
          create listener to trigger the creation of the popup with the trigger supplied by the user config
           */

      }, {
          key: "setPopupTrigger",
          value: function setPopupTrigger(lang, trigger) {
              window.addEventListener(trigger, this.createPopup());
          }

          //Handler for the popup trigger event

      }, {
          key: "createPopup",
          value: function createPopup(event) {
              selction = window.getSelection();
              processText(event, selction, prefs);
          }

          //get the appropiate language tool

      }, {
          key: "getLanguageTool",
          value: function getLanguageTool(elm) {
              var langTool;
              var langKey;
              if (elm) {
                  langKey = util.getLanguageforElement(elm);
              }
              if (!langKey) {
                  langKey = m_defaultLang;
              }
              if (langKey) {
                  langTool = languages.getLanguageToolfromKey();
              }
          }
      }]);
      return morphlib;
  }();

  return morphlib;

}());