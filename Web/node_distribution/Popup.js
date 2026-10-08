/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Extension/App/Popup.tsx"
/*!*********************************!*\
  !*** ./Extension/App/Popup.tsx ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Model */ "./Extension/Model/index.ts");
/* harmony import */ var _View_SessionPunchClockView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../View/SessionPunchClockView */ "./Extension/View/SessionPunchClockView.tsx");
// Copyright FreedomGovernment; license at https://github.com/FreedomGovernment/FreeLawGen




// Browser extension popup widget.
const Popup = () => {
    console.log('>Popup');
    // Example:
    // Live Coding FreeLawGen #39.F Add: Can clock and off to dummy...
    const [ConfigSync, ConfigSyncSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigSyncInit);
    const [ConfigLocal, ConfigLocalSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigLocalInit);
    const [Syndicate, SyndicateSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
    const [IsSaving, IsSavingSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        console.log('[useEffect]');
        (0,_Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigSyncGet)().then(state => ConfigSyncSet(state));
        (0,_Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigLocalGet)().then(state => ConfigLocalSet(state));
        (0,_Model__WEBPACK_IMPORTED_MODULE_2__.ModelSyndicateGet)().then(state => SyndicateSet(state));
    }, []);
    if (ConfigLocal == null || ConfigSync == null)
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "null");
    let { account, mission_ids, repo, session, session_ids } = ConfigSync;
    if (session == undefined)
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Config members undefined");
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex flex-col w-full" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null,
            "Account: ",
            account,
            " #",
            Math.abs(session)),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null,
            "Repo: ",
            repo),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null,
            "Mission: ",
            mission_ids),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", null,
            "Heading: ",
            session_ids),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_View_SessionPunchClockView__WEBPACK_IMPORTED_MODULE_3__["default"], { ConfigSync: ConfigSync, ConfigSyncSet: ConfigSyncSet, ConfigLocal: ConfigLocal, ConfigLocalSet: ConfigLocalSet, ModelConfigLocalSet: _Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigLocalSet, ModelConfigSyncSet: _Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigSyncSet, IsSaving: IsSaving, Syndicate: Syndicate }));
};
const container = document.createElement('div');
document.body.appendChild(container);
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container);
root.render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Popup, null));


/***/ },

/***/ "./Extension/View/MissionSelector.tsx"
/*!********************************************!*\
  !*** ./Extension/View/MissionSelector.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IssueIsSelected: () => (/* binding */ IssueIsSelected),
/* harmony export */   ListReposAndIssues: () => (/* binding */ ListReposAndIssues),
/* harmony export */   "default": () => (/* binding */ MissionSelector)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Model */ "./Extension/Model/index.ts");
// Copyright FreedomGovernment; license at https://github.com/FreedomGovernment/FreeLawGen


