/**
 * Scrollable table wrapper with sticky column headers.
 *
 * @param {object} props
 * @param {string} [props.minWidth] - Tailwind min-width class for the table
 * @param {import('react').ReactNode} props.children - thead + tbody
 */
export default function DataTable({ minWidth = 'min-w-full', children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="max-h-[min(70vh,900px)] overflow-auto">
        <table className={`${minWidth} w-full text-left text-sm`}>{children}</table>
      </div>
    </div>
  )
}

export const dataTableHeadClass =
  'sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-[0_1px_0_0_rgb(226_232_240)]'
