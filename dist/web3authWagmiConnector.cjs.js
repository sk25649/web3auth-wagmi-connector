/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 285:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "MP": () => (/* binding */ ADAPTER_STATUS),
  "EN": () => (/* binding */ CHAIN_NAMESPACES),
  "$z": () => (/* binding */ EVM_ADAPTERS),
  "kC": () => (/* binding */ MULTI_CHAIN_ADAPTERS),
  "hf": () => (/* binding */ SOLANA_ADAPTERS),
  "rW": () => (/* binding */ WALLET_ADAPTERS),
  "aG": () => (/* binding */ Web3AuthConnector)
});

;// CONCATENATED MODULE: external "@babel/runtime/helpers/defineProperty"
const defineProperty_namespaceObject = require("@babel/runtime/helpers/defineProperty");
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty_namespaceObject);
;// CONCATENATED MODULE: external "@wagmi/core"
const core_namespaceObject = require("@wagmi/core");
;// CONCATENATED MODULE: external "ethers"
const external_ethers_namespaceObject = require("ethers");
;// CONCATENATED MODULE: external "loglevel"
const external_loglevel_namespaceObject = require("loglevel");
var external_loglevel_default = /*#__PURE__*/__webpack_require__.n(external_loglevel_namespaceObject);
;// CONCATENATED MODULE: ./src/lib/connector.ts

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { defineProperty_default()(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }



const IS_SERVER = typeof window === "undefined";
function isIWeb3AuthModal(obj) {
  return typeof obj.initModal !== "undefined";
}
const ADAPTER_STATUS = {
  NOT_READY: "not_ready",
  READY: "ready",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
  ERRORED: "errored"
};
const MULTI_CHAIN_ADAPTERS = {
  OPENLOGIN: "openlogin",
  WALLET_CONNECT_V1: "wallet-connect-v1",
  WALLET_CONNECT_V2: "wallet-connect-v2"
};
const SOLANA_ADAPTERS = _objectSpread({
  TORUS_SOLANA: "torus-solana",
  PHANTOM: "phantom",
  SOLFLARE: "solflare",
  SLOPE: "slope"
}, MULTI_CHAIN_ADAPTERS);
const EVM_ADAPTERS = _objectSpread({
  TORUS_EVM: "torus-evm",
  METAMASK: "metamask",
  COINBASE: "coinbase"
}, MULTI_CHAIN_ADAPTERS);
const WALLET_ADAPTERS = _objectSpread(_objectSpread({}, EVM_ADAPTERS), SOLANA_ADAPTERS);
const CHAIN_NAMESPACES = {
  EIP155: "eip155",
  SOLANA: "solana",
  OTHER: "other"
};
class Web3AuthConnector extends core_namespaceObject.Connector {
  constructor(_ref) {
    let {
      chains,
      options
    } = _ref;
    super({
      chains,
      options
    });
    defineProperty_default()(this, "ready", !IS_SERVER);
    defineProperty_default()(this, "id", "web3auth");
    defineProperty_default()(this, "name", "Web3Auth");
    defineProperty_default()(this, "provider", null);
    defineProperty_default()(this, "web3AuthInstance", void 0);
    defineProperty_default()(this, "initialChainId", void 0);
    defineProperty_default()(this, "loginParams", void 0);
    defineProperty_default()(this, "modalConfig", void 0);
    this.web3AuthInstance = options.web3AuthInstance;
    this.loginParams = options.loginParams || null;
    this.modalConfig = options.modalConfig || null;
    this.initialChainId = chains[0].id;
  }
  async connect() {
    try {
      this.emit("message", {
        type: "connecting"
      });
      if (this.web3AuthInstance.status === "not_ready") {
        if (isIWeb3AuthModal(this.web3AuthInstance)) {
          await this.web3AuthInstance.initModal({
            modalConfig: this.modalConfig
          });
        } else if (this.loginParams) {
          await this.web3AuthInstance.init();
        } else {
          external_loglevel_default().error("please provide a valid loginParams when not using @web3auth/modal");
          throw new core_namespaceObject.UserRejectedRequestError("please provide a valid loginParams when not using @web3auth/modal");
        }
      }
      let {
        provider
      } = this.web3AuthInstance;
      if (!provider) {
        if (isIWeb3AuthModal(this.web3AuthInstance)) {
          provider = await this.web3AuthInstance.connect();
        } else if (this.loginParams) {
          provider = await this.web3AuthInstance.connectTo(WALLET_ADAPTERS.OPENLOGIN, this.loginParams);
        } else {
          external_loglevel_default().error("please provide a valid loginParams when not using @web3auth/modal");
          throw new core_namespaceObject.UserRejectedRequestError("please provide a valid loginParams when not using @web3auth/modal");
        }
      }
      const signer = await this.getSigner();
      const account = await signer.getAddress();
      provider.on("accountsChanged", this.onAccountsChanged.bind(this));
      provider.on("chainChanged", this.onChainChanged.bind(this));
      const chainId = await this.getChainId();
      const unsupported = this.isChainUnsupported(chainId);
      return {
        account,
        chain: {
          id: chainId,
          unsupported
        },
        provider
      };
    } catch (error) {
      external_loglevel_default().error("error while connecting", error);
      throw new core_namespaceObject.UserRejectedRequestError("Something went wrong");
    }
  }
  async getAccount() {
    const provider = new external_ethers_namespaceObject.providers.Web3Provider(await this.getProvider());
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    return account;
  }
  async getProvider() {
    if (this.provider) {
      return this.provider;
    }
    this.provider = this.web3AuthInstance.provider;
    return this.provider;
  }
  async getSigner() {
    const provider = new external_ethers_namespaceObject.providers.Web3Provider(await this.getProvider());
    const signer = provider.getSigner();
    return signer;
  }
  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!(account && this.provider);
    } catch {
      return false;
    }
  }
  async getChainId() {
    try {
      if (this.provider) {
        const chainId = await this.provider.request({
          method: "eth_chainId"
        });
        if (chainId) {
          return (0,core_namespaceObject.normalizeChainId)(chainId);
        }
      }
      if (this.initialChainId) {
        return this.initialChainId;
      }
      throw new Error("Chain ID is not defined");
    } catch (error) {
      external_loglevel_default().error("error", error);
      throw error;
    }
  }
  async switchChain(chainId) {
    try {
      var _chain$blockExplorers, _chain$blockExplorers2, _chain$nativeCurrency, _chain$nativeCurrency2;
      const chain = this.chains.find(x => x.id === chainId);
      if (!chain) throw new Error(`Unsupported chainId: ${chainId}`);
      const provider = await this.getProvider();
      if (!provider) throw new Error("Please login first");
      await this.web3AuthInstance.addChain({
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: `0x${chain.id.toString(16)}`,
        rpcTarget: chain.rpcUrls.default.http[0],
        displayName: chain.name,
        blockExplorer: (_chain$blockExplorers = chain.blockExplorers) === null || _chain$blockExplorers === void 0 ? void 0 : (_chain$blockExplorers2 = _chain$blockExplorers.default) === null || _chain$blockExplorers2 === void 0 ? void 0 : _chain$blockExplorers2.url,
        ticker: ((_chain$nativeCurrency = chain.nativeCurrency) === null || _chain$nativeCurrency === void 0 ? void 0 : _chain$nativeCurrency.symbol) || "ETH",
        tickerName: ((_chain$nativeCurrency2 = chain.nativeCurrency) === null || _chain$nativeCurrency2 === void 0 ? void 0 : _chain$nativeCurrency2.name) || "Ethereum",
        decimals: chain.nativeCurrency.decimals || 18
      });
      await this.web3AuthInstance.switchChain({
        chainId: `0x${chain.id.toString(16)}`
      });
      return chain;
    } catch (error) {
      external_loglevel_default().error("Error: Cannot change chain", error);
      throw error;
    }
  }
  async disconnect() {
    await this.web3AuthInstance.logout();
    this.provider = null;
  }
  onAccountsChanged(accounts) {
    if (accounts.length === 0) this.emit("disconnect");else this.emit("change", {
      account: external_ethers_namespaceObject.utils.getAddress(accounts[0])
    });
  }
  isChainUnsupported(chainId) {
    return !this.chains.some(x => x.id === chainId);
  }
  onChainChanged(chainId) {
    const id = (0,core_namespaceObject.normalizeChainId)(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", {
      chain: {
        id,
        unsupported
      }
    });
  }
  onDisconnect() {
    this.emit("disconnect");
  }
}

