export const STARTER_PACK_ID = 7;

export const MEETUP_NFT_CONTRACT_ADDRESS =
  "0x049838d47e37f3681c14ced57742a9900c71a614f651be2d77658505debb21c5";

export const MEETUP_NFT_NAME = "Starknet Japan Meetup NFT";
export const MEETUP_NFT_DESCRIPTION =
  "Official collectible from the Starknet Japan Meetup starter pack.";
export const MEETUP_NFT_IMAGE_PATH = "/nft-badge.svg";
const UINT128 = BigInt("0x100000000000000000000000000000000");

export function parseUint256Response(result: string[]): bigint {
  const low = BigInt(result[0] ?? "0");
  const high = BigInt(result[1] ?? "0");
  return low + high * UINT128;
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
