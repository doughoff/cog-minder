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
})({"4upkk":[function(require,module,exports) {
var HMR_HOST = null;var HMR_PORT = 1234;var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";module.bundle.HMR_BUNDLE_ID = "2eb2bee5398675d31e9ad25079bd35df";/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

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

},{}],"18CUN":[function(require,module,exports) {
var _commonJs = require("./common.js");
var _simulatorCalcsJs = require("./simulatorCalcs.js");
const jq = jQuery.noConflict();
jq(function ($) {
  const spoilerItemCategories = [1, 4, 5, 6];
  const redactedItemCategory = 7;
  // Actual accuracy is 60 for ranged and 70 for melee but just assume the
  // defender immobile bonus for + 10
  const initialRangedAccuracy = 70;
  const initialMeleeAccuracy = 80;
  // Chart variables set on init
  let chart;
  let comparisonChart;
  let currentComparisonData;
  const comparisonBorderColors = ['rgba(228, 26, 28, .8)', 'rgba(55, 126, 184, .8)', 'rgba(36, 192, 36, .8)', 'rgba(152, 78, 163, .8)', 'rgba(255, 127, 0, .8)', 'rgba(255, 255, 51, .8)'];
  // Array of colors currently used to try to avoid duplicating colors when possible
  const comparisonColorsUsed = comparisonBorderColors.map(() => 0);
  const spectrumRegex = /\w* \((\d*)\)/;
  // Flag to cancel a simulation
  let cancelled = false;
  // Actuator array name to followup chance increase map
  const actuatorArrayMap = {
    "0%: None": 0,
    "10%: Actuator Array": 10,
    "12%: Imp. Actuator Array": 12,
    "16%: Adv. Actuator Array": 16,
    "20%: Exp. Actuator Array": 20
  };
  // Actuator name to tu multiplier map
  const actuatorMap = {
    "0%: None": 1.0,
    "20%: Microactuators": 0.8,
    "30%: Nanoactuators": 0.7,
    "40%: 2 Microactuators": 0.6,
    "50%: Femtoactuators": 0.5
  };
  // Armor integrity analyzer chance map
  const armorIntegrityMap = {
    "0%: None": 0,
    "33%: Armor Integrity Analyzer": 33,
    "50%: Imp. Armor Integrity Analyzer": 50,
    "66%: Adv. Armor Integrity Analyzer": 66,
    "90%: Exp. Armor Integrity Analyzer": 90
  };
  // Charger damage increase values
  const chargerMap = {
    "0%: None": 1.00,
    "15%: Particle Charger": 1.15,
    "20%: Imp. Particle Charger": 1.20,
    "25%: Adv. Particle Charger": 1.25,
    "30%: Particle Accelerator": 1.30,
    "40%: Imp. Particle Accelerator": 1.40,
    "50%: Adv. Particle Accelerator": 1.50
  };
  // Core analyzer to percent chance map
  const coreAnalyzerMap = {
    "0%: None": 0,
    "6%: Core Analyzer": 6,
    "8%: Imp. Core Analyzer": 8,
    "8%: Asb. Combat Suite": 8,
    "10%: Adv. Core Analyzer": 10,
    "15%: Exp. Core Analyzer": 15
  };
  // Cycler volley time multiplier map
  const cyclerMap = {
    "0%: None": 1.00,
    "15%: Weapon Cycler": 0.85,
    "20%: Imp. Weapon Cycler": 0.80,
    "25%: Adv. Weapon Cycler": 0.75,
    "30%: Exp. Weapon Cycler": 0.70,
    "50%: Quantum Capacitor": 0.50,
    "50%: Launcher Loader": 0.50
  };
  // Damage reduction names
  const externalDamageReductionNameMap = {
    "0%: None": null,
    "25%: Remote Shield": "Remote Shield",
    "25%: Stasis Trap": "Stasis Trap",
    "50%: Phase Wall": "Phase Wall",
    "50%: Remote Force Field (Energy Mantle)": "Remote Force Field",
    "50%: Stasis Bubble": "Stasis Bubble"
  };
  // Kinecellerator min damage increase values
  const kinecelleratorMap = {
    "0%: None": 1.00,
    "30%: Kinecellerator": 1.30,
    "40%: Imp. Kinecellerator": 1.40,
    "50%: Adv. Kinecellerator": 1.50
  };
  // Melee analysis ids
  const meleeAnalysisIds = ["meleeAnalysisInput", "impMeleeAnalysisInput", "advMeleeAnalysisInput", "expMeleeAnalysisInput"];
  // Array of melee analysis minimum damage increases
  const meleeAnalysisMinDamageIncrease = [2, 3, 4, 6];
  // Melee weapon types
  const meleeTypes = ["Impact Weapon", "Piercing Weapon", "Slashing Weapon", "Special Melee Weapon"];
  // Ranged weapon types
  const rangedTypes = ["Ballistic Cannon", "Ballistic Gun", "Energy Cannon", "Energy Gun", "Launcher", "Special Weapon"];
  // Bot size mode to accuracy bonus map
  const sizeAccuracyMap = {
    "Huge": 30,
    "Large": 10,
    "Medium": 0,
    "Small": -10,
    "Tiny": -30
  };
  // Siege mode text to accuracy bonus/TUs to activate map
  const siegeModeBonusMap = {
    "No Siege": {
      bonus: 0,
      tus: 0
    },
    "In Siege Mode": {
      bonus: 20,
      tus: 0
    },
    "In High Siege Mode": {
      bonus: 30,
      tus: 0
    },
    "Entering Siege Mode": {
      bonus: 20,
      tus: 500
    },
    "Entering High Siege Mode": {
      bonus: 30,
      tus: 500
    }
  };
  // Target analyzer name to critical % chance increase
  const targetAnalyzerMap = {
    "0%: None": 0,
    "5%: Target Analyzer": 5,
    "6%: Imp. Target Analyzer": 6,
    "8%: Adv. Target Analyzer": 8,
    "12%: Exp. Target Analyzer": 12
  };
  $(document).ready(() => {
    init();
  });
  function addComparison() {
    const name = $("#comparisonNameInput").val();
    $("#comparisonNameInput").val("");
    // Disable the button to avoid adding the dataset multiple times
    const button = $("#addComparisonButton");
    button.addClass("disabled");
    button.prop("disabled", true);
    button.tooltip("hide");
    $("#comparisonContainer").removeClass("not-visible");
    // Try to get the first unused color if possible
    const {colorIndex} = comparisonColorsUsed.reduce((acc, num, index) => {
      if (num < acc.value) {
        return {
          colorIndex: index,
          value: num
        };
      } else {
        return acc;
      }
    }, {
      colorIndex: -1,
      value: Number.MAX_VALUE
    });
    comparisonColorsUsed[colorIndex] += 1;
    // Create and append the dataset to the chart
    const newDataset = getDatasetSettings(name, "rgb(0, 0, 0, 0)", comparisonBorderColors[colorIndex]);
    newDataset.data = currentComparisonData;
    comparisonChart.data.datasets.push(newDataset);
    // Create editor elements
    const parent = $('<div class="input-group"></div>');
    const nameInput = $(`<input class="form-control"></input>`);
    nameInput.val(name);
    const deleteButton = $('<button class="btn ml-2" data-toggle="tooltip" title="Removes the dataset.">X</button>');
    parent.append(nameInput);
    parent.append(deleteButton);
    // Set up callbacks
    deleteButton.tooltip();
    deleteButton.on("click", () => {
      // Remove the dataset from the chart
      const datasets = comparisonChart.data.datasets;
      datasets.splice(datasets.indexOf(newDataset), 1);
      comparisonChart.update();
      if (datasets.length === 0) {
        // Hide the comparison chart section if no more data to show
        $("#comparisonContainer").addClass("not-visible");
      }
      comparisonColorsUsed[colorIndex] -= 1;
      // Remove the associated item
      deleteButton.tooltip("dispose");
      parent.remove();
    });
    nameInput.change(() => {
      newDataset.label = nameInput.val();
      comparisonChart.update();
    });
    $("#comparisonDatasetsContainer").append(parent);
    comparisonChart.update();
  }
  // Adds a new weapon select dropdown with an optional weapon name
  function addWeaponSelect(weaponName) {
    const spoilersState = _commonJs.getSpoilersState();
    const container = $("#weaponSelectContainer");
    const melee = isMelee();
    const types = melee ? meleeTypes : rangedTypes;
    const weapons = [];
    Object.keys(_commonJs.itemData).forEach(name => {
      const item = _commonJs.itemData[name];
      // Slot check
      if (item["Slot"] !== "Weapon") {
        return;
      }
      // Ranged/melee type check
      if (!types.includes(item["Type"])) {
        return;
      }
      // Damage check
      if (item["Damage Type"] === "Special") {
        return;
      }
      // Spoilers check
      if (spoilersState === "None") {
        // No spoilers, check that none of the categories are spoilers/redacted
        const categories = _commonJs.getItemCategories(name);
        if (categories.every(c => c != redactedItemCategory && !spoilerItemCategories.includes(c))) {
          weapons.push(name);
        }
      } else if (spoilersState == "Spoilers") {
        // Spoilers allowed, check only for redacted category
        const categories = _commonJs.getItemCategories(name);
        if (categories.every(c => c != redactedItemCategory)) {
          weapons.push(name);
        }
      } else {
        // Redacted, no checks
        weapons.push(name);
      }
    });
    // Sort and create weapon option HTML elements
    weapons.sort(_commonJs.gallerySort);
    const weaponOptions = weapons.map(w => `<option>${w}</option>`).join();
    // Add elements
    const parent = $('<div class="input-group mt-1"></div>');
    const selectLabel = $('<span class="input-group-text" data-toggle="tooltip" title="Name of an equipped weapon to fire">Weapon</span>');
    const select = $(`<select class="selectpicker" data-live-search="true">${weaponOptions}</select>`);
    const helpButton = $('<button class="btn weapon-help-btn" data-html=true data-toggle="popover">?</button>');
    const numberLabel = $(`
        <div class="input-group-prepend ml-2" data-toggle="tooltip" title="How many weapons of this type to have equipped.">
            <span class="input-group-text">Number</span>
        </div>`);
    const number = $('<input class="form-control" placeholder="1"></input>');
    const deleteButton = $('<button class="btn ml-2" data-toggle="tooltip" title="Removes the weapon.">X</button>');
    container.append(parent);
    parent.append(selectLabel);
    parent.append(select);
    parent.append(helpButton);
    parent.append(numberLabel);
    parent.append(number);
    parent.append(deleteButton);
    deleteButton.tooltip();
    deleteButton.on("click", () => {
      // Ensure the last dropdown is always empty
      if (parent.next().length === 0) {
        addWeaponSelect("");
      }
      // Remove the associated item
      select.selectpicker("destroy");
      deleteButton.tooltip("dispose");
      parent.remove();
    });
    select.selectpicker("val", weaponName);
    // Set initial weapon info if valid
    if ((weaponName in _commonJs.itemData)) {
      const weapon = _commonJs.itemData[weaponName];
      helpButton.attr("data-content", _commonJs.createItemDataContent(weapon));
      helpButton.popover();
    }
    // Add changed event
    select.on("changed.bs.select", () => {
      if (parent.next().length === 0) {
        addWeaponSelect("");
      }
      // Update item info
      const weapon = _commonJs.itemData[select.selectpicker("val")];
      helpButton.attr("data-content", _commonJs.createItemDataContent(weapon));
      helpButton.popover();
    });
    select.parent().addClass("weapon-dropdown");
    // Enable tooltips
    deleteButton.tooltip();
    numberLabel.tooltip();
    selectLabel.tooltip();
    // Minor hack, the btn-light class is auto-added to dropdowns with search
    // but it doesn't really fit with everything else
    parent.find(".btn-light").removeClass("btn-light");
  }
  // Gets a dataset's overall settings with some defaults
  function getDatasetSettings(label, backgroundColor, borderColor) {
    return {
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      label: label,
      pointRadius: 0,
      pointHitRadius: 25,
      showLine: true,
      steppedLine: "middle"
    };
  }
  // Gets the number of simulations to perform
  function getNumSimulations() {
    const stringValue = $("#numFightsInput").val().replace(",", "");
    return parseIntOrDefault(stringValue, 100000);
  }
  // Initialize the page state
  async function init() {
    await _commonJs.initData();
    // Load spoilers saved state
    $("#spoilers").text(_commonJs.getSpoilersState());
    // Set initial state
    _commonJs.resetButtonGroup($("#combatTypeContainer"));
    _commonJs.resetButtonGroup($("#xAxisContainer"));
    $("#comparisonChartNameInput").val("");
    resetValues();
    updateChoices();
    // Register handlers
    $("#spoilersDropdown > button").on("click", e => {
      const state = $(e.target).text();
      $("#spoilers").text(state);
      _commonJs.setSpoilersState(state);
      $("#spoilersDropdown > button").tooltip("hide");
      updateChoices();
    });
    $("#reset").click(() => {
      $("#reset").tooltip("hide");
      resetValues();
    });
    $("#botSelect").on("changed.bs.select", () => {
      const bot = _commonJs.botData[$("#botSelect").selectpicker("val")];
      $("#enemyInfoButton").attr("data-content", _commonJs.createBotDataContent(bot));
    });
    $("#combatTypeContainer > label > input").on("click", () => {
      updateChoices();
    });
    $("#simulateButton").click(() => {
      simulate();
    });
    $("#cancelButton").click(() => {
      cancelled = true;
    });
    $("#addComparisonButton").click(() => {
      addComparison();
    });
    $("#comparisonChartNameInput").change(() => {
      let label = $("#comparisonChartNameInput").val();
      if (label === "") {
        label = "Custom Comparison";
      }
      comparisonChart.options.title.text = label;
      comparisonChart.update();
    });
    $(window).on("click", e => {
      // If clicking outside of a popover close the current one
      if ($(e.target).parents(".popover").length === 0 && $(".popover").length >= 1) {
        $('[data-toggle="popover"]').not(e.target).popover("hide");
      }
    });
    // Enable tooltips/popovers
    $('[data-toggle="tooltip"]').tooltip();
    // Set initial bot info
    const bot = _commonJs.botData[$("#botSelect").selectpicker("val")];
    $("#enemyInfoButton").attr("data-content", _commonJs.createBotDataContent(bot));
    $("#enemyInfoButton").popover();
    // These divs are created at runtime so have to do this at init
    $("#damageReductionSelect").parent().addClass("percent-dropdown");
    $("#botSelectContainer > div").addClass("enemy-dropdown");
    $("#siegeSelectContainer > div").addClass("siege-dropdown");
    $("#chargerSelect").parent().addClass("percent-dropdown");
    $("#kinecelleratorSelect").parent().addClass("percent-dropdown");
    $("#cyclerSelect").parent().addClass("percent-dropdown");
    $("#armorIntegSelect").parent().addClass("percent-dropdown");
    $("#coreAnalyzerSelect").parent().addClass("percent-dropdown");
    $("#targetAnalyzerSelect").parent().addClass("percent-dropdown");
    $("#actuatorSelect").parent().addClass("percent-dropdown");
    $("#actuatorArraySelect").parent().addClass("percent-dropdown");
    $("#sneakAttackSelect").parent().addClass("sneak-attack-dropdown");
    initCharts();
  }
  // Initializes the charts with default settings and no data
  function initCharts() {
    const perXDataset = getDatasetSettings("Current volley kill %", "rgba(0, 98, 0, 0.3)", "rgba(0, 196, 0, 1)");
    const cumulativeDataset = getDatasetSettings("Cumulative kill %", "rgba(96, 96, 96, 0.3)", "rgba(128, 128, 128, 1)");
    let chartElement = $("#chart");
    chart = new Chart(chartElement, {
      type: 'scatter',
      data: {
        datasets: [perXDataset, cumulativeDataset]
      },
      options: {
        legend: {
          labels: {
            fontSize: 16
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: "Number of volleys",
              fontSize: 24
            },
            ticks: {
              min: 0,
              stepSize: 1
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(128, 128, 128, 0.8)"
            },
            scaleLabel: {
              display: true,
              labelString: "Percent of kills",
              fontSize: 24
            },
            ticks: {
              beginAtZero: true,
              callback: (value, index, values) => value + "%"
            }
          }]
        },
        title: {
          display: true,
          fontSize: 24
        }
      }
    });
    chartElement = $("#comparisonChart");
    comparisonChart = new Chart(chartElement, {
      type: 'scatter',
      data: {
        datasets: []
      },
      options: {
        legend: {
          labels: {
            fontSize: 16
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: "Number of time units",
              fontSize: 24
            },
            ticks: {
              min: 0,
              stepSize: 100
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(128, 128, 128, 0.8)"
            },
            scaleLabel: {
              display: true,
              labelString: "Percent of kills",
              fontSize: 24
            },
            ticks: {
              beginAtZero: true,
              callback: (value, index, values) => value + "%"
            }
          }]
        },
        title: {
          display: true,
          text: "Custom Comparison",
          fontSize: 24
        }
      }
    });
  }
  // Checks if the combat type is melee or ranged
  function isMelee() {
    return $("#combatTypeMelee").hasClass("active");
  }
  // Attempts to parse an int from the string, otherwise uses the default value
  function parseIntOrDefault(string, defaultVal) {
    const value = parseInt(string);
    if (isNaN(value)) {
      return defaultVal;
    }
    return value;
  }
  // Resets a dropdown to the first item
  function resetDropdown(dropdown) {
    dropdown.selectpicker("val", dropdown.children().val());
  }
  // Resets all values
  function resetValues() {
    // Reset button groups
    _commonJs.resetButtonGroup($("#analysisContainer"));
    _commonJs.resetButtonGroup($("#movedContainer"));
    _commonJs.resetButtonGroup($("#siegeModeContainer"));
    // Reset dropdowns
    resetDropdown($("#damageReductionSelect"));
    resetDropdown($("#siegeSelect"));
    resetDropdown($("#chargerSelect"));
    resetDropdown($("#kinecelleratorSelect"));
    resetDropdown($("#cyclerSelect"));
    resetDropdown($("#armorIntegSelect"));
    resetDropdown($("#coreAnalyzerSelect"));
    resetDropdown($("#targetAnalyzerSelect"));
    resetDropdown($("#actuatorSelect"));
    resetDropdown($("#actuatorArraySelect"));
    resetDropdown($("#sneakAttackSelect"));
    resetDropdown($("#endConditionSelect"));
    // Reset text inputs
    $("#distanceInput").val("");
    $("#numFightsInput").val("");
    $("#targetingInput").val("");
    $("#treadsInput").val("");
    $("#meleeAnalysisContainer > input").val("");
    $("#speedInput").val("");
    $("#bonusMomentumInput").val("");
    $("#initialMomentumInput").val("");
    $("#comparisonNameInput").val("");
    // Reset with 1 preset weapon and one empty one
    $("#weaponSelectContainer").empty();
    const defaultWeapon = isMelee() ? "Mining Claw" : "Lgt. Assault Rifle";
    addWeaponSelect(defaultWeapon);
    addWeaponSelect("");
    setStatusText("");
    $("#resultsContainer").addClass("not-visible");
  }
  // Sets controls to disabled/enabled based on if the simulation is running
  function setSimulationRunning(running) {
    function setEnabled(selector) {
      selector.removeClass("disabled");
      selector.prop("disabled", false);
    }
    function setDisabled(selector) {
      selector.addClass("disabled");
      selector.prop("disabled", true);
    }
    let func = running ? setDisabled : setEnabled;
    func($("#spoilers"));
    func($("#combatTypeRanged"));
    func($("#combatTypeRanged > input"));
    func($("#combatTypeMelee"));
    func($("#combatTypeMelee > input"));
    func($("#numFightsInput"));
    func($("#reset"));
    func($("#botSelect").next());
    func($("#analysisNo"));
    func($("#analysisNo > input"));
    func($("#analysisYes"));
    func($("#analysisYes > input"));
    func($("#damageReductionSelect").next());
    func($("#targetingInput"));
    func($("#siegeSelect").next());
    func($("#treadsInput"));
    func($("#distanceInput"));
    func($("#chargerSelect").next());
    func($("#kinecelleratorSelect").next());
    func($("#cyclerSelect").next());
    func($("#meleeAnalysisContainer > input"));
    func($("#actuatorSelect").next());
    func($("#actuatorArraySelect").next());
    func($("#bonusMomentumInput"));
    func($("#initialMomentumInput"));
    func($("#speedInput"));
    func($("#sneakAttackSelect").next());
    func($("#armorIntegSelect").next());
    func($("#coreAnalyzerSelect").next());
    func($("#targetAnalyzerSelect").next());
    func($("#weaponSelectContainer button").not(".weapon-help-btn"));
    func($("#weaponSelectContainer input"));
    // Update the cancel/simulate buttons
    if (running) {
      $("#cancelButton").removeClass("not-visible");
      $("#simulateButton").addClass("not-visible");
    } else {
      $("#cancelButton").addClass("not-visible");
      $("#simulateButton").removeClass("not-visible");
    }
  }
  // Sets the status label to the specified value
  function setStatusText(text) {
    $("#statusText").text(text);
  }
  // Simulates combat with the current settings and updates the chart (simulate button entry point)
  function simulate() {
    // Check inputs first
    const botName = $("#botSelect").selectpicker("val");
    const weaponDefs = [];
    $("#weaponSelectContainer select").each((_, s) => {
      const name = $(s).selectpicker("val");
      if ((name in _commonJs.itemData)) {
        const weapon = _commonJs.itemData[name];
        // Tread invalid or unfilled numbers as 1
        const number = parseIntOrDefault($(s).parent().nextAll("input").val(), 1);
        for (let i = 0; i < number; i++) {
          weaponDefs.push(weapon);
        }
      }
    });
    if (!((botName in _commonJs.botData))) {
      setStatusText(`Bot ${botName} is invalid, this is probably a bug.`);
      return;
    }
    if (weaponDefs.length === 0) {
      setStatusText("There must be at least 1 weapon selected.");
      return;
    }
    // Set up initial calculation state
    const bot = _commonJs.botData[botName];
    const parts = [];
    bot["Components Data"].concat(bot["Armament Data"]).forEach(item => {
      for (let i = 0; i < item["Number"]; i++) {
        const itemDef = _commonJs.getItem(item["Name"]);
        const isProtection = itemDef["Type"] === "Protection";
        const coverage = parseInt(itemDef["Coverage"]);
        parts.push({
          armorAnalyzedCoverage: isProtection ? 0 : coverage,
          coverage: coverage,
          def: itemDef,
          integrity: parseInt(itemDef["Integrity"]),
          protection: isProtection
        });
      }
    });
    const armorAnalyzedCoverage = bot["Core Coverage"] + parts.reduce((prev, part) => prev + part.armorAnalyzedCoverage, 0);
    const externalDamageReduction = externalDamageReductionNameMap[$("#damageReductionSelect").selectpicker("val")];
    const defensiveState = _simulatorCalcsJs.getBotDefensiveState(parts, externalDamageReduction);
    // Enemy bot state
    const botState = {
      armorAnalyzedCoverage: armorAnalyzedCoverage,
      coreCoverage: bot["Core Coverage"],
      coreDisrupted: false,
      coreIntegrity: bot["Core Integrity"],
      corruption: 0,
      def: bot,
      defensiveState: defensiveState,
      externalDamageReduction: externalDamageReduction,
      immunities: _commonJs.valueOrDefault(bot["Immunities"], []),
      initialCoreIntegrity: bot["Core Integrity"],
      parts: parts,
      regen: _simulatorCalcsJs.getRegen(bot),
      resistances: _commonJs.valueOrDefault(bot["Resistances"], []),
      totalCoverage: bot["Total Coverage"]
    };
    // Weapons and other offensive state
    const melee = isMelee();
    const numTreads = parseIntOrDefault($("#treadsInput").val(), 0);
    // Accuracy bonuses and penalties
    const siegeBonus = melee ? null : siegeModeBonusMap[$("#siegeSelect").selectpicker("val")];
    let targetingComputerBonus = 0;
    if (!melee) {
      targetingComputerBonus = parseIntOrDefault($("#targetingInput").val(), 0);
    }
    const meleeAnalysis = [0, 0, 0, 0];
    if (melee) {
      // Melee analysis types
      meleeAnalysisIds.map((id, i) => {
        meleeAnalysis[i] = parseIntOrDefault($(`#${id}`).val(), 0);
      });
    }
    // Invalid / 6 or more tiles = 0 bonus
    let distance = parseIntOrDefault($("#distanceInput").val(), 6);
    if (distance <= 1) {
      // Less than or equal to 1, just assign to 1
      distance = 1;
    }
    const allRecoil = weaponDefs.reduce((prev, weapon) => _simulatorCalcsJs.getRecoil(weapon, numTreads) + prev, 0);
    // Target Analyzer crit bonus
    const targetAnalyzerName = $("#targetAnalyzerSelect").selectpicker("val");
    const critBonus = targetAnalyzerMap[targetAnalyzerName];
    const weapons = weaponDefs.map((weapon, i) => {
      let damageMin = 0;
      let damageMax = 0;
      let damageType = null;
      let explosionMin = 0;
      let explosionMax = 0;
      let explosionType = null;
      if (("Damage" in weapon)) {
        // Found regular damage
        if (weapon["Damage"].includes("-")) {
          const split = weapon["Damage"].split("-");
          damageMin = parseInt(split[0]);
          damageMax = parseInt(split[1]);
        } else {
          damageMin = parseInt(weapon["Damage"]);
          damageMax = damageMin;
        }
        if (weapon["Type"] === "Ballistic Gun" || weapon["Type"] === "Ballistic Cannon") {
          // Increase minimum damage for kinecellerators (2)
          const kinecelleratorName = $("#kinecelleratorSelect").selectpicker("val");
          const kinecelleratorBonus = kinecelleratorMap[kinecelleratorName];
          // Double damage for overloading (2)
          // TODO
          // Ensure min damage can't exceed max
          damageMin = Math.min(Math.trunc(damageMin * kinecelleratorBonus), damageMax);
        } else if (melee) {
          // Apply damage for melee analyses (2)
          let minDamageIncrease = 0;
          for (let i = 0; i < meleeAnalysisMinDamageIncrease.length; i++) {
            minDamageIncrease += meleeAnalysis[i] * meleeAnalysisMinDamageIncrease[i];
          }
          // Ensure min damage can't exceed max
          damageMin = Math.min(minDamageIncrease + damageMin, damageMax);
        }
        damageType = weapon["Damage Type"];
      }
      if (("Explosion Damage" in weapon)) {
        // Found explosion damage
        if (weapon["Explosion Damage"].includes("-")) {
          const split = weapon["Explosion Damage"].split("-");
          explosionMin = parseInt(split[0]);
          explosionMax = parseInt(split[1]);
        } else {
          explosionMin = parseInt(weapon["Explosion Damage"]);
          explosionMax = explosionMin;
        }
        explosionType = weapon["Explosion Type"];
      }
      // Get crit chance, only apply target analyzer if there's a specific bonus
      const critical = ("Critical" in weapon) ? parseInt(weapon["Critical"]) + critBonus : 0;
      // Calculate base accuracy that can't change over the course of the fight
      let baseAccuracy = melee ? initialMeleeAccuracy : initialRangedAccuracy;
      if (!melee) {
        baseAccuracy += targetingComputerBonus + 2 * numTreads;
      }
      // Size bonus/penalty
      if ((bot["Size"] in sizeAccuracyMap)) {
        baseAccuracy += sizeAccuracyMap[bot["Size"]];
      } else {
        console.log(`${botName} has invalid size ${bot["Size"]}`);
      }
      // Builtin targeting
      if (("Targeting" in weapon)) {
        baseAccuracy += parseInt(weapon["Targeting"]);
      }
      const delay = parseIntOrDefault(weapon["Delay"], 0);
      // Follow-up attacks on melee gain a 10% bonus to targeting
      const followUp = melee && i != 0;
      if (followUp) {
        baseAccuracy += 10;
      }
      const disruption = parseIntOrDefault(weapon["Disruption"]);
      const spectrum = ("Spectrum" in weapon) ? parseInt(spectrumRegex.exec(weapon["Spectrum"])[1]) : 0;
      const explosionSpectrum = ("Explosion Spectrum" in weapon) ? parseInt(spectrumRegex.exec(weapon["Explosion Spectrum"])[1]) : 0;
      // All launchers are missiles except for special cases
      const isMissile = weapon["Type"] === "Launcher" && weapon["Name"] != "Sigix Terminator" && weapon["Name"] != "Supercharged Sigix Terminator" && weapon["Name"] != "Vortex Catalyst Activator";
      return {
        accelerated: weapon["Type"] === "Energy Gun" || weapon["Type"] === "Energy Cannon",
        baseAccuracy: baseAccuracy,
        critical: critical,
        damageMin: damageMin,
        damageMax: damageMax,
        damageType: damageType,
        def: weapon,
        delay: delay,
        disruption: disruption,
        explosionMin: explosionMin,
        explosionMax: explosionMax,
        explosionSpectrum: explosionSpectrum,
        explosionType: explosionType,
        isMissile: isMissile,
        numProjectiles: ("Projectile Count" in weapon) ? parseInt(weapon["Projectile Count"]) : 1,
        overflow: !weapon["Type"].includes("Gun"),
        spectrum: spectrum
      };
    });
    // Charger bonus
    const chargerName = $("#chargerSelect").selectpicker("val");
    const chargerBonus = chargerMap[chargerName];
    // Armor Integrity Analyzer chance
    const armorAnalyzerName = $("#armorIntegSelect").selectpicker("val");
    const armorAnalyzerChance = armorIntegrityMap[armorAnalyzerName];
    // Core Analyzer chance
    const coreAnalyzerName = $("#coreAnalyzerSelect").selectpicker("val");
    const coreAnalyzerChance = coreAnalyzerMap[coreAnalyzerName];
    // Actuator Array chance
    const actuatorArrayName = $("#actuatorArraySelect").selectpicker("val");
    const actuatorArrayBonus = actuatorArrayMap[actuatorArrayName];
    // Calculate followup chance
    const followupChances = [];
    if (melee) {
      // melee followup% = 20 + ([(primary weapon speed mod) - (followup weapon speed mod)] / 10)
      const baseChance = 20 + actuatorArrayBonus;
      weapons.forEach((weapon, i) => {
        if (i != 0) {
          let chance = baseChance + Math.trunc((weapons[0].delay - weapon.delay) / 10);
          // Clamp between 0-100
          chance = Math.min(chance, 100);
          chance = Math.max(chance, 0);
          followupChances.push(chance);
        }
      });
    }
    // Get speed
    const speed = parseIntOrDefault($("#speedInput").val(), 100);
    // Get momentum
    const bonusMomentum = parseIntOrDefault($("#bonusMomentumInput").val(), 0);
    const initialMomentum = parseIntOrDefault($("#initialMomentumInput").val(), 0);
    // Determine sneak attack strategy
    const sneakAttackStrategy = $("#sneakAttackSelect").selectpicker("val");
    // Calculate total (ranged) or initial (melee) volley time
    const volleyTimeModifier = melee ? actuatorMap[$("#actuatorSelect").selectpicker("val")] : cyclerMap[$("#cyclerSelect").selectpicker("val")];
    const volleyTime = melee ? weapons[0].delay + _simulatorCalcsJs.volleyTimeMap[1] : _simulatorCalcsJs.getRangedVolleyTime(weapons, volleyTimeModifier);
    // Other misc offensive state
    const offensiveState = {
      armorAnalyzerChance: armorAnalyzerChance,
      analysis: $("#analysisYes").hasClass("active"),
      chargerBonus: chargerBonus,
      coreAnalyzerChance: coreAnalyzerChance,
      distance: distance,
      followupChances: followupChances,
      melee: melee,
      meleeAnalysis: meleeAnalysis,
      momentum: {
        bonus: bonusMomentum,
        current: bonusMomentum + initialMomentum,
        initial: initialMomentum
      },
      numTreads: numTreads,
      recoil: allRecoil,
      siegeBonus: siegeBonus,
      sneakAttack: false,
      sneakAttackStrategy: sneakAttackStrategy,
      speed: speed,
      targetingComputerBonus: targetingComputerBonus,
      volleyTime: volleyTime,
      volleyTimeModifier: volleyTimeModifier
    };
    // Overall state
    const state = {
      endCondition: $("#endConditionSelect").selectpicker("val"),
      initialBotState: botState,
      killTus: {},
      killVolleys: {},
      offensiveState: offensiveState,
      tus: 0,
      weapons: weapons
    };
    // Disable all input fields while the simulation is running
    setSimulationRunning(true);
    // Run simulation
    cancelled = false;
    let i = 0;
    const numSimulations = getNumSimulations();
    const initial = performance.now();
    let lastFrame = initial;
    let lastStatusUpdate = lastFrame;
    // Run simulation in batches via setTimeout to avoid UI lockup.
    // After each 100 simulations check if we've surpassed 30 ms since the
    // last update (aim for ~30 fps)
    // If so then pass control back so events/updates can be processed.
    function run() {
      for (; i < numSimulations; i++) {
        if (i % 100 === 0) {
          if (cancelled) {
            // User cancelled
            setStatusText("Cancelled simulation");
            cancelled = false;
            setSimulationRunning(false);
            return;
          }
          const now = performance.now();
          if (now - lastFrame > 30) {
            lastFrame = now;
            if (now - lastStatusUpdate > 100) {
              // Only update status ~ 10 times a second
              const percent = (i * 100 / numSimulations).toFixed(1);
              setStatusText(`${String(percent).padStart(4, "0")} % completed.`);
              lastStatusUpdate = now;
            }
            setTimeout(run, 0);
            break;
          }
        }
        try {
          if (!_simulatorCalcsJs.simulateCombat(state)) {
            // Combat can only fail if we exceed max volleys
            setStatusText(`The simulation exceeded ${_simulatorCalcsJs.maxVolleys} volleys and will likely never kill.`);
            setSimulationRunning(false);
            return;
          }
        } catch (e) {
          console.log(e);
          setStatusText("The simulation encountered an unexpected error, this is a bug.");
          setSimulationRunning(false);
          return;
        }
      }
      if (i >= numSimulations) {
        setSimulationRunning(false);
        let time = performance.now() - initial;
        time /= 1000;
        time = time.toFixed(2);
        setStatusText(`Completed in ${time} seconds.`);
        updateChart(state);
        const button = $("#addComparisonButton");
        button.removeClass("disabled");
        button.prop("disabled", false);
      }
    }
    ;
    run();
  }
  // Updates the chart based on the current simulation state
  function updateChart(state) {
    const numSimulations = getNumSimulations();
    // Calculate data, round to the given number of decimal places and
    // ignore values smaller to reduce clutter
    function getData(perXKillsKeys, perXKillsObject, roundDecimals, stepSize) {
      const data = perXKillsKeys.filter(numX => perXKillsObject[numX] / numSimulations > Math.pow(10, -2 - roundDecimals)).map(numX => {
        return {
          x: numX,
          y: Math.trunc(perXKillsObject[numX] / numSimulations * Math.pow(10, 2 + roundDecimals)) / Math.pow(10, roundDecimals)
        };
      });
      if (data.length < 5) {
        // Add a 0 kill ending point if there aren't many data points
        // to fill out a bit more nicely
        data.push({
          x: parseInt(data[data.length - 1].x) + stepSize,
          y: 0
        });
      }
      return data;
    }
    function getCumulativeData(data) {
      const cumulativeData = [];
      let total = 0;
      data.forEach(point => {
        total += point.y;
        cumulativeData.push({
          x: point.x,
          y: Math.trunc(total * 100) / 100
        });
      });
      return cumulativeData;
    }
    // Get datasets
    const perXDataset = chart.data.datasets[0];
    const cumulativeDataset = chart.data.datasets[1];
    const perVolleys = $("#xAxisVolleys").hasClass("active");
    let perXData;
    const perXString = $("#endConditionSelect").selectpicker("val");
    let stepSize;
    let xString;
    let xAxisString;
    // Get comparison data first
    const perXKillsKeys = Object.keys(state.killTus);
    perXKillsKeys.sort((a, b) => parseFloat(a) - parseFloat(b));
    // Note: Melee (especially with followups) can create a lot of
    // relatively  lower probability scenarios due to strange melee delays
    // so add an extra decimal place to avoid cutting out too many
    // results that the max total % would end up being unreasonably
    // low (like under 80%) when killing enemies with particularly
    // large health pools.
    const tuData = getData(perXKillsKeys, state.killTus, state.offensiveState.melee ? 2 : 1, 100);
    currentComparisonData = getCumulativeData(tuData);
    if (perVolleys) {
      // Show data per volley
      xString = "Volleys";
      stepSize = 1;
      xAxisString = "Number of volleys";
      perXData = getData(Object.keys(state.killVolleys), state.killVolleys, 1, 1);
    } else {
      // Show data per time unit
      xString = "Time Units";
      stepSize = state.offensiveState.volleyTime;
      xAxisString = "Number of time units";
      perXData = getData(perXKillsKeys, state.killTus, state.offensiveState.melee ? 2 : 1, stepSize);
    }
    const cumulativeData = getCumulativeData(perXData);
    // Update chart
    chart.options.scales.xAxes[0].ticks.stepSize = stepSize;
    chart.options.scales.xAxes[0].scaleLabel.labelString = xAxisString;
    perXDataset.data = perXData;
    cumulativeDataset.data = cumulativeData;
    chart.options.title.text = `${xString}/${perXString} vs. ${$("#botSelect").selectpicker("val")}`;
    chart.update();
    $("#resultsContainer").removeClass("not-visible");
  }
  // Updates the available choices for the dropdowns depending on spoiler state and combat type
  function updateChoices() {
    const spoilersState = _commonJs.getSpoilersState();
    // Update all bot selections after saving old pick
    const select = $("#botSelect");
    const oldBot = select.selectpicker("val");
    select.empty();
    Object.keys(_commonJs.botData).forEach(name => {
      const bot = _commonJs.botData[name];
      if (bot["Categories"].some(c => c === "Spoilers")) {
        // Spoiler bots allowed for spoilers/redacted
        if (spoilersState === "Spoilers" || spoilersState === "Redacted") {
          select.append(`<option>${name}</option>`);
        }
      } else if (bot["Categories"].some(c => c === "Redacted")) {
        // Redacted bots only allowed for spoilers/redacted
        if (spoilersState === "Redacted") {
          select.append(`<option>${name}</option>`);
        }
      } else {
        // Non-spoiler bot always allowed
        select.append(`<option>${name}</option>`);
      }
    });
    // Don't show arch tele condition when not on redacted
    if (spoilersState === "Redacted") {
      $("#endConditionArchTele").removeClass("not-visible");
    } else {
      $("#endConditionArchTele").addClass("not-visible");
    }
    $("#endConditionSelect").selectpicker("refresh");
    select.selectpicker("refresh");
    // Try to preserve the old bot, otherwise default
    select.selectpicker("val", oldBot);
    if (select.selectpicker("val") === null) {
      select.selectpicker("val", "G-34 Mercenary");
    }
    // Minor hack, the btn-light class is auto-added to dropdowns with search
    // but it doesn't really fit with everything else
    $(".btn-light").removeClass("btn-light");
    const melee = isMelee();
    function setVisibility(selector, visible) {
      visible ? selector.removeClass("not-visible") : selector.addClass("not-visible");
    }
    setVisibility($("#rangedAccuracyContainer"), !melee);
    setVisibility($("#rangedUtilitiesContainer"), !melee);
    setVisibility($("#meleeAnalysisContainer"), melee);
    setVisibility($("#meleeBehaviorContainer"), melee);
    setVisibility($("#meleeUtilitiesContainer"), melee);
    // Reset with 1 preset weapon and one empty one
    const defaultWeapon = melee ? "Mining Claw" : "Lgt. Assault Rifle";
    $("#weaponSelectContainer").empty();
    addWeaponSelect(defaultWeapon);
    addWeaponSelect("");
  }
});

},{"./common.js":"2d4ET","./simulatorCalcs.js":"1VaCM"}],"2d4ET":[function(require,module,exports) {
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
},{}],"1VaCM":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "maxVolleys", function () {
  return maxVolleys;
});
_parcelHelpers.export(exports, "volleyTimeMap", function () {
  return volleyTimeMap;
});
_parcelHelpers.export(exports, "calculateResistDamage", function () {
  return calculateResistDamage;
});
_parcelHelpers.export(exports, "getBotDefensiveState", function () {
  return getBotDefensiveState;
});
_parcelHelpers.export(exports, "getRecoil", function () {
  return getRecoil;
});
_parcelHelpers.export(exports, "getRegen", function () {
  return getRegen;
});
_parcelHelpers.export(exports, "getRangedVolleyTime", function () {
  return getRangedVolleyTime;
});
_parcelHelpers.export(exports, "simulateCombat", function () {
  return simulateCombat;
});
var _commonJs = require("./common.js");
const minAccuracy = 10;
const maxRangedAccuracy = 95;
const maxMeleeAccuracy = 100;
const maxVolleys = 100000;
// Array of damage reducing parts to sort
// 11. Apply the first and only first defense applicable from the
// following list: phase wall, 75% personal shield (VFP etc),
// Force Field, Shield Generator, stasis bubble, active Stasis Trap,
// Remote Shield, 50% remote shield (Energy Mantle etc.), Hardlight Generator.
const damageReductionSortOrder = ["Phase Wall", "Vortex Field Projector", "7V-RTL'S Ultimate Field", "Force Field", "Imp. Force Field", "Adv. Force Field", "Exp. Force Field", "Shield Generator", "Imp. Shield Generator", "Adv. Shield Generator", "Exp. Shield Generator", "Stasis Bubble", "Stasis Trap", "Remote Shield", "Imp. Remote Shield", "Remote Force Field", "Imp. Remote Force Field", "Energy Mantle", "Imp. Energy Mantle", "AEGIS Remote Shield"];
const externalDamageReductionMap = {
  "Remote Shield": 0.75,
  "Stasis Trap": 0.75,
  "Phase Wall": 0.5,
  "Remote Force Field": 0.5,
  "Stasis Bubble": 0.5
};
// Array of melee analysis accuracy increases
const meleeAnalysisAccuracy = [5, 6, 8, 12];
const categoryAntimissile = 0;
const categoryAvoid = 1;
const categoryCorruptionIgnore = 2;
const categoryDamageReduction = 3;
const categoryResist = 4;
const categoryRangedAvoid = 5;
const categorySelfDamageReduction = 6;
const categoryShielding = 7;
const specialItems = {
  // Antimissile, chance to shoot down launcher projectiles per tile
  // Antimissile, chance to shoot down launcher projectiles per tile
  "Point Defense System": {
    category: categoryAntimissile,
    chance: 8
  },
  "Point Defense Array": {
    category: categoryAntimissile,
    chance: 16
  },
  "Antimissile System": {
    category: categoryAntimissile,
    chance: 24
  },
  // Avoid, - all weapon accuracy
  // Avoid, - all weapon accuracy
  "Maneuvering Thrusters": {
    category: categoryAvoid,
    legs: 3,
    other: 6
  },
  "Imp. Maneuvering Thrusters": {
    category: categoryAvoid,
    legs: 5,
    other: 10
  },
  "Reaction Control System": {
    category: categoryAvoid,
    legs: 6,
    other: 12
  },
  "Adv. Reaction Control System": {
    category: categoryAvoid,
    legs: 7,
    other: 14
  },
  // Corruption ignore, % of ignoring corruption addition
  // Corruption ignore, % of ignoring corruption addition
  "Dynamic Insulation System": {
    category: categoryCorruptionIgnore,
    ignore: 50
  },
  "Imp. Dynamic Insulation System": {
    category: categoryCorruptionIgnore,
    ignore: 67
  },
  "Adv. Dynamic Insulation System": {
    category: categoryCorruptionIgnore,
    ignore: 75
  },
  // Damage reduction, (val * damage = reduced damage)
  // Damage reduction, (val * damage = reduced damage)
  "Adv. Shield Generator": {
    category: categoryDamageReduction,
    reduction: .75
  },
  "Exp. Shield Generator": {
    category: categoryDamageReduction,
    reduction: .75
  },
  "Imp. Remote Shield": {
    category: categoryDamageReduction,
    reduction: .75
  },
  "Imp. Shield Generator": {
    category: categoryDamageReduction,
    reduction: .75
  },
  "Remote Shield": {
    category: categoryDamageReduction,
    reduction: .75
  },
  "Shield Generator": {
    category: categoryDamageReduction,
    reduction: .75
  },
  "AEGIS Remote Shield": {
    category: categoryDamageReduction,
    reduction: .50
  },
  "Adv. Force Field": {
    category: categoryDamageReduction,
    reduction: .50
  },
  "Exp. Force Field": {
    category: categoryDamageReduction,
    reduction: .50
  },
  "Energy Mantle": {
    category: categoryDamageReduction,
    reduction: .50
  },
  "Force Field": {
    category: categoryDamageReduction,
    reduction: .50
  },
  "Imp. Energy Mantle": {
    category: categoryDamageReduction,
    reduction: .50
  },
  "Imp. Force Field": {
    category: categoryDamageReduction,
    reduction: .50
  },
  "Imp. Remote Force Field": {
    category: categoryDamageReduction,
    reduction: .50
  },
  "Remote Force Field": {
    category: categoryDamageReduction,
    reduction: .50
  },
  "7V-RTL's Ultimate Field": {
    category: categoryDamageReduction,
    reduction: .25
  },
  "Vortex Field Projector": {
    category: categoryDamageReduction,
    reduction: .25
  },
  // Resist, % of damage type resisted
  // Resist, % of damage type resisted
  "Insulated Plating": {
    category: categoryResist,
    resists: {
      "Electromagnetic": 15
    }
  },
  "Med. Insulated Plating": {
    category: categoryResist,
    resists: {
      "Electromagnetic": 20
    }
  },
  "EM Shield": {
    category: categoryResist,
    resists: {
      "Electromagnetic": 25
    }
  },
  "Hvy. Insulated Plating": {
    category: categoryResist,
    resists: {
      "Electromagnetic": 30
    }
  },
  "EM Disruption": {
    category: categoryResist,
    resists: {
      "Electromagnetic": 50
    }
  },
  "EM Dispersion": {
    category: categoryResist,
    resists: {
      "Electromagnetic": 75
    }
  },
  "Damper Plating": {
    category: categoryResist,
    resists: {
      "Electromagnetic": 90
    }
  },
  "8R-AWN's Armor/EX": {
    category: categoryResist,
    resists: {
      "Explosive": 90
    }
  },
  "Shock Absorption System": {
    category: categoryResist,
    resists: {
      "Explosive": 25
    }
  },
  "Imp. Shock Absorption System": {
    category: categoryResist,
    resists: {
      "Explosive": 50
    }
  },
  "Exp. Shock Absorption System": {
    category: categoryResist,
    resists: {
      "Explosive": 75
    }
  },
  "Mak. Kinetic Plating": {
    category: categoryResist,
    resists: {
      "Kinetic": 20
    }
  },
  "Focal Shield": {
    category: categoryResist,
    resists: {
      "Kinetic": 20
    }
  },
  "Reactive Plating": {
    category: categoryResist,
    resists: {
      "Kinetic": 20
    }
  },
  "Imp. Focal Shield": {
    category: categoryResist,
    resists: {
      "Kinetic": 25
    }
  },
  "Adv. Focal Shield": {
    category: categoryResist,
    resists: {
      "Kinetic": 30
    }
  },
  "Exp. Focal Shield": {
    category: categoryResist,
    resists: {
      "Kinetic": 30
    }
  },
  "Med. Reactive Plating": {
    category: categoryResist,
    resists: {
      "Kinetic": 30
    }
  },
  "Hvy. Reactive Plating": {
    category: categoryResist,
    resists: {
      "Kinetic": 40
    }
  },
  "8R-AWN's Armor/TH": {
    category: categoryResist,
    resists: {
      "Thermal": 90
    }
  },
  "Mak. Thermal Plating": {
    category: categoryResist,
    resists: {
      "Thermal": 10
    }
  },
  "Thermal Defense Suite": {
    category: categoryResist,
    resists: {
      "Thermal": 20
    }
  },
  "Reflective Plating": {
    category: categoryResist,
    resists: {
      "Thermal": 10
    }
  },
  "Med. Reflective Plating": {
    category: categoryResist,
    resists: {
      "Thermal": 15
    }
  },
  "Thermal Shield": {
    category: categoryResist,
    resists: {
      "Thermal": 20
    }
  },
  "Imp. Thermal Defense Suite": {
    category: categoryResist,
    resists: {
      "Thermal": 25
    }
  },
  "Imp. Thermal Shield": {
    category: categoryResist,
    resists: {
      "Thermal": 25
    }
  },
  "Hvy. Reflective Plating": {
    category: categoryResist,
    resists: {
      "Thermal": 25
    }
  },
  "Adv. Thermal Defense Suite": {
    category: categoryResist,
    resists: {
      "Thermal": 30
    }
  },
  "Adv. Thermal Shield": {
    category: categoryResist,
    resists: {
      "Thermal": 30
    }
  },
  "Exp. Thermal Defense Suite": {
    category: categoryResist,
    resists: {
      "Thermal": 30
    }
  },
  "Exp. Thermal Shield": {
    category: categoryResist,
    resists: {
      "Thermal": 30
    }
  },
  "Thermal Barrier": {
    category: categoryResist,
    resists: {
      "Thermal": 50
    }
  },
  "Beam Splitter": {
    category: categoryResist,
    resists: {
      "Thermal": 75
    }
  },
  "ME-RLN's Chromatic Screen": {
    category: categoryResist,
    resists: {
      "Electromagnetic": 20,
      "Explosive": 20,
      "Impact": 20,
      "Kinetic": 20,
      "Piercing": 20,
      "Slashing": 20
    }
  },
  "Zio. Shade Carapace": {
    category: categoryResist,
    resists: {
      "Electromagnetic": 20,
      "Explosive": 20,
      "Impact": 20,
      "Kinetic": 20,
      "Piercing": 20,
      "Slashing": 20
    }
  },
  "Zio. Shade Armor": {
    category: categoryResist,
    resists: {
      "Electromagnetic": 30,
      "Explosive": 30,
      "Impact": 30,
      "Kinetic": 30,
      "Piercing": 30,
      "Slashing": 30
    }
  },
  // Ranged avoid, - ranged weapon accuracy
  // Ranged avoid, - ranged weapon accuracy
  "Phase Shifter": {
    category: categoryRangedAvoid,
    avoid: 5
  },
  "Imp. Phase Shifter": {
    category: categoryRangedAvoid,
    avoid: 10
  },
  "Adv. Phase Shifter": {
    category: categoryRangedAvoid,
    avoid: 15
  },
  "Exp. Phase Shifter": {
    category: categoryRangedAvoid,
    avoid: 20
  },
  // Self damage reduction, damage reduction (val * damage = reduced damage)
  // Self damage reduction, damage reduction (val * damage = reduced damage)
  "1C-UTU's Buckler": {
    category: categorySelfDamageReduction,
    reduction: .50
  },
  "Powered Armor": {
    category: categorySelfDamageReduction,
    reduction: .50
  },
  "Imp. Powered Armor": {
    category: categorySelfDamageReduction,
    reduction: .50
  },
  "Adv. Powered Armor": {
    category: categorySelfDamageReduction,
    reduction: .50
  },
  "Exp. Powered Armor": {
    category: categorySelfDamageReduction,
    reduction: .50
  },
  // Part shielding, contains slot and percent of damage blocked
  // Part shielding, contains slot and percent of damage blocked
  "Core Shielding": {
    category: categoryShielding,
    slot: "Core",
    percent: .20
  },
  "Imp. Core Shielding": {
    category: categoryShielding,
    slot: "Core",
    percent: .30
  },
  "Exp. Core Shielding": {
    category: categoryShielding,
    slot: "Core",
    percent: .40
  },
  "Power Shielding": {
    category: categoryShielding,
    slot: "Power",
    percent: .33
  },
  "Imp. Power Shielding": {
    category: categoryShielding,
    slot: "Power",
    percent: .66
  },
  "Exp. Power Shielding": {
    category: categoryShielding,
    slot: "Power",
    percent: .90
  },
  "Propulsion Shielding": {
    category: categoryShielding,
    slot: "Propulsion",
    percent: .33
  },
  "Imp. Propulsion Shielding": {
    category: categoryShielding,
    slot: "Propulsion",
    percent: .66
  },
  "Exp. Propulsion Shielding": {
    category: categoryShielding,
    slot: "Propulsion",
    percent: .90
  },
  "Utility Shielding": {
    category: categoryShielding,
    slot: "Utility",
    percent: .33
  },
  "Imp. Utility Shielding": {
    category: categoryShielding,
    slot: "Utility",
    percent: .66
  },
  "Exp. Utility Shielding": {
    category: categoryShielding,
    slot: "Utility",
    percent: .90
  },
  "Weapon Shielding": {
    category: categoryShielding,
    slot: "Weapon",
    percent: .33
  },
  "Imp. Weapon Shielding": {
    category: categoryShielding,
    slot: "Weapon",
    percent: .66
  },
  "Exp. Weapon Shielding": {
    category: categoryShielding,
    slot: "Weapon",
    percent: .90
  },
  "Zio. Weapon Casing": {
    category: categoryShielding,
    slot: "Weapon",
    percent: 1.00
  }
};
const volleyTimeMap = {
  1: 200,
  2: 300,
  3: 325,
  4: 350,
  5: 375,
  6: 400
};
// Applies a final calculated damage value to a bot, splitting into chunks if necessary
function applyDamage(state, botState, damage, critical, armorAnalyzed, coreAnalyzed, disruptChance, spectrum, canOverflow, damageType) {
  const chunks = [];
  // Split into chunks each containing originalDamage for other calcs (10)
  if (damageType === "Explosive") {
    if (critical) {
      throw "Explosive damage can't be a crit";
    }
    // Split explosive damage randomly into 1-3 chunks (8)
    // EX damage can never crit, ignore armor, disrupt, explicitly
    // target core, or have a spectrum
    // Note: The remainder from the division is explicitly thrown out
    const numChunks = _commonJs.randomInt(1, 3);
    for (let i = 0; i < numChunks; i++) {
      chunks.push({
        armorAnalyzed: false,
        critical: false,
        damageType: damageType,
        disruptChance: 0,
        forceCore: false,
        originalDamage: Math.trunc(damage / numChunks),
        spectrum: 0
      });
    }
  } else {
    // Non-EX damage is done in a single chunk unless core analyzer proc (8)
    if (coreAnalyzed && !botState.immunities.includes("Criticals") && !botState.immunities.includes("Coring")) {
      let chunkDamage = Math.trunc(damage / 2);
      chunks.push({
        armorAnalyzed: armorAnalyzed,
        critical: critical,
        damageType: damageType,
        disruptChance: disruptChance,
        forceCore: false,
        originalDamage: chunkDamage,
        spectrum: spectrum
      });
      chunks.push({
        armorAnalyzed: false,
        critical: false,
        damageType: damageType,
        disruptChance: 0,
        forceCore: true,
        originalDamage: chunkDamage,
        spectrum: 0
      });
    } else {
      chunks.push({
        armorAnalyzed: armorAnalyzed,
        critical: critical,
        damageType: damageType,
        disruptChance: disruptChance,
        forceCore: false,
        originalDamage: damage,
        spectrum: spectrum
      });
    }
  }
  // Apply any additional damage reduction (11)
  const part = getDefensiveStatePart(botState.defensiveState.damageReduction);
  let multiplier = part != null ? part.damageReduction : 1;
  chunks.forEach(chunk => {
    chunk.damage = Math.trunc(chunk.originalDamage * multiplier);
  });
  function applyDamageChunk(damage, damageType, critical, isOverflow, forceCore, disruptChance, spectrum, armorAnalyzed) {
    // Determine hit part (14)
    const {part, partIndex} = getHitPart(botState, damageType, isOverflow, forceCore, armorAnalyzed);
    // Handle core hit
    if (part === null) {
      // Try to get shielding
      const shielding = getShieldingType(botState, "Core");
      // Remove crit if immunity or shielding (15)
      if (critical) {
        critical = !botState.immunities.includes("Criticals") && !botState.immunities.includes("Coring") && shielding == null;
      }
      if (shielding != null) {
        // Handle core shielding reduction
        // Note: shielding may absorb more damage than integrity
        const shieldingDamage = Math.trunc(shielding.shieldingPercent * damage);
        shielding.integrity -= shieldingDamage;
        damage = damage - shieldingDamage;
      }
      if (critical) {
        botState.coreIntegrity = 0;
      } else {
        botState.coreIntegrity -= damage;
      }
      // Apply disruption (18)
      // Core disruption only has 50% of the usual chance
      if (_commonJs.randomInt(0, 99) < disruptChance / 2 && botState.immunities.includes("Disruption")) {
        botState.coreDisrupted = true;
      }
      return;
    }
    // Try to get shielding
    const shielding = getShieldingType(botState, part.def["Slot"]);
    // Check for crit immunity or shielding (15)
    if (critical) {
      critical = !botState.immunities.includes("Criticals") && shielding == null;
    }
    // Check for spectrum engine explosion (17)
    // TODO apply damage
    const engineExplosion = part.def["Slot"] === "Power" && _commonJs.randomInt(0, 99) < spectrum;
    // Protection can't get crit, only receives 20% more damage
    if (critical && part.protection) {
      critical = false;
      damage = Math.trunc(1.2 * damage);
    }
    // Reduce damage for powered armor/siege mode (18)
    // TODO enemy siege mode
    if (("selfDamageReduction" in part)) {
      damage = Math.trunc(part.selfDamageReduction);
    }
    // Apply disruption (18)
    // TODO
    if (shielding != null) {
      // Handle slot shielding reduction
      // Note: shielding may absorb more damage than integrity
      const shieldingDamage = Math.trunc(shielding.shieldingPercent * damage);
      shielding.integrity -= shieldingDamage;
      damage = damage - shieldingDamage;
    }
    let destroyed = part.integrity <= damage || critical || engineExplosion;
    // Check for sever
    if (!destroyed && damageType === "Slashing") {
      // Sever has a damage / 3 % chance of happening against a
      // non-destroyed part (23)
      if (_commonJs.randomInt(0, 99) < Math.trunc(damage / 3)) {
        destroyed = true;
      }
    }
    if (destroyed) {
      // Part destroyed, remove part and update bot state
      botState.parts.splice(partIndex, 1);
      botState.armorAnalyzedCoverage -= part.armorAnalyzedCoverage;
      botState.totalCoverage -= part.coverage;
      // If the part was providing any damage resistances remove them now
      if (("resists" in part)) {
        Object.keys(part.resists).forEach(type => {
          if ((type in botState.resistances)) {
            botState.resistances[type] -= part.resists[type];
          }
        });
      }
      if (part.integrity < damage && !part.protection && canOverflow && !critical) {
        // Handle overflow damage if excess damage was dealt
        // against a non-protection part (19)
        applyDamageChunk(damage - part.integrity, damageType, false, true, false, false);
      }
      if (damageType === "Impact") {
        // Apply 25-150% random corruption to the bot after
        // destroying a part (affected by EM resistance) (23)
        let corruption = _commonJs.randomInt(25, 150);
        corruption = calculateResistDamage(botState, corruption, "Electromagnetic");
        botState.corruption += corruption;
      }
      part.integrity = 0;
      updateWeaponsAccuracy(state);
    } else {
      // Part not destroyed, just reduce integrity
      part.integrity -= damage;
    }
  }
  // Apply damage
  chunks.forEach(chunk => {
    applyDamageChunk(chunk.damage, chunk.damageType, chunk.critical, false, chunk.forceCore, chunk.disruptChance, chunk.spectrum, chunk.armorAnalyzed);
    // Apply corruption (23)
    if (damageType === "Electromagnetic") {
      // Check for corruption ignore chance
      const corruptionIgnorePart = getDefensiveStatePart(botState.defensiveState.corruptionIgnore);
      if (corruptionIgnorePart === null || _commonJs.randomInt(0, 99) >= corruptionIgnorePart.corruptionIgnore) {
        const corruptionPercent = _commonJs.randomInt(50, 150) / 100;
        const corruption = chunk.originalDamage * corruptionPercent;
        botState.corruption += corruption;
      }
    }
  });
}
// Returns a clone of a bot state
// This is not a deep copy, any fields that can be modified are deep-copied
// but immutable fields are not.
function cloneBotState(botState) {
  const resistances = {};
  Object.keys(botState.resistances).forEach(type => resistances[type] = botState.resistances[type]);
  const newState = {
    armorAnalyzedCoverage: botState.armorAnalyzedCoverage,
    coreCoverage: botState.coreCoverage,
    coreDisrupted: botState.coreDisrupted,
    coreIntegrity: botState.coreIntegrity,
    corruption: botState.corruption,
    def: botState.def,
    externalDamageReduction: botState.externalDamageReduction,
    immunities: botState.immunities,
    initialCoreIntegrity: botState.initialCoreIntegrity,
    parts: botState.parts.map(p => {
      return {
        armorAnalyzedCoverage: p.armorAnalyzedCoverage,
        coverage: p.coverage,
        def: p.def,
        integrity: p.integrity,
        protection: p.protection
      };
    }),
    regen: botState.regen,
    resistances: resistances,
    totalCoverage: botState.totalCoverage
  };
  newState.defensiveState = getBotDefensiveState(newState.parts, newState.externalDamageReduction);
  return newState;
}
function calculateResistDamage(botState, damage, damageType) {
  if ((damageType in botState.resistances)) {
    return Math.trunc(damage * (1 - botState.resistances[damageType] / 100));
  }
  return damage;
}
function getBotDefensiveState(parts, externalDamageReduction) {
  const state = {
    antimissile: [],
    avoid: [],
    corruptionIgnore: [],
    damageReduction: [],
    rangedAvoid: [],
    shieldings: {
      "Core": [],
      "Power": [],
      "Propulsion": [],
      "Utility": [],
      "Weapon": []
    }
  };
  parts.forEach(part => {
    const name = part.def["Name"];
    const specialItem = specialItems[name];
    if (specialItem === undefined) {
      return;
    }
    if (specialItem.category === categoryAntimissile) {
      // Antimissile System-like part
      part.intercept = specialItem.chance;
      state.antimissile.push(part);
    } else if (specialItem.category === categoryAvoid) {
      // Reaction Control System-like part
      // Leg/hover/flight determination done at accuracy update time
      part.avoid = specialItem;
      state.avoid.push(part);
    } else if (specialItem.category === categoryCorruptionIgnore) {
      // Dynamic Insulation System
      part.corruptionIgnore = specialItem.ignore;
      state.corruptionIgnore.push(part);
    } else if (specialItem.category === categoryDamageReduction) {
      // Force field-like part
      part.damageReduction = specialItem.reduction;
      state.damageReduction.push(part);
    } else if (specialItem.category === categoryResist) {
      // Damage type resist part
      part.resists = specialItem.resists;
    } else if (specialItem.category === categoryRangedAvoid) {
      // Phase Shifters
      part.rangedAvoid = specialItem.avoid;
      state.rangedAvoid.push(part);
    } else if (specialItem.category === categorySelfDamageReduction) {
      // Powered armor-like part
      part.selfDamageReduction = specialItem.reduction;
    } else if (specialItem.category === categoryShielding) {
      // Core/slot shielding
      part.shieldingPercent = specialItem.percent;
      state.shieldings[specialItem.slot].push(part);
    }
  });
  // Sort damage reduction (11)
  if ((externalDamageReduction in externalDamageReductionMap)) {
    const reduction = externalDamageReductionMap[externalDamageReduction];
    if (state.damageReduction.length === 0) {
      // If no other damage reduction no need to sort
      state.damageReduction.push({
        integrity: 1,
        damageReduction: reduction
      });
    } else {
      const existingIndex = damageReductionSortOrder.indexOf(state.damageReduction[0].def["Name"]);
      const newIndex = damageReductionSortOrder.indexOf(externalDamageReduction);
      // Use sort order to decide to insert before or after
      if (newIndex < existingIndex) {
        state.damageReduction.unshift({
          integrity: 1,
          damageReduction: reduction
        });
      } else {
        state.damageReduction.push({
          integrity: 1,
          damageReduction: reduction
        });
      }
    }
  }
  // All other parts should technically be sorted as well.
  // However, in game no bot ever has duplicate mixed-level defenses,
  // some have multiples of the same level like 2 base weapon shieldings on
  // Warbot which, but that doesn't require sorting anyways.
  return state;
}
// Tries to get a bot defensive state part from an array
// Parts will be removed from the array if their integrity has dropped below 0
function getDefensiveStatePart(array) {
  let part = null;
  while (array.length > 0) {
    if (array[0].integrity > 0) {
      // Found a good part, use it here
      part = array[0];
      break;
    } else {
      // Found destroyed part, remove from array
      array.shift();
    }
  }
  return part;
}
// Determines the part that was hit by an attack
function getHitPart(botState, damageType, isOverflow, forceCore, armorAnalyzed) {
  let part = null;
  let partIndex;
  if (forceCore) {} else {
    if (damageType === "Impact") {
      // Impact damage targets core and all parts with equal probability
      const coverageHit = _commonJs.randomInt(0, botState.parts.length);
      if (coverageHit < botState.parts.length) {
        partIndex = coverageHit;
        part = botState.parts[partIndex];
      } else {}
    } else if (isOverflow) {
      const protectionParts = botState.parts.filter(p => p.protection && p.coverage > 0);
      if (protectionParts.length > 0) {
        // Handle overflow damage specially when there's armor,
        // overflow into a random armor piece based on coverage (20)
        let coverageHit = _commonJs.randomInt(0, protectionParts.reduce((prev, part) => prev + part.coverage, 0));
        for (let i = 0; i < protectionParts.length; i++) {
          coverageHit -= protectionParts[i].coverage;
          if (coverageHit < 0) {
            part = protectionParts[i];
            break;
          }
        }
        partIndex = botState.parts.indexOf(part);
      }
    }
    if (part === null) {
      // Piercing damage gets double core exposure
      const coreCoverageBonus = damageType === "Piercing" ? botState.coreCoverage : 0;
      if (armorAnalyzed) {
        // Determine part based on reduced armor coverage
        const totalCoverage = botState.armorAnalyzedCoverage + coreCoverageBonus;
        let coverageHit = _commonJs.randomInt(0, totalCoverage - 1);
        for (partIndex = 0; partIndex < botState.parts.length; partIndex++) {
          // Subtract part's armor analyzed coverage to see if we got a hit
          coverageHit -= botState.parts[partIndex].armorAnalyzedCoverage;
          if (coverageHit < 0) {
            part = botState.parts[partIndex];
            break;
          }
        }
      } else {
        // Determine part based on regular coverage
        const totalCoverage = botState.totalCoverage + coreCoverageBonus;
        let coverageHit = _commonJs.randomInt(0, totalCoverage - 1);
        for (partIndex = 0; partIndex < botState.parts.length; partIndex++) {
          // Subtract part's coverage to see if we got a hit
          coverageHit -= botState.parts[partIndex].coverage;
          if (coverageHit < 0) {
            part = botState.parts[partIndex];
            break;
          }
        }
      }
    }
  }
  if (part === null) {
    partIndex = -1;
  }
  return {
    part: part,
    partIndex: partIndex
  };
}
function getRecoil(weaponDef, numTreads) {
  let recoil = 0;
  // Add recoil if siege mode not active
  if (("Recoil" in weaponDef)) {
    recoil += parseInt(weaponDef["Recoil"]);
    recoil -= numTreads;
  }
  // Make sure we don't have negative recoil
  return Math.max(recoil, 0);
}
const regenRegex = /Core Regeneration \((\d*)\)/;
function getRegen(bot) {
  const traits = _commonJs.valueOrDefault(bot["Traits"], []);
  for (let i = 0; i < traits.length; i++) {
    const result = regenRegex.exec(traits[i]);
    if (result != null) {
      return parseInt(result[1]);
    }
  }
  return 0;
}
function getRangedVolleyTime(weapons, cyclerModifier) {
  let volleyTime;
  if ((weapons.length in volleyTimeMap)) {
    volleyTime = volleyTimeMap[weapons.length];
  } else {
    // No additional penalty past 6 weapons
    volleyTime = 400;
  }
  weapons.forEach(weapon => {
    // Apply individual delays
    volleyTime += weapon.delay;
  });
  volleyTime *= cyclerModifier;
  // Min time is capped at 25
  return Math.trunc(Math.max(25, volleyTime));
}
// Tries to get a bot's first shielding for a specific slot
// Parts will be removed from the array if their integrity has dropped below 0
function getShieldingType(botState, slot) {
  return getDefensiveStatePart(botState.defensiveState.shieldings[slot]);
}
const simulationEndConditions = {
  "Kill": function (botState) {
    return botState.coreIntegrity <= 0 || botState.corruption >= 100;
  },
  "Kill or Core Disrupt": function (botState) {
    return botState.coreIntegrity <= 0 || botState.corruption >= 100 || botState.coreDisrupted;
  },
  "Kill or No Power": function (botState) {
    return botState.coreIntegrity <= 0 || botState.corruption >= 100 || botState.parts.every(part => part.def["Slot"] != "Power");
  },
  "Kill or No Weapons": function (botState) {
    return botState.coreIntegrity <= 0 || botState.corruption >= 100 || botState.parts.every(part => part.def["Slot"] != "Weapon");
  },
  "Architect Tele (80% integrity, 1 weapon, or 1 prop)": function (botState) {
    return botState.coreIntegrity <= botState.initialCoreIntegrity * 0.8 || botState.parts.filter(part => part.def["Slot"] === "Weapon").length === 1 || botState.parts.filter(part => part.def["Slot"] === "Propulsion").length === 1;
  }
};
function simulateCombat(state) {
  // Clone initial bot state
  const botState = cloneBotState(state.initialBotState);
  state.botState = botState;
  const offensiveState = state.offensiveState;
  let volleys = 0;
  let oldTus = 0;
  state.tus = 0;
  // Update initial accuracy
  updateWeaponsAccuracy(state);
  const endCondition = simulationEndConditions[state.endCondition];
  // Update initial sneak attack state
  offensiveState.sneakAttack = offensiveState.sneakAttackStrategy === "All" || offensiveState.sneakAttackStrategy === "First Only";
  // Update initial momentum
  offensiveState.momentum.current = offensiveState.momentum.bonus + offensiveState.momentum.initial;
  while (!endCondition(botState)) {
    // Apply core regen
    const lastCompletedTurns = Math.trunc(oldTus / 100);
    const newCompletedTurns = Math.trunc(state.tus / 100);
    const regenIntegrity = botState.regen * (newCompletedTurns - lastCompletedTurns);
    botState.coreIntegrity = Math.min(botState.initialCoreIntegrity, botState.coreIntegrity + regenIntegrity);
    // Process each volley
    volleys += 1;
    let volleyTime = offensiveState.volleyTime;
    if (offensiveState.melee) {
      // Always do primary attack
      simulateWeapon(state, state.weapons[0]);
      // Handle followups chances
      for (let i = 1; i < state.weapons.length; i++) {
        if (_commonJs.randomInt(0, 99) < offensiveState.followupChances[i - 1]) {
          simulateWeapon(state, state.weapons[i]);
          // Add followup delay, 50% of normal
          volleyTime += 0.5 * state.weapons[i].delay;
        }
      }
      // Apply volley modifier (actuators) here since the total time
      // can't be known ahead of time
      volleyTime *= offensiveState.volleyTimeModifier;
      if (volleys === 1) {
        // Disable sneak attack if active only for the first turn
        if (offensiveState.sneakAttackStrategy === "First Only") {
          offensiveState.sneakAttack = false;
        }
        // Remove initial momentum
        offensiveState.momentum.current = offensiveState.momentum.bonus;
      }
    } else {
      state.weapons.forEach(weapon => simulateWeapon(state, weapon));
    }
    if (volleys >= maxVolleys) {
      // Exceeded max volleys and combat will likely never complete
      // Just bail here
      return false;
    }
    // Update TUs and time based changes
    oldTus = state.tus;
    state.tus += volleyTime;
    // Update accuracy when crossing siege mode activation
    if (!offensiveState.melee && oldTus < offensiveState.siegeBonus.tus && state.tus > offensiveState.siegeBonus.tus) {
      updateWeaponsAccuracy(state);
    }
  }
  // Update kill dictionaries
  if ((volleys in state.killVolleys)) {
    state.killVolleys[volleys] += 1;
  } else {
    state.killVolleys[volleys] = 1;
  }
  if ((state.tus in state.killTus)) {
    state.killTus[state.tus] += 1;
  } else {
    state.killTus[state.tus] = 1;
  }
  return true;
}
// Simulates 1 weapon's damage in a volley
function simulateWeapon(state, weapon) {
  const botState = state.botState;
  const offensiveState = state.offensiveState;
  for (let i = 0; i < weapon.numProjectiles; i++) {
    // Check if the attack was a sneak attack or was a hit.
    // Technically sneak attacks can miss, but not under any realistic
    // scenario I could find. Sneak attacks force a base accuracy of 120%,
    // seemingly overriding other penalties like size or defensive
    // utilities like Reaction Control Systems. The most it seems to
    // take into account is -targeting, the lowest of which
    // (CR-A16's Pointy Stick) only has -20%, making this always a
    // guaranteed hit.
    let hit = offensiveState.melee && offensiveState.sneakAttack || _commonJs.randomInt(0, 99) < weapon.accuracy;
    if (hit && weapon.isMissile) {
      // Check for an antimissile intercept
      const part = getDefensiveStatePart(botState.defensiveState.antimissile);
      if (part != null) {
        const intercept = part.intercept;
        // Check once per tile
        // Note: even though the utilities have a range of 3 there are
        // still 4 attempts at an intercept because the projectile can
        // be intercepted on the same tile as the bot is currently on
        // before the damage is applied.
        // See below, @ is cogmind, i is intercept bot,
        // . is empty space, and x is intercept roll
        // @ . . . i
        // @ x . . i
        // @ . x . i
        // @ . . x i
        // @ . . . x
        const numChanges = Math.min(4, offensiveState.distance);
        for (let i = 0; i < numChanges; i++) {
          if (_commonJs.randomInt(0, 99) < intercept) {
            hit = false;
            break;
          }
        }
      }
    }
    if (!hit) {
      continue;
    }
    if (weapon.damageType != null) {
      // Calculate base damage, then apply overloads, momentum,
      // and sneak attacks (2)
      let damage = _commonJs.randomInt(weapon.damageMin, weapon.damageMax);
      // Overloading guns TODO
      // Apply momentum bonus
      // ([momentum] * [speed%] / 1200) * 40)
      if (offensiveState.melee && offensiveState.momentum.current > 0) {
        const speedPercent = 100 / offensiveState.speed * 100;
        let momentumMultiplier = offensiveState.momentum.current * speedPercent / 1200 * 40;
        // Cap at 1-40
        momentumMultiplier = Math.trunc(momentumMultiplier);
        momentumMultiplier = Math.max(1, momentumMultiplier);
        momentumMultiplier = Math.min(40, momentumMultiplier);
        if (weapon.damageType === "Piercing") {
          // Piercing gets double bonus (not double cap)
          momentumMultiplier *= 2;
        }
        momentumMultiplier = momentumMultiplier / 100 + 1;
        damage = Math.trunc(momentumMultiplier * damage);
      }
      // Apply double damage sneak attack bonus
      if (offensiveState.melee && offensiveState.sneakAttack) {
        damage *= 2;
      }
      // Add analysis (3)
      if (offensiveState.analysis) {
        damage = Math.trunc(1.1 * damage);
      }
      // Add accelerator (5)
      if (weapon.accelerated) {
        damage = Math.trunc(offensiveState.chargerBonus * damage);
      }
      // Apply resistances (6)
      damage = calculateResistDamage(botState, damage, weapon.damageType);
      // Check for armor integrity analyzer
      const armorAnalyzed = _commonJs.randomInt(0, 99) < offensiveState.armorAnalyzerChance;
      // Check for core analyzer (8)
      const coreAnalyzed = _commonJs.randomInt(0, 99) < offensiveState.coreAnalyzerChance;
      // Check for crit (9)
      const critical = _commonJs.randomInt(0, 99) < weapon.critical;
      if (damage > 0) {
        applyDamage(state, botState, damage, critical, armorAnalyzed, coreAnalyzed, weapon.disruption, weapon.spectrum, weapon.overflow, weapon.damageType);
      }
    }
    if (weapon.explosionType != null) {
      // Apply explosion damage (2)
      let damage = _commonJs.randomInt(weapon.explosionMin, weapon.explosionMax);
      // Apply resistances (6)
      damage = calculateResistDamage(botState, damage, weapon.explosionType);
      if (damage > 0) {
        applyDamage(state, botState, damage, false, false, false, weapon.disruption, weapon.explosionSpectrum, weapon.overflow, weapon.explosionType);
      }
    }
  }
}
// Updates all calculated weapon accuracies
function updateWeaponsAccuracy(state) {
  const offensiveState = state.offensiveState;
  const botState = state.botState;
  let perWeaponBonus = 0;
  // Flying/hovering enemy penalty
  // TODO handle bots becoming overweight
  const botDef = botState.def;
  const movement = botDef["Movement"];
  if (movement.includes("Hovering") || movement.includes("Flying")) {
    perWeaponBonus -= 10;
  }
  // Subtract always avoid util (reaction control system)
  const avoidPart = getDefensiveStatePart(botState.defensiveState.avoid);
  if (avoidPart != null) {
    if (movement.includes("Walking")) {
      perWeaponBonus -= avoidPart.avoid.legs;
    } else {
      perWeaponBonus -= avoidPart.avoid.other;
    }
  }
  if (offensiveState.analysis) {
    perWeaponBonus += 5;
  }
  let siegeBonus = 0;
  if (offensiveState.melee) {
    // Add melee analysis bonuses
    for (let i = 0; i < meleeAnalysisAccuracy.length; i++) {
      perWeaponBonus += offensiveState.meleeAnalysis[i] * meleeAnalysisAccuracy[i];
    }
  } else {
    // Add (low) distance bonus
    perWeaponBonus += offensiveState.distance < 6 ? (6 - offensiveState.distance) * 3 : 0;
    // Add siege bonus
    const siege = offensiveState.siegeBonus;
    if (state.tus >= siege.tus) {
      siegeBonus = siege.bonus;
    }
    perWeaponBonus += siegeBonus;
    // Subtract ranged avoid util (phase shifter)
    const rangedAvoidPart = getDefensiveStatePart(botState.defensiveState.rangedAvoid);
    if (rangedAvoidPart != null) {
      perWeaponBonus -= rangedAvoidPart.rangedAvoid;
    }
  }
  state.weapons.forEach(weapon => {
    if (("Waypoints" in weapon.def)) {
      // Guided weapons always have 100% accuracy
      weapon.accuracy = 100;
      return;
    }
    let accuracy = weapon.baseAccuracy + perWeaponBonus;
    if (!offensiveState.melee && siegeBonus === 0) {
      // Subtract recoil if siege mode inactive
      accuracy -= offensiveState.recoil - getRecoil(weapon.def, offensiveState.numTreads);
    }
    // Cap accuracy
    let max = offensiveState.melee ? maxRangedAccuracy : maxMeleeAccuracy;
    weapon.accuracy = Math.min(max, Math.max(accuracy, minAccuracy));
  });
}

},{"./common.js":"2d4ET","@parcel/transformer-js/lib/esmodule-helpers.js":"HNevC"}]},{},["4upkk","18CUN"], "18CUN", "parcelRequire5d10")

//# sourceMappingURL=simulator.79bd35df.js.map
