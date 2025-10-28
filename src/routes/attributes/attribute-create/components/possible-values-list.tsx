import { useEffect } from "react";

import { DotsSix, XMark } from "@medusajs/icons";
import { Alert, Button, IconButton, Input, Label } from "@medusajs/ui";

import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useFieldArray, useFormContext } from "react-hook-form";

type AttributeValueType = {
  value: string;
  rank: number;
  metadata: Record<string, unknown>;
};
// @todo fix any type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormValues = any;

interface SortableItemProps {
  id: string;
  index: number;
  onRemove: () => void;
}

const SortableItem = ({ id, index, onRemove }: SortableItemProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fieldError = errors[`possible_values.${index}.value`];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 flex items-center gap-2 rounded-xl border border-ui-border-base bg-ui-bg-component p-2"
    >
      <button
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <DotsSix className="text-ui-fg-subtle" />
      </button>
      <div className="flex-1">
        <Input
          className="flex-1"
          aria-invalid={!!fieldError}
          placeholder="Enter value"
          {...register(`possible_values.${index}.value`)}
        />
      </div>
      <IconButton variant="transparent" size="small" onClick={onRemove}>
        <XMark />
      </IconButton>
    </div>
  );
};

const PossibleValuesList = () => {
  const { control, getValues, clearErrors, watch, formState } =
    useFormContext<FormValues>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "possible_values",
  });

  // Watch needed values to control error visibility
  const uiComponent = watch("ui_component");
  const possibleValues = watch("possible_values") as
    | AttributeValueType[]
    | undefined;

  // Clear error when not Single Select anymore
  useEffect(() => {
    if (uiComponent && uiComponent !== "select") {
      clearErrors("possible_values");
    }
  }, [uiComponent, clearErrors]);

  // Clear error as soon as at least one value exists
  useEffect(() => {
    if ((possibleValues?.length || 0) > 0) {
      clearErrors("possible_values");
    }
  }, [possibleValues?.length, clearErrors]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      // Get current form values
      const currentValues = getValues(
        "possible_values",
      ) as AttributeValueType[];

      // Create new array with reordered items
      const reorderedValues = arrayMove(currentValues, oldIndex, newIndex);

      // Update all fields with their new positions and ranks
      reorderedValues.forEach((value, index) => {
        update(index, {
          value: value.value,
          rank: index,
          metadata: value.metadata || {},
        });
      });
    }
  };

  const handleAddValue = () => {
    append({
      value: "",
      rank: fields.length,
      metadata: {},
    });
    // If a value is added, clear any existing error on possible_values
    clearErrors("possible_values");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between pb-1">
        <Label>Possible Values</Label>
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={handleAddValue}
        >
          Add
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field, index) => (
            <SortableItem
              key={field.id}
              id={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {formState.errors.possible_values && (
        <Alert
          variant="error"
          className="mt-1 flex items-center gap-2 text-sm font-medium"
        >
          {/*@ts-ignore*/}
          {formState.errors.possible_values.message ||
            "Please add at least one value"}
        </Alert>
      )}
    </div>
  );
};

export default PossibleValuesList;
