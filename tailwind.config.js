/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0e1a',
        surface: '#131826',
        surface2: '#0f1422',
        line: '#1f2a3d',
        subtle: '#1e293b',
        ink: '#f1f5f9',
        mute: '#94a3b8',
        mute2: '#64748b',
        cyan: '#06b6d4',
        cyan2: '#22d3ee',
        orange: '#f97316',
        red: '#ef4444',
      },
      fontFamily: {
        display: ['Orbitron', 'ui-sans-serif', 'system-ui'],
        ui: ['Rajdhani', 'Microsoft YaHei', 'PingFang SC', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
