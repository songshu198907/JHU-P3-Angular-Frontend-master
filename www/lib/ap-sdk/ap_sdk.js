(function(angular) {

  /**
  @module AP
  @submodule utility
  */
  angular.module("AP.utility", ["ngStorage"]);

})(angular);

(function(angular) {

  /**
  @module AP
  @submodule utility
  @class $helpers
  */
  angular.module("AP.utility")
    .service("$helpers", [function() {

      var _id = 1;

      /**
      Generates a unique String id
      @method uniqueId
      @param {String} prefix optional prefix to prepend to the id
      @param {String} suffix optional suffix to append to the id
      @returns {String}
      */
      this.uniqueId = function uniqueId(prefix, suffix) {
        var pref = prefix || "", suff = suffix || "";
        var id = "" + _id;
        _id++;
        return pref + id + suff;
      };

      /**
      Generates a random Number within a range. If no start and no end for the range is specified the default
      range will be 1-100000
      @method randomNumber
      @param {Number} start start of range
      @param {Number} end end of range
      @returns {Number}
      */
      this.randomNumber = function randomNumber(start, end) {
        start = start || 1;
        end = end || 100000
        return Math.floor(Math.random() * end) + start;
      };

      /**
      Finds an element within an Array, given a comparison Function passed as an argument
      @method find
      @param {Array} arr the array to search
      @param {Function} fn a compare Function that recieves an element as an argument and should return true/false if its the one its looking for
      @returns the element (any type) or null if no element met satisfied the comparison Function
      */
      this.find = function find(arr, fn) {
        if(angular.isArray(arr)) {
          var len = arr.length, i, element, found=false;
          for(i=0; i<len; i++) {
            element = arr[i];
            found = fn(element);
            if(found) {
              return element;
            }
          }
        }
        return null;
      };

      /**
      Create a query string from an object of parameters where the object's keys are the parameter names and their associated values are the parameter values
      @method getQueryString
      @param {Object} params an object of parameters where the object's keys are the parameter names and their associated values are the parameter values
      @returns {String}
      */
      this.getQueryString = function(params) {
        var result = "", paramArray = [];
        for(var param in params) {
          if(params.hasOwnProperty(param)) {
            paramArray.push({
              name: param,
              value: params[param]
            });
          }
        }
        if(paramArray.length) {
          result += "?";
        }
        for(var i = 0 ; i<paramArray.length ; i++) {
          var auxParam = paramArray[i];
          result += (i != 0) ? "&" : "";
          result += auxParam.name + "=" + JSON.stringify(auxParam.value);
        }

        return result;
      };

    }]);

})(angular);

(function(angular) {

  function Timestamps() {
    /**
    This is used to help calculate the difference in days between cache record timestamps
    @property millisecondsInOneDay
    @type {Number}
    */
    this.millisecondsInOneDay = 24 * 60 * 60 * 1000;

    /**
    The amount of days before a timestamp should be considered expired
    @property expiration
    @type {Number}
    */
    this.expiration = 7;
  }

  angular.extend(Timestamps.prototype, {

    /**
    Creates a timestamp from an ISO formatted string
    @method fromISOString
    @param {String} the ISO string to convert to a timestamp
    @returns {Date}
    */
    fromISOString: function(str) {
      return new Date(str);
    },

    /**
    Checks if a {Date} is within the expiration range configured for the cache.
    @method isValid
    @param {Date} date the date to check
    @returns {Boolean}
    */
    isValid: function(date) {
      if(angular.isDate(date)) {
        var diff = (new Date()).valueOf() - date.valueOf();
        return !(Math.ceil(diff/this.millisecondsInOneDay) > this.getExpirationRange());
      }
      return false;
    },

    /**
    Gets the amount of days that are set as limit for expiration of stored values.
    @method getExpirationRange
    @returns {Number}
    */
    getExpirationRange: function() {
      return (this.expiration) ? this.expiration : 7;
    },

    /**
    Sets the amount of days to use as expiration range
    @method setExpirationRange
    @param {Number} days the number of days
    @returns {Void}
    */
    setExpirationRange: function(days) {
      if(typeof days === "number") {
        this.expiration = days;
      }
    },

    /**
    Returns a timestamp
    @method timestamp
    @returns {Date}
    */
    timestamp: function() {
      return new Date();
    }
  });

  angular.module("AP.utility")
    .service("$timestamps", [Timestamps]);

})(angular);

(function(angular) {

  /**
  Local cache class, uses ngStorage internally to persist data across sessions in the browser
  @module AP
  @submodule utility
  @class {Cache}
  @param {Object} $localStorage Web Storage instance for persisting session data.
  */
  function Cache($localStorage, $timestamps) {
    this.$storage = $localStorage;
    this.$timestamps = $timestamps;
  }

  angular.extend(Cache.prototype, {

    /**
    Single function for getting or setting data in the Cache. If only a key is provided then it will get that key, if a key and value are
    provided then it will set the value of that key in the cache. If nothing is passed or if you try to get a value that doesn't exist
    it will return undefined.
    @method store
    @param {Object} key the key to get or set, it can be a value type or reference type
    @param {Object} value the value to store, if no value then it will act as a getter
    @returns {Object} if acting as a getter
    */
    store: function(key, value) {
      var $store = this.$storage["cache"], serializedKey, ts, data;
      // Checks to see if the cache exists within ngStorage and if doesn't then it recreates it
      // this is because the cache might have been flushed so it might not exist.
      if(!$store) {
        this.$storage["cache"] = {};
        $store = this.$storage["cache"];
      }
      if(key) {
        serializedKey = this.serializeKey(key);
        if(value) { // Set the value in the cache
          ts = this.$timestamps.timestamp();
          $store[serializedKey] = {
            value: value,
            timestamp: ts
          };
          return value;
        } else { // Get the value for key from the cache
          data = $store[serializedKey];
          if(data) {
            var timestamp = this.$timestamps.fromISOString(data.timestamp);
            if(!this.$timestamps.isValid(timestamp)) {
              delete $store[serializedKey];
              data = undefined;
            } else {
              data = data.value;
            }
          }
          return data;
        }
      }
    },

    /**
    Return a string version of a key. This allows to use reference types as keys
    @method serializeKey
    @param {Object} key the key to serialize
    @returns {String} serialized key
    */
    serializeKey: function(key) {
      return JSON.stringify(key);
    },

    /**
    Wipe the cache clean
    @method flush
    @returns {Void}
    */
    flush: function() {
      if(this.$storage) {
        delete this.$storage["cache"];
      }
    }

  });

  angular.module("AP.utility").service("$cache", ["$localStorage", "$timestamps", Cache]);

})(angular);

(function(angular) {

  function objectFromXml(xml) {
  	// Create the return object
  	var obj = {};

  	if (xml.nodeType == 1) { // element
  		// do attributes
  		if (xml.attributes.length > 0) {
  			for (var j = 0; j < xml.attributes.length; j++) {
  				var attribute = xml.attributes.item(j);
  				obj[attribute.nodeName] = attribute.nodeValue;
  			}
      }
  	} else if (xml.nodeType == 2 || xml.nodeType == 3) { // text
  		obj = xml.nodeValue;
  	}

  	// do children
  	if (xml.hasChildNodes() && xml.nodeType != 2) {
  		for(var i = 0; i < xml.childNodes.length; i++) {
  			var item = xml.childNodes.item(i);
  			var nodeName = item.nodeName;
  			if (typeof(obj[nodeName]) == "undefined") {
  				obj[nodeName] = fromXml(item);
  			} else {
  				if (typeof(obj[nodeName].push) == "undefined") {
  					var old = obj[nodeName];
  					obj[nodeName] = [];
  					obj[nodeName].push(old);
  				}
  				obj[nodeName].push(fromXml(item));
  			}
  		}
  	}
  	return obj;
  }

  function objectToXml(name, obj) {
    var xmlString = '', i;
    if(!(obj instanceof Array || obj instanceof Function || obj instanceof Object)) {
      return '<'+name+'>'+obj+'</'+name+'>';
    }

    if(obj instanceof Date) {
      return '<'+name+'>'+obj+'</'+name+'>';
    } else if(obj instanceof Array) {
      for(i=0; i<obj.length; i++) {
        xmlString += objectToXml(name, obj[i]);
      }
    } else if(obj instanceof Object) {
      xmlString = '<'+name+'>';
      for(i in obj) {
        xmlString += objectToXml(i, obj[i]);
      }
      xmlString += '</'+name+'>';
    }

    return xmlString;
  }

  function parseXml(xmlString) {
    var xmlDoc, parser;
    if (window.DOMParser) {
      parser=new DOMParser();
      xmlDoc=parser.parseFromString(xmlString,"text/xml");
    } else {// Internet Explorer
      xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async=false;
      xmlDoc.loadXML(xmlString);
    }
    return xmlDoc;
  }

  function xmlToString(xml) {
    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xml.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xml);
    }
    return xmlString;
  }

  angular.module("AP.utility")
    .service("$convertions", [function() {
      this.objectFromXml = objectFromXml;
      this.objectToXml = objectToXml;
      this.parseXml = parseXml;
      this.xmlToString = xmlToString;
    }]);

})(angular);

(function(angular) {

  /**
  @module AP
  @submodule adapter
  */
  angular.module("AP.adapter", ["AP.utility"]);

})(angular);