const { LLIDNextHex } = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'linearid'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
function ListReposAndIssues(Syndicate, account, repo) {
    let repo_names = [];
    let issue_id_strings = [];
    console.log('Iterating through Syndicates...');
    Object.entries(Syndicate || {}).forEach(([account_key, account_value]) => {
        if (account != account_key && account != 'All')
            return [[], []];
        console.log('Processing entries for account:' + account + ' s_key:' + account_key);
        //Accounts.push(key)
        let Repos = Object(account_value)['Repos'];
        console.log('Account:"' +
            Object.keys(Syndicate).find(key => Syndicate[key] === account_value) + '"');
        console.assert(Repos != undefined);
        console.log('Repos:');
        console.log(Repos);
        console.log('Iterating through Repos:');
        repo_names.push(repo !== null && repo !== void 0 ? repo : '.github');
        Object.entries(Repos || {}).forEach(([repo_key, repo_value]) => {
            console.log('key:"' + repo_key + '" + repo_value:');
            console.log(repo_value);
            if (account === account_key && repo === repo_key) {
                console.log('Creating list of issues...');
                let repo_issues = Object(repo_value)['issues_open'];
                console.log('my_issues:');
                console.log(repo_issues);
                Object.entries(repo_issues || {}).map(([issue_key, issue_value]) => {
                    issue_id_strings.push('#' + issue_key + ' ' + issue_value);
                    console.log("'#' + key2 + ' ' + value2:" + '#' + issue_key + ' '
                        + issue_value);
                });
            }
            else {
                repo_names.push(repo_key);
            }
        });
        console.log('Done!');
    });
    console.log("repos:");
    console.log(repo_names);
    console.log("issues:");
    console.log(issue_id_strings);
    return [repo_names, issue_id_strings];
}
// Checks if the issue_num_title starts off with #mission_number_string (i.e #123).
function IssueIsSelected(issue_num_title, mission_number_string) {
    const MLength = mission_number_string.length;
    //if(MLength < 1 || issue_num_title.length <= MLength) return false; 
    // Example issue_is_selected: "ABC" or "A123" or "#123 Working example"
    let issue_is_selected = issue_num_title[0] != '#' && MLength < 1
        && issue_num_title.length <= MLength;
    //if(!issue_is_selected) return issue_is_selected
    let i = 0;
    for (; i < MLength; ++i) {
        if (issue_num_title[i + 1] != mission_number_string[i]) {
            issue_is_selected = false;
            break;
        }
    }
    return issue_is_selected && issue_num_title[i + 1] == ' ';
}
function MissionSelector(props) {
    const { ConfigLocal, ConfigLocalSet, Syndicate } = props;
    let { account, mission_ids, repo } = ConfigLocal;
    console.log('MissionSelector: account:"' + account + '" repo:"' + repo
        + '" mission:"' + mission_ids + '"');
    console.log('Config:');
    console.log(ConfigLocal);
    console.log("Syndicate:");
    console.log(Syndicate);
    console.log("repo:");
    console.log(repo);
    if (account == undefined || repo == undefined || mission_ids == undefined)
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "undefined");
    let [repos, issues] = ListReposAndIssues(Syndicate, account, repo);
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "MissionSelector w-lg w-full max-w-lg" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'AccountSelector' },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { htmlFor: "Accounts" }, "Account:"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("select", { name: "Accounts", id: "Accounts", className: 'max-w-fit', onChange: (e) => {
                    console.log("Changing Account:" + e.target.value);
                    ConfigLocalSet(Object.assign(Object.assign({}, ConfigLocal), { account: e.target.value }));
                }, value: account },
                Object.keys(Syndicate).map((key) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: key, key: LLIDNextHex() }, key))),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: 'All' }, "All"))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'RepoSelector' },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { htmlFor: "Repos" }, "Repo:"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("select", { name: "Repos", id: "Repos", className: 'max-w-fit', onChange: e => {
                    console.log("Changing Repo:" + e.target.value);
                    const ConfigNew = Object.assign(Object.assign({}, ConfigLocal), { account: ConfigLocal.account, repo: e.target.value });
                    (0,_Model__WEBPACK_IMPORTED_MODULE_1__.ModelConfigLocalSet)(ConfigNew).then(() => {
                        ConfigLocalSet(ConfigNew);
                    });
                }, value: repo }, repos.map((key) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: key, key: LLIDNextHex() }, key))))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { id: 'MissionSelector' },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { htmlFor: "Missions" }, "Missions:"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("select", { name: "Missions", id: "Missions", className: 'max-w-fit', onChange: (e) => {
                    console.log(e.target.value);
                    const ConfigNew = Object.assign(Object.assign({}, ConfigLocal), { mission_ids: e.target.value });
                    (0,_Model__WEBPACK_IMPORTED_MODULE_1__.ModelConfigLocalSet)(ConfigNew).then(() => {
                        ConfigLocalSet(ConfigNew);
                    });
                }, value: mission_ids }, issues.map((issue_num_title) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", { value: issue_num_title, key: LLIDNextHex() }, issue_num_title))))));
}


/***/ },

/***/ "./Extension/View/SessionPunchClockView.tsx"
/*!**************************************************!*\
  !*** ./Extension/View/SessionPunchClockView.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SessionPunchClockViewView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _MissionSelector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MissionSelector */ "./Extension/View/MissionSelector.tsx");
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Model */ "./Extension/Model/index.ts");
// Copyright FreedomGovernment; license at https://github.com/FreedomGovernment/FreeLawGen

//const { TimestampSeconds } = require('linearid')


