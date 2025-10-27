import {
  Button,
  Drawer,
  Heading,
  Input,
  Label,
  Text,
  toast,
} from "@medusajs/ui";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { useAttribute } from "@hooks/api/attributes";
import { useUpdateAttributePossibleValue } from "@hooks/api/attributes";

const formSchema = z.object({
  value: z.string().min(1, "Value is required"),
});

type FormValues = z.infer<typeof formSchema>;

export const EditPossibleValue = () => {
  const { id: attributeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const possibleValueId = searchParams.get("possible_value_id");

  const { attribute, isLoading: isAttributeLoading } = useAttribute(
    attributeId!,
    {
      fields: "possible_values.*",
    },
    {
      enabled: !!attributeId,
    },
  );

  const { mutateAsync, isPending } = useUpdateAttributePossibleValue(
    attributeId!,
    possibleValueId!,
  );

  const possibleValue = attribute?.possible_values?.find(
    (pv: { id: string }) => pv.id === possibleValueId,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: possibleValue?.value || "",
    },
  });

  const handleSave = form.handleSubmit(async (data) => {
    await mutateAsync(
      { value: data.value },
      {
        onSuccess: () => {
          toast.success("Possible value updated!");
          navigate(-1);
        },
        onError: (error) => {
          toast.error("Failed to update possible value");
          console.error(error);
        },
      },
    );
  });

  const handleClose = () => {
    navigate(`/settings/attributes/${attributeId}`);
  };

  return (
    <Drawer
      open={true}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <Drawer.Content>
        {isAttributeLoading ? (
          <>
            <Drawer.Header>
              <Heading>Loading...</Heading>
            </Drawer.Header>
            <Drawer.Body>
              <Text>Fetching possible value details...</Text>
            </Drawer.Body>
          </>
        ) : !possibleValue ? (
          <>
            <Drawer.Header>
              <Heading>Possible Value Not Found</Heading>
            </Drawer.Header>
            <Drawer.Body>
              <Text>The requested possible value could not be found.</Text>
              <Button onClick={handleClose}>Close</Button>
            </Drawer.Body>
          </>
        ) : (
          <>
            <Drawer.Header>
              <Drawer.Title>Edit Possible Value</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <form id="edit-possible-value-form" onSubmit={handleSave}>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="value">Name</Label>
                    <Input
                      id="value"
                      {...form.register("value")}
                      className="mt-2"
                    />
                    {form.formState.errors.value && (
                      <Text className="mt-1 text-sm text-red-500">
                        {form.formState.errors.value.message}
                      </Text>
                    )}
                  </div>
                </div>
              </form>
            </Drawer.Body>
            <Drawer.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-possible-value-form"
                disabled={isPending}
              >
                Save
              </Button>
            </Drawer.Footer>
          </>
        )}
      </Drawer.Content>
    </Drawer>
  );
};