(function(angular) {

  /**
  Factory that creates http clients. This clients act as wrappers for angular's $http service.
  This allows configurations to be set for http calls but within a closed environment,
  thus not polluting the global http connection with defaults.

  @module AP
  @submodule adapter
  @class $httpClientFactory
  */
  angular.module("AP.adapter")
    .factory("$httpClientFactory", ["$http", "$q", "$cache", "$helpers", function($http, $q, $cache, $helpers) {

      /**
      Constructor for HttpClient instances
      @class HttpClient
      @constructor
      @param {Object} options configuration options for HttpClient constructor
      */
      function HttpClient(options) {
        var url = options.url || "",
            params = options.params || {},
            headers = angular.extend({}, options.headers),
            data = (typeof options.data == "object") ? angular.extend({}, options.data) : options.data,
            success = options.success || [],
            error = options.error || [],
            withCredentials = !!options.withCredentials,
            requestTransformations = options.requestTransformations,
            responseTransformations = options.responseTransformations,
            interceptors = options.interceptors || [];

        /**
        @property useOfflineCache
        @type {Boolean}
        */
        this.useOfflineCache = false;
        /**
        @property user
        @type {String} the username of the currently logged in user (if there is a user logged in)
        */
        this.user = "";
        /**
        @property url
        @type {String} url route
        */
        this.url = url;
        /**
        @property headers
        @type {Object} key-value pairs where "key" is the header name and "value" is the header value
        */
        this.headers = headers;
        /**
        @property params
        @type {Object} key-value pairs for query string parameters
        */
        this.params = params;
        /**
        @property data
        @type {Object} key-value pairs for data to send inside the request body (not applicable when executing GET requests)
        */
        this.data = data;
        /**
        @property onSuccess
        @type {Function} callback to apply when a request returns successfully from the server
        */
        this.onSuccess = success;
        /**
        @property onError
        @type {Function} callback function to apply when there is an error after sending a request to the server
        */
        this.onError = error;
        /**
        @property withCredentials
        @type {Boolean} specifies whether the request to send is a cross-domain kind of request
        */
        this.withCredentials = withCredentials;
        /**
        Request transformations are executed after the request is built and before it is sent to the server
        This array contains Function objects which execute in order and the return value of each function is passed
        to the next one in the Array. The first transformation recieves the request data. If a Function returns a value then this
        value is passed to the next in the chain, if no value is returned then the object being passed along the chain passed to the next
        Function as it was recieved by the former. Query string params can't be altered by this transformations, only payload data.
        @property requestTransformations
        @type {Function[]} array of transformations to apply to the request data before sending it to the server
        */
        this.requestTransformations = requestTransformations;
        /**
        Response transformations are executed after the response comes back from the server and before the success or error
        callbacks are executed. This array contains Functions that execute in order and the return value of each one of these is passed
        on to the next in the chain. The first Function on the array recieves the response from the server. If a Function returns
        no value then the object being passed is not altered, and it is passed to the next Function as an argument.
        @property responseTransformations
        @type {Function[]} array of transformations to apply to the response data after it comes back from the server and before the success or error callbacks are executed
        */
        this.responseTransformations = responseTransformations;
        /**
        Request interceptor chain to modify a request object before sending it to the server
        @property requestInterceptors
        @type Array
        */
        this.requestInterceptors = interceptors;
      }

      /**
      Creates the Object that is passed to angular's $http service. This resulting Object will contain the default $http configuration,
      overriden by the HttpClient's configuration properties, and then also overriden by any additional configuration passed as arguments to
      this Function.

      For example:

      If
      ```
      $http.defaults.headers = { "Foo": "Bar" }
      ```
      And
      ```
      this.headers = { "Foo2": "Bar2" }
      ```
      And
      ```
      headers (Function argument) =
      {
        "Foo": "NotBar",
        "Foo3": "Bar3"
      }
      ```
      The resulting Object will contain
      ```
      {
        headers: {
          "Foo": "NotBar",
          "Foo2": "Bar2",
          "Foo3": "Bar3"
        }
      }
      ```

      Also the request and response transformations will each be the union of the default transformations,
      the HttpClient's transformations and any transformations passed as arguments.
      The urls will also be concatenated using the same hierarchy.

      @method buildRequest
      @param {String} method http verb to use
      @param {String} url url to append to the HttpClient's url
      @param {Object} params query string parameters to send with this request
      @param {Object} headers headers to send with this request
      @param {Object} data payload data to send with this request (not used for GET requests)
      @param {Function} success success callback to execute after this request comes back from the server
      @param {Function} error error callback to execute after this request comes back from the server
      @param {Boolean} withCredentials whether the request should be cross-domain or not
      @param {Function[]} requestTransformations array of transformations to apply to this request
      @param {Function[]} responseTransformations array of transformations to apply to the response of this request
      @returns {Object} the request to pass to angular's $http service
      */
      HttpClient.prototype.buildRequest = function(method, url, params, headers, data, success, error, withCredentials, requestTransformations, responseTransformations) {
        var finalMethod = method || "GET",
            fullUrl = this.url + url,
            allParams = angular.extend({}, this.params, params),
            allHeaders = angular.extend({}, this.headers, headers),
            allData = angular.extend({}, this.data, data),
            allSuccess = [],
            allError = [],
            finalWithCredentials = (withCredentials != undefined) ? withCredentials : this.withCredentials,
            allRequestTransformations = [],
            allResponseTransformations = [],
            allRequestInterceptors = [];

        if(typeof data == "string") {
          allData = data;
        } else if(typeof this.data == "string"){
          allData = this.data;
        }

        Array.prototype.push.apply(allSuccess, this.success);
        Array.prototype.push.apply(allError, this.error);

        if(angular.isArray(success)) {
          Array.prototype.push.apply(allSuccess, success);
        } else if(angular.isFunction(success)) {
          allSuccess.push(success);
        }

        if(angular.isArray(error)) {
          Array.prototype.push.apply(allError, error);
        } else if(angular.isFunction(error)) {
          allError.push(error);
        }

        Array.prototype.push.apply(allRequestTransformations, this.requestTransformations);
        Array.prototype.push.apply(allResponseTransformations, this.responseTransformations);

        if(angular.isArray(requestTransformations)) {
          Array.prototype.push.apply(allRequestTransformations, requestTransformations);
        }
        if(angular.isArray(responseTransformations)) {
          Array.prototype.push.apply(allResponseTransformations, responseTransformations);
        }

        return {
          method: finalMethod,
          url: fullUrl,
          params: allParams,
          headers: allHeaders,
          data: JSON.stringify(allData),
          success: allSuccess,
          error: allError,
          withCredentials: finalWithCredentials,
          transformRequest: allRequestTransformations,
          transformResponse: allResponseTransformations
        }
      };

      /**
      Applies success and error callbacks to a promise returned by angular's $http service
      @method applyCallbacks
      @param {Promise} promise promise Object obtained as a result of calling $http
      @param {Function[]} successCallbacks Array of success callbacks to apply in order to promise
      @param {Function[]} errorCallbacks Array of error callbacks to apply in order to promise
      @returns {Promise} the same promise passed as an argument but with all callbacks subscribed
      */
      HttpClient.prototype.applyCallbacks = function(promise, successCallbacks, errorCallbacks) {
        if(successCallbacks && angular.isArray(successCallbacks) && promise && promise.then) {
          angular.forEach(successCallbacks, function(success) {
            if(success && angular.isFunction(success)) {
              promise.then(function(response) {
                if(response) {
                  (response.data) ? success(response.data) : success(response);
                }
              });
            }
          });
        }
        if(errorCallbacks && angular.isArray(errorCallbacks) && promise && promise.catch) {
          angular.forEach(errorCallbacks, function(error) {
            if(error && angular.isFunction(error)) {
              promise.catch(error);
            }
          });
        }
        return promise;
      };

      /**
      Execute the HTTP request by calling angular's $http service. If offline caching is enabled it will "fake" a response from the
      $http service and return the data from the cache (if there is data available for that request). If the data hasn't been cached
      then it will make the request to the server and cache the response for later
      @method send
      @param {Object} req Object representing the configuration of the request to make
      @returns {Promise} returns the same promise returned by $http but with all success and error callbacks subscribed to it
      */
      HttpClient.prototype.send = function(req) {
        var _req = req || {}, request, dataKey = [this.user, req.url, $helpers.getQueryString(req.params)], data = undefined;
        if(this.useOfflineCache) {
          data = $cache.store(dataKey);
        }

        if(data) {
          if(req.transformResponse && angular.isArray(req.transformResponse)) {
            angular.forEach(req.transformResponse, function(transform) {
              data = transform(data);
            });
          }
          request = $q(function(resolve, reject) {
            resolve(data);
          });
        } else {
          //Setup a response transformation to cache the response
          request = $http(_req);
          if(_req.method === "GET") {
            request.then(function(response) {
              $cache.store(dataKey, data);
            });
          }
        }

        return this.applyCallbacks(request, _req.success, _req.error);
      };


      /**
      Runs a chain of {Function} sending them the request object as an argument so they can mutate it, where every
      function in the chain gets the result of the previous function.
      @method interceptRequest
      @param {Object} the request configuration object, which is passed to the first function in the chain
      @param {Array} chain of {Function} objects to execute
      @returns {Object} the result of running the entire chain
      */
      HttpClient.prototype.interceptRequest = function(request, requestInterceptors) {
        var _request = request;
        angular.forEach(requestInterceptors, function(interceptor) {
          _request = interceptor(_request);
        });
        return _request;
      };

      /**
      Sends an AJAX request. Builds the request, sends it and returns a promise.
      @method ajax
      @param {Object} options configuration Object similar to what is passed to the $http service
      @returns {Promise}
      */
      HttpClient.prototype.ajax = function(options) {
        var opts = options || {},
            method = opts.method,
            url = opts.url,
            params = opts.params,
            headers = opts.headers,
            data = opts.data,
            success = opts.success,
            error = opts.error,
            before = opts.before,
            withCredentials = opts.withCredentials,
            requestTransformations = opts.requestTransformations,
            responseTransformations = opts.responseTransformations,
            requestInterceptors = opts.requestInterceptors;

        var request = this.buildRequest(method, url, params, headers, data, success, error, withCredentials, requestTransformations, responseTransformations);
        request = this.interceptRequest(request, requestInterceptors);

        return this.send(request);
      };

      /**
      Execute a GET request
      @method get
      @param {Object} options options to configure the request to make
      @returns {Promise}
      */
      HttpClient.prototype.get = function(options) {
        var opts = angular.extend({}, options, { method: "GET" });
        return this.ajax(opts);
      };

      /**
      Execute a POST request
      @method post
      @param {Object} options options to configure the request to make
      @returns {Promise}
      */
      HttpClient.prototype.post = function(options) {
        var opts = angular.extend({}, options, { method: "POST" });
        return this.ajax(opts);
      };

      /**
      Execute a PUT request
      @method put
      @param {Object} options options to configure the request to make
      @returns {Promise}
      */
      HttpClient.prototype.put = function(options) {
        var opts = angular.extend({}, options, { method: "PUT" });
        return this.ajax(opts);
      };

      /**
      Execute a PATCH request
      @method patch
      @param {Object} options options to configure the request to make
      @returns {Promise}
      */
      HttpClient.prototype.patch = function(options) {
        var opts = angular.extend({}, options, { method: "PATCH" });
        return this.ajax(opts);
      };

      /**
      Execute a DELETE request
      @method delete
      @param {Object} options options to configure the request to make
      @returns {Promise}
      */
      HttpClient.prototype.delete = function(options) {
        var opts = angular.extend({}, options, { method: "DELETE" });
        return this.ajax(opts);
      };

      return {
        /**
        Creates an instance of {HttpClient} given a configuration Object
        @method create
        @param {Object} options configuration options for creating a new HttpClient
        @returns {HttpClient}
        */
        create: function(options) {
          return new HttpClient(options);
        }
      }

    }]);

})(angular);

(function(angular) {

  /**
  Factory that creates MockServer instances. A MockServer simulates the AJAX calls usually sent to a backend server
  by a Model instance, returning fake data in order to allow offline development.
  @module AP
  @submodule adapter
  @class $mockServerFactory
  */
  angular.module("AP.adapter")
    .factory("$mockServerFactory", ["$q", "$helpers", function($q, $helpers) {

      /**
      MockServer Constructor
      @class MockServer
      @constructor
      */
      function MockServer() {}

      angular.extend(MockServer.prototype, {

        /**
        Extract the id value from a url, for example given "http://localhost/api/v1/people/1u987s"
        the result would be "1u987s"
        @method getInstanceIdFromUrl
        @param {String} url the url to extract the id from
        @returns {String} url the id
        */
        getInstanceIdFromUrl: function(url) {
          var id = "";
          if(url) {
            var lastSlashIndex = url.lastIndexOf("/");
            var queryStringStartIndex = url.indexOf("?");
            queryStringStartIndex = (queryStringStartIndex == -1) ? url.length : queryStringStartIndex;
            var start = lastSlashIndex + 1;
            var length = queryStringStartIndex - start;
            id = url.substr(start, length);
          }
          return id;
        },

        /**
        Given a Model and an id, it creates a complete instance of a that Model, as to simulate
        a GET request for a single element, where sending ```GET { id: 1 }```, would usually return something like ```{ id: 1, name: "John", age: 30 }```.
        The reason it takes an id is to keep consistency, so the returned instance has the same id that was searched.
        @method getInstance
        @param {Model} model the model to create an instance of
        @param {String} id the id for the instance calling GET
        @returns {Object} representation of a JSON response contaning a single instance
        */
        getInstance: function(model, id) {
          var instance = this.generateDataForInstance(model);
          var keyField = $helpers.find(model.fields, function(field) {
            return field.key;
          });
          if(keyField && keyField.name) {
            var name = keyField.name;
            instance[name] = id;
          }
          return instance;
        },

        /**
        Given an Object containing the data sent by a POST request, it completes that data with every field that
        is defined as auto as those values would usually be filled in by the backend.
        @method completeAutoFieldsForInstance
        @param {Model} model the model service that holds the fields descriptions for the instance
        @param {Object} instance the request data sent in a POST
        @returns {Object} the same data with auto fields filled in
        */
        completeAutoFieldsForInstance: function(model, instance) {
          var autoFields = {};
          if(angular.isObject(model) && angular.isObject(instance)) {
            angular.forEach(model.fields, function(field) {
              if(field.auto) {
                autoFields[field.name] = this.randomDataForField(field);
              }
            }, this);
            angular.extend(instance, autoFields);
          }
          return instance;
        },

        /**
        Generates random data for an instance of a given Model based of its defined fields
        @method generateDataForInstance
        @param {Model} model the Model for which the data is generated
        @returns {Object} the data for the instance
        */
        generateDataForInstance: function(model) {
          model = model || {};
          var fields = model.fields,
              data = {};
          if(angular.isArray(fields)) {
            angular.forEach(fields, function(field) {
              data[field.name] = this.randomDataForField(field);
            }, this);
          }
          return data;
        },

        /**
        Generates a response for an Object Query Scope, basically an Array of a specified length with fake instances of that Model.
        If no length is passed then it will create 3 instances in the Array
        @method generateDataForObjectQueryScope
        @param {Model} model the model to which the query scope belongs to
        @param {Number} length the amount of instances wanted in the response
        @returns {Object[]}
        */
        generateDataForObjectQueryScope: function(model, length) {
          var model = model || {}, len = length || 3, data = [];
          for(var i=0 ; i < len ; i++) {
            var instanceData = this.generateDataForInstance(model);
            data.push(instanceData);
          }
          return data;
        },

        /**
        Generates a response for an Aggregate Query Scope, that is, an Array with a single Object that contains the
        with the aggregate field for that query scope and a generated value for that aggregate field
        @method generateDataForAggregateQueryScope
        @param {Model} model the Model service to which the aggregate query scope belongs to
        @param {String} aggregateField the name of the aggregate field for this Aggregate Query Scope
        @returns {Object[]}
        */
        generateDataForAggregateQueryScope: function(aggregateField) {
          var aggregateField = aggregateField || "id", data = [{}];
          data[0][aggregateField] = this.randomDataForField({ type: "integer" });
          return data;
        },

        /**
        Given a field definition for a Model, it generates a random value for that field
        @method randomDataForField
        @param {Object} field field definition
        @returns {Number}/{String} depending on the field type
        */
        randomDataForField: function(field) {
          field = field || {};
          var type = field.type;
          switch(type) {
            case "string":
              return $helpers.uniqueId(name + "_");
            case "integer":
              return $helpers.randomNumber();
            case "boolean":
              return (Math.random() * 100) < 50;
            case "float":
              return (Math.random() * 1000000000);
            case "date":
            case "time":
              return (new Date()).toISOString();
            case "array":
              return [$helpers.randomNumber(), $helpers.randomNumber(), $helpers.randomNumber()];
            case "hash":
              return {
                "field1": $helpers.uniqueId("field1"),
                "field2": $helpers.uniqueId("field2"),
                "field3": $helpers.uniqueId("field3")
              }
          }
        },

        /**
        Handles what response to generate for a request, depending on the verb (GET, POST, etc.) and
        on whether the request is for an instance or if its a query scope
        @method mockDataForRequest
        @param {String} method the HTTP verb of the request
        @param {Model} model the Model instance that triggered the request
        @param {Object} options request options
        @returns {Object[]}/{Object} the fake resonse for the request
        */
        mockDataForRequest: function(method, model, options) {
          if(!angular.isObject(model)) {
            // Here we will fake authentication
            return null;
          }

          var data = options.data;
          var params = options.params;
          var scope = (params) ? params.scope : undefined;

          if(!scope) {
            if(method === "post") {
              return this.completeAutoFieldsForInstance(model, data);
            }
            if(method === "put" || method === "patch") {
              return data;
            }
            if(method === "get") {
              var id = this.getInstanceIdFromUrl(options.url);
              return this.getInstance(model, id);
            }
          }

          if(scope) {
            var scopeDefinition = $helpers.find(model.scopes, function(query_scope) {
              return query_scope.name == scope;
            });
            if(scopeDefinition.type === "ObjectQueryScope") {
              return this.generateDataForObjectQueryScope(model);
            } else if(scopeDefinition.type === "AggregateQueryScope") {
              return this.generateDataForAggregateQueryScope(scopeDefinition.aggregateField);
            }
          }
        },

        /**
        Applies transformations to the fake response, simulating what the HttpClient would do.
        @method transformResponse
        @param {Object[]}/{Object} response the fake response generated by the MockServer
        @param {Function[]} transformations list of transfomations to apply to the response
        @returns transformed data (could be of any type depending on what the transformations do)
        */
        transformResponse: function(response, transformations) {
          var returnValue = response;
          if(angular.isObject(response) && angular.isArray(transformations)) {
            angular.forEach(transformations, function(transformation) {
              returnValue = transformation(returnValue);
            });
          }
          return returnValue;
        },

        /**
        Handles all responses for the MockServer. It decides if data should be mocked for a request, applies transformations,
        and creates a Promise to return as a result of the fake AJAX call. This promised is resolved immediately, so error callbacks
        added to the Promise will not be called.
        @method respondTo
        @param {String} method the HTTP verb for the request
        @param {Model} model the Model service being synced with the server
        @param {Object} options request options
        @returns {Promise}
        */
        respondTo: function(method, model, options) {
          var responseData, transformedResponse, promise;
          if(method !== "delete") {
            responseData = this.mockDataForRequest(method, model, options);
          }
          transformedResponse = this.transformResponse(responseData, options.responseTransformations);
          promise = $q(function(resolve, reject) {
            resolve({
              status: 200,
              data: transformedResponse,
              headers: options.headers,
              config: options,
              statusText: "OK"
            });
          });
          // we add a success method because Promises in angular don't have it and yet the ones returned
          // by $http add a success method as a convenience
          promise.success = function(fn) {
            promise.then(function(response) {
              fn(response.data, response.status, response.headers, response.config);
            });
            return promise;
          };
          // we add an error method because Promises in angular don't have it and yet the ones returned
          // by $http add an error method as a convenience
          promise.error = function(fn) {
            promise.catch(function(response) {
                fn(response.data, response.status, response.headers, response.config);
            });
            return promise;
          };

          return promise;
        },

        /**
        @method get
        @param {Model} model the Model service being synced with the server
        @param {Object} options request options
        @returns {Promise}
        */
        get: function(model, options) {
          return this.respondTo("get", model, options);
        },

        /**
        @method post
        @param {Model} model the Model service being synced with the server
        @param {Object} options request options
        @returns {Promise}
        */
        post: function(model, options) {
          return this.respondTo("post", model, options);
        },

        /**
        @method put
        @param {Model} model the Model service being synced with the server
        @param {Object} options request options
        @returns {Promise}
        */
        put: function(model, options) {
          return this.respondTo("put", model, options);
        },

        /**
        @method patch
        @param {Model} model the Model service being synced with the server
        @param {Object} options request options
        @returns {Promise}
        */
        patch: function(model, options) {
          return this.respondTo("patch", model, options);
        },

        /**
        @method delete
        @param {Model} model the Model service being synced with the server
        @param {Object} options request options
        @returns {Promise}
        */
        delete: function(model, options) {
          return this.respondTo("delete", model, options);
        }

      });


      return {
        /**
        Creates a MockServer instance
        @method create
        @returns {MockServer}
        */
        create: function() {
          return new MockServer();
        }
      }

    }]);

})(angular);