function SessionPunchClockViewView(props) {
    const { ConfigLocal, ConfigLocalSet, ConfigSync, ConfigSyncSet, IsSaving, Syndicate } = props;
    let { session } = ConfigSync;
    if (session == undefined)
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "undefined");
    const [MissionHeading, MissionHeadingSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [SessionHeading, SessionHeadingSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [SessionNumber, SessionNumberSet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
    const CanCancelMissionSwitch = ConfigLocal.account != ConfigSync.account ||
        ConfigLocal.mission_ids != ConfigSync.mission_ids ||
        ConfigLocal.repo != ConfigSync.repo;
    const OtherMissionSelected = ConfigLocal.account != ConfigSync.account &&
        ConfigLocal.mission_ids != ConfigSync.mission_ids &&
        ConfigLocal.repo != ConfigSync.repo;
    function TimesheetPunchHandle() {
        if (session == undefined)
            return;
        const Time = Date.now() / 1000;
        const TimeText = new Date(Time * 1000);
        if (session == 0) { // End Session
            fetch("localhost:3000/api/v1/session", {
                method: "POST"
            });
            console.log('Clocking on to Session #' + SessionNumber + ' at ' + TimeText);
            //@todo Integrate with GitHub to create Session Tickets.
            const ConfigNew = Object.assign(Object.assign({}, ConfigSync), { session: SessionNumber });
            (0,_Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigSyncSet)(ConfigNew);
            ConfigSyncSet(ConfigNew);
        }
        else if (session < 0) { // Stop Break
            const S = -session;
            console.log('Stopping break from Session #' + S + ' at ' + TimeText);
            const ConfigNew = Object.assign(Object.assign({}, ConfigSync), { session: S });
            (0,_Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigSyncSet)(ConfigNew);
            ConfigSyncSet(ConfigNew);
        }
        else { // -> Session > 0
            console.log('Clocking off from Session #' + session + ' at ' + TimeText);
            const ConfigNew = Object.assign(Object.assign({}, ConfigSync), { session: 0 });
            (0,_Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigSyncSet)(ConfigNew);
            ConfigSyncSet(ConfigNew);
        }
    }
    function TimesheetBreakStartHandle() {
        if (session == undefined)
            return;
        let time = Date.now() / 1000;
        console.log('Starting break from Session #' + session + ' at ' + new Date(time * 1000));
        const ConfigNew = Object.assign(Object.assign({}, ConfigSync), { session: -session });
        (0,_Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigSyncSet)(ConfigNew);
        ConfigSyncSet(ConfigNew);
    }
    function MissionHeadingUpdate(focus_headline) {
        MissionHeadingSet(focus_headline);
    }
    function SessionHeadingUpdate(focus_headline) {
        SessionHeadingSet(focus_headline);
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'flex flex-row m-4' },
        session == 0 && react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { id: 'ClockOnOffButton', type: "button", value: "Begin Session", onClick: TimesheetPunchHandle }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { id: 'SessionNumberInput', type: 'number', value: SessionNumber, onChange: e => SessionNumberSet(e.target.valueAsNumber), disabled: IsSaving })),
        session > 0 && react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { id: 'ClockBreakOnOffButton', type: "button", value: "End Session", onClick: TimesheetPunchHandle }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { id: 'TimesheetBreakButton', type: "button", value: "Start Break", onClick: TimesheetBreakStartHandle })),
        session < 0 &&
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { id: 'ClockBreakOnOffButton', type: "button", value: "Stop break", onClick: TimesheetPunchHandle }),
        session == 0 && react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "Session and Mission Heading:"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { type: 'text', placeholder: "Enter #SID and heading...", value: SessionHeading, onChange: (event) => SessionHeadingUpdate(event.target.value), disabled: IsSaving }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "Mission heading:"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { type: 'text', placeholder: "Enter mission heading...", value: MissionHeading, onChange: (event) => MissionHeadingUpdate(event.target.value), disabled: IsSaving })),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_MissionSelector__WEBPACK_IMPORTED_MODULE_1__["default"], { ConfigLocal: ConfigLocal, ConfigLocalSet: ConfigLocalSet, ModelConfigSyncSet: _Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigSyncSet, Syndicate: Syndicate }),
        CanCancelMissionSwitch &&
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => {
                    const ConfigNew = Object.assign(Object.assign({}, ConfigLocal), { account: ConfigSync.account, repo: ConfigSync.repo, mission_ids: ConfigSync.mission_ids });
                    console.log('');
                    ConfigLocalSet(ConfigNew);
                    (0,_Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigLocalSet)(ConfigNew);
                } }, "Cancel"),
        OtherMissionSelected &&
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => {
                    const Timestamp = Date.now() / 1000;
                    let { account, mission_ids, repo } = ConfigLocal;
                    const ConfigNew = Object.assign(Object.assign({}, ConfigSync), { account: account, repo: repo, mission_ids: mission_ids });
                    console.log(new Date(Timestamp * 1000) + ': Starting mission ' + account + '/' + repo + mission_ids);
                    ConfigSyncSet(ConfigNew);
                    (0,_Model__WEBPACK_IMPORTED_MODULE_2__.ModelConfigSyncSet)(ConfigNew);
                } }, "Start mission"));
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
/******/ 			"Popup": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_react-dom_client_js","Extension_Model_index_ts"], () => (__webpack_require__("./Extension/App/Popup.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=Popup.js.map