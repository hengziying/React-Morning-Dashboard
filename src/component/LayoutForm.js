export default function LayoutForm({
  columns,
  rows,
  onColChange,
  onRowChange,
}) {
  return (
    <div className="layout-options">
      <label>
        Columns:
        <input
          type="number"
          name="columns"
          min="1"
          value={columns}
          onChange={(e) =>
            onColChange(
              Number(e.target.value) > 0 && Number(e.target.value) < 5
                ? Number(e.target.value)
                : columns
            )
          }
        />
      </label>
      <label>
        Rows:
        <input
          type="number"
          name="rows"
          min="1"
          value={rows}
          onChange={(e) =>
            onRowChange(
              Number(e.target.value) > 0 && Number(e.target.value) < 5
                ? Number(e.target.value)
                : rows
            )
          }
        />
      </label>
    </div>
  );
}