(function(angular) {

  /**
  This factory creates {Adapter} objects. An Adapter represents a connection to an API, and it is meant to handle how to configure an HttpClient
  in order to connect to its API. By default, an Adapter does nothing more than pass on the options for requests down to an HttpClient, but its
  methods can easily be overrided to achieve custom behaviour.
  Also, an Adapter instance can choose whether to send requests through its HttpClient or through its MockServer instance, in such funcionality
  has been enabled.

  @module AP
  @submodule adapter
  @class $adapterFactory
  */
  angular.module("AP.adapter")
    .factory("$adapterFactory", ["$httpClientFactory", "$mockServerFactory", "$cache", "$q", "$helpers", "$http", function($httpClientFactory, $mockServerFactory, $cache, $q, $helpers, $http) {

      /**
      Adapter Constructor
      @class Adapter
      @constructor
      @param {Object} options configuration options for Adapter constructor
      */
      function Adapter(options) {
        /**
        @property useMockServer
        @type {Boolean}
        */
        this.useMockServer = false;

        var opts = options || {};

        /**
        @property $restClient
        @type {HttpClient}
        */
        this.$restClient = $httpClientFactory.create(opts);
        /**
        @property $mockServer
        @type {MockServer}
        */
        this.$mockServer = $mockServerFactory.create();
      }

      /**
      Returns a request transformation depending on whether the model has fields that are of type file or not. When files are
      present, the transformation returned will give back FormData with the data, else the data will just be returned as is.
      @method encodeDataTransformation
      @param {Object} the data to transform
      @param {Array} an array containing the name of all the file fields in the model (empty if none present)
      @returns {Function} request transformation to apply to the request
      */
      Adapter.encodeDataTransformation = function(data, fileFieldNames) {
        var $data = angular.extend({}, data), fileFields = {};
        if(fileFieldNames && fileFieldNames.length) {
          var formData = new FormData();
          angular.forEach(fileFieldNames, function(name) {
            fileFields[name] = $data[name];
            delete $data[name];
          });
          angular.forEach($data, function(value, name) {
            formData.append(name, String(value));
          });
          angular.forEach(fileFields, function(file, name) {
            formData.append(name, file);
          });
          return function() {
            return formData;
          };
        }
        return function(data) {
          return data;
        };
      };

      /**
      Setting the base url for an adapter will change the base url in the Adapter's HttpClient, so all requests will be directed
      to the new url.
      @method setBaseUrl
      @param {String} url the new url to use as base of the API
      @returns {Void}
      */
      Adapter.prototype.setBaseUrl = function(url) {
        if(url && typeof url === "string") {
          this.$restClient.url = url;
        }
      };

      /**
      Returns an array containing the names of all the fields in the given model that are of type file,
      or an empty array if none are present.
      @method getModelFileFields
      @param {Object} the model to which the fields belong
      @returns {Array} the array of field names
      */
      Adapter.prototype.getModelFileFields = function(model) {
        var fileFields = [];
        angular.forEach(model.fields, function(field) {
          if(field.type === "file") {
            fileFields.push(field.name);
          }
        });
        return fileFields;
      };

      /**
      Given an array of transformations to apply to a request, it will return a new array containing Angular's default request transformations
      with the passed transformations appended to its tail.
      @method appendToDefaultRequestTransformations
      @param {Array} array of transformations to add to the default ones
      @returns {Array} the concatenation of both default transformations and passed transformations
      */
      Adapter.prototype.appendToDefaultRequestTransformations = function(transformations) {
        var defaults = $http.defaults.transformRequest;
        if(transformations && transformations.length) {
          return defaults.concat(transformations);
        }
        return defaults;
      };

      /**
      Given an array of transformations to apply to a response, it will return a new array containing Angular's default resṕonse transformations
      with the passed transformations appended to its tail.
      @method appendToDefaultRequestTransformations
      @param {Array} array of transformations to add to the default ones
      @returns {Array} the concatenation of both default transformations and passed transformations
      */
      Adapter.prototype.appendToDefaultResponseTransformations = function(transformations) {
        var defaults = $http.defaults.transformResponse;
        if(transformations && transformations.length) {
          return defaults.concat(transformations);
        }
        return defaults;
      };

      /**
      Sends an ajax request for a Model instance. Here the Adapter routes the request to the HttpClient or the MockServer.
      @method ajax
      @param {String} method HTTP verb (GET, POST, PUT, PATCH or DELETE)
      @param {Model} model a Model executing the request, for example $person or $employee (this is not a specific resource but the Model service)
      @param {Object} options request options
      @returns {Promise} the promise obtained from either HttpClient or MockServer doing an AJAX request
      */
      Adapter.prototype.ajax = function(method, model, options) {
        var promise = undefined;
        if(this.useMockServer) {
          promise = this.$mockServer[method](model, options);
        } else {
          promise = this.$restClient[method](options);
        }
        return $q(function(resolve, reject) {
          promise
          .then(function(response) {
            resolve(response.data);
          })
          .catch(function(err) {
            reject(err);
          });
        });
      };

      /**
      Handles the create action on a Model

      @method create
      @param {Model} the model service to get the url from and to send to the ajax method of the adapter
      @param {Object} the data to send in the request for creation
      @returns {Promise} the promise object returned by the ajax method
      */
      Adapter.prototype.create = function(model, data) {
        var attributes = angular.extend({}, data);
        var fileFields = this.getModelFileFields(model);
        var headers = (fileFields.length) ? {'Content-Type': undefined} : {};
        return this.ajax("post", model, {
          url: model.url,
          data: attributes,
          headers: headers,
          requestTransformations: [Adapter.encodeDataTransformation(attributes, fileFields)],
          responseTransformations: this.appendToDefaultResponseTransformations([
              function(response) {
                if(response instanceof Object) {
                  angular.extend(data, response);
                }
                return response;
              }
            ]
          )
        });
      };

      /**
      Handles the update action on a Model

      @method update
      @param {Model} the model service to get the url from and to send to the ajax method of the adapter
      @param {Object} the data to update in the server
      @returns {Promise} the promise object returned by the ajax method
      */
      Adapter.prototype.update = function(model, data) {
        var attributes = angular.extend({}, data);
        var fileFields = this.getModelFileFields(model);
        var headers = (fileFields.length) ? {'Content-Type': undefined} : {};
        return this.ajax("put", model, {
          url: model.url + "/" + attributes.id,
          data: attributes,
          headers: headers,
          requestTransformations: [Adapter.encodeDataTransformation(attributes, fileFields)],
          responseTransformations: this.appendToDefaultResponseTransformations([
              function(response) {
                if(response instanceof Object) {
                  angular.extend(data, response);
                }
                return response;
              }
            ]
          )
        });
      };

      /**
      Handles the read action on a Model

      @method read
      @param {Model} the model service to get the url from and to send to the ajax method of the adapter
      @param {Object} options object containing the id of the instance being read from the server
      @returns {Promise} the promise object returned by the ajax method
      */
      Adapter.prototype.read = function(model, options) {
        return this.ajax("get", model, {
          url: model.url + "/" + options.id,
          responseTransformations: this.appendToDefaultResponseTransformations([angular.bind(model, model.createResource)])
        });
      };

      /**
      Handles the delete action on a Model

      @method delete
      @param {Model} the model service to get the url from and to send to the ajax method of the adapter
      @param {Object} the data containing the id of the instance to delete
      @returns {Promise} the promise object returned by the ajax method
      */
      Adapter.prototype.delete = function(model, data) {
        return this.ajax("delete", model, {
          url: model.url + "/" + data.id
        });
      };

      /**
      Handles query scope requests on a Model

      @method query
      @param {Model} the model service to get the url from and to send to the ajax method of the adapter
      @param {String} the name of the query scope to execute
      @param {Object} the configuration of the query to send as query scope params
      @param {Function} callback to be executed if the request is successful
      @param {Function} callback to be executed in the event of an error
      @returns {Array}/{Object} an empty array or an object with an empty value field (an array for object query scopes, and an object for aggregate query scope)
                  that will be populated when the data comes back from the server
      */
      Adapter.prototype.query = function(model, scope, query, success, error) {
        var resource = undefined;
        var scopeDefinition = $helpers.find(model.scopes, function(definition) {
          return definition.name == scope;
        });
        if(scopeDefinition) {
          var type = scopeDefinition.type,
              queryData = this.buildParams(scope, query || {}),
              transformations = [];

          if(type === "ObjectQueryScope") {
            resource = [];
            transformations = [
              angular.bind(model, model.createCollection),
              function(data) {
                if(angular.isArray(data)) {
                  Array.prototype.push.apply(resource, data);
                }
                return data;
              }
            ];
          } else if(type === "AggregateQueryScope") {
            var aggregateField = scopeDefinition.aggregateField;
            resource = {value: undefined};
            transformations = [
              function(data) {
                if(data && angular.isArray(data) && data.length > 0 && aggregateField) {
                  data = data[0][aggregateField];
                }
                return data;
              },
              function(data) {
                resource.value = data;
                return resource;
              }
            ];
          }

          this.ajax("get", model, {
            url: model.url,
            params: queryData,
            success: success,
            error: error,
            responseTransformations: this.appendToDefaultResponseTransformations(transformations)
          });
        }
        return resource;
      };

      /**
      Formats the query attributes like so:
      {
        query: {
          name: "John",
          age: 30
        }
      }
      >>>> INTO >>>>
      {
        "query[name]": "John",
        "query[age]": 30
      }

      To accomodate to the query string params expected by AP backend services

      @method mapQueryParams
      @param {Object} the query configuration for a query scope
      @returns {Object} the changed version of the configuration object
      */
      Adapter.prototype.mapQueryParams = function(data) {
        var key, query, value;
        query = {};
        for (key in data) {
          value = data[key];
          if (value || value===0) {
            query["query[" + key + "]"] = value;
          }
        }
        return query;
      };

      /**
      Formats an Object to send as request parameters of a query scope
      @method buildParams
      @param {String} the name of the scope
      @param {Object} the attributes for the query
      @returns {Object} key/value pairs for query string parameters name/values
      */
      Adapter.prototype.buildParams = function(scopeName, data) {
        var query = { scope: scopeName };
        if(angular.isObject(data)) {
          angular.extend(query, this.mapQueryParams(data.query));
          query.limit = data.limit;
          query.offset = data.offset;
        }
        return query;
      };

      return {
        /**
        Creates an Adapter instance
        @method create
        @param {Object} options configuration options for the request instance
        @returns {Adapter}
        */
        create: function(options) {
          return new Adapter(options);
        }
      }

    }]);

})(angular);

