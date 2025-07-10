import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BulkActionsBar from "./BulkActionsBar";
import { TrashIcon } from "@heroicons/react/24/outline";

describe("BulkActionsBar", () => {
  it("affiche le nombre de sélection et les actions", () => {
    render(
      <BulkActionsBar
        count={3}
        actions={[
          {
            label: "Supprimer",
            icon: <TrashIcon data-testid="delete-icon" className="w-4 h-4" />,
            onClick: vi.mock(),
            className: "text-red-600 hover:bg-red-100",
          },
        ]}
      />
    );

    expect(screen.getByText("3 sélectionnés")).toBeInTheDocument();
    expect(screen.getByText("Supprimer")).toBeInTheDocument();
    expect(screen.getByTestId("delete-icon")).toBeInTheDocument();
  });

  it("déclenche onClearSelection quand on clique sur Annuler", () => {
    const onClearSelection = vi.mock();

    render(
      <BulkActionsBar
        count={2}
        actions={[]}
        onClearSelection={onClearSelection}
      />
    );

    const annulerButton = screen.getByText("Annuler");
    fireEvent.click(annulerButton);

    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });
});
