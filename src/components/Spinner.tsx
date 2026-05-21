export default function Spinner({ size = 22, color = 'var(--green)' }: { size?: number; color?: string }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2.5px solid ${color}30`,
      borderTop: `2.5px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  )
}
