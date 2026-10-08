"use strict";
(self["webpackChunkfreelawgen"] = self["webpackChunkfreelawgen"] || []).push([["Extension_Model_index_ts"],{

/***/ "./Extension/Model/index.ts"
/*!**********************************!*\
  !*** ./Extension/Model/index.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommandStructureGet: () => (/* binding */ CommandStructureGet),
/* harmony export */   CommandStructureInit: () => (/* binding */ CommandStructureInit),
/* harmony export */   CommandStructureSet: () => (/* binding */ CommandStructureSet),
/* harmony export */   MissionSelectedString: () => (/* binding */ MissionSelectedString),
/* harmony export */   MissionStringUnpack: () => (/* binding */ MissionStringUnpack),
/* harmony export */   ModelConfigLocalGet: () => (/* binding */ ModelConfigLocalGet),
/* harmony export */   ModelConfigLocalInit: () => (/* binding */ ModelConfigLocalInit),
/* harmony export */   ModelConfigLocalSet: () => (/* binding */ ModelConfigLocalSet),
/* harmony export */   ModelConfigSyncGet: () => (/* binding */ ModelConfigSyncGet),
/* harmony export */   ModelConfigSyncInit: () => (/* binding */ ModelConfigSyncInit),
/* harmony export */   ModelConfigSyncSet: () => (/* binding */ ModelConfigSyncSet),
/* harmony export */   ModelIssueGet: () => (/* binding */ ModelIssueGet),
/* harmony export */   ModelIssueInit: () => (/* binding */ ModelIssueInit),
/* harmony export */   ModelIssueSet: () => (/* binding */ ModelIssueSet),
/* harmony export */   ModelMissionGet: () => (/* binding */ ModelMissionGet),
/* harmony export */   ModelMissionInit: () => (/* binding */ ModelMissionInit),
/* harmony export */   ModelMissionSet: () => (/* binding */ ModelMissionSet),
/* harmony export */   ModelRepoGet: () => (/* binding */ ModelRepoGet),
/* harmony export */   ModelRepoSet: () => (/* binding */ ModelRepoSet),
/* harmony export */   ModelSessionInit: () => (/* binding */ ModelSessionInit),
/* harmony export */   ModelSessionSet: () => (/* binding */ ModelSessionSet),
/* harmony export */   ModelSyndicateGet: () => (/* binding */ ModelSyndicateGet),
/* harmony export */   ModelSyndicateInit: () => (/* binding */ ModelSyndicateInit),
/* harmony export */   ModelSyndicateSet: () => (/* binding */ ModelSyndicateSet),
/* harmony export */   RepoGithubDefault: () => (/* binding */ RepoGithubDefault),
/* harmony export */   UsernameInit: () => (/* binding */ UsernameInit)
/* harmony export */ });
// Copyright FreedomGovernment; license at https://github.com/FreedomGovernment/FreeLawGen
const UsernameInit = 'AStarCale';
const ModelConfigSyncInit = {
    content_scripts: false,
    metric_units: true,
    me: UsernameInit,
    them: '',
    session: 0,
    session_ids: '',
    account: 'FreedomGovernment',
    repo: 'FreeLawGen',
    mission_ids: ''
};
const ModelConfigLocalInit = {
    account: '',
    mission_ids: '',
    modal_visible: false,
    modal_state: 0,
    repo: '',
    session: 0,
};
// Unpacks the account/repo#MissionNumber.ChildMission from the input string.
function MissionStringUnpack(input) {
    let state = 0;
    let account = '';
    let repo = '';
    let mission_number = '';
    let child_mission = '';
    let i = 0;
    let c = input[i++];
    let o = '\nParsing input:"' + input + '"';
    while (c != undefined) {
        switch (state) {
            case 0: { // Parsing org
                o += '\naccount:"' + account + '" c:' + c + ' i:' + i;
                if (c == '/') {
                    c = input[i++];
                    state = 1;
                    break;
                }
                account += c;
                c = input[i++];
                break;
            }
            case 1: { // Parsing repo
                o += '\nrepo:"' + repo + '" c:' + c + ' i:' + i;
                if (c == '#') {
                    c = input[i++];
                    state = 2;
                    break;
                }
                repo += c;
                c = input[i++];
                break;
            }
            case 2: { // Parsing mission number.
                o += '\nmission_number:"' + mission_number + '" c:' + c + ' i:'
                    + i;
                if (c == '.') {
                    c = input[i++];
                    state = 3;
                    break;
                }
                if (c < '0' || c > '9') {
                    console.assert(c > '', 'ERROR: invalid child mission at i:'
                        + i + ' c:' + c.charCodeAt(0) + ' i:' + i);
                    c = undefined;
                    break;
                }
                mission_number += c;
                c = input[i++];
                break;
            }
            case 3: { // Parsing Child Mission
                o += '\nchild_mission:"' + child_mission + '" c:' + c + ' i:' + i;
                if (c <= ' ') {
                    console.assert(c > '', 'ERROR: invalid child mission at i:'
                        + i + ' c:' + c.charCodeAt(0));
                    c = undefined;
                    break;
                }
                child_mission += c;
                c = input[i++];
                break;
            }
            default: {
                c = undefined;
                break;
            }
        }
    }
    o += '\nFound account:"' + account + '" repo:"' + repo
        + '" mission_number:"' + mission_number
        + '" child_mission:"' + child_mission + '"';
    console.log(o);
    return [account, repo, parseInt(mission_number), child_mission];
}
function MissionSelectedString(syndicate, account, repo, mission) {
    var _a, _b, _c, _d;
    let result = 'Error in MissionSelectedString';
    result = (_d = (_c = (_b = (_a = syndicate[account]) === null || _a === void 0 ? void 0 : _a['Repos']) === null || _b === void 0 ? void 0 : _b[repo]) === null || _c === void 0 ? void 0 : _c['issues_open']) === null || _d === void 0 ? void 0 : _d[mission.toString()];
    return '#' + mission + ' ' + result;
    // const Account = syndicate[account]
    // if(Account == undefined) return 'Account == undefined'
    // const Repos = Account['Repos']
    // if(Repos == undefined) return 'Repos == undefined'
    // const Repo = Account[repo]
    // if(Repo == undefined) return 'Repo == undefined'
    // const IssuesOpen = Account['issues_open']
    // if(IssuesOpen == undefined) return 'IssuesOpen == undefined'
    // const MissionTitle = Account[mission.toString()]
    // if(MissionTitle == undefined) return 'IssuesOpen[mission] == undefined'
    // return '#' + mission + ' ' + MissionTitle
}
// The vanilla Incident Command System Structure.
const CommandStructureInit = {
    'command_roles': {
        ['Commander']: {
            'master': null,
            'contact': {},
            'supervisors': null
        },
        ['PublicInformation']: {
            'master': null,
            'contact': {},
            'supervisors': null,
        },
        ['Liaison']: {
            'master': null,
            'contact': {},
            'supervisors': null,
        },
        ['Safety']: {
            'master': null,
            'contact': {},
            'supervisors': null,
        },
        ['Operations']: {
            'master': null,
            'contact': {},
            'supervisors': null,
        },
        ['Planning']: {
            'master': null,
            'contact': {},
            'supervisors': null,
        },
        ['Logistics']: {
            'master': null,
            'contact': {},
            'supervisors': null,
        },
        ['FinanceAdmin']: {
            'master': null,
            'contact': {},
            'supervisors': null,
        }
    }
};
const ModelSyndicateInit = {
    "FreedomGovernment": {
        "Type": "Org",
        "Repos": {
            "FreeLawGen": {
                "issues_open": {
                    "86": "Abilities.Add: Can set and crop background in OBS for thumbnail",
                    "85": "ContextMenu.Add quick paste feature",
                    "75": "ContextMenu.AddAbility Right click on GitHub issue tickets and add them to the current mission or set as the current mission",
                    "71": "Options.Abilities: Can switch property key casing",
                    "28": "Abilities.Add: Can select a dummy account, repo, mission, and child mission",
                    "22": "Timesheet Logger (v0.1)",
                    "14": "ProductManager.Abilities.Add: Can add and remove products"
                },
                "visibility": true
            },
            "AStartupToolkit": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "LinearId": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "OBSFX": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            ".github": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "AStartupGitTemplate": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "AStartupCookbook": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "AStartupWorld": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "StreamSeq": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "Channel": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "OBSTouchGIMP": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
        }
    },
    "AStarCale": {
        "Type": "Person",
        "Repos": {
            "BadThing": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            ".github": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "FreedomCookbook": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "SickBay>": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "metascrapper": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "MetamediaDownloader": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "Self": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            }
        }
    },
    "KabukiStarship": {
        "Type": "Org",
        "Repos": {
            "Script2": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            ".github": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "Actors": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "iGeekPolygonWorld": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "KabukiLIcenses": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "iGeekCookbook": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "StarshipCookbook": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "KabukiPressCookbook": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "MusictechCookbook": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "iGeek": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "iGeekCardsWorld": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "KabukiStarship.github.io": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "KabukiToolkit": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "IMUL": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "ScriptTek": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "iGeekMazeWorld": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "iGeekPacWorld": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "iGeekTileWorld": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "iGeekVirusWorld": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "KabukiBenchmark": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": true
            },
            "KabukiPress": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "KabukiSearch": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "SearchFor4.669": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "IAmPy": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "iGeekWikiWorld": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "iGeekUlator": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "iGeekBlockWorld": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "KabukiDB": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            },
            "KabukiTheater": {
                "issues_open": {
                    "1": "Session.Next.Monday",
                    "2": "Session.Next.Tuesday"
                },
                "visibility": false
            }
        }
    }
};
function ModelConfigLocalGet() {
    const keys = ['config_local'];
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (state) => {
            var _a;
            resolve((_a = state.config_local) !== null && _a !== void 0 ? _a : ModelConfigLocalInit);
        });
    });
}
function ModelConfigLocalSet(config) {
    const Values = {
        config_local: config,
    };
    return new Promise((resolve) => {
        chrome.storage.local.set(Values, () => {
            resolve();
        });
    });
}
function ModelConfigSyncGet() {
    const keys = ['config_sync'];
    return new Promise((resolve) => {
        chrome.storage.sync.get(keys, (state) => {
            var _a;
            resolve((_a = state.config_sync) !== null && _a !== void 0 ? _a : ModelConfigSyncInit);
        });
    });
}
function ModelConfigSyncSet(config) {
    const Values = {
        config_sync: config,
    };
    return new Promise((resolve) => {
        chrome.storage.sync.set(Values, () => {
            resolve();
        });
    });
}
function CommandStructureGet() {
    const keys = ['command_structure'];
    return new Promise((resolve) => {
        chrome.storage.sync.get(keys, (state) => {
            var _a;
            resolve((_a = state.command_structure) !== null && _a !== void 0 ? _a : CommandStructureInit);
        });
    });
}
function CommandStructureSet(command_structure) {
    const Values = {
        command_structure,
    };
    return new Promise((resolve) => {
        chrome.storage.sync.set(Values, () => {
            resolve();
        });
    });
}
const RepoGithubDefault = {
    account: '',
    name: '',
    visibility: false,
    issue_count: 0,
    issue_count_open: 0,
};
function ModelRepoGet() {
    const keys = ['repo'];
    return new Promise((resolve) => {
        chrome.storage.sync.get(keys, (state) => {
            var _a;
            resolve((_a = state.repo) !== null && _a !== void 0 ? _a : RepoGithubDefault);
        });
    });
}
function ModelRepoSet(repo) {
    const Values = {
        repo,
    };
    return new Promise((resolve) => {
        chrome.storage.sync.set(Values, () => {
            resolve();
        });
    });
}
function ModelIssueGet() {
    const keys = ['issue'];
    return new Promise((resolve) => {
        chrome.storage.sync.get(keys, (state) => {
            var _a;
            resolve((_a = state.issue) !== null && _a !== void 0 ? _a : {});
        });
    });
}
function ModelIssueSet(issue) {
    const Values = {
        issue,
    };
    return new Promise((resolve) => {
        chrome.storage.sync.set(Values, () => {
            resolve();
        });
    });
}
function ModelMissionGet() {
    const keys = ['mission'];
    return new Promise((resolve) => {
        chrome.storage.sync.get(keys, (state) => {
            var _a;
            resolve((_a = state.mission) !== null && _a !== void 0 ? _a : {});
        });
    });
}
const ModelIssueInit = {};
const ModelMissionInit = {};
const ModelSessionInit = {};
function ModelMissionSet(mission) {
    const Values = {
        mission,
    };
    return new Promise((resolve) => {
        chrome.storage.sync.set(Values, () => {
            resolve();
        });
    });
}
function ModelSessionSet(session) {
    const Values = {
        session,
    };
    return new Promise((resolve) => {
        chrome.storage.sync.set(Values, () => {
            resolve();
        });
    });
}
function ModelSyndicateGet() {
    const keys = ['syndicate'];
    return new Promise((resolve) => {
        chrome.storage.sync.get(keys, (state) => {
            var _a;
            resolve((_a = state.syndicate) !== null && _a !== void 0 ? _a : ModelSyndicateInit);
        });
    });
}
function ModelSyndicateSet(syndicate) {
    const Values = {
        syndicate,
    };
    return new Promise((resolve) => {
        chrome.storage.sync.set(Values, () => {
            resolve();
        });
    });
}


/***/ }

}]);
//# sourceMappingURL=Extension_Model_index_ts.js.map