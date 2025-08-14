export default function LayoutEmpty({ children }: any) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "998px",
        margin: "auto",
        padding: "24px",
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Trial</h2>
      <div style={{ padding: "200px 0 24px 0" }}>
        <button type="button" className="trialpagefortesting">
          Got it
        </button>
      </div>
      {children}
      <div style={{ width: "100%", height: "2000px" }}></div>
      <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Trial End</h2>
    </div>
  );
}
