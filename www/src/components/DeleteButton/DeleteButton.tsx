import { Button } from "@1/ui/components/Button";
import { useCallback, useContext, useEffect } from "react";
import { DeleteButtonContext } from "./DeleteButton.context";

export function useDeleteButtonProps() {
  const [{ shouldDelete }, setStatus] = useContext(DeleteButtonContext);

  const on_editing = useCallback(() => {
    setStatus((state) => ({ ...state, shouldDelete: !shouldDelete }));
  }, [shouldDelete]);

  useEffect(() => {
    if (!shouldDelete) return;

    setTimeout(() => {
      setStatus((state) => ({ ...state, shouldDelete: false }));
    }, 0);
  }, [shouldDelete]);
  return { on_editing, shouldDelete };
}

export function DeleteIconButton() {
  const { on_editing, shouldDelete } = useDeleteButtonProps();
  return (
    <Button
      className="px-2 py-2"
      onClick={on_editing}
      theme-padding={false}
      variant="light"
    >
      {shouldDelete ? "❌" : "🗑️"}
    </Button>
  );
}

export function ShouldDeleteQuestion({
  onDelete,
}: {
  onDelete: () => Promise<void> | void;
}) {
  const [{ shouldDelete }] = useContext(DeleteButtonContext);
  useEffect(() => {
    if (!shouldDelete) return;

    if (
      !window.confirm("Êtes vous sur de vouloir supprimer cette question ?")
    ) {
      return;
    }

    onDelete();
  }, [shouldDelete, onDelete]);
  return null;
}
