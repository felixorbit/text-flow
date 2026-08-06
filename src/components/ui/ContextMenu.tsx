import { Trash2 } from 'lucide-react'
import type { RefObject } from 'react'

interface ContextMenuProps {
  menuRef: RefObject<HTMLDivElement | null>
  position: {
    x: number
    y: number
  }
  onDelete: () => void
}

export const ContextMenu = ({ menuRef, position, onDelete }: ContextMenuProps) => (
  <div
    ref={menuRef}
    role="menu"
    aria-label="Element actions"
    className="absolute z-50 w-44 rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg"
    style={{ left: position.x, top: position.y }}
  >
    <button
      type="button"
      role="menuitem"
      onClick={onDelete}
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10 focus-visible:bg-destructive/10 focus-visible:outline-none"
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </button>
  </div>
)
