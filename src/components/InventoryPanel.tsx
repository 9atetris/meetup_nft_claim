"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect, useProvider } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { CairoByteArray, Provider } from "starknet";
import {
  getControllerConnector,
  waitForControllerReady,
} from "@/lib/controllerConnector";
import {
  type CollectibleMetadata,
  MEETUP_NFT_CONTRACT_ADDRESS,
  MEETUP_NFT_DESCRIPTION,
  MEETUP_NFT_IMAGE_PATH,
  MEETUP_NFT_NAME,
  parseUint256Response,
  parseTokenUriMetadata,
  shortenAddress,
} from "@/lib/meetupNft";
import styles from "./InventoryPanel.module.css";

const CONTRACT_URL = `https://voyager.online/contract/${MEETUP_NFT_CONTRACT_ADDRESS}`;

type InventoryState =
  | { status: "idle" | "loading" }
  | {
      status: "ready";
      balance: bigint;
      tokenId: bigint | null;
      metadata: CollectibleMetadata | null;
    }
  | { status: "error"; message: string };

export function InventoryPanel() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { provider } = useProvider();
  const [inventoryState, setInventoryState] = useState<InventoryState>({
    status: "idle",
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleConnect = async () => {
    setConnectError(null);
    setConnecting(true);

    try {
      const controllerConnector = getControllerConnector(connectors);
      await waitForControllerReady(controllerConnector);
      await connectAsync({ connector: controllerConnector });
    } catch (error) {
      console.error(error);
      setConnectError("Could not connect Cartridge.");
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInventory = async () => {
      if (!address || !isConnected || !provider) {
        setInventoryState({ status: "idle" });
        return;
      }

      setInventoryState({ status: "loading" });

      try {
        const rpcProvider = new Provider(provider);
        const balanceResult = await rpcProvider.callContract({
          contractAddress: MEETUP_NFT_CONTRACT_ADDRESS,
          entrypoint: "balance_of",
          calldata: [address],
        });
        const balance = parseUint256Response(balanceResult);

        if (cancelled) {
          return;
        }

        if (balance === BigInt(0)) {
          setInventoryState({
            status: "ready",
            balance,
            tokenId: null,
            metadata: null,
          });
          return;
        }

        const tokenIdResult = await rpcProvider.callContract({
          contractAddress: MEETUP_NFT_CONTRACT_ADDRESS,
          entrypoint: "get_token_id",
          calldata: [address],
        });
        const tokenId = parseUint256Response(tokenIdResult);
        const tokenUriResult = await rpcProvider.callContract({
          contractAddress: MEETUP_NFT_CONTRACT_ADDRESS,
          entrypoint: "token_uri",
          calldata: tokenIdResult,
        });
        const tokenUri = CairoByteArray.factoryFromApiResponse(
          tokenUriResult[Symbol.iterator](),
        ).decodeUtf8();
        const metadata = parseTokenUriMetadata(tokenUri);

        if (cancelled) {
          return;
        }

        setInventoryState({
          status: "ready",
          balance,
          tokenId,
          metadata,
        });
      } catch (error) {
        console.error(error);

        if (cancelled) {
          return;
        }

        setInventoryState({
          status: "error",
          message: "Could not load collectibles right now.",
        });
      }
    };

    void loadInventory();

    return () => {
      cancelled = true;
    };
  }, [address, isConnected, provider, refreshKey]);

  if (!isConnected || !address) {
    return (
      <section className={styles.panel}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Inventory</p>
          <h2 className={styles.heading}>Collectibles</h2>
          <p className={styles.subcopy}>
            Connect Cartridge here to check whether this wallet already holds
            the meetup collectible.
          </p>
        </header>

        <div className={styles.emptyState}>
          <h3 className={styles.stateTitle}>No wallet connected</h3>
          <p className={styles.stateBody}>
            This page can read the NFT contract as soon as Cartridge is
            connected. No claim action is required just to view holdings.
          </p>
          <div className={styles.stateActions}>
            <button
              type="button"
              className={styles.actionButton}
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? "Connecting..." : "Connect Cartridge"}
            </button>
            <Link href="/" className={styles.actionLink}>
              Open Claim
            </Link>
          </div>
          {connectError && <p className={styles.inlineError}>{connectError}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Inventory</p>
        <h2 className={styles.heading}>Collectibles</h2>
        <p className={styles.subcopy}>
          Connected as {shortenAddress(address)}. This view reads the NFT
          contract on Starknet mainnet and shows any claimed meetup collectible.
        </p>
        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.topLink}
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </div>
      </header>

      {inventoryState.status === "loading" && (
        <div className={styles.loadingState}>
          <h3 className={styles.stateTitle}>Checking collectibles...</h3>
          <p className={styles.stateBody}>
            Reading your current balance from the meetup NFT contract.
          </p>
          <div className={styles.loadingBars} aria-hidden="true">
            <div className={styles.loadingBar} />
            <div className={styles.loadingBar} />
            <div className={styles.loadingBar} />
          </div>
        </div>
      )}

      {inventoryState.status === "error" && (
        <div className={styles.errorState}>
          <h3 className={styles.stateTitle}>Could not load collectibles</h3>
          <p className={styles.stateBody}>{inventoryState.message}</p>
          <div className={styles.stateActions}>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => setRefreshKey((current) => current + 1)}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {inventoryState.status === "ready" &&
        inventoryState.balance === BigInt(0) && (
        <div className={styles.emptyState}>
          <h3 className={styles.stateTitle}>No collectibles yet</h3>
          <p className={styles.stateBody}>
            This wallet does not currently hold the meetup NFT. You can still
            use this screen as a connected inventory check without claiming.
          </p>
          <div className={styles.stateActions}>
            <Link href="/" className={styles.actionLink}>
              Open Claim
            </Link>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => setRefreshKey((current) => current + 1)}
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {inventoryState.status === "ready" &&
        inventoryState.balance > BigInt(0) && (
        <article className={styles.card}>
          <div className={styles.artPanel}>
            {inventoryState.metadata?.image &&
            !inventoryState.metadata.image.startsWith("/") ? (
              <img
                src={inventoryState.metadata.image}
                alt={inventoryState.metadata?.name ?? MEETUP_NFT_NAME}
                className={styles.art}
              />
            ) : (
              <Image
                src={inventoryState.metadata?.image ?? MEETUP_NFT_IMAGE_PATH}
                alt={inventoryState.metadata?.name ?? MEETUP_NFT_NAME}
                width={220}
                height={220}
                className={styles.art}
                priority
              />
            )}
          </div>

          <div className={styles.details}>
            <span className={styles.badge}>Collected</span>

            <div>
              <h3 className={styles.name}>
                {inventoryState.metadata?.name ?? MEETUP_NFT_NAME}
              </h3>
              <p className={styles.description}>
                {inventoryState.metadata?.description ?? MEETUP_NFT_DESCRIPTION}
              </p>
            </div>

            <div className={styles.grid}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Owner</span>
                <span className={styles.metricValue}>{shortenAddress(address)}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Balance</span>
                <span className={styles.metricValue}>
                  {inventoryState.balance.toString()}
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Token ID</span>
                <span className={styles.metricValue}>
                  {inventoryState.tokenId?.toString() ?? "-"}
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Contract</span>
                <span className={styles.metricValue}>
                  {shortenAddress(MEETUP_NFT_CONTRACT_ADDRESS)}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => setRefreshKey((current) => current + 1)}
              >
                Refresh
              </button>
              <a
                href={CONTRACT_URL}
                target="_blank"
                rel="noreferrer"
                className={`${styles.actionLink} ${styles.actionGhost}`}
              >
                View on Voyager
              </a>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
