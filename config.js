var cache_hash=null;
function locate(load) {

  //return load.address + "?ctag=" + "hello";
  return loadHashTable().then((hashtable) => {
    var url = load.address;
    let baseUrl = initBaseUrl();

    var relUrl = (startsWith(url, baseUrl) ? relUrl = url.substring(baseUrl.length) : url);
    var entry = hashtable[relUrl];

    if (entry) {
      var cacheBuster = "?hash=" + entry.hash
      url = url + cacheBuster;
    }

    // log("System.locate: " + url);
    return url;
    //return load.address+"?hash="+;
  })
}
function initBaseUrl() {
  let baseUrl=""
  let baseTag = document.getElementsByTagName("base");
  if (baseTag.length) {
    baseUrl = baseTag[0].href;
  }
  else {
    baseUrl = location.origin;
    if (baseUrl[baseUrl.length - 1] != "/") {
      baseUrl += "/";
    }
  }
  return baseUrl;
}
function startsWith(str1, str2) {
  if (str2.length > str1.length) {
    return false;
  }

  var res = (str1.substring(0, str2.length) == str2);
  return res;
}
var loadHashTablePromise = null;
function loadHashTable() {
  if (loadHashTablePromise) {
    return loadHashTablePromise;
  }

  return loadHashTablePromise = new Promise(function (resolve, reject) {
    let jsonFileName = "system.cachebuster.json";
    var url = jsonFileName + "?v=" + new Date().valueOf();

    var oReq = new XMLHttpRequest();
    oReq.open("GET", url);
    oReq.send();
    oReq.addEventListener("load", function () {
      if (this.status == 200) {
        hashTable = JSON.parse(this.responseText);
      }
      else {
        hashTable = {};
      }
      cache_hash=hashTable;
      resolve(hashTable);
    });
  });
}
System.registry.set("vo-loader", System.newModule({ locate: locate }));
System.config({
  baseURL: ".",
  meta: {
    'xlsx': {
      exports: 'XLSX' // <-- tell SystemJS to expose the XLSX variable
    },
    "src/*": {
      loader: "vo-loader"
    }
  },
  paths: {
    "github:*": "../jspm_packages/github/*",
    "npm:*": "../node_modules/*",
    "src": "./src"
  },
  map: {
    "src": "./src",
    "aurelia-fetch-client": "npm:aurelia-fetch-client/dist/system/aurelia-fetch-client",
    "jquery-weui": "npm:jquery-weui/dist/js/jquery-weui.min",
    "jquery": "npm:jquery/dist/jquery.min",
    "materialize": "npm:materialize-css/dist/js/materialize.min",
    "jweixin": "../scripts/jweixin-1.1.0.js",
    "xlsx": "../node_modules/xlsx/dist/xlsx.core.min.js",
    "file-saver":"../node_modules/file-saver/FileSaver.min.js",
    "video.js": "../node_modules/video.js/dist/video.min.js",
    "laydate": "../node_modules/laydate/laydate/laydate.js",
    "teamy-utils":"./node_modules/teamy-utils/dist/utils.js",
    "tab_router":"./node_modules/teamy-utils/dist/src/cn/teamy/tab_router.js"
  },
  packages: {
    'node_modules':{defaultExtension: "js" },
    'src': { defaultExtension: "js" },
    'test': { defaultExtension: "js" }
  }

});

