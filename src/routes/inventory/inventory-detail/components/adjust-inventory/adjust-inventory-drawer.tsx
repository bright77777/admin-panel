import type { InventoryTypes } from "@medusajs/types";
import { Heading } from "@medusajs/ui";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { RouteDrawer } from "@components/modals";

import { useInventoryItem } from "@hooks/api";
import { useStockLocation } from "@hooks/api";

import { AdjustInventoryForm } from "@routes/inventory/inventory-detail/components/adjust-inventory/components/adjust-inventory-form.tsx";

export const AdjustInventoryDrawer = () => {
  const { id, location_id } = useParams();
  const { t } = useTranslation();

  const {
    inventory_item: inventoryItem,
    isPending: isLoading,
    isError,
    error,
  } = useInventoryItem(id!);

  const inventoryLevel = inventoryItem?.location_levels!.find(
    // @ts-expect-error @todo: fix this
    (level: InventoryTypes.InventoryLevelDTO) =>
      level.location_id === location_id,
  );

  const { stock_location, isLoading: isLoadingLocation } = useStockLocation(
    location_id!,
  );

  const ready =
    !isLoading &&
    inventoryItem &&
    inventoryLevel &&
    !isLoadingLocation &&
    stock_location;

  if (isError) {
    throw error;
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("inventory.manageLocationQuantity")}</Heading>
      </RouteDrawer.Header>
      {ready && (
        <AdjustInventoryForm
          item={inventoryItem}
          // @ts-expect-error @todo: fix this
          level={inventoryLevel}
          // @ts-expect-error @todo: fix this
          location={stock_location}
        />
      )}
    </RouteDrawer>
  );
};
