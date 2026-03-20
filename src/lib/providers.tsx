"use client";

import { ControllerConnector } from "@cartridge/connector";
import { StarknetConfig, publicProvider } from "@starknet-react/core";
import { mainnet } from "@starknet-react/chains";

const connector = new ControllerConnector({
  defaultChainId: "0x534e5f4d41494e", // SN_MAIN
  chains: [{ rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" }],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={publicProvider()}
      connectors={[connector]}
    >
      {children}
    </StarknetConfig>
  );
}