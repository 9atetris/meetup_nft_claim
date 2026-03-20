import { ArcadeScreen } from "@/components/ArcadeScreen";
import { ClaimButton } from "@/components/ClaimButton";

export default function Home() {
  return (
    <ArcadeScreen title="STARKNET MEETUP 日本" activeTab="claim">
      <ClaimButton />
    </ArcadeScreen>
  );
}
