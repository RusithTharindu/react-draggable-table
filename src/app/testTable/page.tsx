"use client";

import React, { useState, useRef } from "react";

export type Row = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

export default function DraggableTable() {
  const initial: Row[] = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "Editor" },
    { id: "3", name: "Carol", email: "carol@example.com", role: "Viewer" },
    { id: "4", name: "Dave", email: "dave@example.com", role: "Editor" },
  ];

  const [rows, setRows] = useState<Row[]>(initial);
  const draggingIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  // Called when dragging starts
  function handleDragStart(e: React.DragEvent, index: number) {
    draggingIndex.current = index;
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  }

  // Called when dragged item enters another row
  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    dragOverIndex.current = index;
    e.dataTransfer.dropEffect = "move";
  }

  // When drop happens, reorder
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const from = draggingIndex.current;
    const to = dragOverIndex.current;

    if (from === null || to === null) return;
    if (from === to) return;

    setRows((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

    draggingIndex.current = null;
    dragOverIndex.current = null;
  }

  function handleDragEnd() {
    draggingIndex.current = null;
    dragOverIndex.current = null;
  }

  // Add new row
  function addRow() {
    const id = (rows.length + 1).toString();
    setRows([
      ...rows,
      {
        id,
        name: `New User ${id}`,
        email: `user${id}@example.com`,
        role: "Viewer",
      },
    ]);
  }

  // Print table
  function printTable() {
    const printContent = document.getElementById("table-container")?.innerHTML;
    if (printContent) {
      const win = window.open("", "", "width=800,height=600");
      if (win) {
        win.document.write(
          "<html><head><title>Table Print</title></head><body>"
        );
        win.document.write(printContent);
        win.document.write("</body></html>");
        win.document.close();
        win.print();
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 text-black">
      <h2 className="text-xl font-semibold mb-4">
        Draggable Rows Table (TypeScript + React)
      </h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={addRow}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Row
        </button>
        <button
          onClick={printTable}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Print Table
        </button>
      </div>

      <div
        id="table-container"
        className="bg-white shadow rounded overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isDragging = draggingIndex.current === i;
              return (
                <tr
                  key={r.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  className={`border-t cursor-grab select-none transition-all duration-150 ${
                    isDragging
                      ? "opacity-60 bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">{r.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Tip: After reordering, send the new <code>rows</code> order to your
          backend (e.g. with an API call) to persist the change.
        </p>
      </div>
    </div>
  );
}
