import type { FC } from "react";
import { useState } from "react";

import type { AdminProductCategory } from "@medusajs/types";
import { Button, FocusModal, ProgressTabs, Text, toast } from "@medusajs/ui";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";

import { SortableTree } from "@components/common/sortable-tree";

import { attributeQueryKeys } from "@hooks/api/attributes.tsx";

import { sdk } from "@lib/client";

import { CreatePossibleValues } from "@routes/attributes/attribute-edit-possible-value/components/create-possible-values.tsx";
import type { RankingItem } from "@routes/attributes/attribute-edit-possible-value/components/edit-ranking-drawer.tsx";
import type { CreateAttributeFormSchema } from "@routes/attributes/attribute-edit/schema.ts";

type CreateRankingModalProps = {
  items: RankingItem[];
  onSave?: (orderedItems: RankingItem[]) => Promise<void> | void;
  title?: string;
};

export const CreateRankingModal: FC<CreateRankingModalProps> = ({
  items,
  title,
  onSave,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localItems, setLocalItems] = useState<RankingItem[]>(items ?? []);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "type">("details");
  const [tabStatuses, setTabStatuses] = useState<{
    detailsStatus: "not-started" | "in-progress" | "completed";
    typeStatus: "not-started" | "in-progress" | "completed";
  }>({
    detailsStatus: "not-started",
    typeStatus: "not-started",
  });
  const queryClient = useQueryClient();

  const handleClose = () => {
    navigate(-1);
  };

  const handleChange = (
    _updatedItem: {
      id: string | number;
      parentId: string | number | null;
      index: number;
    },
    updatedItems: RankingItem[],
  ) => {
    // Only update local state; do not persist yet
    setLocalItems(updatedItems);
  };

  const handleSave = async (
    data: z.infer<typeof CreateAttributeFormSchema>,
  ) => {
    try {
      const { ...payload } = data;
      await sdk.client.fetch("/admin/attributes", {
        method: "POST",
        body: payload,
      });

      queryClient.invalidateQueries({ queryKey: attributeQueryKeys.lists() });

      toast.success("Attribute created!");
      navigate(-1);
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    }
  };

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger>
        <Button size="small" variant="secondary" onClick={() => setOpen(true)}>
          Create
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <ProgressTabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "details" | "type")}
          className="h-full w-full overflow-y-auto"
        >
          <FocusModal.Header className="sticky top-0 z-10 flex h-fit w-full items-center justify-between bg-ui-bg-base py-0">
            <div className="h-full w-full border-l">
              <ProgressTabs.List className="flex w-full items-center justify-start">
                <ProgressTabs.Trigger
                  value="details"
                  status={tabStatuses.detailsStatus}
                >
                  Details
                </ProgressTabs.Trigger>
                <ProgressTabs.Trigger
                  value="type"
                  status={tabStatuses.typeStatus}
                >
                  Type
                </ProgressTabs.Trigger>
              </ProgressTabs.List>
            </div>
          </FocusModal.Header>
          <FocusModal.Body>
            {activeTab === "details" ? (
              <CreatePossibleValues />
            ) : localItems && localItems.length ? (
              <SortableTree
                items={localItems}
                childrenProp="children"
                enableDrag={true}
                onChange={handleChange}
                renderValue={(item: RankingItem) => (
                  <div className="flex items-center gap-x-2">
                    <span className="text-ui-fg-subtle">
                      {String(item.value)}
                    </span>
                  </div>
                )}
              />
            ) : (
              <Text className="text-ui-fg-subtle">No items to reorder.</Text>
            )}
          </FocusModal.Body>
        </ProgressTabs>
        <FocusModal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {activeTab === "details" ? (
            <Button
              form="attribute-form"
              onClick={() => {
                setActiveTab("type");
                setTabStatuses({
                  detailsStatus: "completed",
                  typeStatus: "in-progress",
                });
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              form="attribute-form"
              onClick={() => handleSave}
              disabled={saving}
              isLoading={saving}
            >
              Save
            </Button>
          )}
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  );
};