/***/ }),

/***/ 470:
/***/ (() => {



/***/ })

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
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ADAPTER_STATUS": () => (/* reexport safe */ _lib_connector__WEBPACK_IMPORTED_MODULE_0__.MP),
/* harmony export */   "CHAIN_NAMESPACES": () => (/* reexport safe */ _lib_connector__WEBPACK_IMPORTED_MODULE_0__.EN),
/* harmony export */   "EVM_ADAPTERS": () => (/* reexport safe */ _lib_connector__WEBPACK_IMPORTED_MODULE_0__.$z),
/* harmony export */   "MULTI_CHAIN_ADAPTERS": () => (/* reexport safe */ _lib_connector__WEBPACK_IMPORTED_MODULE_0__.kC),
/* harmony export */   "SOLANA_ADAPTERS": () => (/* reexport safe */ _lib_connector__WEBPACK_IMPORTED_MODULE_0__.hf),
/* harmony export */   "WALLET_ADAPTERS": () => (/* reexport safe */ _lib_connector__WEBPACK_IMPORTED_MODULE_0__.rW),
/* harmony export */   "Web3AuthConnector": () => (/* reexport safe */ _lib_connector__WEBPACK_IMPORTED_MODULE_0__.aG)
/* harmony export */ });
/* harmony import */ var _lib_connector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(285);
/* harmony import */ var _lib_interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(470);
/* harmony import */ var _lib_interfaces__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib_interfaces__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _lib_interfaces__WEBPACK_IMPORTED_MODULE_1__) if(["default","ADAPTER_STATUS","CHAIN_NAMESPACES","EVM_ADAPTERS","MULTI_CHAIN_ADAPTERS","SOLANA_ADAPTERS","WALLET_ADAPTERS","Web3AuthConnector"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _lib_interfaces__WEBPACK_IMPORTED_MODULE_1__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=web3authWagmiConnector.cjs.js.map