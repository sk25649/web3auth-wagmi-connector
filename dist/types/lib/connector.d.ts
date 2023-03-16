import { Address, Connector, ConnectorData } from "@wagmi/core";
import { Chain } from "@wagmi/core/chains";
import { IWeb3Auth, SafeEventEmitterProvider, WALLET_ADAPTER_TYPE } from "@web3auth/base";
import type { IWeb3AuthModal, ModalConfig } from "@web3auth/modal";
import type { OpenloginLoginParams } from "@web3auth/openlogin-adapter";
import { Signer } from "ethers";
import type { Options } from "./interfaces";
export declare const ADAPTER_STATUS: {
    readonly NOT_READY: "not_ready";
    readonly READY: "ready";
    readonly CONNECTING: "connecting";
    readonly CONNECTED: "connected";
    readonly DISCONNECTED: "disconnected";
    readonly ERRORED: "errored";
};
export declare const WALLET_ADAPTERS: {
    OPENLOGIN: string;
    WALLET_CONNECT_V1: string;
    WALLET_CONNECT_V2: string;
    TORUS_SOLANA: string;
    PHANTOM: string;
    SOLFLARE: string;
    SLOPE: string;
    TORUS_EVM: string;
    METAMASK: string;
    COINBASE: string;
};
export declare const CHAIN_NAMESPACES: {
    readonly EIP155: "eip155";
    readonly SOLANA: "solana";
    readonly OTHER: "other";
};
export declare class Web3AuthConnector extends Connector<SafeEventEmitterProvider, Options, Signer> {
    ready: boolean;
    readonly id = "web3auth";
    readonly name = "Web3Auth";
    provider: SafeEventEmitterProvider | null;
    web3AuthInstance: IWeb3Auth | IWeb3AuthModal;
    initialChainId: number;
    loginParams: OpenloginLoginParams | null;
    modalConfig: Record<WALLET_ADAPTER_TYPE, ModalConfig> | null;
    constructor({ chains, options }: {
        chains?: Chain[];
        options: Options;
    });
    connect(): Promise<Required<ConnectorData>>;
    getAccount(): Promise<Address>;
    getProvider(): Promise<SafeEventEmitterProvider>;
    getSigner(): Promise<Signer>;
    isAuthorized(): Promise<boolean>;
    getChainId(): Promise<number>;
    switchChain(chainId: number): Promise<Chain>;
    disconnect(): Promise<void>;
    protected onAccountsChanged(accounts: string[]): void;
    protected isChainUnsupported(chainId: number): boolean;
    protected onChainChanged(chainId: string | number): void;
    protected onDisconnect(): void;
}
