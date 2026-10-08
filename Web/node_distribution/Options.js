/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Extension/App/Options.tsx"
/*!***********************************!*\
  !*** ./Extension/App/Options.tsx ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OptionsView: () => (/* binding */ OptionsView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _View_Icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../View/Icons */ "./Extension/View/Icons.tsx");
/* harmony import */ var _View_Primitives__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../View/Primitives */ "./Extension/View/Primitives.tsx");
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Model */ "./Extension/Model/index.ts");
/* harmony import */ var _View_Timesheets__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../View/Timesheets */ "./Extension/View/Timesheets.tsx");
/* harmony import */ var _View_SettingsView__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../View/SettingsView */ "./Extension/View/SettingsView.tsx");
// Copyright FreedomGovernment; license at https://github.com/FreedomGovernment/FreeLawGen







function OptionsView() {
    console.log('[OptionsView].Begin');
    let Modes;
    (function (Modes) {
        Modes[Modes["CentralCommand"] = 0] = "CentralCommand";
        Modes[Modes["Estuary"] = 1] = "Estuary";
        Modes[Modes["Init"] = 2] = "Init";
        Modes[Modes["Intake"] = 3] = "Intake";
        Modes[Modes["Loading"] = 4] = "Loading";
        Modes[Modes["MissionControl"] = 5] = "MissionControl";
        Modes[Modes["Post"] = 6] = "Post";
        Modes[Modes["Settings"] = 7] = "Settings";
        Modes[Modes["Timesheets"] = 8] = "Timesheets";
    })(Modes || (Modes = {}));
    const SettingsDispatcher = (state, action) => {
        let type = action.type;
        console.log('[OptionsView.ReduceState]: ' + type);
        switch (type) {
            case null: return state;
            case 'Options':
                return state.map((state_prior) => {
                    ///if (state_prior.id === action.id) {
                    ///  return { ...state_prior, complete: !state_prior.complete };
                    ///} else {
                    ///  return state_prior;
                    ///}
                    return state_prior;
                });
            case 'OptionsUsernameSet':
                return state.map((state_prior) => {
                });
            default: return state;
        }
    };
    const [CommandStructure, CommandStructureSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_Model__WEBPACK_IMPORTED_MODULE_4__.CommandStructureInit);
    //const [Visible, VisibleSet] = useState(false) //???
    const [State, StateSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
    const [IsSaving, IsSavingSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [Mode, ModeSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(Modes.Settings);
    const [Config, ConfigSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_Model__WEBPACK_IMPORTED_MODULE_4__.ModelConfigSyncInit);
    const SaveButtonStyles = 'block mt-10 border-none outline-none'
        + 'rounded-md p-4 bg-violet-500 font-bold'
        + 'cursor-pointer';
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        console.log('[useEffect]');
        (0,_Model__WEBPACK_IMPORTED_MODULE_4__.ModelConfigSyncGet)().then(options_new => ConfigSet(options_new));
    }, []);
    const SettingsReducer = (action) => {
        return SettingsDispatcher(Config, action);
    };
    const [AppState, Dispatch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(SettingsReducer, { prop1: null, prop2: null });
    if (Config == null || Config == undefined)
        return null;
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'Root' },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'RootMidground' }),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'RootForeground' }),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'RootBackground' },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'SPAHeader' },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", { id: 'PageImage', src: './Icon128.png' }),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'SPAToolbar', className: 'flex flex-row inline' },
                    Mode == Modes.Timesheets &&
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_Primitives__WEBPACK_IMPORTED_MODULE_3__.Tooltip, { title: "Timesheets" },
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", null,
                                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_Icons__WEBPACK_IMPORTED_MODULE_2__.ClockIcon, null),
                                "Timesheets")),
                    Mode != Modes.Timesheets &&
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_Primitives__WEBPACK_IMPORTED_MODULE_3__.Tooltip, { title: "Timesheets" },
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => ModeSet(Modes.Timesheets) },
                                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_Icons__WEBPACK_IMPORTED_MODULE_2__.ClockIcon, null),
                                "Timesheets")),
                    Mode == Modes.Settings &&
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_Primitives__WEBPACK_IMPORTED_MODULE_3__.Tooltip, { title: "Settings" },
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", null,
                                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_Icons__WEBPACK_IMPORTED_MODULE_2__.GearIcon, null),
                                "Settings")),
                    Mode != Modes.Settings &&
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_Primitives__WEBPACK_IMPORTED_MODULE_3__.Tooltip, { title: "Settings" },
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => ModeSet(Modes.Settings) },
                                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_Icons__WEBPACK_IMPORTED_MODULE_2__.GearIcon, null),
                                "Settings"))),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'SPAMain', className: '' },
                    Mode == Modes.Timesheets &&
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_Timesheets__WEBPACK_IMPORTED_MODULE_5__["default"], null),
                    Mode == Modes.Settings &&
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_SettingsView__WEBPACK_IMPORTED_MODULE_6__["default"], { dispatch: SettingsReducer, is_saving: IsSaving }))))));
}
const container = document.createElement('div');
document.body.appendChild(container);
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container);
root.render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(OptionsView, null));


