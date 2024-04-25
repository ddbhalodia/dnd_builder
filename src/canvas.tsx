import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { renderers } from "./fields";
import { DELETE_IC } from "./Assets";


function getRenderer(type: string) {
    if (type === "spacer") {
        return () => {
            return <div className="spacer">spacer</div>;
        };
    }
    //@ts-ignore
    return renderers[type] || (() => <div>No renderer found for {type}</div>);
}

export function Field(props: any) {
    const { field, overlay, handleDeleteField, ...rest } = props;
    const { type } = field;

    const Component = getRenderer(type);

    let className = "canvas-field";
    if (overlay) {
        className += " overlay";
    }

    return (
        <div className={className}>
            <div className="relative w-full">
                <Component {...rest} />
                {/* Add the onClick handler to the DELETE_IC icon */}
            </div>
        </div>
    );
}


function SortableField(props: any) {
    const { id, index, field } = props;

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id,
            data: {
                index,
                id,
                field,
            },
        });
        
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };
        
        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Field field={field} />
        </div>
    );
}

export default function Canvas(props: any) {
    const { fields, updateData } = props;

    const { listeners, setNodeRef, transform, transition }: any = useDroppable({
        id: "canvas_droppable",
        data: {
            parent: null,
            isContainer: true,
        },
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    const handleDeleteField = (id: string) => {
        console.log("=========", id)
        updateData((draft: any) => {
            draft.fields = draft.fields.filter((field: any) => field.id !== id);
        });
    };
    
    return (
        <div ref={setNodeRef} className="m-auto h-screen w-1/3 bg-slate-400 border border-black " style={style} {...listeners}>
            <div className="">
                {fields?.map((f: any, i: any) => (
                    <div key={i} className="relative w-full">
                        <SortableField key={f.id} id={f.id} field={f} index={i} />
                        <img
                            onClick={() => handleDeleteField(f.id)}
                            className="absolute cursor-pointer z-20 -right-36 top-0"
                            src={DELETE_IC}
                            alt=""
                            style={{ zIndex: 100 }} // Ensure the icon is on top of other elements
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}