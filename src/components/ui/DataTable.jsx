import { useState, useMemo } from "react";
import EmptyState from "./EmptyState";
import "../../Style/ui.css";

export function DataTable({
  columns = [],
  data = [],
  searchPlaceholder = "Search records...",
  searchKey,
  filters = [],
  initialFilterValues = {},
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search filters or add a new record.",
  pageSize = 10
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState(initialFilterValues);
  const [currentPage, setCurrentPage] = useState(1);

  // Synchronize initialFilterValues if updated from parent
  const filterValString = JSON.stringify(initialFilterValues);
  useMemo(() => {
    if (initialFilterValues && Object.keys(initialFilterValues).length > 0) {
      setFilterValues(initialFilterValues);
    }
  }, [filterValString]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Global/key search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (searchKey && item[searchKey]) {
          if (!String(item[searchKey]).toLowerCase().includes(query)) return false;
        } else {
          const matchAny = Object.values(item).some((val) =>
            String(val || "").toLowerCase().includes(query)
          );
          if (!matchAny) return false;
        }
      }

      // Dropdown filters
      for (const filter of filters) {
        const selectedVal = filterValues[filter.key];
        if (selectedVal && selectedVal !== "ALL") {
          if (String(item[filter.key] || "").toLowerCase() !== String(selectedVal).toLowerCase()) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, searchQuery, searchKey, filterValues, filters]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="ui-table-container">
      <div className="ui-table-toolbar">
        <div className="ui-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {filters.length > 0 && (
          <div className="ui-filter-group">
            {filters.map((flt) => (
              <select
                key={flt.key}
                className="ui-select"
                value={filterValues[flt.key] || "ALL"}
                onChange={(e) => {
                  setFilterValues({ ...filterValues, [flt.key]: e.target.value });
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All {flt.label}</option>
                {flt.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      <div className="ui-table-wrapper">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            Loading records...
          </div>
        ) : paginatedData.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <table className="ui-table">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} style={{ width: col.width || "auto" }}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && filteredData.length > 0 && (
        <div className="ui-table-pagination">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
            {filteredData.length} records
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="ui-btn ui-btn-secondary ui-btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <button
              className="ui-btn ui-btn-secondary ui-btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
