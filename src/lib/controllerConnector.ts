import type { Connector } from "@starknet-react/core";

const CONTROLLER_READY_TIMEOUT_MS = 10_000;
const CONTROLLER_READY_POLL_MS = 100;

export type StarterPackConnector = Connector & {
  id: string;
  controller: {
    openStarterPack: (
      id: string | number,
      options?: { onPurchaseComplete?: () => void },
    ) => Promise<void>;
  };
  isReady: () => boolean;
};

export function getControllerConnector(connectors: { id: string }[]) {
  const controllerConnector = connectors.find(
    (connector) => connector.id === "controller",
  );

  if (!controllerConnector) {
    throw new Error("Controller connector is not available yet.");
  }

  return controllerConnector as StarterPackConnector;
}

export async function waitForControllerReady(
  controllerConnector: StarterPackConnector,
) {
  const deadline = Date.now() + CONTROLLER_READY_TIMEOUT_MS;

  while (!controllerConnector.isReady()) {
    if (Date.now() > deadline) {
      throw new Error("Controller did not become ready in time.");
    }

    await new Promise((resolve) =>
      setTimeout(resolve, CONTROLLER_READY_POLL_MS),
    );
  }
}
