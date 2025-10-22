import { useParams } from "react-router-dom";

import { MetadataForm } from "@components/forms/metadata-form";
import { RouteDrawer } from "@components/modals";

import { useInventoryItem, useUpdateInventoryItem } from "@hooks/api";

export const InventoryItemMetadata = () => {
  const { id } = useParams();

  const { inventory_item, isPending, isError, error } = useInventoryItem(id);
  const { mutateAsync, isPending: isMutating } = useUpdateInventoryItem(id);

  if (isError) {
    throw error;
  }

  return (
    <RouteDrawer>
      <MetadataForm
        isPending={isPending}
        isMutating={isMutating}
        hook={mutateAsync}
        metadata={inventory_item?.metadata}
      />
    </RouteDrawer>
  );
};