(function(angular) {

  /**
  Factory that creates http adapters. An http adapter works almost the same as a regular adapter, only it allows some extra features like value interpolation.
  Unlike a regular adapter, which delegates configurations like headers, params, etc to an http client instance, an http adapter handles those configurations
  manually. This is because most of the configuration values can have placeholders {{}} for interpolation, so the http adapter will first interpolate all the values,
  build the request object itself (instead of letting the http client do it) and send everything to the http client once its built.

  @module AP
  @submodule adapter
  @class $httpAdapterFactory
  */
  angular.module("AP.adapter")
    .factory("$httpAdapterFactory", ["$adapterFactory", "$convertions", function($adapterFactory, $convertions) {

      function create(options) {
        /**
        The http adapter does not have a class constructor it is quite simply a regular adapter with extra behaviour attached to it
        */
        var httpAdapter = $adapterFactory.create();

        angular.extend(httpAdapter, {

          /**
          @property config
          @type {Object} a configuration object for the http adapter. Its configurable values include things like base url, default headers and query string params, etc.
          */
          config: options,

          /**
          @property interpolationRegexp
          @type {RegExp} regular expression used to find the string "{{}}" within another string. This enables interpolation.
          */
          interpolationRegexp: /{{([^{}]*)}}/g,

          /**
          @method interpolate
          @param {String} the string to interpolate values into
          @param {Object} the interpolation context from which the interpolated values are taken from (i.e. str "{{myId}}" with context {myId: 1})
          @returns {String} a new string copied from "str" but with interpolated values into it
          */
          interpolate: function interpolate(str, context) {
              /**
               * Interpolate strings using {{}} notation
               */
              var resultStr = str.replace(this.interpolationRegexp, function(match, capture) {
                var trimmedCapture = capture.trim();
                var fields = trimmedCapture.split(".");
                var replacementValue = context;
                var field = undefined;
                if(fields && fields.length) {
                    for(var i= 0; i<fields.length; i++) {
                        if(replacementValue === undefined) {
                            break;
                        }
                        field = fields[i];
                        replacementValue = replacementValue[field];
                    }
                    return (replacementValue !== undefined) ? replacementValue : "";
                } else {
                    return "";
                }
              });
              return resultStr;
          },

          /**
          Takes the appropiate adapter configuration from a Model based on the name of an action passed as an argument. For example if we wanted the adapter
          configuration for the action "create" of the Model "Person" it would return that adapter configuration object. In the case of adapter configurations for
          query scopes, the method will first look for an action with the name given and if none is found by that name then it will attempt to find a query scope
          with that name.

          @method getConfiguration
          @param {Model} the model service from which the adapter configuration is taken
          @param {String} the name of the action within the model whose configuration
          @returns {Object} the adapter configuration from model for the given action
          */
          getConfiguration: function(model, action) {
            var config = undefined;
            if(model) {
              config = model.adapterConfigurations[action];
              if(!config) {
                config = model.adapterConfigurations.scopes[action];
              }
            }
            return config;
          },

          /**
          Helper method. It evaluates a string that contains a javascript object, for example the string "{id: 1, name: 'Sarah'}". Evaluating that string
          will basically create that object in memory, so the result of parsing the object above would be an object {id: 1, name: 'Sarah'}.
          This method is used to parse body payload templates in json format

          @method parseObject
          @param {String} the string to parse the object from
          @returns {Object} the result of parsing str
          */
          parseObject: function(str) {
            var result = null, parser = null, xmlDoc = null;
            if(str && typeof str === "string") {
              result = eval('('+str+')');
            }
            return result;
          },

          /**
          Creates an object with key value pairs where keys are the names of the headers to send in a request and values are the values of those headers.
          The resulting headers will be a union of the default headers set for the http adapter itself (those headers are taken from the http adapter's "config" property)
          and the headers in the adapter configuration for a specific model/action pair. Also values from the model's adapter configuration can override headers from
          the http adapter. For example, having an http adapter with this headers

          {
            "Adapter-Header-One": "foo",
            "Adapter-Header-Two": "bar"
          }

          and a model with the following adapter configuration for the "create" action

          {
            adapterConfigurations: {
              create: {
                headers: {
                  "Adpater-Header-Two": "Some-Other-Stuff",
                  "Custom-Header": "Hello"
                }
              }
            }
          }

          the resulting object will be

          {
            "Adapter-Header-One": "foo",
            "Adapter-Header-Two": "Some-Other-Stuff",
            "Custom-Header": "Hello"
          }

          Also, any and all headers, from the http adapter or the model's adapter configuration can have values with the "{{}}" placeholder

          @method buildHeaders
          @param {Object} an adapter configuration for some action on some Model (which adapter configuration in which Model is irrelevant)
          @param {Object} an object to act as interpolation context in the event that some header values require interpolated values
          @returns {Object} key/value pair object where keys are header names and values are the values for those headers
          */
          buildHeaders: function(config, context) {
            var headers = {}, iName, iValue, _this = this;
            if(this.config && this.config.headers) {
              angular.forEach(this.config.headers, function(value, name) {
                if(name && value) {
                  if(context) {
                    name = _this.interpolate(name, context);
                    value = _this.interpolate(value, context);
                  }
                  headers[name] = value;
                }
              });
            }
            if(config) {
              angular.forEach(config.headers, function(value, name) {
                if(name && value) {
                  if(context) {
                    name = _this.interpolate(name, context);
                    value = _this.interpolate(value, context);
                  }
                  headers[name] = value;
                }
              });
            }
            return headers;
          },

          /**
          Creates an Object where keys are query string parameters's name and their corresponding value. Like with headers the resulting Object will inlcude params
          from the http adapter's default params as well as params from the adapter configuration passed as an argument. The adapter configuration's params can override
          the default configuration in the http adapter. (See the example in "buildHeaders" as it works the same way).

          Params can have interpolation placeholders "{{}}" so values will be interpolated in

          @method buildParams
          @param {Object} an adapter configuration for some action on some Model (which adapter configuration in which Model is irrelevant)
          @param {Object} an object to act as interpolation context in the event that some header values require interpolated values
          @returns {Object} key/value pair object where keys are query string parameter names and values are the values for those parameters
          */
          buildParams: function(config, context) {
            var params = {}, iName, iValue, _this = this;
            if(this.config && this.config.params) {
              angular.forEach(this.config.params, function(value, name) {
                if(name && value) {
                  if(context) {
                    name = _this.interpolate(name, context);
                    value = _this.interpolate(value, context);
                  }
                  params[name] = value;
                }
              });
            }
            if(config && config.params) {
              angular.forEach(config.params, function(value, name) {
                if(name && value) {
                  if(context) {
                    name = _this.interpolate(name, context);
                    value = _this.interpolate(value, context);
                  }
                  params[name] = value;
                }
              });
            }
            return params;
          },

          /**
          Creates a full url from the url in the http adapter's config object and the incrementalPath taken from an adapter configuration passed
          as an argument. Also interpolates values into that full url if "{{}}" placeholders are present in the url.

          @method buildUrl
          @param {Object} an adapter configuration for some action on some Model (which adapter configuration in which Model is irrelevant)
          @param {Object} an object to act as interpolation context in the event that some header values require interpolated values
          @returns {String} the full url where the request will be sent to
          */
          buildUrl: function(config, context) {
            var url = "";
            if(this.config && this.config.url) {
              url += this.config.url;
            }
            if(config && config.incrementalPath) {
              url += config.incrementalPath;
            }
            if(context) {
              url = this.interpolate(url, context);
            }
            return url;
          },

          /**
          Creates an object to send as a request's data. The data object is created from the request field mappings defined in the adapter configuration
          passed as an argument. It also supports value interpolation in the mappings.
          This method is used whenever a body payload template is not specified for the adapter configuration argument.
          Request field mappings map the fields from the recieved context to another name.
          For example, given the following request field mappings:
            {
              id: "foo",
              name: "bar",
              age: "{{name}}"
            }
          And a context:
            {
              id: 1,
              name: "Helen",
              age: 30
            }
          It will yield the following data object to send in the request:
            {
              foo: 1,
              bar: "Helen",
              Helen: 30
            }
          If the format of the request is xml then that final object will be converted to an xml string with this structure
          The value if the field "objectNameMapping" is used as a top level node in this case
          Assuming an objectNameMapping = "person"

          <person>
            <foo>1</foo>
            <bar>Helen</bar>
            <Helen>30</Helen>
          </person>

          @method buildRequestMappings
          @param {Object} an adapter configuration for some action on some Model (which adapter configuration in which Model is irrelevant)
          @param {Object} an object to act as interpolation context in the event that some header values require interpolated values
          @returns {Object}/{String} the object to send as data within the request or an xml string version of that same object
          */
          buildRequestMappings: function(config, context) {
            var data = {}, mappedName, _this = this;
            if(config && config.requestFieldLevelMappings) {
              angular.forEach(config.requestFieldLevelMappings, function(mapping, name) {
                if(context) {
                  var interpolationResult = undefined;
                  interpolationResult = _this.interpolate(mapping, context);
                  if(interpolationResult && interpolationResult != "") {
                    mapping = interpolationResult;
                  }
                }
                data[mapping] = context[name];
              });
            }

            if(config.format === "xml") {
              data = $convertions.objectToXml(config.objectNameMapping, data);
            }

            return data;
          },

          /**
          Creates the data to send in a request out of a body payload template in the adapter configuration passed as a parameter.
          Unlike "buildRequestMappings" the structure of the resulting object is defined by the template itself and all that is done
          is interpolating values into that template.
          If the format of the request is json then once values are interpolated in the template string will be parsed into an actual
          object literal to send as data. If its xml then the returned data will be a string.

          @method buildBodyPayload
          @param {Object} an adapter configuration for some action on some Model (which adapter configuration in which Model is irrelevant)
          @param {Object} an object to act as interpolation context in the event that some header values require interpolated values
          @returns {Object}/{String} the object literal to send as data (json) or the xml string to send as data (xml)
          */
          buildBodyPayload: function(config, context) {
            var bodyPayload = null;
            if(config && config.bodyPayload && config.bodyPayload !== "") {
              bodyPayload = config.bodyPayload;
              if(context) {
                bodyPayload = this.interpolate(bodyPayload, context);
              }
              if(config.format === "json") {
                bodyPayload = this.parseObject(bodyPayload);
              }
            }
            return bodyPayload;
          },

          /**
          Creates the entire request configuration to pass to the {HttpClient} to be sent to the server. It builds the request headers, query string parameters,
          url, data and adds the appropiate content type header according to the format of the request. The created request is based on both the http adapter's
          config object and the adapter configuration passed as an argument.

          @method buildRequest
          @param {Object} an adapter configuration for some action on some Model (which adapter configuration in which Model is irrelevant)
          @param {Object} an object to act as interpolation context in the event that some header values require interpolated values
          @returns {Object} a request configuration object to pass to an {HttpClient}
          */
          buildRequest: function(config, context) {
            var request = {}, headers = {}, params = {}, data = {}, url, method;
            headers = this.buildHeaders(config, context);
            params = this.buildParams(config, context);
            url = this.buildUrl(config, context);
            method = config.httpVerb;
            if(method !== "GET") {
              if(config.bodyPayload && config.bodyPayload != "") {
                data = this.buildBodyPayload(config, context);
              } else {
                data = this.buildRequestMappings(config, context);
              }
            }
            switch(config.format) {
              case "xml":
                headers["Content-Type"] = "application/xml";
                break;
              case "form_encoded":
                headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
                break;
              case "json":
              default:
                headers["Content-Type"] = "application/json";
                break;
            }
            request = {
              method: method,
              url: url,
              headers: headers,
              params: params,
              data: data
            }
            return request;
          },

          /**
          Evaluates an XPath or JSONPath expression on a response data object. Whether the path selector is XPath or JSONPath is infered from
          the format of the adapter configuration that is passed along with the response data.
          This feature requires external libraries (both included with the SDK):
            for JSON  -> jsonPath
            for XML   -> wicked-good-xpath

          @method getPathFromSelector
          @param {Object} an object holding some response data from the server
          @param {Object} an adapter configuration for some action on some Model (which adapter configuration in which Model is irrelevant)
          @returns {Array}/{XPathResult} An array of javascript objects which are the result of evaluating the expression (in the case of json) or an
                        {XPathResult} object (in case of xml)
          */
          getPathFromSelector: function(response, config) {
            var selectedPath = undefined, selector=undefined;
            if(response && config) {
              if(config.pathSelector === "") {
                if(config.format == "json") {
                  selector = "$..";
                } else if(config.format == "xml") {
                  selector = "/";
                }
              } else {
                selector = config.pathSelector;
              }
              if(config.format === "xml") {
                //evaluate XPath expression
                //document.evaluate must be available for this kind of expressions (for Internet Explorer you need to use wicked-good-xpath)
                if(document.evaluate) {
                  selectedPath = document.evaluate(selector, response);
                }
              } else if(config.format === "json") {
                //evaluate JSONPath expression
                if(window.jsonPath) {
                  selectedPath = jsonPath(response, selector);
                }
              }
            }
            return selectedPath;
          },

          /**
          Analogous to "buildRequestMappings" but used to map the values recieved from a response into the fields of a context.
          The response mappings do NOT allow interpolation on the mapping name, however you can set an XPath or JSONPath expression
          as a mapping so you can select any fragment of the response to map to a field.
          In the case of an XML response, and response field mappings with XPath expressions, the result of evaluating the XPath expression
          is not a text node, the value of the mapped field will be a string representation of the node structure.
          For example:

            If the response is:

            <person>
              <name>John</name>
              <description>
                <short>A short version of the description</short>
                <large>
                  A much larger description going in depth...
                </large>
              </description>
            </person>

            and the following response mappings:

            {
              name: "/person/name/text()",
              description: "/person/description"
            }

            The resulting object will be:

            {
              name: "John",
              description: "<short>A short version of the description</short><large>A much larger description going in depth...</large>"
            }

            The selected response passed as a first argument is the result of evaluating the pathSelector in the adapter configuration
            on the full response from the server.
            There are two levels of expression evaluation:
              1) The pathSelector, specified in the adapter configuration, is evaluated on the actual response from the server and
                  returns just a fragment/s of the entire response
              2) Out of that fragment/s gotten from the first evaluation, if any response field mappings have expressions as mappings, then that
                  expression is evaluated on the fragment/s of the response not the entire response (unless the fragment is equal to the entire response)


            @method mapResponse
            @param {Object} the selected response after evaluating the "pathSelector" on the entire response
            @param {Object} an adapter configuration for some action on some Model (which adapter configuration in which Model is irrelevant)
            @returns {Object} data to use in a Model instance or {Resource} object
          */
          mapResponse: function(selectedResponse, config) {
            var mapped = {}, _this = this;
            if(selectedResponse && config && config.responseFieldLevelMappings) {
              angular.forEach(config.responseFieldLevelMappings, function(mappingValue, mappingName) {
                var mappedExpression = mappingValue;
                var selectedResponseFirstElement = undefined;
                // IF XML...
                if(config.format === "xml" && document.evaluate) {
                  if(selectedResponse) {
                    mappedExpression = (document.evaluate(mappedExpression, selectedResponse)).iterateNext();
                  }
                  // If the response is an xml node then covert it to a string
                  if(mappedExpression) {
                    mappedExpression = $convertions.xmlToString(mappedExpression);
                  }
                }
                // IF JSON
                else if(config.format === "json" && window.jsonPath) {
                  mappedExpression = jsonPath(selectedResponse, mappedExpression);
                  if(mappedExpression && mappedExpression instanceof Array) {
                    mappedExpression = mappedExpression[0];
                  }
                }
                mapped[mappingName] = mappedExpression;
              });
            }
            return mapped;
          },

          /**
          Handles the response for single element actions (i.e. create, update, etc).
          It evaluates the "pathSelector" from the adapter configuration passed as an argument on the response passed as an argument.
          The result from the evaluation is used as a selected response in "mapResponse".
          It will return the mapped data for that single element.

          @method handleResponse
          @param {Object} the response data coming from the server
          @param {Object} an adapter configuration for some action on some Model (which adapter configuration in which Model is irrelevant)
          @returns {Object} the mapped data for a {Resource} instance
          */
          handleResponse: function(response, config) {
            var selectedPath = undefined, mapped = undefined;
            if(config.format === "xml") {
              response = $convertions.parseXml(response);
              selectedPath = this.getPathFromSelector(response, config);
              if(selectedPath) {
                var element = selectedPath.iterateNext();
                mapped = this.mapResponse(element, config);
              }
            } else {
              selectedPath = this.getPathFromSelector(response, config);
              mapped = this.mapResponse(selectedPath[0], config);
            }
            return mapped;
          },

          /**
          Handles the response for query scopes.
          It evaluates the "pathSelector" from the adapter configuration passed as an argument on the response passed as an argument.
          The result of that evaluation should be a collection. That collection will be iterated over and for each element "mapResponse"
          will be called using that item in the collection as the selected response.
          It will return a collection of mapped data.

          @method handleQueryResponse
          @param {Object} the response data coming from the server
          @param {Object} an adapter configuration for some action on some Model (which adapter configuration in which Model is irrelevant)
          @returns {Array} collection of mapped data
          */
          handleQueryResponse: function(response, config) {
            var selectedPath, mappedCollection = [];
            if(config.format === "xml") {
              response = $convertions.parseXml(response);
              selectedPath = this.getPathFromSelector(response, config);
              if(selectedPath) {
                var _this = this;
                var element = selectedPath.iterateNext();
                while(element) {
                  mappedCollection.push(_this.mapResponse(element, config));
                  element = selectedPath.iterateNext();
                }
              }
            } else {
              selectedPath = this.getPathFromSelector(response, config);
              if(selectedPath) {
                var _this = this;
                angular.forEach(selectedPath, function(element) {
                  mappedCollection.push(_this.mapResponse(element, config));
                });
              }
            }
            return mappedCollection;
          },


          /**
          Handles the create action of a Model

          @method create
          @param {Model} the model from where the adapter configuration for the "create" action will be taken
          @param {Object} the data to send to the server for creation
          @param {Object} the interpolation context to use to build the request
          @returns {Promise} the promise returned by the adapter's ajax method
          */
          create: function(model, data, context) {
            context = context || {};
            var config = this.getConfiguration(model, "create");
            var options = this.buildRequest(config, context);
            angular.extend(options, {
              responseTransformations: [
                angular.bind(this, function(response) {
                  if(response) {
                    return this.handleResponse(response, config, context);
                  }
                }),
                function(response) {
                  if(response instanceof Object) {
                    angular.extend(data, response);
                  }
                }
              ]
            });
            method = options.method.toLowerCase();
            return this.ajax(method, model, options);
          },

          /**
          Handles the update action of a Model

          @method update
          @param {Model} the model from where the adapter configuration for the "update" action will be taken
          @param {Object} the data to send to the server for updating
          @param {Object} the interpolation context to use to build the request
          @returns {Promise} the promise returned by the adapter's ajax method
          */
          update: function(model, data, context) {
            context = context || {};
            var config = this.getConfiguration(model, "update");
            var options = this.buildRequest(config, context);
            angular.extend(options, {
              responseTransformations: [
                angular.bind(this, function(response) {
                  if(response) {
                    return this.handleResponse(response, config, context);
                  }
                }),
                function(response) {
                  if(response instanceof Object) {
                    angular.extend(data, response);
                  }
                }
              ]
            });
            method = options.method.toLowerCase();
            return this.ajax(method, model, options);
          },

          /**
          Handles the read action of a Model

          @method read
          @param {Model} the model from where the adapter configuration for the "read" action will be taken
          @param {Object} the interpolation context to use to build the request
          @returns {Promise} the promise returned by the adapter's ajax method
          */
          read: function(model, context) {
            context = context || {};
            var config = this.getConfiguration(model, "read");
            var options = this.buildRequest(config, context);
            angular.extend(options, {
              responseTransformations: [
                angular.bind(this, function(response) {
                  if(response) {
                    return this.handleResponse(response, config, context);
                  }
                }),
                angular.bind(model, model.createResource)
              ]
            });
            method = options.method.toLowerCase();
            return this.ajax(method, model, options);
          },

          /**
          Handles the delete action of a Model

          @method delete
          @param {Model} the model from where the adapter configuration for the "delete" action will be taken
          @param {Object} the interpolation context to use to build the request
          @returns {Promise} the promise returned by the adapter's ajax method
          */
          delete: function(model, context) {
            context = context || {};
            var config = this.getConfiguration(model, "delete");
            var options = this.buildRequest(config, context);
            angular.extend(options, {
              responseTransformations: [angular.bind(this, function(response) {
                if(response) {
                  return this.handleResponse(response, config, context);
                }
              })]
            });
            method = options.method.toLowerCase();
            return this.ajax(method, model, options);
          },

          /**
          Handles the query scopes for a Model

          @method query
          @param {Model} the model from where the adapter configuration for the appropiate query scope will be taken
          @param {String} the name of the query scope being executed
          @param {Object} the interpolation context to use to build the request
          @param {Function} callback to be run if the request is successful
          @param {Function} callback to be run if there is an error
          @returns {Array} an empty array that will be populated when the response comes from the server
          */
          query: function(model, scope, context, success, error) {
            context = context || {};
            var config = this.getConfiguration(model, scope);
            var options = this.buildRequest(config, context);
            var resource = [];
            angular.extend(options, {
              success: success,
              error: error,
              responseTransformations: [
                angular.bind(this, function(response) {
                  if(response) {
                    return this.handleQueryResponse(response, config);
                  }
                }),
                angular.bind(model, model.createCollection),
                function(data) {
                  if(angular.isArray(data)) {
                    Array.prototype.push.apply(resource, data);
                  }
                  return data;
                }
              ]
            });
            method = options.method.toLowerCase();
            this.ajax(method, model, options);
            return resource;
          },

        });

        return httpAdapter;
      }

      return {
        create: create
      }

    }]);

})(angular);

