import { ArcadeScreen } from "@/components/ArcadeScreen";
import { InventoryPanel } from "@/components/InventoryPanel";

export default function InventoryPage() {
  return (
    <ArcadeScreen title="Inventory / Collectibles" activeTab="inventory">
      <InventoryPanel />
    </ArcadeScreen>
  );
}
