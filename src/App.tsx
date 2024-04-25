import React, { useRef, useState } from "react";
import { useImmer } from "use-immer";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Sidebar, { SidebarField } from "./sidebar";
import Canvas, { Field } from "./canvas";

interface FieldData {
  id: string;
  type: string;
  name?: string;
  parent?: any; // You can replace 'any' with a more specific type
}

interface SpacerData extends FieldData {
  title: string;
}

interface AppData {
  fields: (FieldData | SpacerData)[];
}

function getData(prop: any): any {
  return prop?.data?.current ?? {};
}

function createSpacer({ id }: { id: string }): SpacerData {
  return {
    id,
    type: "spacer",
    title: "spacer",
  };
}

const App: React.FC = () => {
  const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(
    Date.now()
  );
  const spacerInsertedRef = useRef<boolean>();
  const currentDragFieldRef = useRef<FieldData | null>(null);
  const [activeSidebarField, setActiveSidebarField] = useState<FieldData>();
  const [activeField, setActiveField] = useState<FieldData>();
  const [data, updateData] = useImmer<AppData>({
    fields: [],
  });

  const cleanUp = () => {
    setActiveSidebarField(undefined);
    setActiveField(undefined);
    currentDragFieldRef.current = null;
    spacerInsertedRef.current = false;
  };

  const handleDragStart = (e: any) => {
    const { active } = e;
    const activeData = getData(active);

    if (activeData.fromSidebar) {
      const { field } = activeData;
      const { type } = field;
      setActiveSidebarField(field);
      currentDragFieldRef.current = {
        id: active.id,
        type,
        name: `${type}${data.fields.length + 1}`,
        parent: null,
      };
      return;
    }

    const { field, index } = activeData;
    setActiveField(field);
    currentDragFieldRef.current = field;
    updateData((draft) => {
      draft.fields.splice(index, 1, createSpacer({ id: active.id }));
    });
  };

  const handleDragOver = (e: any) => {
    const { active, over } = e;
    const activeData = getData(active);

    if (activeData.fromSidebar) {
      const overData = getData(over);

      if (!spacerInsertedRef.current) {
        const spacer = createSpacer({
          id: active.id + "-spacer",
        });

        updateData((draft) => {
          if (!draft.fields.length) {
            draft.fields.push(spacer);
          } else {
            const nextIndex =
              overData.index > -1 ? overData.index : draft.fields.length;

            draft.fields.splice(nextIndex, 0, spacer);
          }
          spacerInsertedRef.current = true;
        });
      } else if (!over) {
        updateData((draft) => {
          draft.fields = draft.fields.filter((f) => f.type !== "spacer");
        });
        spacerInsertedRef.current = false;
      } else {
        updateData((draft) => {
          const spacerIndex = draft.fields.findIndex(
            (f) => f.id === active.id + "-spacer"
          );

          const nextIndex =
            overData.index > -1 ? overData.index : draft.fields.length - 1;

          if (nextIndex === spacerIndex) {
            return;
          }

          draft.fields = arrayMove(draft.fields, spacerIndex, overData.index);
        });
      }
    }
  };

  const handleDragEnd = (e: any) => {
    const { over } = e;

    if (!over) {
      cleanUp();
      updateData((draft) => {
        draft.fields = draft.fields.filter((f) => f.type !== "spacer");
      });
      return;
    }

    let nextField = currentDragFieldRef.current;

    if (nextField) {
      const overData = getData(over);

      updateData((draft) => {
        const spacerIndex = draft.fields.findIndex((f) => f.type === "spacer");
        draft.fields.splice(spacerIndex, 1, nextField as FieldData);

        draft.fields = arrayMove(
          draft.fields,
          spacerIndex,
          overData.index || 0
        );
      });
    }

    setSidebarFieldsRegenKey(Date.now());
    cleanUp();
  };

  const handleDeleteField = (id: string) => {
    updateData((draft) => {
      draft.fields = draft.fields.filter((field) => field.id !== id);
    });
  };

  const { fields } = data;
  console.log(JSON.stringify(fields));
  return (
    <div className="app">
      <div className="content">
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          autoScroll
        >          
          <Sidebar fieldsRegKey={sidebarFieldsRegenKey} />
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={fields.map((f) => f.id)}
          >
            <Canvas fields={fields} updateData={updateData} handleDeleteField={handleDeleteField} />
          </SortableContext>
          <DragOverlay>
            {activeSidebarField ? (
              <SidebarField overlay field={activeSidebarField} />
            ) : null}
            {activeField ? <Field overlay field={activeField} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default App;