(function(angular) {

  /**
  Factory that creates Dispatcher instances. A Dispatcher contains the Adapter instances for a specific SDK.
  There is always one Adapter which is the default one, so when someone asks for an Adapter instance that doesn't
  exist, the Dispatcher will just return the default one.

  @module AP
  @submodule adapter
  @class $dispatcherFactory
  */
  angular.module("AP.adapter")
    .factory("$dispatcherFactory", ["$helpers", function($helpers) {

      /**
      Dispatcher Constructor
      @class Dispatcher
      @constructor
      @param {Object} options configuration options for Dispatcher constructor
      */
      function Dispatcher(options) {
        /**
        The default Adapter instance
        @property default
        @type {Adapter}
        */
        this.default = options.default;
        /**
        List of registered Adapters
        @property adapters
        @type {Object[]}
        */
        this.adapters = [];
      }

      /**
      Registers an adapter by name within the Dispatcher
      @method addAdapter
      @param {String} name the name by which this Adapter will be known and located
      @param {Adapter} adapter the Adapter instance to add
      @returns {Void}
      */
      Dispatcher.prototype.addAdapter = function(name, adapter) {
        if(name && adapter && typeof name === "string") {
            this.adapters.push({ name: name, instance: adapter});
        }
      };

      /**
      Gets a registered Adapter given a name. If no Adapter is found with that name the default one will be returned
      @method adapter
      @param {String} name the name of the wanted Adapter
      @returns {Adapter}
      */
      Dispatcher.prototype.adapter = function(name) {
        var client = null;
        client = $helpers.find(this.adapters, function(adapter) {
          return adapter.name == name;
        });

        if(!client) {
          client = this.default;
        } else {
          client = client.instance;
        }

        return client;
      };


      return {
        /**
        Creates a Dispatcher instance
        @method create
        @param {Object} options configuration options for creating a new Dispatcher
        @returns {Dispatcher}
        */
        create: function(options) {
          var dispatcher = null;
          if(options) {
            dispatcher = new Dispatcher(options);
          }
          return dispatcher;
        }
      }

    }]);

})(angular);

(function(angular)  {

  /**
  @module AP
  @submodule authentication
  */
  angular.module("AP.authentication", ['AP.utility', 'ngStorage']);

})(angular);

(function(angular) {

  /**
   * Handles storing, retrieving and deleting authentication info using the localStorage API. Also handles expiration of stored data.
   * @module AP
   * @submodule authentication
   * @class $authenticationStorageService
   */
  angular.module("AP.authentication")
    .service("$authenticationStorageService", ['$localStorage', '$timestamps', function($localStorage, $timestamps) {

      // Initialize the "auth" section of the local storage if non existent
      if(!$localStorage["auth"]) {
        $localStorage["auth"] = {};
      }

      /**
       * Object in localStorage dedicated to authentication data
       * @property store
       * @type Object
       */
      this.store = $localStorage["auth"];

      /**
       * Gets the localStorage key used to store the authentication data.
       * @method key
       * @param {String} The base url for the SDK
       * @returns {String} string key composed from the base url
       */
      this.key = function(url) {
        return (typeof url === "string" && url !== "") ? 'session-' + url.replace(/[^a-zA-Z\-0-9]/g, '') : undefined;
      };

      /**
       * @method isValidSession
       * @param {Object} the response data returned by the api after authenticating
       * @returns {Boolean} whether the session is valid
       */
      this.isValidSession = function(session) {
        if(typeof session === "object" && session.timestamp && session.data) {
          return $timestamps.isValid($timestamps.fromISOString(session.timestamp));
        }
        return false;
      }

      /**
       * Saves the session into localStorage
       * @method saveSession
       * @param {String} the base url for the SDK
       * @param {Object} the response data returned by the api after authenticating
       * @returns {Boolean} true if success, false otherwise
       */
      this.saveSession = function(url, session) {
        var key = this.key(url);
        if(key) {
          this.store[key] = JSON.stringify({
            data: session,
            timestamp: $timestamps.timestamp()
          });
          return true;
        }
        return false;
      };

      /**
       * Gets the session from localStorage
       * @method getSession
       * @param {String} the base url for the SDK
       * @returns {Object} the stored session
       */
      this.getSession = function(url) {
        var key = this.key(url), session = undefined;
        if(key) {
          session = this.store[key];
          if(session) {
            session = JSON.parse(session);
            if(this.isValidSession(session)) {
              return session.data;
            } else {
              this.deleteSession(url);
            }
          }
        }
        return undefined;
      };

      /**
       * Deletes the session in localStorage
       * @method deleteSession
       * @param {String} the base url for the SDK
       */
      this.deleteSession = function(url) {
        var key = this.key(url);
        if(key) {
          delete this.store[key];
        }
      }

    }]);

})(angular);

(function(angular) {

  /**
   * Manages multiple authentication strategies and the common tasks among all strategies.
   * @module AP
   * @submodule authentication
   * @class $authenticationManagerFactory
   */
  angular.module("AP.authentication")
    .factory("$authenticationManagerFactory", ['$rootScope', '$authenticationStorageService', '$authenticationFactory', function($rootScope, $authenticationStorageService, $authenticationFactory)  {

      /**
       * AuthenticationManager constructor
       * @class AuthenticationManager
       * @constructor
       * @param {Dispatcher} dispatcher the dispatcher used by the SDK
       */
      function AuthenticationManager(dispatcher) {
        this.$dispatcher = dispatcher;
      }

      /**
       * Returns the base url
       * @method url
       * @returns {String} the base url string for the SDK
       */
      AuthenticationManager.prototype.url = function() {
        return this.$dispatcher.adapter().$restClient.url;
      };

      /**
       * Convenience method to get a strategy by name
       * @method strategy
       * @param {String} the name of the strategy to get
       * @returns {Authentication} the authentication strategy
       */
      AuthenticationManager.prototype.strategy = function(name) {
        return this[name];
      };

      /**
       * Adds a new strategy to be handled by the manager
       * @method addStrategy
       * @param {Object} options to construct the strategy
       */
      AuthenticationManager.prototype.addStrategy = function(options) {
        this[options.strategyName] = $authenticationFactory.create(this, options);
      };

      /**
       * Sets the X-Session-Id header in the default HttpClient
       * @method setSessionAsHeader
       * @param {Object} the session returned as response from authenticating
       */
      AuthenticationManager.prototype.setSessionAsHeader = function(session) {
        this.$dispatcher.adapter().$restClient.headers['X-Session-Id'] = session.xSessionId;
      };

      /**
       * Removes the X-Session-Id header in the default HttpClient
       * @method removeSessionAsHeader
       */
      AuthenticationManager.prototype.removeSessionAsHeader = function() {
        delete this.$dispatcher.adapter().$restClient.headers['X-Session-Id'];
      };

      /**
       * Called by the different strategies after getting the response from authenticating.
       * @method setSession
       * @param {Object} the session returned as response from authenticating
       */
      AuthenticationManager.prototype.setSession = function(session) {
        $authenticationStorageService.saveSession(this.url(), session);
        this.setSessionAsHeader(session);
        this.$dispatcher.adapter().$restClient.user = session.username;
        /**
        @event 'auth:authenticated'
        An authenticated event is emitted after a successful login.
        */
        $rootScope.$emit('auth:authenticated');
      };

      /**
       * Called by the different strategies after deauthenticating
       * @method destroySession
       */
      AuthenticationManager.prototype.destroySession = function() {
        $authenticationStorageService.deleteSession(this.url());
        this.removeSessionAsHeader();
        this.$dispatcher.adapter().$restClient.user = undefined;
        /**
        @event auth:deauthenticated
        A deauthenticated event is emitted after the session is destroyed.
        */
        $rootScope.$emit('auth:deauthenticated');
      };

      /**
       * Convenience method for users to retrieve session data
       * @method getSession
       * @returns {Object} the session object stored by authentication storage
       */
      AuthenticationManager.prototype.getSession = function() {
        return $authenticationStorageService.getSession(this.url());
      };

      /**
       * Restores a session from authentication storage. This is used when changing the base url for the SDK, as authentication data might be already
       * stored for the new url
       * @method restoreSession
       */
      AuthenticationManager.prototype.restoreSession = function() {
        var session = $authenticationStorageService.getSession(this.url());
        if(session) {
          this.setSessionAsHeader(session);
          this.$dispatcher.adapter().$restClient.user = session.username;
        }
      };

      /**
       * Returns whether the user is authenticated
       * @method isAuthenticated
       * @returns {Boolean}
       */
      AuthenticationManager.prototype.isAuthenticated = function() {
        return !!$authenticationStorageService.getSession(this.url());
      };

      return {
        create: function(dispatcher) {
          return new AuthenticationManager(dispatcher);
        }
      };


    }]);

})(angular);

(function(angular)  {

  /**
   * Provides methods for user authentication and deauthentication.
   *
   * To login:
   * ```
   * ApplicationDefinitionNameSdk.login({
   *   username: "johndoe",
   *   password: "doe123"
   * });
   *
   * ApplicationDefinitionNameSdk.isAuthenticated();
   * // true
   * ```
   *
   * To logout:
   * ```
   * ApplicationDefinitionNameSdk.logout();
   *
   * ApplicationDefinitionNameSdk.isAuthenticated();
   * // false
   * ```
   *
   * @module AP
   * @submodule authentication
   * @class $authenticationFactory
   */

  angular.module("AP.authentication")
    .factory("$authenticationFactory", ['$rootScope', '$q', function($rootScope, $q)  {

      /**
      Authentication Constructor
      @class Authentication
      @constructor
      @param {AuthenticationManager} authentication strategies coordinator and manager
      */
      function Authentication(manager, options) {


        this.manager = manager;

        /**
        Stores details about authentication and authorization.
        @property settings
        @type Object
       */
        this.settings = {

          /**
          The type of the authentication strategy
          @property settings.strategyType
          @type String
          */
          strategyType: options.strategyType,

          /**
          The name of the authentication strategy
          @property settings.strategyName
          @type String
          */
          strategyName: options.strategyName,

          /**
          The name of the field to match for authentication.  Only one value is used
          at this time:  `password`.
          @property settings.matchField
          @type String
           */
          matchField: options.matchField || "password",

          /**
          The name of the field used to find a user.  For example:  `username`.
          @property settings.lookupField
          @type String
          */
          lookupField: options.lookupField || "username",

          /**
          The name of the field on the object returned after authenticating that
          stores user roles.  The role field is used by `AP.auth.Authorization`.
          @property settings.roleField
          @type String
          */
          roleField: options.roleField || "role",

          /**
          The URL of the API endpoint to authenticate
          @property settings.authentication_url
          @type String
          */
          authentication_url: "/auth/" + options.strategyName + "/callback",

          /**
          URL of logout API endpoint.  Logout requests must be made to this URL.
          @property settings.deauthentication_url
          @type String
          */
          deauthentication_url: "/auth/signout"

        };
      }

      /**
      Gets the Adapter for the API to which this Auth Object belongs to
      NOTE: For now all Auth Objects belong to an AP backend
      @method client
      @returns {Adapter}
      */
      Authentication.prototype.client = function()  {
        return this.manager.$dispatcher.adapter().$restClient;
      };

      /**
      Executes login request with passed `credentials`.
      @method login
      @static
      @param {Object} credentials the credentials for the user attempting to login
      @returns {Promise}
       */
      Authentication.prototype.login = function(credentials)  {
        if (!this.isAuthenticated())  {
          return this.authenticate(credentials);
        } else {
          return $q.resolve(undefined);
        }
      };

      /**
      Executes logout request.
      @method logout
      @static
      @returns {Promise}
       */
      Authentication.prototype.logout = function() {
        if (this.isAuthenticated()) {
          return this.deauthenticate();
        } else {
          return $q.resolve(undefined);
        }
      };

      /**
      @method isAuthenticated
      @static
      @return {Boolean} `true` if a user is logged-in
      */
      Authentication.prototype.isAuthenticated = function() {
        return !!(this.manager.isAuthenticated());
      };

      /**
      Performs authentication request with HTTP basic auth.  Upon a successful
      login the user object returned by the API is stored for later use.
      @method authenticate
      @static
      @param {Object} credentials user credentials object, for example:
      ```{"username": "johndoe", "password": "doe123"}```.
      */
      Authentication.prototype.authenticate = function(credentials) {
        return this.client().post({
          url: this.settings.authentication_url,
          data:  credentials
        }).then(angular.bind(this, function(response)  {
          if(response) {
            this.manager.setSession(JSON.parse(response.data));
          } else {
            /**
            @event 'auth:error'
            An auth error event is emitted if a login or logout fails for
            any reason.
            */
            $rootScope.$emit('auth:error');
          }
        }))
        .catch(function(response) {
          /**
          @event 'auth:error'
          An auth error event is emitted if a login or logout fails for
          any reason.
          */
          $rootScope.$emit('auth:error');
        });

      };

      /**
      Performs deauthentication request.  Upon a successful logout, stored user data
      is removed.
      @method deauthenticate
      @static
      */
      Authentication.prototype.deauthenticate = function() {
        return this.client().post({
          url: this.settings.deauthentication_url
        }).then(angular.bind(this, function(response)  {
          this.manager.destroySession();
        }));
      };

      /**
      Returns the lookup field value (username) of the currently logged-in user.
      @method getUsername
      @static
      @return {Object/null} the authenticated user's lookup field value (username)
      */
      Authentication.prototype.getUsername = function() {
        var credentials = this.manager.getSession();
        return (typeof credentials === "object" && this.settings.lookupField) ? credentials[this.settings.lookupField] : undefined;
      };

      /**
      Returns the role(s) of the currently logged-in user.
      @method getUserRole
      @static
      @return {Object/null} the authenticated user's role(s)
      */
      Authentication.prototype.getUserRole = function() {
        var credentials = this.manager.getSession();
        return (typeof credentials === "object" && this.settings.lookupField) ? credentials[this.settings.roleField] : undefined;
      };



      return {
        create: function(manager, options) {
          return new Authentication(manager, options);
        }
      };

    }]);

})(angular);

