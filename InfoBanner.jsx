export default function InfoBanner() {
  return (
    <div
      className="row gap-8"
      style={{
        background: 'var(--sky-pale)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        marginTop: 8,
      }}
    >
      <span style={{ fontSize: 18 }}>ⓘ</span>
      <p className="card-sub" style={{ margin: 0 }}>
        There is no completely safe UV tan. SunQuest is designed to help you understand UV exposure
        and reduce risk, not guarantee safe tanning.
      </p>
    </div>
  )
}
