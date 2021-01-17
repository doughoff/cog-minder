// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"3Orah":[function(require,module,exports) {
var HMR_HOST = null;var HMR_PORT = 1234;var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";module.bundle.HMR_BUNDLE_ID = "08c7601f1069259cd347b0265e1bb547";/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function(fn) {
      this._acceptCallbacks.push(fn || function() {});
    },
    dispose: function(fn) {
      this._disposeCallbacks.push(fn);
    },
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets;

function getHostname() {
  return (
    HMR_HOST ||
    (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost')
  );
}

function getPort() {
  return HMR_PORT || location.port;
}

// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = getHostname();
  var port = getPort();
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(
    protocol + '://' + hostname + (port ? ':' + port : '') + '/',
  );
  ws.onmessage = function(event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};

    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();

      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH);

      // Handle HMR Update
      var handled = false;
      assets.forEach(asset => {
        var didAccept =
          asset.type === 'css' || hmrAcceptCheck(module.bundle.root, asset.id);
        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();

        assets.forEach(function(asset) {
          hmrApply(module.bundle.root, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];
          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe
          ? ansiDiagnostic.codeframe
          : ansiDiagnostic.stack;

        console.error(
          '🚨 [parcel]: ' +
            ansiDiagnostic.message +
            '\n' +
            stack +
            '\n\n' +
            ansiDiagnostic.hints.join('\n'),
        );
      }

      // Render the fancy html overlay
      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };
  ws.onerror = function(e) {
    console.error(e.message);
  };
  ws.onclose = function(e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  let errorHTML =
    '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;

    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';

  overlay.innerHTML = errorHTML;

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function() {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };
  newLink.setAttribute(
    'href',
    link.getAttribute('href').split('?')[0] + '?' + Date.now(),
  );
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function() {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      var hostname = getHostname();
      var servedFromHMRServer =
        hostname === 'localhost'
          ? new RegExp(
              '^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort(),
            ).test(href)
          : href.indexOf(hostname + ':' + getPort());
      var absolute =
        /^https?:\/\//i.test(href) &&
        href.indexOf(window.location.origin) !== 0 &&
        !servedFromHMRServer;
      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;

  var cached = bundle.cache[id];

  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(module.bundle.root, id).some(function(v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function(cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function(cb) {
      var assetsToAlsoAccept = cb(function() {
        return getParents(module.bundle.root, id);
      });
      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }
  acceptedAssets[id] = true;
}

},{}],"4wJcN":[function(require,module,exports) {
var _commonJs = require("./common.js");
var _jquery = require("jquery");
const jq = _jquery.noConflict();
jq(function ($) {
  // Map of bot names to bot elements, created at page init
  const botElements = {};
  // Faction HTML ids to JSON category names
  const factionIdToCategoryName = {
    "faction0b10": "0b10",
    "factionArchitect": "Architect",
    "factionDerelict": "Derelict",
    "factionExile": "Exiles",
    "factionWarlord": "Warlord",
    "factionZionite": "Zionite"
  };
  // Spoiler faction HTML ids
  const spoilerFactionIds = ["factionWarlord", "factionZionite"];
  const redactedFactionIds = ["factionArchitect"];
  $(document).ready(() => {
    init();
  });
  // Creates the bot buttons and adds them to the grid
  function createBots() {
    const bots = Object.values(_commonJs.botData);
    const botsGrid = $("#botsGrid");
    bots.forEach(bot => {
      const botName = bot["Name"];
      const botId = _commonJs.nameToId(botName);
      const element = $(`<button
                    id="${botId}"
                    class="item btn"
                    data-html=true
                    data-content='${_commonJs.createBotDataContent(bot)}'
                    data-toggle="popover">
                    ${botName}
                 </button>`);
      botElements[botName] = element;
      botsGrid.append(element);
    });
    $('#botsGrid > [data-toggle="popover"]').popover();
  }
  // Gets a filter function combining all current filters
  function getBotFilter() {
    const filters = [];
    // Spoilers filter
    const spoilersState = _commonJs.getSpoilersState();
    if (spoilersState === "None") {
      filters.push(bot => !bot["Categories"].some(c => c === "Spoilers" || c === "Redacted"));
    } else if (spoilersState === "Spoilers") {
      filters.push(bot => !bot["Categories"].some(c => c === "Redacted"));
    }
    // Name filter
    const nameValue = $("#name").val().toLowerCase();
    if (nameValue.length > 0) {
      filters.push(bot => bot["Name"].toLowerCase().includes(nameValue));
    }
    // Class filter
    const classValue = $("#class").val().toLowerCase();
    if (classValue.length > 0) {
      filters.push(bot => bot["Class"].toLowerCase().includes(classValue));
    }
    // Part filter
    const partValue = $("#part").val().toLowerCase();
    if (partValue.length > 0) {
      filters.push(bot => {
        if (bot["Armament Data"].map(data => data["Name"]).some(name => name.toLowerCase().includes(partValue))) {
          return true;
        }
        if (bot["Components Data"].map(data => data["Name"]).some(name => name.toLowerCase().includes(partValue))) {
          return true;
        }
        for (let i = 0; i < bot["Armament Option Data"].length; i++) {
          const data = bot["Armament Option Data"][i];
          if (data.map(data => data["Name"]).some(name => name.toLowerCase().includes(partValue))) {
            return true;
          }
        }
        for (let i = 0; i < bot["Components Option Data"].length; i++) {
          const data = bot["Components Option Data"][i];
          if (data.map(data => data["Name"]).some(name => name.toLowerCase().includes(partValue))) {
            return true;
          }
        }
        return false;
      });
    }
    // Faction filter
    const factionId = $("#factionContainer > label.active").attr("id");
    if ((factionId in factionIdToCategoryName)) {
      const categoryName = factionIdToCategoryName[factionId];
      filters.push(bot => bot["Categories"].includes(categoryName));
    }
    // Create a function that checks all filters
    return bot => {
      return filters.every(func => func(bot));
    };
  }
  // Initialize the page state
  async function init() {
    await _commonJs.initData();
    createBots();
    // Load spoilers saved state
    $("#spoilers").text(_commonJs.getSpoilersState());
    // Set initial state
    updateFactionVisibility();
    resetFilters();
    // Register handlers
    $("#spoilersDropdown > button").on("click", e => {
      const state = $(e.target).text();
      $("#spoilers").text(state);
      _commonJs.setSpoilersState(state);
      $("#spoilersDropdown > button").tooltip("hide");
      updateFactionVisibility();
      updateBots();
    });
    $("#name").on("input", updateBots);
    $("#class").on("input", updateBots);
    $("#part").on("input", updateBots);
    $("#reset").click(() => {
      $("#reset").tooltip("hide");
      resetFilters();
    });
    $("#factionContainer > label > input").on("click", updateBots);
    $(window).on("click", e => {
      // If clicking outside of a popover close the current one
      if ($(e.target).parents(".popover").length === 0 && $(".popover").length >= 1) {
        $('[data-toggle="popover"]').not(e.target).popover("hide");
      }
    });
    // Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();
  }
  // Resets all filters
  function resetFilters() {
    // Reset text inputs
    $("#name").val("");
    $("#class").val("");
    $("#part").val("");
    // Reset buttons
    _commonJs.resetButtonGroup($("#factionContainer"));
    // Update visible bots
    updateBots();
  }
  // Sorts bot names
  function sortBotNames(botNames) {
    botNames.sort((a, b) => {
      let aValue = typeof a === "string" ? a : "";
      let bValue = typeof b === "string" ? b : "";
      return aValue.localeCompare(bValue);
    });
    return botNames;
  }
  // Clears all existing bots and adds new ones based on the filters
  function updateBots() {
    // Hide any existing popovers
    $('[data-toggle="popover"]').popover("hide");
    // Get the names of all non-filtered bots
    const botFilter = getBotFilter();
    let bots = [];
    Object.keys(_commonJs.botData).forEach(botName => {
      const bot = _commonJs.getBot(botName);
      if (botFilter(bot)) {
        bots.push(bot["Name"]);
      }
    });
    // Sort bot names for display
    bots = sortBotNames(bots);
    // Update visibility and order of all bots
    $("#botsGrid > button").addClass("not-visible");
    let precedingElement = null;
    bots.forEach(botName => {
      const element = botElements[botName];
      element.removeClass("not-visible");
      if (precedingElement == null) {
        $("#botGrid").append(element);
      } else {
        element.insertAfter(precedingElement);
      }
      precedingElement = element;
    });
  }
  // Updates faction visibility based on the spoiler state
  function updateFactionVisibility() {
    const state = _commonJs.getSpoilersState();
    const showSpoilers = state === "Spoilers";
    const showRedacted = state === "Redacted";
    if (showSpoilers) {
      spoilerFactionIds.forEach(faction => $(`#${faction}`).removeClass("not-visible"));
      redactedFactionIds.forEach(faction => $(`#${faction}`).addClass("not-visible"));
    } else if (showRedacted) {
      spoilerFactionIds.forEach(faction => $(`#${faction}`).removeClass("not-visible"));
      redactedFactionIds.forEach(faction => $(`#${faction}`).removeClass("not-visible"));
    } else {
      spoilerFactionIds.forEach(faction => $(`#${faction}`).addClass("not-visible"));
      redactedFactionIds.forEach(faction => $(`#${faction}`).addClass("not-visible"));
    }
  }
});

},{"./common.js":"2d4ET","jquery":"7ojxO"}],"2d4ET":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "botData", function () {
  return botData;
});
_parcelHelpers.export(exports, "categoryData", function () {
  return categoryData;
});
_parcelHelpers.export(exports, "itemData", function () {
  return itemData;
});
_parcelHelpers.export(exports, "entityMap", function () {
  return entityMap;
});
_parcelHelpers.export(exports, "createBotDataContent", function () {
  return createBotDataContent;
});
_parcelHelpers.export(exports, "createItemDataContent", function () {
  return createItemDataContent;
});
_parcelHelpers.export(exports, "escapeHtml", function () {
  return escapeHtml;
});
_parcelHelpers.export(exports, "flatten", function () {
  return flatten;
});
_parcelHelpers.export(exports, "gallerySort", function () {
  return gallerySort;
});
_parcelHelpers.export(exports, "getBot", function () {
  return getBot;
});
_parcelHelpers.export(exports, "getItemCategories", function () {
  return getItemCategories;
});
_parcelHelpers.export(exports, "getItem", function () {
  return getItem;
});
_parcelHelpers.export(exports, "getSpoilersState", function () {
  return getSpoilersState;
});
_parcelHelpers.export(exports, "nameToId", function () {
  return nameToId;
});
_parcelHelpers.export(exports, "noPrefixName", function () {
  return noPrefixName;
});
_parcelHelpers.export(exports, "initData", function () {
  return initData;
});
_parcelHelpers.export(exports, "resetButtonGroup", function () {
  return resetButtonGroup;
});
_parcelHelpers.export(exports, "randomInt", function () {
  return randomInt;
});
_parcelHelpers.export(exports, "setSpoilersState", function () {
  return setSpoilersState;
});
_parcelHelpers.export(exports, "valueOrDefault", function () {
  return valueOrDefault;
});
let botData;
let categoryData;
let itemData;
// Color schemes
const colorSchemeLowGood = "lowGood";
const colorSchemeHighGood = "highGood";
const colorSchemeGreen = "green";
const colorSchemeRed = "red";
const colorSchemes = {
  "lowGood": {
    low: "range-green",
    midLow: "range-yellow",
    midHigh: "range-orange",
    high: "range-red"
  },
  "highGood": {
    low: "range-red",
    midLow: "range-orange",
    midHigh: "range-yellow",
    high: "range-green"
  },
  "green": {
    low: "range-green",
    midLow: "range-green",
    midHigh: "range-green",
    high: "range-green"
  },
  "red": {
    low: "range-red",
    midLow: "range-red",
    midHigh: "range-red",
    high: "range-red"
  }
};
const entityMap = {
  '&': '&amp;',
  '<': 'ᐸ',
  '>': 'ᐳ',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
  '\n': '<br />'
};
// Ceil the number to the nearest multiple
function ceilToMultiple(num, multiple) {
  return Math.ceil(num / multiple) * multiple;
}
// Creates a range line from minVal to maxVal using filled squares with the given color scheme with no unit
function rangeLine(category, valueString, value, defaultValueString, minValue, maxValue, colorScheme) {
  return rangeLineUnit(category, valueString, value, "", defaultValueString, minValue, maxValue, colorScheme);
}
// Creates a range line from minVal to maxVal using filled squares with the given color scheme
function rangeLineUnit(category, valueString, value, unitString, defaultValueString, minValue, maxValue, colorScheme) {
  let valueHtml;
  if (typeof valueString != "string") {
    valueString = defaultValueString;
    value = 0;
    valueHtml = `<span class="dim-text">${defaultValueString}${unitString}</span>`;
  } else {
    valueHtml = valueString + unitString;
  }
  // Determine bars and spacing
  const maxBars = 22;
  const numSpaces = 23 - 1 - 1 - category.length - valueString.length - unitString.length;
  let valuePercentage;
  if (maxValue - minValue === 0) {
    valuePercentage = 1;
  } else {
    valuePercentage = value / (maxValue - minValue);
  }
  let fullBars = Math.min(Math.floor(maxBars * valuePercentage), 22);
  // Always round away from 0
  // This allows for things like 1/100 to show 1 bar rather than 0
  if (fullBars === 0 && value != minValue) {
    fullBars = 1;
  }
  if (minValue === maxValue) {
    fullBars = 0;
  }
  const emptyBars = maxBars - fullBars;
  // Determine color
  let colorClass;
  if (valuePercentage < .25) {
    colorClass = colorSchemes[colorScheme].low;
  } else if (valuePercentage < .5) {
    colorClass = colorSchemes[colorScheme].midLow;
  } else if (valuePercentage < .75) {
    colorClass = colorSchemes[colorScheme].midHigh;
  } else {
    colorClass = colorSchemes[colorScheme].high;
  }
  // Create bars HTML string
  let barsHtml;
  if (emptyBars > 0) {
    barsHtml = `<span class="${colorClass}">${"▮".repeat(fullBars)}</span><span class="range-dim">${"▯".repeat(emptyBars)}</span>`;
  } else {
    barsHtml = `<span class=${colorClass}>${"▮".repeat(fullBars)}</span>`;
  }
  // Return full HTML
  return `
    <pre class="popover-line"> ${category}${" ".repeat(numSpaces)}${valueHtml} ${barsHtml}</pre>
    `;
}
// Create a summary line
function summaryLine(text) {
  return `<pre class="popover-summary">${text}</pre>`;
}
// Creates a summary line with an optional projectile multiplier
function summaryProjectileLine(item, category) {
  if (("Projectile Count" in item) && parseInt(item["Projectile Count"]) > 1) {
    return `<pre class="popover-summary">${category}${" ".repeat(13)}<span class="projectile-num"> x${item["Projectile Count"]} </span></pre>`;
  } else {
    return summaryLine("Projectile");
  }
}
// Create a text line with no value and default style
function textLine(category, text) {
  const numSpaces = 23 - 1 - category.length;
  return `<pre class="popover-line"> ${category}${" ".repeat(numSpaces)}${text}</pre>`;
}
// Create a text line with no value and dim style
function textLineDim(category, text) {
  const numSpaces = 23 - 1 - category.length;
  return `<pre class="popover-line"> ${category}${" ".repeat(numSpaces)}<span class="dim-text">${text}</span></pre>`;
}
// Create a text line with no value  and a default
function textLineWithDefault(category, textString, defaultString) {
  if (typeof textString != "string") {
    textString = `<span class="dim-text">${defaultString}</span>`;
  }
  const numSpaces = 23 - 1 - category.length;
  return `<pre class="popover-line"> ${category}${" ".repeat(numSpaces)}${textString}</pre>`;
}
// Create a text line with a value and a given HTML string for the text
function textValueHtmlLine(category, valueString, valueClass, textHtml) {
  const numSpaces = 23 - 1 - 1 - category.length - valueString.length;
  let valueHtml;
  if (typeof valueClass === "string" && valueClass.length > 0) {
    valueHtml = `<span class="${valueClass}">${valueString}</span>`;
  } else {
    valueHtml = valueString;
  }
  return `<pre class="popover-line"> ${category}${" ".repeat(numSpaces)}${valueHtml} ${textHtml}</pre>`;
}
// Create a value line with no text
function valueLine(category, valueString) {
  const numSpaces = 23 - 1 - category.length - 1 - valueString.length;
  return `<pre class="popover-line"> ${category}${" ".repeat(numSpaces)}${valueString}</pre>`;
}
// Create a value line with no text and a default
function valueLineUnitsWithDefault(category, valueString, unitString, defaultString) {
  let valueLength;
  if (typeof valueString != "string") {
    valueString = `<span class="dim-text">${defaultString}${unitString}</span>`;
    valueLength = defaultString.length + unitString.length;
  } else {
    valueString += unitString;
    valueLength = valueString.length;
  }
  const numSpaces = 23 - 1 - category.length - 1 - valueLength;
  return `<pre class="popover-line"> ${category}${" ".repeat(numSpaces)}${valueString}</pre>`;
}
// Create a value line with no text and a default
function valueLineWithDefault(category, valueString, defaultString) {
  let valueLength;
  if (typeof valueString != "string") {
    valueString = `<span class="dim-text">${defaultString}</span>`;
    valueLength = defaultString.length;
  } else {
    valueLength = valueString.length;
  }
  const numSpaces = 23 - 1 - category.length - 1 - valueLength;
  return `<pre class="popover-line"> ${category}${" ".repeat(numSpaces)}${valueString}</pre>`;
}
function createBotDataContent(bot) {
  function createItemHtml(data) {
    let line = `${escapeHtml(data["Name"])} (${data["Coverage"]}%)`;
    if (data["Number"] > 1) {
      line += " x" + data["Number"].toString();
    }
    return `${itemLine(line)}`;
  }
  function createItemOptionHtml(data) {
    // Add all options
    let html = "";
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let line;
      if (item["Name"] === "None") {
        line = "None";
      } else {
        line = `${item["Name"]} (${item["Coverage"]}%)`;
      }
      if (item["Number"] > 1) {
        line += " x" + item["Number"].toString();
      }
      html += itemLineOption(line, i);
    }
    return html;
  }
  function getRatingValue(bot) {
    const ratingString = bot["Rating"];
    const ratingArray = ratingString.split("-").map(s => s.trim()).map(s => parseInt(s));
    return ratingArray.reduce((sum, val) => sum + val, 0) / ratingArray.length;
  }
  function itemLine(itemString) {
    return `<pre class="popover-line"> ${itemString}</pre>`;
  }
  function itemLineOption(itemString, i) {
    return `<pre class="popover-line"><span class="popover-option"> ${String.fromCharCode(97 + i)})</span><span> ${itemString}</span></pre>`;
  }
  // Create overview
  let html = `
    <pre class="popover-title">${escapeHtml(bot["Name"])}</pre>
    <p/>
    ${summaryLine("Overview")}
    ${textLine("Class", bot["Class"])}
    ${textLine("Size", bot["Size"])}
    ${rangeLine("Rating", bot["Rating"], getRatingValue(bot), null, 0, 165, colorSchemeLowGood)}
    ${textLine("Value", bot["Value"])}
    ${textLine("Visual Range", bot["Visual Range"])}
    ${textLine("Movement", bot["Movement"])}
    ${rangeLine("Core Integrity", bot["Core Integrity"].toString(), bot["Core Integrity"], null, 0, bot["Core Integrity"], colorSchemeGreen)}
    ${rangeLineUnit("Core Exposure", bot["Core Exposure"].toString(), bot["Core Exposure"], "%", null, 0, 100, colorSchemeLowGood)}
    ${textLine("Salvage Potential", bot["Salvage Potential"])}
    <p/>
    ${summaryLine("Armament")}
    `;
  // Add armament items and options
  if (bot["Armament"].length > 0) {
    bot["Armament Data"].forEach(data => {
      html += createItemHtml(data);
    });
    for (let i = 0; i < bot["Armament Option Data"].length; i++) {
      if (i != 0 || bot["Armament Data"].length > 0) {
        html += "<p/>";
      }
      html += createItemOptionHtml(bot["Armament Option Data"][i]);
    }
  } else {
    html += itemLine("None");
  }
  // Add component items
  html += `
    <p/>
    ${summaryLine("Components")}
    `;
  if (bot["Components"].length > 0) {
    bot["Components Data"].forEach(data => {
      html += createItemHtml(data);
    });
    for (let i = 0; i < bot["Components Option Data"].length; i++) {
      if (i != 0 || bot["Components Data"].length > 0) {
        html += "<p/>";
      }
      html += createItemOptionHtml(bot["Components Option Data"][i]);
    }
  } else {
    html += itemLine("N/A");
  }
  // Add Resistances/immunities
  const resistances = Object.keys(valueOrDefault(bot["Resistances"], {}));
  const immunities = valueOrDefault(bot["Immunities"], []);
  if (resistances.length > 0 || immunities.length > 0) {
    html += `
        <p/>
        ${summaryLine("Resistances")}
        `;
    resistances.forEach(damageType => {
      const resistValue = bot["Resistances"][damageType];
      if (resistValue > 0) {
        html += rangeLine(damageType, resistValue.toString() + "%", resistValue, null, 0, 100, colorSchemeGreen);
      } else {
        html += rangeLine(damageType, resistValue.toString() + "%", resistValue, null, 0, -100, colorSchemeRed);
      }
    });
    immunities.forEach(immunity => {
      html += textLineDim(immunity, "IMMUNE");
    });
  }
  // Add traits
  const traits = valueOrDefault(bot["Traits"], {});
  if (traits.length > 0) {
    html += `
        <p/>
        ${summaryLine("Traits")}
        `;
    traits.forEach(trait => {
      html += itemLine(trait);
    });
  }
  // Add description
  const description = escapeHtml(valueOrDefault(bot["Description"], ""));
  if (description.length > 0) {
    html += `
        <p/>
        ${summaryLine("Description")}
        <span class="popover-description">${description}</span>
        `;
  }
  return html;
}
function createItemDataContent(item) {
  function getDamageValue(item) {
    const damageString = item["Damage"];
    const damageArray = damageString.split("-").map(s => s.trim()).map(s => parseInt(s));
    return damageArray.reduce((sum, val) => sum + val, 0) / damageArray.length;
  }
  function getDelayString(item) {
    if (("Delay" in item)) {
      const delay = item["Delay"];
      if (delay[0] != "-") {
        return "+" + delay;
      }
      return delay;
    }
    return null;
  }
  function getExplosionValue(item) {
    const damageString = item["Explosion Damage"];
    const damageArray = damageString.split("-").map(s => s.trim()).map(s => parseInt(s));
    return damageArray.reduce((sum, val) => sum + val, 0) / damageArray.length;
  }
  function getFabricationMatterValue(item) {
    const matter = item["Fabrication Matter"];
    const siphonMatter = Math.floor(parseInt(item["Fabrication Matter"]) * .75).toString();
    return `${matter} (With siphon: ${siphonMatter})`;
  }
  function getNegativeString(item, category) {
    const value = item[category];
    if (value === undefined) {
      return null;
    } else if (value[0] === "-") {
      return value;
    } else {
      return "-" + value;
    }
  }
  function getOverloadStabilityValue(item) {
    const stabilityString = item["Overload Stability"];
    if (stabilityString === undefined) {
      return 0;
    } else {
      return parseInt(stabilityString.slice(0, -1));
    }
  }
  function getPenetrationTextHtml(item) {
    const penetrationString = item["Penetration"];
    if (penetrationString === undefined) {
      return "";
    }
    const penetrationArray = penetrationString.split("/").map(s => s.trim());
    return penetrationArray.join(" / ");
  }
  function getPenetrationValueClass(item) {
    if (("Penetration" in item)) {
      return null;
    }
    return "dim-text";
  }
  function getPenetrationValue(item) {
    const penetrationString = item["Penetration"];
    if (penetrationString === undefined) {
      return "x0";
    }
    if (penetrationString === "Unlimited") {
      return "x*";
    }
    const penetrationArray = penetrationString.split("/").map(s => s.trim());
    return "x" + penetrationArray.length;
  }
  function getPositiveString(item, category) {
    const value = item[category];
    if (value === undefined) {
      return null;
    } else {
      return "+" + value;
    }
  }
  function getPowerStabilityValue(item) {
    const stabilityString = item["Power Stability"];
    if (stabilityString === undefined) {
      return 0;
    } else {
      return parseInt(stabilityString.slice(0, -1));
    }
  }
  function getRatingHtml(item) {
    const category = item["Category"];
    if (category === "Prototype") {
      return '<span class="rating-prototype"> Prototype </span>';
    } else if (category === "Alien") {
      return '<span class="rating-alien"> Alien </span>';
    } else {
      return '<span class="dim-text">Standard</span>';
    }
  }
  function getSchematicString(item) {
    if (item["Hackable Schematic"] === "1") {
      return "Hackable";
    } else if (("Fabrication Number" in item)) {
      return "Not Hackable";
    }
    return null;
  }
  function getSlotString(item) {
    let slotType = item["Slot"];
    if (item["Slot"] === "N/A") {
      // Take care of item special cases
      if (item["Type"] === "Item" || item["Type"] === "Trap") {
        slotType = "Inventory";
      } else {
        return `<span class="dim-text">N/A</span>`;
      }
    }
    if (("Size" in item) && parseInt(item["Size"]) > 1) {
      return `${slotType} x${item["Size"]}`;
    }
    return slotType;
  }
  // Create overview
  let html = `
    <pre class="popover-title">${escapeHtml(item["Name"])}</pre>
    <p/>
    ${summaryLine("Overview")}
    ${textLine("Type", item["Type"])}
    ${textLine("Slot", getSlotString(item))}
    ${rangeLine("Mass", item["Mass"], parseInt(item["Mass"]), "N/A", 0, 15, colorSchemeLowGood)}
    ${textValueHtmlLine("Rating", item["Rating"].replace("**", "").replace("*", ""), "", getRatingHtml(item))}
    ${rangeLine("Integrity", item["Integrity"], 1, null, 0, 1, colorSchemeGreen)}
    ${valueLine("Coverage", valueOrDefault(item["Coverage"], "0"))}
    ${textLineWithDefault("Schematic", getSchematicString(item), "N/A")}
    `;
  if (item["Slot"] === "Power") {
    // Add power-unique categories
    html += `
        <p/>
        ${summaryLine("Active Upkeep")}
        ${rangeLine("Energy", null, 0, "-0", 0, 0, colorSchemeLowGood)}
        ${rangeLine("Matter", null, 0, "-0", 0, 0, colorSchemeLowGood)}
        ${rangeLine("Heat", getPositiveString(item, "Heat Generation"), parseInt(item["Heat Generation"]), "+0", 0, 20, colorSchemeLowGood)}
        <p/>
        ${summaryLine("Power")}
        ${rangeLine("Supply", "+" + item["Energy Generation"], parseInt(item["Energy Generation"]), null, 0, 30, colorSchemeGreen)}
        ${rangeLine("Storage", item["Energy Storage"], parseInt(item["Energy Storage"]), "0", 0, 300, colorSchemeGreen)}
        ${rangeLine("Stability", item["Power Stability"], getPowerStabilityValue(item), "N/A", 0, 100, colorSchemeHighGood)}
        `;
  } else if (item["Slot"] === "Propulsion") {
    // Add propulsion-unique categories
    html += `
        <p/>
        ${summaryLine("Active Upkeep")}
        ${rangeLine("Energy", getNegativeString(item, "Energy Upkeep"), parseInt(item["Energy Upkeep"]), "-0", 0, 20, colorSchemeLowGood)}
        ${rangeLine("Matter", null, 0, "-0", 0, 0, colorSchemeLowGood)}
        ${rangeLine("Heat", getPositiveString(item, "Heat Generation"), parseInt(item["Heat Generation"]), "+0", 0, 20, colorSchemeLowGood)}
        <p/>
        ${summaryLine("Propulsion")}
        ${rangeLine("Time/Move", item["Time/Move"], parseInt(item["Time/Move"]), null, 0, 150, colorSchemeLowGood)}
        ${("Mod/Extra" in item) ? valueLine(" Mod/Extra", item["Mod/Extra"]) : ""}
        ${rangeLine("Energy", getNegativeString(item, "Energy/Move"), parseInt(item["Energy/Move"]), "-0", 0, 10, colorSchemeLowGood)}
        ${rangeLine("Heat", getPositiveString(item, "Heat/Move"), parseInt(item["Heat/Move"]), "+0", 0, 10, colorSchemeLowGood)}
        ${rangeLine("Support", item["Support"], parseInt(item["Support"]), null, 0, 20, colorSchemeHighGood)}
        ${rangeLine(" Penalty", item["Penalty"], parseInt(item["Penalty"]), "0", 0, 60, colorSchemeLowGood)}
        ${item["Type"] === "Treads" ? textLineWithDefault("Siege", item["Siege"], "N/A") : rangeLine("Burnout", item["Burnout"], parseInt(item["Burnout"]), "N/A", 0, 100, colorSchemeLowGood)}
        `;
  } else if (item["Slot"] == "Utility") {
    // Add utility-unique categories
    html += `
        <p/>
        ${summaryLine("Active Upkeep")}
        ${rangeLine("Energy", getNegativeString(item, "Energy Upkeep"), parseInt(item["Energy Upkeep"]), "-0", 0, 20, colorSchemeLowGood)}
        ${rangeLine("Matter", getNegativeString(item, "Matter Upkeep"), parseInt(item["Matter Upkeep"]), "-0", 0, 20, colorSchemeLowGood)}
        ${rangeLine("Heat", getPositiveString(item, "Heat Generation"), parseInt(item["Heat Generation"]), "+0", 0, 20, colorSchemeLowGood)}
        `;
  } else {
    // Add weapon-unique categories
    if (item["Type"].includes("Gun") || item["Type"].includes("Cannon")) {
      html += `
            <p/>
            ${summaryLine("Shot")}
            ${rangeLine("Range", item["Range"], parseInt(item["Range"]), null, 0, 20, colorSchemeHighGood)}
            ${rangeLine("Energy", getNegativeString(item, "Shot Energy"), parseInt(item["Shot Energy"]), "-0", 0, 50, colorSchemeLowGood)}
            ${rangeLine("Matter", getNegativeString(item, "Shot Matter"), parseInt(item["Shot Matter"]), "-0", 0, 25, colorSchemeLowGood)}
            ${rangeLine("Heat", getPositiveString(item, "Shot Heat"), parseInt(item["Shot Heat"]), "-0", 0, 100, colorSchemeLowGood)}
            ${valueLineWithDefault("Recoil", item["Recoil"], "0")}
            ${valueLineUnitsWithDefault("Targeting", item["Targeting"], "%", "0")}
            ${valueLineWithDefault("Delay", getDelayString(item), "0")}
            ${rangeLine("Stability", item["Overload Stability"], getOverloadStabilityValue(item), "N/A", 0, 100, colorSchemeHighGood)}
            ${("Waypoints" in item) ? valueLine("Waypoints", item["Waypoints"]) : valueLineWithDefault("Arc", item["Arc"], "N/A")}
            <p/>
            ${summaryProjectileLine(item, "Projectile")}
            ${rangeLine("Damage", item["Damage"], getDamageValue(item), null, 0, 100, colorSchemeGreen)}
            ${textLine("Type", item["Damage Type"])}
            ${rangeLineUnit("Critical", item["Critical"], parseInt(item["Critical"]), "%", "0", 0, 50, colorSchemeGreen)}
            ${textValueHtmlLine("Penetration", getPenetrationValue(item), getPenetrationValueClass(item), getPenetrationTextHtml(item))}
            ${("Heat Transfer" in item) ? textLine("Heat Transfer", item["Heat Transfer"]) : textLineWithDefault("Spectrum", item["Spectrum"], "N/A")}
            ${rangeLineUnit("Disruption", item["Disruption"], parseInt(item["Disruption"]), "%", "0", 0, 50, colorSchemeGreen)}
            ${valueLineWithDefault("Salvage", item["Salvage"], "0")}
            `;
    } else if (item["Type"] === "Launcher") {
      html += `
            <p/>
            ${summaryLine("Shot")}
            ${rangeLine("Range", item["Range"], parseInt(item["Range"]), null, 0, 20, colorSchemeHighGood)}
            ${rangeLine("Energy", getNegativeString(item, "Shot Energy"), parseInt(item["Shot Energy"]), "-0", 0, 50, colorSchemeLowGood)}
            ${rangeLine("Matter", getNegativeString(item, "Shot Matter"), parseInt(item["Shot Matter"]), "-0", 0, 25, colorSchemeLowGood)}
            ${rangeLine("Heat", getPositiveString(item, "Shot Heat"), parseInt(item["Shot Heat"]), "-0", 0, 100, colorSchemeLowGood)}
            ${valueLineWithDefault("Recoil", item["Recoil"], "0")}
            ${valueLineUnitsWithDefault("Targeting", item["Targeting"], "%", "0")}
            ${valueLineWithDefault("Delay", getDelayString(item), "0")}
            ${rangeLine("Stability", item["Overload Stability"], getOverloadStabilityValue(item), "N/A", 0, 100, colorSchemeHighGood)}
            ${("Waypoints" in item) ? valueLine("Waypoints", item["Waypoints"]) : valueLineWithDefault("Arc", item["Arc"], "N/A")}
            <p/>
            ${summaryProjectileLine(item, "Explosion")}
            ${rangeLine("Radius", item["Explosion Radius"], parseInt(item["Explosion Radius"]), null, 0, 8, colorSchemeGreen)}
            ${rangeLine("Damage", item["Explosion Damage"], getExplosionValue(item), null, 0, 100, colorSchemeGreen)}
            ${valueLineWithDefault(" Falloff", ("Falloff" in item) ? "-" + item["Falloff"] : null, "0")}
            ${textLine("Type", item["Explosion Type"])}
            ${textLineWithDefault("Spectrum", item["Explosion Spectrum"], "N/A")}
            ${rangeLineUnit("Disruption", item["Explosion Disruption"], parseInt(item["Explosion Disruption"]), "%", "0", 0, 50, colorSchemeGreen)}
            ${valueLineWithDefault("Salvage", item["Explosion Salvage"], "0")}
            `;
    } else if (item["Type"] === "Special Melee Weapon") {
      html += `
            <p/>
            ${summaryLine("Attack")}
            ${rangeLine("Energy", getNegativeString(item, "Shot Energy"), parseInt(item["Shot Energy"]), "-0", 0, 50, colorSchemeLowGood)}
            ${rangeLine("Matter", getNegativeString(item, "Shot Matter"), parseInt(item["Shot Matter"]), "-0", 0, 25, colorSchemeLowGood)}
            ${rangeLine("Heat", getPositiveString(item, "Shot Heat"), parseInt(item["Shot Heat"]), "-0", 0, 100, colorSchemeLowGood)}
            ${valueLineUnitsWithDefault("Targeting", item["Targeting"], "%", "0")}
            ${valueLineWithDefault("Delay", getDelayString(item), "0")}
            `;
    } else if (item["Type"] === "Special Weapon") {
      html += `
            <p/>
            ${summaryLine("Shot")}
            ${rangeLine("Range", item["Range"], parseInt(item["Range"]), null, 0, 20, colorSchemeHighGood)}
            ${rangeLine("Energy", getNegativeString(item, "Shot Energy"), parseInt(item["Shot Energy"]), "-0", 0, 50, colorSchemeLowGood)}
            ${rangeLine("Matter", getNegativeString(item, "Shot Matter"), parseInt(item["Shot Matter"]), "-0", 0, 25, colorSchemeLowGood)}
            ${rangeLine("Heat", getPositiveString(item, "Shot Heat"), parseInt(item["Shot Heat"]), "-0", 0, 100, colorSchemeLowGood)}
            ${valueLineWithDefault("Recoil", item["Recoil"], "0")}
            ${valueLineUnitsWithDefault("Targeting", item["Targeting"], "%", "0")}
            ${valueLineWithDefault("Delay", getDelayString(item), "0")}
            ${rangeLine("Stability", item["Overload Stability"], getOverloadStabilityValue(item), "N/A", 0, 100, colorSchemeHighGood)}
            ${("Waypoints" in item) ? valueLine("Waypoints", item["Waypoints"]) : valueLineWithDefault("Arc", item["Arc"], "N/A")}
            `;
      if (("Damage" in item)) {
        html += `
                <p/>
                ${summaryLine("Projectile")}
                ${rangeLine("Damage", item["Damage"], getDamageValue(item), null, 0, 100, colorSchemeGreen)}
                ${textLine("Type", item["Damage Type"])}
                ${rangeLineUnit("Critical", item["Critical"], parseInt(item["Critical"]), "%", "0", 0, 50, colorSchemeGreen)}
                ${textValueHtmlLine("Penetration", getPenetrationValue(item), getPenetrationValueClass(item), getPenetrationTextHtml(item))}
                ${("Heat Transfer" in item) ? textLine("Heat Transfer", item["Heat Transfer"]) : textLineWithDefault("Spectrum", item["Spectrum"], "N/A")}
                ${rangeLineUnit("Disruption", item["Disruption"], parseInt(item["Disruption"]), "%", "0", 0, 50, colorSchemeGreen)}
                ${valueLineWithDefault("Salvage", item["Salvage"], "0")}
                `;
      }
    } else if (item["Type"] === "Impact Weapon" || item["Type"] === "Slashing Weapon" || item["Type"] === "Piercing Weapon") {
      html += `
            <p/>
            ${summaryLine("Attack")}
            ${rangeLine("Energy", getNegativeString(item, "Shot Energy"), parseInt(item["Shot Energy"]), "-0", 0, 50, colorSchemeLowGood)}
            ${rangeLine("Matter", getNegativeString(item, "Shot Matter"), parseInt(item["Shot Matter"]), "-0", 0, 25, colorSchemeLowGood)}
            ${rangeLine("Heat", getPositiveString(item, "Shot Heat"), parseInt(item["Shot Heat"]), "-0", 0, 100, colorSchemeLowGood)}
            ${valueLineUnitsWithDefault("Targeting", item["Targeting"], "%", "0")}
            ${valueLineWithDefault("Delay", getDelayString(item), "0")}
            <p/>
            ${rangeLine("Damage", item["Damage"], getDamageValue(item), null, 0, 100, colorSchemeGreen)}
            ${textLine("Type", item["Damage Type"])}
            ${rangeLineUnit("Critical", item["Critical"], parseInt(item["Critical"]), "%", "0", 0, 50, colorSchemeGreen)}
            ${rangeLineUnit("Disruption", item["Disruption"], parseInt(item["Disruption"]), "%", "0", 0, 50, colorSchemeGreen)}
            ${valueLineWithDefault("Salvage", item["Salvage"], "0")}
            `;
    }
  }
  // Add effect/description if present
  if (("Effect" in item) || ("Description" in item)) {
    html += `
        <p/>
        ${summaryLine("Effect")}
        `;
    if (("Effect" in item)) {
      html += `<span class="popover-description">${escapeHtml(item["Effect"])}</span>`;
      if (("Description" in item)) {
        html += "<p/><p/>";
      }
    }
    if (("Description" in item)) {
      html += `<span class="popover-description">${escapeHtml(item["Description"])}</span>`;
    }
  }
  // Add fabrication stats if present
  if (("Fabrication Number" in item)) {
    const number = item["Fabrication Number"];
    html += "<p/>";
    if (number == "1") {
      html += summaryLine("Fabrication");
    } else {
      html += summaryLine(`Fabrication x${number}`);
    }
    html += `
        ${textLine("Time", item["Fabrication Time"])}
        ${textLine("Matter", getFabricationMatterValue(item))}
        ${textLine("Components", "None")}
        `;
  }
  return html;
}
function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/\n]/g, function (s) {
    return entityMap[s];
  });
}
function flatten(arrays) {
  return [].concat.apply([], arrays);
}
function gallerySort(a, b) {
  const noPrefixA = noPrefixName(a);
  const noPrefixB = noPrefixName(b);
  let res = (noPrefixA > noPrefixB) - (noPrefixA < noPrefixB);
  if (res === 0) {
    // If no-prefix names match then use index in gallery export
    // There may be some formula to determine the real order or
    // it may be a hand-crafted list, I couldn't tell either way.
    // The export index will always be ordered for different prefix
    // versions of the same parts so this is the best way to sort
    // them how the in-game gallery does.
    res = parseInt(getItem(a)["Index"]) - parseInt(getItem(b)["Index"]);
  }
  return res;
}
function getBot(botName) {
  if ((botName in botData)) {
    return botData[botName];
  }
  console.trace();
  throw `${botName} not a valid bot`;
}
function getItemCategories(itemName) {
  if ((itemName in categoryData)) {
    return categoryData[itemName];
  }
  console.trace();
  throw `${itemName} not in category data`;
}
function getItem(itemName) {
  if ((itemName in itemData)) {
    return itemData[itemName];
  }
  console.trace();
  throw `${itemName} not a valid item`;
}
function getSpoilersState() {
  let value = valueOrDefault(window.localStorage.getItem("spoilers"), "None");
  if (typeof value != "string" || value != "None" && value != "Spoilers" && value != "Redacted") {
    value = "None";
  }
  return value;
}
// Converts an item or bot's name to an HTML id
const nameToIdRegex = /[ /.'"\]\[]]*/g;
function nameToId(name) {
  const id = `item${name.replace(nameToIdRegex, "")}`;
  return id;
}
// Removes the prefix from an item name
const noPrefixRegex = /\w{3}\. (.*)/;
function noPrefixName(name) {
  const newName = name.replace(noPrefixRegex, "$1");
  return newName;
}
async function initData() {
  // Load external files
  const bots = fetch("./json/bots.json").then(response => response.json());
  const categories = fetch("./json/categories.json").then(response => response.json());
  const items = fetch("./json/items.json").then(response => response.json());
  await Promise.all([bots, categories, items]);
  botData = await bots;
  categoryData = await categories;
  itemData = await items;
  // Add calculated properties to items
  Object.keys(itemData).forEach(itemName => {
    // Add no prefix name
    const item = getItem(itemName);
    const name = noPrefixName(itemName);
    item["No Prefix Name"] = name;
    // Add float-value rating
    const rating = item["Rating"];
    if (rating.includes("*")) {
      item["Float Rating"] = parseFloat(rating.slice(0, rating.lastIndexOf("*"))) + 0.5;
    } else {
      item["Float Rating"] = parseFloat(rating);
    }
    // Add int-value size/mass
    item["Int Size"] = parseInt(item["Size"]);
    item["Int Mass"] = parseInt(item["Mass"]);
    // Add default coverage
    if ((!"Coverage" in item) || isNaN(parseInt(item["Coverage"]))) {
      item["Coverage"] = "0";
    }
  });
  // Add calculated properties to bots
  Object.keys(botData).forEach(botName => {
    function sumItemCoverage(sum, data) {
      if (typeof data === "string") {
        // Item name, just parse coverage
        return parseInt(getItem(data)["Coverage"]) + sum;
      } else {
        // Option, return largest sum of items
        let largest = 0;
        data.forEach(optionData => {
          if (optionData["Name"] === "None") {
            return;
          }
          const number = valueOrDefault(optionData["Number"], 1);
          const item = getItem(optionData["Name"]);
          const optionCoverage = parseInt(item["Coverage"]) * number;
          largest = Math.max(largest, optionCoverage);
        });
        return largest + sum;
      }
    }
    const bot = getBot(botName);
    bot["Name"] = botName;
    const itemCoverage = bot["Armament"].reduce(sumItemCoverage, 0) + bot["Components"].reduce(sumItemCoverage, 0);
    let roughCoreCoverage = 100.0 / (100.0 - bot["Core Exposure"]) * itemCoverage - itemCoverage;
    if (isNaN(roughCoreCoverage)) {
      roughCoreCoverage = 1;
    }
    const estimatedCoreCoverage = ceilToMultiple(roughCoreCoverage, 10);
    const totalCoverage = estimatedCoreCoverage + itemCoverage;
    bot["Core Coverage"] = estimatedCoreCoverage;
    bot["Total Coverage"] = totalCoverage;
    let partData = [];
    let partOptionData = [];
    function addPartData(data) {
      if (typeof data === "string") {
        const itemName = data;
        // Item name, add to part data
        let result = partData.find(p => p["Name"] === data);
        if (result === undefined) {
          const item = getItem(itemName);
          partData.push({
            "Name": itemName,
            "Number": 1,
            "Coverage": Math.floor(100.0 * parseInt(item["Coverage"]) / totalCoverage),
            "Integrity": parseInt(item["Integrity"])
          });
        } else {
          result["Number"] += 1;
        }
      } else {
        // Option, add all options
        const options = [];
        data.forEach(optionData => {
          const itemName = optionData["Name"];
          let coverage = undefined;
          const item = getItem(itemName);
          if (itemName !== "None") {
            coverage = Math.floor(100.0 * parseInt(item["Coverage"]) / totalCoverage);
          }
          options.push({
            "Name": itemName,
            "Number": optionData["Number"],
            "Coverage": coverage,
            "Integrity": item["Integrity"]
          });
        });
        partOptionData.push(options);
      }
    }
    // Add armament and component data
    bot["Armament"].forEach(addPartData);
    bot["Armament Data"] = partData;
    bot["Armament Option Data"] = partOptionData;
    partData = [];
    partOptionData = [];
    bot["Components"].forEach(addPartData);
    bot["Components Data"] = partData;
    bot["Components Option Data"] = partOptionData;
  });
}
function resetButtonGroup(group) {
  group.children().removeClass("active");
  group.children("label:first-of-type").addClass("active");
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Rounds the number to the nearest multiple
function roundToMultiple(num, multiple) {
  return multiple * Math.round(num / multiple);
}
function setSpoilersState(state) {
  window.localStorage.setItem("spoilers", state);
}
function valueOrDefault(val, defaultVal) {
  if (val === undefined) {
    return defaultVal;
  }
  return val;
}

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"HNevC"}],"HNevC":[function(require,module,exports) {
"use strict";

exports.interopDefault = function (a) {
  return a && a.__esModule ? a : {
    default: a
  };
};

exports.defineInteropFlag = function (a) {
  Object.defineProperty(a, '__esModule', {
    value: true
  });
};

exports.exportAll = function (source, dest) {
  Object.keys(source).forEach(function (key) {
    if (key === 'default' || key === '__esModule') {
      return;
    } // Skip duplicate re-exports when they have the same value.


    if (key in dest && dest[key] === source[key]) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function () {
        return source[key];
      }
    });
  });
  return dest;
};

exports.export = function (dest, destName, get) {
  Object.defineProperty(dest, destName, {
    enumerable: true,
    get: get
  });
};
},{}]},{},["3Orah","4wJcN"], "4wJcN", "parcelRequire5d10")

//# sourceMappingURL=bots.5e1bb547.js.map