(function(angular) {

  /**
  @module AP
  @submodule model
  */
  angular.module("AP.model", []);

})(angular);

(function(angular) {

  var models = {};

  /****************************************************
                    HELPER METHODS
  ****************************************************/
  /**
  @method isEmptyString
  @param {String} str the string to check if it's empty or not.
  @returns {Boolean} true if str is both a string and empty, false otherwise
  */
  function isEmptyString(str) {
    return angular.isString(str) && str === "";
  }

  /**
  The ModelRegistry is merely a store where Model services difined in one or more SDKs are kept.
  This is used for relationships between Models, so any model can access another without needing to inject
  it as a dependecy when the service is defined. Since the registry is global (it is not specific to any SDK)
  registered Models are grouped by SDK name.
  @module AP
  @submodule model
  @class ModelRegistry
  @param {Object} $injector the angular service used to do dependency injection
  */
  function ModelRegistry($injector) {
    this.$injector = $injector;
  }

  angular.extend(ModelRegistry.prototype, {

    /**
    Checks that the SDK name and Model name passed are Strings and are not empty Strings
    @method validateSdkAndModelNames
    @param {String} sdk the name of an SDK
    @param {String} modelName the name of a Model
    @returns {Boolean} true if they both check out, false if they don't
    */
    validateSdkAndModelNames: function(sdk, modelName) {
      return angular.isString(sdk) && !isEmptyString(sdk) && angular.isString(modelName) && !isEmptyString(modelName);
    },

    /**
    Stores a Model service, within the space of its container SDk with the name passed
    @method register
    @param {String} sdk the name of the SDK where the Model is defined
    @param {String} modelName the name of the Model, which will be used as the key to store the service
    @param {Model} modelFactory the Model service
    @returns {Void}
    */
    register: function(sdk, modelName, modelFactory) {
      if(this.validateSdkAndModelNames(sdk, modelName)) {
        if(!models[sdk] || !angular.isObject(models[sdk])) {
          models[sdk] = {};
        }

        if(!models[sdk][modelName]) {
          models[sdk][modelName] = modelFactory;
        }
      }
    },

    /**
    Gets a Model based on the SDk name and Model name passed from the store. If a Model requested isn't
    found within the store, the registry will attempt to inject it using angular's $injector service. This is
    because angular doesn't initialize services until they are needed so there might be a case when a Model
    hasn't been registered simply because nobody has used it yet. If a Model gets injected using $injector the
    resulting Model will be registered for later use.
    @method get
    @param {String} sdk the name of the SDK where the Model is registered
    @param {String} modelName the name of the Model to get
    @returns {Model} the requested Model service
    */
    get: function(sdk, modelName) {
      var factory = undefined;
      if(this.validateSdkAndModelNames(sdk, modelName)) {
        if(models[sdk]) {
          if(models[sdk][modelName]) {
            factory = models[sdk][modelName];
          }
        } else {
          factory = this.$injector.get(modelName);
          this.register(sdk, modelName, factory);
        }
      }
      return factory;
    }

  });

  angular.module("AP.model")
    .service("$registry", ["$injector", ModelRegistry]);

})(angular);

(function(angular) {

  /**
  Factory that creates Model instances. A Model instance is a basically a service that exposes methods for CRUD operations and
  Query Scopes. In order to create an instance, a dispatcher and a model definition must be passed as arguments. The dispatcher
  is needed so that the Model instance will know how to connect to the backend when its methods are called.

  @module AP
  @submodule model
  @class $modelFactory
  */
  angular.module("AP.model")
    .factory("$modelFactory", ["$registry", function($registry) {

      /**
      Constructor for Model instances
      Model Constructor
      @class Model
      @constructor
      @param {Dispatcher} dispatcher the dispatcher used by the SDK
      @param {Object} definition configuration data describing the model
      */
      function Model(dispatcher, definition) {

        /**
        @property
        @type {String} incremental path for the model
        */
        this.url = definition.url || "";

        /**
        @property
        @type {String} the name of the model
        */
        this.name = definition.name;

        /**
        @property
        @type {String} the name of the angular factory for the model (i.e. Person -> $person)
        */
        this.service = definition.service || "";

        /**
        @property
        @type {String} the name of the SDK to which the model belongs
        */
        this.ownerSdk = definition.ownerSdk || "";

        /**
        @property
        @type {Array} an array of field definitions of each field for that model where each field definition is an object of that field's properties
        */
        this.fields = definition.fields || [];

        /**
        @property
        @type {Array} an array of query scope definitions for that model where each definition is an object of properties that define that query scope
        */
        this.scopes = definition.scopes || [];

        /**
        @property
        @type {Array} an array of belongs_to relationship definitions for that model where each definition is an object of that belongs_to relationship's properties
        */
        this.belongsTo = definition.belongsTo || [];

        /**
        @property
        @type {Array} an array of hasOne relationship definitions for that model where each definition is an object of that hasOne relationship's properties
        */
        this.hasOne = definition.hasOne || [];

        /**
        @property
        @type {Array} an array of hasMany relationship definitions for that model where each definition is an object of that hasMany relationship's properties
        */
        this.hasMany = definition.hasMany || [];

        /**
        @property
        @type {Dispatcher} the dispatcher used by the SDK
        */
        this.$dispatcher = dispatcher;

        /**
        @property
        @type {String} the name of the data source for the model
        */
        this.interface = definition.interface;

        /**
        @property
        @type {Object} the definitions of direct to source configurations for the model and all its actions and query scopes
        */
        this.adapterConfigurations = definition.adapterConfigurations || {};

        // Add the new model to the AP model registry..
        $registry.register(this.ownerSdk, this.service, this);
      }

      /**
      Gets the Adapter for the API to which this Model belongs to
      NOTE: For now all Model instances belong to an AP backend
      @method client
      @returns {Adapter}
      */
      Model.prototype.client = function() {
        return this.$dispatcher.adapter(this.interface);
      };

      /**
      Saves an instance passed as an argument to the server. If the instance has an "id" property then it assumes
      the operation is for updating instead of creating
      @method save
      @param {Object} data the instance data to save
      @param {Object} interpolation context to use (only valid for direct to source models)
      @returns {Promise}
      */
      Model.prototype.save = function(data, context) {
        if(data.id) {
          return this.client().update(this, data, context);
        }
        return this.client().create(this, data, context);
      };

      /**
      Creates a Resource instance for this Model
      @method create
      @param {Object} data the data with which the Resource is created
      @returns {Resource}
      */
      Model.prototype.create = function(data) {
        return this.createResource(data);
      };

      /**
      Reads an instance from the server
      @method get
      @param {Object} with the query for the instance ( usually just { id: ... } )
      @returns {Promise}
      */
      Model.prototype.get = function(data) {
        return this.client().read(this, data);
      };

      /**
      Deletes an instance from the server
      @method delete
      @param {Object} with the id of the instance to delete
      @returns {Promise}
      */
      Model.prototype.delete = function(data) {
        return this.client().delete(this, data);
      };

      /**
      Creates an instance of Resource. If an Object is passed as an argument then the attributes of that
      Object will be added to the resulting Resource
      @method createResource
      @param {Object} obj attributes for the Resource
      @returns {Resource}
      */
      Model.prototype.createResource = function(obj) {
        var _this = this, resource;

        /**
        A Resource is nothing more than an object with a $save method. This class is defined dynamically so that
        whenever a Model creates a Resource, the resources's $save method will have access to the "save" method of the specific Model that created it
        @class Resource
        */
        function Resource() {}

        /**
        Copies the Resources attributes and calls the save method from the Model that created the instance
        @method $save
        @param {Object} interpolation context to use when saving
        @returns {Promise}
        */
        Resource.prototype.$save = function(context) {
          return _this.save(this, context);
        };

        // Add a $related object to hold the relationships
        if(this.belongsTo.length || this.hasOne.length || this.hasMany.length) {
          Resource.prototype.$related = {};
        }

        var resource = new Resource();
        if(obj && angular.isObject(obj)) {
          angular.extend(resource, obj);
        }

        this.addRelationshipsToResource(resource);

        return resource;
      };

      /**
      Adds methods to a Resource than represent each of the relationships defined for this Model.
      All relationship methods are stored inside a $related Object in the Model service.
      @method addRelationshipsToResource
      @param {Resource} res the Resource instance to add the methods to
      @returns {Resource} the same Resource passed
      */
      Model.prototype.addRelationshipsToResource = function(res) {

        if(res) {
          var _this = this;
          // Add 'belongsTo' relationships
          if(this.belongsTo.length) {
            angular.forEach(this.belongsTo, function(belongs) {
              res.$related[belongs.name] = angular.bind(res, function(success, error) {
                var $model = $registry.get(_this.ownerSdk, belongs.service);
                if($model) {
                  var query = {};
                  query[belongs.pk] = this[belongs.fk];
                  return $model.exact_match({
                    query: query,
                    limit: 1,
                    offset: 0
                  }, success, error);
                }
                return null;
              });
            });
          }

          if(this.hasOne.length) {
            angular.forEach(this.hasOne, function(hasOne) {
              res.$related[hasOne.name] = angular.bind(res, function(success, error) {
                var $model = $registry.get(_this.ownerSdk, hasOne.service);
                if($model) {
                  var query = {};
                  query[hasOne.fk] = this[hasOne.pk];
                  return $model.exact_match({
                    query: query,
                    limit: 1,
                    offset: 0
                  }, success, error);
                }
                return null;
              });
            });
          }

          if(this.hasMany.length) {
            angular.forEach(this.hasMany, function(hasMany) {
              res.$related[hasMany.name] = angular.bind(res, function(success, error) {
                var $model = $registry.get(_this.ownerSdk, hasMany.service);
                if($model) {
                  var query = {};
                  query[hasMany.fk] = this[hasMany.pk];
                  return $model.exact_match({ query: query }, success, error);
                }
                return null;
              });
            });
          }
        }

        return res;
      };

      /**
      Given an Array of Objects representing a collection, it transforms every Object in the Array into a Resource
      @method createCollection
      @param {Object[]} data the collection data
      @returns {Resource[]}
      */
      Model.prototype.createCollection = function(data) {
        var collection = [];
        if(angular.isArray(data)) {
          angular.forEach(data, function(element) {
            var model = this.create(element);
            collection.push(model);
          }, this);
          data = collection;
        }
        return data;
      };


      /********************************************************
      * Helper Functions
      ********************************************************/
      /**
      Adds all the scopes defined for the Model to the instance
      @method addScopes
      @param {Model} model the model instance to add the scopes too
      @param {Object[]} scopes the scopes' definitions
      @returns {Void}
      */
      function addScopes(model) {
        angular.forEach(model.scopes, function(scopeDefinition) {
          var name = scopeDefinition.name;
          model[name] = angular.bind(model, function(options, success, error) {
            return this.client().query(this, name, options, success, error);
          });
        });
      }

      /**
      Creates a Model instance
      @method createModel
      @param {Dispatcher} dispatcher the dispatcher used by the SDK for the Model to connect to the backend
      @param {Object} definition configuration data describing the model
      @returns {Model}
      */
      function createModel(dispatcher, definition) {
        var model = new Model(dispatcher, definition);
        addScopes(model);
        return model;
      }

      return {
        create: createModel
      }


    }]);

})(angular);

(function(angular) {

  /**
  @module AP
  */
  angular.module("AP", [
    "AP.utility",
    "AP.adapter",
    "AP.model",
    "AP.authentication"
  ]);

})(angular);

(function(angular) {

  /**
  @module VaccineSurveySdk
  @submodule adapters
  */
  var sdk = angular.module("VaccineSurveySdk.adapters", ["AP"]);

  sdk.run(["$injector", function($injector) {

    var httpAdapters = [];
    
    
    

    if(httpAdapters.length) {
      angular.forEach(httpAdapters, function(adapter) {
        $injector.get(adapter);
      });
    }

  }]);

})(angular);

(function(angular) {

  /**
  Default adapter for VaccineSurveySdk
  @module VaccineSurveySdk
  @submodule adapters
  @class $vaccineSurveySdkDefaultAdapter
  */
  angular.module("VaccineSurveySdk.adapters")
    .factory("$vaccineSurveySdkDefaultAdapter", ["$adapterFactory", function($adapterFactory) {
      return $adapterFactory.create({
        withCredentials: true
      });
    }]);

})(angular);

