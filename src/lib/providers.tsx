"use client";

import { mainnet } from "@starknet-react/chains";
import {
  type Connector,
  StarknetConfig,
  publicProvider,
} from "@starknet-react/core";
import { useEffect, useState } from "react";

const controllerOptions = {
  defaultChainId: "0x534e5f4d41494e", // SN_MAIN
  chains: [{ rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet/rpc/v0_9" }],
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [connectors, setConnectors] = useState<Connector[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadConnector = async () => {
      const { ControllerConnector } = await import("@cartridge/connector");

      if (cancelled) {
        return;
      }

      setConnectors([new ControllerConnector(controllerOptions)]);
    };

    void loadConnector();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={publicProvider()}
      connectors={connectors}
    >
      {children}
    </StarknetConfig>
  );
}
