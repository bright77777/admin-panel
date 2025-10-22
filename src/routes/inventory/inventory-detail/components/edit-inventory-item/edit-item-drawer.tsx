import { Heading } from "@medusajs/ui";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { RouteDrawer } from "@components/modals";

import { useInventoryItem } from "@hooks/api";

import { EditInventoryItemForm } from "@routes/inventory/inventory-detail/components/edit-inventory-item/components/edit-item-form.tsx";

export const InventoryItemEdit = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    inventory_item: inventoryItem,
    isPending: isLoading,
    isError,
    error,
  } = useInventoryItem(id!);

  const ready = !isLoading && inventoryItem;

  if (isError) {
    throw error;
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("inventory.editItemDetails")}</Heading>
      </RouteDrawer.Header>
      {/*// @ts-expect-error @todo: fix this*/}
      {ready && <EditInventoryItemForm item={inventoryItem} />}
    </RouteDrawer>
  );
};
