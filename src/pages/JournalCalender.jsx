import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { subDays, format } from 'date-fns'

export default function JournalCalendar({ entries }) {
  const today = new Date()

  // Map entries to heatmap values
  const values = entries.map((entry) => ({
    date: entry.date,
    count: 1,
  }))

  // Sort entries by date descending for streak check
  const sortedDates = entries
    .map((e) => e.date)
    .sort((a, b) => b.localeCompare(a))

  // Calculate streak (consecutive days with entries)
  let streak = 0
  let currentDate = format(today, 'yyyy-MM-dd')

  for (let i = 0; i < sortedDates.length; i++) {
    if (sortedDates[i] === currentDate) {
      streak++
      currentDate = format(subDays(new Date(currentDate), 1), 'yyyy-MM-dd')
    } else {
      break
    }
  }

  return (
    <div className="max-w-xl mx-auto my-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-purple-700 mb-2">📅 Your Journal Activity</h2>
      <p className="text-sm text-gray-600 mb-4">🔥 Current Streak: <span className="font-bold text-purple-600">{streak} day{streak !== 1 ? 's' : ''}</span></p>

      <CalendarHeatmap
        startDate={subDays(today, 180)}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value) return 'color-empty'
          return 'color-filled'
        }}
        showWeekdayLabels
      />

      <style>
        {`
          .color-empty {
            fill: #eee;
          }
          .color-filled {
            fill: #a855f7; /* purple-500 */
          }
        `}
      </style>
    </div>
  )
}
