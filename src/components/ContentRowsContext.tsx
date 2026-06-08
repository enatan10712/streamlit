"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useMemo,
  type ReactNode,
} from "react";

export interface RowHandle {
  focusCard: (index: number) => void;
  getCardCount: () => number;
}

interface ContentRowsContextValue {
  registerRow: (id: string, handle: RowHandle) => void;
  unregisterRow: (id: string) => void;
  navigateVertical: (fromRowId: string, cardIndex: number, direction: "up" | "down") => void;
}

const ContentRowsContext = createContext<ContentRowsContextValue | null>(null);

export function ContentRowsProvider({ children }: { children: ReactNode }) {
  const rowsRef = useRef<Map<string, RowHandle>>(new Map());
  const orderRef = useRef<string[]>([]);

  const registerRow = useCallback((id: string, handle: RowHandle) => {
    rowsRef.current.set(id, handle);
    if (!orderRef.current.includes(id)) {
      orderRef.current.push(id);
    }
  }, []);

  const unregisterRow = useCallback((id: string) => {
    rowsRef.current.delete(id);
    orderRef.current = orderRef.current.filter((r) => r !== id);
  }, []);

  const navigateVertical = useCallback(
    (fromRowId: string, cardIndex: number, direction: "up" | "down") => {
      const order = orderRef.current;
      const rowIndex = order.indexOf(fromRowId);
      if (rowIndex === -1) return;

      const targetIndex = direction === "up" ? rowIndex - 1 : rowIndex + 1;
      const targetId = order[targetIndex];
      if (!targetId) return;

      const targetRow = rowsRef.current.get(targetId);
      if (!targetRow) return;

      const clampedIndex = Math.min(cardIndex, targetRow.getCardCount() - 1);
      targetRow.focusCard(Math.max(0, clampedIndex));
    },
    []
  );

  const value = useMemo(
    () => ({ registerRow, unregisterRow, navigateVertical }),
    [registerRow, unregisterRow, navigateVertical]
  );

  return (
    <ContentRowsContext.Provider value={value}>{children}</ContentRowsContext.Provider>
  );
}

export function useContentRows() {
  return useContext(ContentRowsContext);
}
