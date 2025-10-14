import React, { useState, useEffect } from 'react'
import { getProgress } from '../supabaseQueries.js'

export default function Progress({ topic, darkMode, userId, refreshKey }) {
  const [progress, setProgress] = useState({ viewed: 0, total: 0 })

  useEffect(() => {
    if (!topic || !userId) return
    let active = true
    const fetchProgress = async () => {
      try {
        const data = await getProgress(userId, topic)
        if (active) setProgress(data)
      } catch {
        if (active) setProgress({ viewed: 0, total: 0 })
      }
    }
    fetchProgress()
    return () => { active = false }
  }, [topic, userId, refreshKey])

  const percent = progress.total ? Math.round((progress.viewed / progress.total) * 100) : 0
  const barColor = darkMode ? '#5AA1BD' : '#A67B5B'
  const bgColor = darkMode ? '#333' : '#eee'

  return (
    <div style={{ margin: '20px auto', width: '80%' }}>
      <div
        style={{
          height: 16,
          background: bgColor,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: barColor,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}