/***/ },

/***/ "./Extension/View/Icons.tsx"
/*!**********************************!*\
  !*** ./Extension/View/Icons.tsx ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClockIcon: () => (/* binding */ ClockIcon),
/* harmony export */   GearIcon: () => (/* binding */ GearIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function GearIcon() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" }),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" }));
}
function ClockIcon() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" }));
}


/***/ },

/***/ "./Extension/View/Primitives.tsx"
/*!***************************************!*\
  !*** ./Extension/View/Primitives.tsx ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ButtonSave: () => (/* binding */ ButtonSave),
/* harmony export */   Tooltip: () => (/* binding */ Tooltip)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function ButtonSave({ props, children }) {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { color: "primary", onClick: () => props === null || props === void 0 ? void 0 : props.dispatch({ type: 'OptionsSave',
            values: Object.assign({}, props.options) }), disabled: props.is_saving }, children);
}
function Tooltip({ children, title }) {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "transititext-primary text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600", "data-te-toggle": "tooltip", title: title }, children);
}


/***/ },

/***/ "./Extension/View/SettingsView.tsx"
/*!*****************************************!*\
  !*** ./Extension/View/SettingsView.tsx ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
// Copyright FreedomGovernment; license at https://github.com/FreedomGovernment/FreeLawGen

const SettingsEditor = (props) => {
    let { dispatch, is_saving } = props;
    if (dispatch == undefined)
        return null;
    const options = dispatch(null);
    let { content_scripts, me, metric_units } = options;
    if (content_scripts == undefined || metric_units == undefined ||
        me == undefined)
        return null;
    const [ContentScripts, ContentScriptsSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(content_scripts == true ? 'Enabled' : 'Disabled');
    const [MetricUnits, MetricUnitsSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(metric_units == true ? 'Standard' : 'Imperial');
    const UsernameChange = (me) => {
    };
    const ContentScriptsChange = (event, value) => {
        ContentScriptsSet(value == 'Enabled' ? 'Disabled' : 'Enabled');
    };
    const MetricUnitsChange = (event, value) => {
        MetricUnitsSet(metric_units == true ? 'Standard' : 'Imperial');
    };
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'flex justify-center h-full' },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "Options"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "Username"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { type: 'text', placeholder: "Enter your GitHub me...", value: options.me, onChange: (event) => UsernameChange(event.target.value), disabled: is_saving }),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'UseContentScripts' },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { htmlFor: "UseContentScriptsCB" }, "Use content scripts: "),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { type: "checkbox", id: "UseContentScriptsCB", name: "scales", checked: true })),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'UseStandardMetricUnits' },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { htmlFor: "UseStandardMetricUnitsCB" }, "Use standard metric units: "),
            ContentScripts == 'Enabled' ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { type: "checkbox", id: "UseStandardMetricUnitsCB", name: "scales", checked: true })) : (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { type: "checkbox", id: "UseStandardMetricUnitsCB", name: "scales" }))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { color: "primary", onClick: () => dispatch({ action: 'OptionsSave',
                values: Object.assign({}, options) }), disabled: is_saving }, is_saving ? 'Save' : 'Saving...'));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SettingsEditor);


/***/ },

/***/ "./Extension/View/Timesheets.tsx"
/*!***************************************!*\
  !*** ./Extension/View/Timesheets.tsx ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimesheetsView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
// Copyright FreedomGovernment; license at https://github.com/FreedomGovernment/FreeLawGen

function TimesheetsView() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "Timesheets"));
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"Options": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkfreelawgen"] = self["webpackChunkfreelawgen"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_react-dom_client_js","Extension_Model_index_ts"], () => (__webpack_require__("./Extension/App/Options.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=Options.js.map