(function(angular) {

  /**
  Dispatcher for VaccineSurveySdk
  @module VaccineSurveySdk
  @submodule adapters
  @class $vaccineSurveySdkDispatcher
  */
  angular.module("VaccineSurveySdk.adapters")
    .factory("$vaccineSurveySdkDispatcher",
      [
        "$dispatcherFactory",
        "$vaccineSurveySdkDefaultAdapter",
        function($dispatcherFactory, $vaccineSurveySdkDefaultAdapter) {

          var dispatcher = $dispatcherFactory.create({
            default: $vaccineSurveySdkDefaultAdapter
          });

          return dispatcher;

        }
      ]);

})(angular);

(function(angular) {

  angular.module("VaccineSurveySdk.authentication", ["AP"]);

})(angular);

(function(angular) {

  angular.module("VaccineSurveySdk.authentication")
    .factory("$vaccineSurveySdkAuthentication",
      [
        "$authenticationManagerFactory",
        "$vaccineSurveySdkDispatcher",
        function($authenticationManagerFactory, $vaccineSurveySdkDispatcher) {

          var authentication = {};

          var manager = $authenticationManagerFactory.create($vaccineSurveySdkDispatcher);

          

          manager.addStrategy({
            
            matchField: "password",
            lookupField: "email",
            roleField: "role",
            
            strategyName: "password",
            strategyType: "Password"
          });

          

          return manager;
        }
      ]);

})(angular);

(function(angular) {

  /**
  @module VaccineSurveySdk
  @submodule config
  */
  angular.module("VaccineSurveySdk.config", [
    "VaccineSurveySdk.adapters",
    "VaccineSurveySdk.authentication"
  ]);

})(angular);

(function(angular) {

  /**
  Configuration service for VaccineSurveySdk
  @module VaccineSurveySdk
  @submodule config
  */
  angular.module("VaccineSurveySdk.config")
    .service("$vaccineSurveySdkConfig",
      [
        "$vaccineSurveySdkDispatcher",
        "$vaccineSurveySdkAuthentication",
        function($vaccineSurveySdkDispatcher, $vaccineSurveySdkAuthentication) {

          /******************************************************************
          *                     BASE URL SETTINGS
          ******************************************************************/
          function UrlManager() {}
          UrlManager.prototype.set = function(url) {
            $vaccineSurveySdkDispatcher.default.setBaseUrl(url);
            // After the url has been set restore the session data
            $vaccineSurveySdkAuthentication.restoreSession();
            //$vaccineSurveySdkAuthentication.setupSessionData();
            return this;
          };
          UrlManager.prototype.get = function() {
            return $vaccineSurveySdkDispatcher.default.baseUrl;
          };

          /**
          @property baseUrl
          @type {UrlManager}
          */
          this.baseUrl = new UrlManager();



          /****************************************************************
          *                     MOCK SERVER SETTINGS
          ****************************************************************/
          function MockServerManager() {}
          MockServerManager.prototype.enable = function() {
            $vaccineSurveySdkDispatcher.default.useMockServer = true;
            return this;
          };
          MockServerManager.prototype.disable = function() {
            $vaccineSurveySdkDispatcher.default.useMockServer = false;
            return this;
          };

          /**
          @property mockServer
          @type {MockServerManager}
          */
          this.mockServer = new MockServerManager();


          /****************************************************************
          *                     OFFLINE CACHE SETTINGS
          ****************************************************************/
          function OfflineCacheManager() {}
          OfflineCacheManager.prototype.enable = function() {
            $vaccineSurveySdkDispatcher.default.$restClient.useOfflineCache = true;
            return this;
          };
          OfflineCacheManager.prototype.disable = function() {
            $vaccineSurveySdkDispatcher.default.$restClient.useOfflineCache = false;
            return this;
          };

          /**
          @property offlineCache
          @type {OfflineCacheManager}
          */
          this.offlineCache = new OfflineCacheManager();


          /****************************************************************
          *                       AJAX SETTINGS
          ****************************************************************/

          /**
           * @method ajaxSettings
           * @param {object} options - http configuration options
           * @returns {HttpClient}
           */
          this.ajaxSettings = function(options) {
            var httpClient = $vaccineSurveySdkDispatcher.adapter().$restClient;
            if(options && typeof options === "object") {
              var validOptions = {
                headers: true,
                params: true,
                data: true,
                withCredentials: true,
                requestTransformations: true,
                responseTransformations: true
              };
              for(var key in options) {
                if(options.hasOwnProperty(key) && !!validOptons[key]) {
                  httpClient[key] = options[key];
                }
              }
            }

            return httpClient;
          }

        }
      ]);

})(angular);

(function(angular) {

  /**
  @module VaccineSurveySdk
  @submodule models
  */
  angular.module("VaccineSurveySdk.models", ["AP", "VaccineSurveySdk.adapters"]);

})(angular);

