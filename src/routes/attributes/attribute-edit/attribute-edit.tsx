import { useEffect, useState } from "react";

import type { AdminProductCategory } from "@medusajs/types";
import { Button, Drawer, FocusModal, toast } from "@medusajs/ui";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";

import {
  attributeQueryKeys,
  useAttribute,
  useUpdateAttribute,
} from "@hooks/api/attributes.tsx";

import { sdk } from "@lib/client";

import type { UpdateAttributeFormSchema } from "@routes/attributes/attribute-edit/components/attribute-form.tsx";
import { AttributeForm } from "@routes/attributes/attribute-edit/components/attribute-form.tsx";

export const AttributeEdit = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { id } = useParams();
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const queryClient = useQueryClient();

  const { attribute, isLoading } = useAttribute(
    id ?? "",
    {
      fields:
        "name,description,handle,ui_component,product_categories.name,possible_values.*,is_filterable,is_required",
    },
    { enabled: !!id },
  );

  const { mutateAsync } = useUpdateAttribute(id!);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sdk.client.fetch<{
          product_categories: AdminProductCategory[];
        }>("/admin/product-categories", {
          method: "GET",
        });
        setCategories(response.product_categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSave = async (
    data: z.infer<typeof UpdateAttributeFormSchema>,
  ) => {
    try {
      const { ...payload } = data;
      await mutateAsync(payload);

      queryClient.invalidateQueries({ queryKey: attributeQueryKeys.lists() });

      toast.success("Attribute updated!");
      navigate(-1);
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  if (isLoading) {
    return null;
  }

  if (!attribute) {
    return null;
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <Drawer.Content>
        <Drawer.Header>Edit Attribute</Drawer.Header>
        <Drawer.Body className="flex flex-col items-center">
          <div>
            <AttributeForm
              initialData={attribute}
              mode="update"
              onSubmit={handleSave}
              categories={categories}
            />
          </div>
        </Drawer.Body>
        <FocusModal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="attribute-form">
            Save
          </Button>
        </FocusModal.Footer>
      </Drawer.Content>
    </Drawer>
  );
};