(function(angular) {

  /**
  Model service for ClinicianBlockRandomizer
  @module VaccineSurveySdk
  @submodule models
  @class $clinicianBlockRandomizer
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$clinicianBlockRandomizer", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var ClinicianBlockRandomizer = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/clinician_block_randomizers",

          name: "clinicianblockrandomizer",

          mapping: "clinic_block_randomizer",

          ownerSdk: "VaccineSurveySdk",

          service: "$clinicianBlockRandomizer",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "clinician_code_id",
              label: "clinician_code_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "intervention_group",
              label: "intervention_group",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "patient_type",
              label: "patient_type",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "sorted_by_clinic_id",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "filter_by_clinic_id",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
            {
              name: "cliniciancode",
              service: "$clinicianCode",
              opposite_object: "ClinicianCode",
              fk: "clinician_code_id",
              pk: "id"
            },
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return ClinicianBlockRandomizer;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for ClinicianCode
  @module VaccineSurveySdk
  @submodule models
  @class $clinicianCode
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$clinicianCode", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var ClinicianCode = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/clinician_codes",

          name: "cliniciancode",

          mapping: "clinician_codes",

          ownerSdk: "VaccineSurveySdk",

          service: "$clinicianCode",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "code",
              label: "code",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "name",
              label: "name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "sorted_by_name",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "clinicianblockrandomizers",
              service: "$clinicianBlockRandomizer",
              opposite_object: "ClinicianBlockRandomizer",
              fk: "clinician_code_id",
              pk: "id"
            },
            
            {
              name: "users",
              service: "$user",
              opposite_object: "User",
              fk: "clinician_code_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return ClinicianCode;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for Education
  @module VaccineSurveySdk
  @submodule models
  @class $education
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$education", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var Education = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/educations",

          name: "education",

          mapping: "educations",

          ownerSdk: "VaccineSurveySdk",

          service: "$education",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "name",
              label: "name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "sorted_by_name",
              type: "ObjectQueryScope",
              
            },
            {
              name: "sorted_by_id",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "users",
              service: "$user",
              opposite_object: "User",
              fk: "education_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return Education;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for HealthcareProviderContent
  @module VaccineSurveySdk
  @submodule models
  @class $healthcareProviderContent
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$healthcareProviderContent", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var HealthcareProviderContent = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/healthcare_provider_contents",

          name: "healthcareprovidercontent",

          mapping: "healthcare_provider_contents",

          ownerSdk: "VaccineSurveySdk",

          service: "$healthcareProviderContent",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "category_group",
              label: "category_group",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "desc",
              label: "desc",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "external_link",
              label: "external_link",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "keywords",
              label: "keywords",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "title",
              label: "title",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "topic_id",
              label: "topic_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "search_content",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "sorted_by_name",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "filter_by_category_group",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
            {
              name: "topic",
              service: "$topic",
              opposite_object: "Topic",
              fk: "topic_id",
              pk: "id"
            },
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return HealthcareProviderContent;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for JobAuditLogging
  @module VaccineSurveySdk
  @submodule models
  @class $jobAuditLogging
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$jobAuditLogging", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var JobAuditLogging = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/job_audit_loggings",

          name: "jobauditlogging",

          mapping: "job_audit_logging",

          ownerSdk: "VaccineSurveySdk",

          service: "$jobAuditLogging",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "created_at",
              label: "created_at",
              
              
              type: "time",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "name",
              label: "name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "rows_effected",
              label: "rows_effected",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return JobAuditLogging;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for QuestionCategory
  @module VaccineSurveySdk
  @submodule models
  @class $questionCategory
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$questionCategory", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var QuestionCategory = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/question_categories",

          name: "questioncategory",

          mapping: "question_categories",

          ownerSdk: "VaccineSurveySdk",

          service: "$questionCategory",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "name",
              label: "name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "sorted_by_name",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "surveyquestions",
              service: "$surveyQuestion",
              opposite_object: "SurveyQuestion",
              fk: "question_category_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return QuestionCategory;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for QuestionCode
  @module VaccineSurveySdk
  @submodule models
  @class $questionCode
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$questionCode", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var QuestionCode = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/question_codes",

          name: "questioncode",

          mapping: "question_codes",

          ownerSdk: "VaccineSurveySdk",

          service: "$questionCode",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "name",
              label: "name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "sorted_by_name",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "surveyquestions",
              service: "$surveyQuestion",
              opposite_object: "SurveyQuestion",
              fk: "question_code_id",
              pk: "id"
            },
            
            {
              name: "usersurveyanswers",
              service: "$userSurveyAnswer",
              opposite_object: "UserSurveyAnswer",
              fk: "question_code_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return QuestionCode;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for QuestionType
  @module VaccineSurveySdk
  @submodule models
  @class $questionType
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$questionType", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var QuestionType = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/question_types",

          name: "questiontype",

          mapping: "question_types",

          ownerSdk: "VaccineSurveySdk",

          service: "$questionType",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "control_type",
              label: "control_type",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "name",
              label: "name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "sorted_by_name",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "surveyquestions",
              service: "$surveyQuestion",
              opposite_object: "SurveyQuestion",
              fk: "question_type_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return QuestionType;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for Race
  @module VaccineSurveySdk
  @submodule models
  @class $race
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$race", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var Race = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/races",

          name: "race",

          mapping: "races",

          ownerSdk: "VaccineSurveySdk",

          service: "$race",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "name",
              label: "name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "sorted_by_name",
              type: "ObjectQueryScope",
              
            },
            {
              name: "sorted_by_id",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "users",
              service: "$user",
              opposite_object: "User",
              fk: "race_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return Race;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for SearchAuditLogging
  @module VaccineSurveySdk
  @submodule models
  @class $searchAuditLogging
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$searchAuditLogging", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var SearchAuditLogging = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/search_audit_loggings",

          name: "searchauditlogging",

          mapping: "search_audit_logging",

          ownerSdk: "VaccineSurveySdk",

          service: "$searchAuditLogging",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "created_at",
              label: "created_at",
              
              
              type: "time",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "search_term",
              label: "search_term",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "user_id",
              label: "user_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
          ],

          belongsTo: [
            
            {
              name: "user",
              service: "$user",
              opposite_object: "User",
              fk: "user_id",
              pk: "id"
            },
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return SearchAuditLogging;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for SendGrid
  @module VaccineSurveySdk
  @submodule models
  @class $sendGrid
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$sendGrid", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var SendGrid = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/send_grids",

          name: "sendgrid",

          mapping: "SendGrid",

          ownerSdk: "VaccineSurveySdk",

          service: "$sendGrid",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "SendGrid",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return SendGrid;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for Setting
  @module VaccineSurveySdk
  @submodule models
  @class $setting
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$setting", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var Setting = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/settings",

          name: "setting",

          mapping: "settings",

          ownerSdk: "VaccineSurveySdk",

          service: "$setting",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "aws_healthcare_content_bucket_name",
              label: "aws_healthcare_content_bucket_name",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "aws_video_bucket_name",
              label: "aws_video_bucket_name",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "contact_user_registration_email_text",
              label: "contact_user_registration_email_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "contact_user_registration_subject",
              label: "contact_user_registration_subject",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "forgot_password_email_text",
              label: "forgot_password_email_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "forgot_password_subject",
              label: "forgot_password_subject",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "from_email",
              label: "from_email",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "sms_phone_number",
              label: "sms_phone_number",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_completion_email_subject",
              label: "survey_completion_email_subject",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_completion_email_text",
              label: "survey_completion_email_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_notification_email_text",
              label: "survey_notification_email_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_notification_final_sms_text",
              label: "survey_notification_final_sms_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_notification_first_reminder_email_text",
              label: "survey_notification_first_reminder_email_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_notification_first_reminder_subject",
              label: "survey_notification_first_reminder_subject",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_notification_subject",
              label: "survey_notification_subject",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },

            {
              name: "take_first_survey_text",
              label: "take_first_survey_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            {
              name: "after_first_survey_complete_text",
              label: "after_first_survey_complete_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },{
              name: "post_video_thanking_text",
              label: "post_video_thanking_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "terms_and_conditions",
              label: "terms_and_conditions",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },

            
            

            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return Setting;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for Survey
  @module VaccineSurveySdk
  @submodule models
  @class $survey
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$survey", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var Survey = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/surveys",

          name: "survey",

          mapping: "surveys",

          ownerSdk: "VaccineSurveySdk",

          service: "$survey",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "intervention_group",
              label: "intervention_group",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "is_active",
              label: "is_active",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "name",
              label: "name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "patient_type",
              label: "patient_type",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_type",
              label: "survey_type",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "total_questions",
              label: "total_questions",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "version",
              label: "version",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "create_copy",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "active_surveys_by_type_patient",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "get_sorted_surveys",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "delete_survey",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "generate_csv_results",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "surveyquestions",
              service: "$surveyQuestion",
              opposite_object: "SurveyQuestion",
              fk: "survey_id",
              pk: "id"
            },
            
            {
              name: "usersurveys",
              service: "$userSurvey",
              opposite_object: "UserSurvey",
              fk: "survey_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return Survey;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for SurveyAnswer
  @module VaccineSurveySdk
  @submodule models
  @class $surveyAnswer
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$surveyAnswer", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var SurveyAnswer = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/survey_answers",

          name: "surveyanswer",

          mapping: "survey_answers",

          ownerSdk: "VaccineSurveySdk",

          service: "$surveyAnswer",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "allow_free_form",
              label: "allow_free_form",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "free_form_data_type",
              label: "free_form_data_type",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "label",
              label: "label",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "sort_order",
              label: "sort_order",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_question_id",
              label: "survey_question_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "video_target_number",
              label: "video_target_number",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "weight",
              label: "weight",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "get_answers_by_question",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "delete_question_answer",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
            {
              name: "surveyquestion",
              service: "$surveyQuestion",
              opposite_object: "SurveyQuestion",
              fk: "survey_question_id",
              pk: "id"
            },
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "usersurveyanswers",
              service: "$userSurveyAnswer",
              opposite_object: "UserSurveyAnswer",
              fk: "survey_answer_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return SurveyAnswer;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for SurveyQuestion
  @module VaccineSurveySdk
  @submodule models
  @class $surveyQuestion
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$surveyQuestion", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var SurveyQuestion = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/survey_questions",

          name: "surveyquestion",

          mapping: "survey_questions",

          ownerSdk: "VaccineSurveySdk",

          service: "$surveyQuestion",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "did_you_know_text",
              label: "did_you_know_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "label",
              label: "label",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "question_category_id",
              label: "question_category_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "question_code_id",
              label: "question_code_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "question_group",
              label: "question_group",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "question_text",
              label: "question_text",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "question_type_id",
              label: "question_type_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "required_answer",
              label: "required_answer",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "sort_order",
              label: "sort_order",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_id",
              label: "survey_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "get_question_by_survey",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "delete_survey_question",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "get_question_by_question_code",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
            {
              name: "questioncategory",
              service: "$questionCategory",
              opposite_object: "QuestionCategory",
              fk: "question_category_id",
              pk: "id"
            },
            
            {
              name: "questioncode",
              service: "$questionCode",
              opposite_object: "QuestionCode",
              fk: "question_code_id",
              pk: "id"
            },
            
            {
              name: "questiontype",
              service: "$questionType",
              opposite_object: "QuestionType",
              fk: "question_type_id",
              pk: "id"
            },
            
            {
              name: "survey",
              service: "$survey",
              opposite_object: "Survey",
              fk: "survey_id",
              pk: "id"
            },
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "surveyanswers",
              service: "$surveyAnswer",
              opposite_object: "SurveyAnswer",
              fk: "survey_question_id",
              pk: "id"
            },
            
            {
              name: "usersurveyanswers",
              service: "$userSurveyAnswer",
              opposite_object: "UserSurveyAnswer",
              fk: "survey_question_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return SurveyQuestion;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for SurveyQuestionSkipLogic
  @module VaccineSurveySdk
  @submodule models
  @class $surveyQuestionSkipLogic
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$surveyQuestionSkipLogic", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var SurveyQuestionSkipLogic = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/survey_question_skip_logics",

          name: "surveyquestionskiplogic",

          mapping: "survey_question_skip_logic",

          ownerSdk: "VaccineSurveySdk",

          service: "$surveyQuestionSkipLogic",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "skip_question_codes",
              label: "skip_question_codes",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_answer_id",
              label: "survey_answer_id",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "get_skip_logic_by_answers",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return SurveyQuestionSkipLogic;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for Topic
  @module VaccineSurveySdk
  @submodule models
  @class $topic
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$topic", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var Topic = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/topics",

          name: "topic",

          mapping: "topics",

          ownerSdk: "VaccineSurveySdk",

          service: "$topic",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "name",
              label: "name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "sorted_by_name",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "healthcareprovidercontents",
              service: "$healthcareProviderContent",
              opposite_object: "HealthcareProviderContent",
              fk: "topic_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return Topic;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for Twilio
  @module VaccineSurveySdk
  @submodule models
  @class $twilio
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$twilio", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var Twilio = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/twilios",

          name: "twilio",

          mapping: "Twilio",

          ownerSdk: "VaccineSurveySdk",

          service: "$twilio",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "TwilioAPI",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return Twilio;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for User
  @module VaccineSurveySdk
  @submodule models
  @class $user
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$user", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var User = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/users",

          name: "user",

          mapping: "users",

          ownerSdk: "VaccineSurveySdk",

          service: "$user",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "actual_child_birth",
              label: "actual_child_birth",
              
              
              type: "date",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "address",
              label: "address",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "cell_phone",
              label: "cell_phone",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "city",
              label: "city",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "clinician_code_id",
              label: "clinician_code_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "clinic_name",
              label: "clinic_name",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "consent_accepted_on",
              label: "consent_accepted_on",
              
              
              type: "time",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "contact_cell_phone",
              label: "contact_cell_phone",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "contact_email",
              label: "contact_email",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "contact_home_phone",
              label: "contact_home_phone",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "contact_name",
              label: "contact_name",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "deactivated_on",
              label: "deactivated_on",
              
              
              type: "time",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "education_id",
              label: "education_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "email",
              label: "email",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "expected_child_birth",
              label: "expected_child_birth",
              
              
              type: "date",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "first_name",
              label: "first_name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "has_contact_users",
              label: "has_contact_users",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "home_phone",
              label: "home_phone",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "intervention_group",
              label: "intervention_group",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "is_deactive",
              label: "is_deactive",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "last_name",
              label: "last_name",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "parent_relationship_type",
              label: "parent_relationship_type",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "parent_user_id",
              label: "parent_user_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "password",
              label: "password",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "password_confirmation",
              label: "password_confirmation",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "password_digest",
              label: "password_digest",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "patient_type",
              label: "patient_type",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "postal_code",
              label: "postal_code",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "race_id",
              label: "race_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "reason_for_deactivation",
              label: "reason_for_deactivation",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "reset_password",
              label: "reset_password",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "role",
              label: "role",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "state",
              label: "state",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "updated_user_profile",
              label: "updated_user_profile",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "vaccination_reminders",
              label: "vaccination_reminders",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "x_session_id",
              label: "x_session_id",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "reset_password",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "consent_accepted",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "deactivate",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "myprofile",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "get_my_contacts",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "get_patients_by_clinics",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "get_healthcare_by_clinic",
              type: "ObjectQueryScope",
              
            },
            {
              name: "get_users_by_race",
              type: "ObjectQueryScope",
            },
            {
              name: "get_users_by_education",
              type: "ObjectQueryScope",
            },
            
            {
              name: "patient_survey_export",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
            {
              name: "cliniciancode",
              service: "$clinicianCode",
              opposite_object: "ClinicianCode",
              fk: "clinician_code_id",
              pk: "id"
            },
            
            {
              name: "education",
              service: "$education",
              opposite_object: "Education",
              fk: "education_id",
              pk: "id"
            },
            
            {
              name: "race",
              service: "$race",
              opposite_object: "Race",
              fk: "race_id",
              pk: "id"
            },
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
            {
              name: "userauditloggings",
              service: "$userAuditLogging",
              opposite_object: "UserAuditLogging",
              fk: "user_id",
              pk: "id"
            },
            
            {
              name: "searchauditloggings",
              service: "$searchAuditLogging",
              opposite_object: "SearchAuditLogging",
              fk: "user_id",
              pk: "id"
            },
            
            {
              name: "usersurveys",
              service: "$userSurvey",
              opposite_object: "UserSurvey",
              fk: "user_id",
              pk: "id"
            },
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return User;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for UserAuditLogging
  @module VaccineSurveySdk
  @submodule models
  @class $userAuditLogging
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$userAuditLogging", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var UserAuditLogging = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/user_audit_loggings",

          name: "userauditlogging",

          mapping: "user_audit_logging",

          ownerSdk: "VaccineSurveySdk",

          service: "$userAuditLogging",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "ip_address",
              label: "ip_address",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "logged_in_at",
              label: "logged_in_at",
              
              
              type: "time",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "logged_out_at",
              label: "logged_out_at",
              
              
              type: "time",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "user_agent",
              label: "user_agent",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "user_id",
              label: "user_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "user_audit_export",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
            {
              name: "user",
              service: "$user",
              opposite_object: "User",
              fk: "user_id",
              pk: "id"
            },
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return UserAuditLogging;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for UserSurvey
  @module VaccineSurveySdk
  @submodule models
  @class $userSurvey
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$userSurvey", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var UserSurvey = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/user_surveys",

          name: "usersurvey",

          mapping: "user_surveys",

          ownerSdk: "VaccineSurveySdk",

          service: "$userSurvey",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "completed_at",
              label: "completed_at",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "completition",
              label: "completition",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "created_at",
              label: "created_at",
              
              
              type: "time",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "currentuseranswers",
              label: "currentuseranswers",
              
              
              type: "array",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "first_question",
              label: "first_question",
              
              
              type: "hash",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "first_question_id",
              label: "first_question_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "first_reminder",
              label: "first_reminder",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "is_complete",
              label: "is_complete",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "matched_videos",
              label: "matched_videos",
              
              
              type: "array",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "maternal_video_complete",
              label: "maternal_video_complete",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "maternal_video_number",
              label: "maternal_video_number",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "maternal_video_position",
              label: "maternal_video_position",
              
              
              type: "float",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "pediatric_video_complete",
              label: "pediatric_video_complete",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "pediatric_video_number",
              label: "pediatric_video_number",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "pediatric_video_position",
              label: "pediatric_video_position",
              
              
              type: "float",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "question_count",
              label: "question_count",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "second_reminder",
              label: "second_reminder",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_id",
              label: "survey_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "user_id",
              label: "user_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "video_source_version",
              label: "video_source_version",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "get_patients_survey",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "getfirstquestion",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "compelete_survey",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "get_video_survey",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "check_survey_exists",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "check_survey_count",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "generate_csv_results",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
            {
              name: "survey",
              service: "$survey",
              opposite_object: "Survey",
              fk: "survey_id",
              pk: "id"
            },
            
            {
              name: "user",
              service: "$user",
              opposite_object: "User",
              fk: "user_id",
              pk: "id"
            },
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return UserSurvey;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for UserSurveyAnswer
  @module VaccineSurveySdk
  @submodule models
  @class $userSurveyAnswer
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$userSurveyAnswer", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var UserSurveyAnswer = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/user_survey_answers",

          name: "usersurveyanswer",

          mapping: "user_survey_answers",

          ownerSdk: "VaccineSurveySdk",

          service: "$userSurveyAnswer",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "applied_skip_logic_id",
              label: "applied_skip_logic_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "free_form_response",
              label: "free_form_response",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "nextquestion",
              label: "nextquestion",
              
              
              type: "hash",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "previousquestion",
              label: "previousquestion",
              
              
              type: "hash",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "question_code_id",
              label: "question_code_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "question_group",
              label: "question_group",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "question_order",
              label: "question_order",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "skipped",
              label: "skipped",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_answer_id",
              label: "survey_answer_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "survey_question_id",
              label: "survey_question_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "user_survey_id",
              label: "user_survey_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "previousquestion",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
            {
              name: "questioncode",
              service: "$questionCode",
              opposite_object: "QuestionCode",
              fk: "question_code_id",
              pk: "id"
            },
            
            {
              name: "surveyanswer",
              service: "$surveyAnswer",
              opposite_object: "SurveyAnswer",
              fk: "survey_answer_id",
              pk: "id"
            },
            
            {
              name: "surveyquestion",
              service: "$surveyQuestion",
              opposite_object: "SurveyQuestion",
              fk: "survey_question_id",
              pk: "id"
            },
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return UserSurveyAnswer;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for UserSurveyVideo
  @module VaccineSurveySdk
  @submodule models
  @class $userSurveyVideo
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$userSurveyVideo", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var UserSurveyVideo = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/user_survey_videos",

          name: "usersurveyvideo",

          mapping: "user_survey_videos",

          ownerSdk: "VaccineSurveySdk",

          service: "$userSurveyVideo",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "is_complete",
              label: "is_complete",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "sort_order",
              label: "sort_order",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "user_survey_id",
              label: "user_survey_id",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "video_number",
              label: "video_number",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "video_position",
              label: "video_position",
              
              
              type: "float",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "video_source_version",
              label: "video_source_version",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "video_type",
              label: "video_type",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "get_videos_for_user_survey_id",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "get_video_by_id",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return UserSurveyVideo;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for VaccinationReminder
  @module VaccineSurveySdk
  @submodule models
  @class $vaccinationReminder
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$vaccinationReminder", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var VaccinationReminder = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/vaccination_reminders",

          name: "vaccinationreminder",

          mapping: "vaccination_reminders",

          ownerSdk: "VaccineSurveySdk",

          service: "$vaccinationReminder",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "message_text",
              label: "message_text",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "trigger_days_from_dob",
              label: "trigger_days_from_dob",
              
              
              type: "integer",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "sorted_by_trigger_days",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "send_vaccination_reminders",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return VaccinationReminder;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for Video
  @module VaccineSurveySdk
  @submodule models
  @class $video
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$video", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var Video = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/videos",

          name: "video",

          mapping: "videos",

          ownerSdk: "VaccineSurveySdk",

          service: "$video",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "desc",
              label: "desc",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "is_active",
              label: "is_active",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "keywords",
              label: "keywords",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "length",
              label: "length",
              
              
              type: "float",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "question_group",
              label: "question_group",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "sort_order",
              label: "sort_order",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "source_version",
              label: "source_version",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "target_number",
              label: "target_number",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "title",
              label: "title",
              
              
              type: "string",
              required: true,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "topic_id",
              label: "topic_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "video_url",
              label: "video_url",
              
              
              type: "string",
              required: false,
              auto: false,
              file_url: true,
              file_type: "Video"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "search_video_scoped_by_race_edu",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "search_video_by_keyword",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "sorted_by_name",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "video_gallery",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return Video;

    }]);

})(angular);

(function(angular) {

  /**
  Model service for VideoAuditLogging
  @module VaccineSurveySdk
  @submodule models
  @class $videoAuditLogging
  */
  angular.module("VaccineSurveySdk.models")
    .factory("$videoAuditLogging", ["$vaccineSurveySdkDispatcher", "$modelFactory", function($vaccineSurveySdkDispatcher, $modelFactory) {

      var VideoAuditLogging = $modelFactory.create(
        $vaccineSurveySdkDispatcher,
        {
          url: "/api/v2/video_audit_loggings",

          name: "videoauditlogging",

          mapping: "video_audit_logging",

          ownerSdk: "VaccineSurveySdk",

          service: "$videoAuditLogging",

          fields: [
            
            {
              name: "id",
              label: "id",
              
              
              type: "integer",
              required: false,
              auto: true,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "created_at",
              label: "created_at",
              
              
              type: "time",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "duration",
              label: "duration",
              
              
              type: "float",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "user_id",
              label: "user_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "video_id",
              label: "video_id",
              
              
              type: "integer",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
            {
              name: "watched_entire_video",
              label: "watched_entire_video",
              
              
              type: "boolean",
              required: false,
              auto: false,
              file_url: false,
              file_type: "Image"
            },
            
          ],

          scopes: [
            
            {
              name: "all",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "exact_match",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "count",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "count_exact_match",
              type: "AggregateQueryScope",
              
              aggregateField: "id"
              
            },
            
            {
              name: "export_video_log",
              type: "ObjectQueryScope",
              
            },
            
            {
              name: "by_video_and_user_id",
              type: "ObjectQueryScope",
              
            },
            
          ],

          belongsTo: [
            
          ],

          hasOne: [
            
          ],

          hasMany: [
            
          ],
          
          interface: "Encrypted Mysql",
          
          isDirectToSource: false,
          
          
          adapterConfigurations: {
            
            
            
            
            scopes: {
              
              
              
              
              
              
              
              
              
              
              
              
              
            }
          }
        }
      );

      return VideoAuditLogging;

    }]);

})(angular);

(function(angular) {

  /**
  @module VaccineSurveySdk
  */
  angular.module("VaccineSurveySdk", [
    "VaccineSurveySdk.adapters",
    "VaccineSurveySdk.config",
    "VaccineSurveySdk.authentication",
    "VaccineSurveySdk.models"
  ])

  .run([function() {
    // Enable document.evaluate() function to evaluate XPath expressions
    // This requires wicked-good-xpath library
    if(typeof wgxpath !== "undefined" && wgxpath.install && wgxpath.install instanceof Function) {
      wgxpath.install();
    }

  }]);

})(angular);
