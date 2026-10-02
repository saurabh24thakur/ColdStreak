"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CheckCircle2, MoreHorizontal, MessageSquare, Plus, Edit2, Users } from "lucide-react"

type Entry = {
  id: string
  date: string
  metrics: Record<string, boolean | number>
  raw_description: string
  checkpoints: string[]
  status?: string
}

type Stats = {
  currentStreak: number
  longestStreak: number
  daysCompleted: number
  totalDays: number
  completionPercentage: number
}

export function ClientDashboard({ user, entries, stats }: { user: any, entries: Entry[], stats: Stats }) {
  // Process data for Recharts
  const chartData = [...entries].reverse().map(entry => {
    let completedCount = 0
    if (entry.metrics) {
      Object.values(entry.metrics).forEach(val => {
        if (val === true || (typeof val === 'number' && val > 0)) completedCount++
      })
    }
    return {
      name: new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short' }),
      completed: completedCount
    }
  }).slice(-7) // Last 7 days

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full">
      {/* Left Column (Main Stats) */}
      <div className="flex-1 space-y-6">
        
        {/* Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Streak */}
          <div className="bg-purple-600 dark:bg-purple-700 rounded-3xl p-6 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <div className="text-sm font-medium opacity-90">Current Streak</div>
              <div className="text-4xl font-bold">{stats.currentStreak} <span className="text-xl font-normal opacity-70">Days</span></div>
            </div>
            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/20" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-white" strokeDasharray="263.89" strokeDashoffset={263.89 - (263.89 * Math.min(100, (stats.currentStreak / 30) * 100)) / 100} strokeLinecap="round" />
              </svg>
              <span className="text-xs font-bold">🔥</span>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="bg-purple-600 dark:bg-purple-700 rounded-3xl p-6 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <div className="text-sm font-medium opacity-90">Longest Streak</div>
              <div className="text-4xl font-bold">{stats.longestStreak} <span className="text-xl font-normal opacity-70">Days</span></div>
            </div>
            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/20" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-white" strokeDasharray="263.89" strokeDashoffset={263.89 - (263.89 * Math.min(100, (stats.longestStreak / 90) * 100)) / 100} strokeLinecap="round" />
              </svg>
              <span className="text-xs font-bold">🏆</span>
            </div>
          </div>
        </div>

        {/* Chart & Arc Progress Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1f1f2b] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Habit Consistency</h3>
              <select className="bg-gray-100 dark:bg-[#16161f] text-xs font-medium px-3 py-1.5 rounded-full border-none outline-none text-gray-600 dark:text-gray-400">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-[200px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="completed" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" activeDot={{ r: 6, fill: '#9333ea', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">Not enough data to display chart.</div>
              )}
            </div>
          </div>

          {/* Arc Progress */}
          <div className="bg-white dark:bg-[#1f1f2b] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center relative">
            <MoreHorizontal className="absolute top-6 right-6 h-5 w-5 text-gray-400 cursor-pointer" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-8 self-start w-full">Arc Progress</h3>
            
            <div className="relative flex items-center justify-center w-32 h-32">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-100 dark:text-[#16161f]" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#9333ea" strokeWidth="12" strokeDasharray="263.89" strokeDashoffset={263.89 - (263.89 * Math.max(0, Math.min(100, stats.completionPercentage))) / 100} strokeLinecap="round" />
              </svg>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 relative z-10">{stats.completionPercentage}%</div>
            </div>
            
            <div className="flex w-full justify-between mt-8 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                <span className="text-gray-500">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                <span className="text-gray-500">Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Check-ins Table */}
        <div className="bg-white dark:bg-[#1f1f2b] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Recent Check-ins</h3>
            <button className="text-xs font-medium text-purple-600 hover:text-purple-700">View all</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-medium text-gray-400 border-b border-gray-100 dark:border-white/5">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Metrics Logged</th>
                  <th className="pb-3 font-medium">AI Summary</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {entries.slice(0, 4).map(entry => (
                  <tr key={entry.id} className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 font-medium text-gray-800 dark:text-gray-200">
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">
                      {entry.metrics ? Object.keys(entry.metrics).filter(k => entry.metrics[k]).length : 0} Habits
                    </td>
                    <td className="py-4 text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                      {entry.checkpoints && entry.checkpoints[0] ? entry.checkpoints[0] : "Logged"}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Completed</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button className="p-1 text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"><MoreHorizontal className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No recent check-ins found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Right Column (Sidebar Profile) */}
      <div className="w-full xl:w-[320px] bg-white dark:bg-[#1f1f2b] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center">
        
        {/* Profile Info */}
        <div className="flex flex-col items-center mt-4 w-full">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 p-1 relative mb-4">
            <div className="w-full h-full rounded-full border-[3px] border-white dark:border-[#1f1f2b] overflow-hidden bg-gray-200">
              {/* Dummy Avatar */}
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white dark:border-[#1f1f2b] rounded-full" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{user?.name || "User"}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Discipline Builder</p>
          
          <div className="flex gap-3 mt-6 w-full justify-center">
            <a href="/dashboard/rooms" className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition-colors" title="Rooms">
              <Users className="h-4 w-4" />
            </a>
            <a href="/dashboard/check-in" className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors" title="Check In">
              <CheckCircle2 className="h-4 w-4" />
            </a>
            <a href="/onboarding" className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition-colors" title="Edit Goals">
              <Edit2 className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="w-full border-t border-gray-100 dark:border-white/5 my-8" />

        {/* About Section */}
        <div className="w-full">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">About Arc</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Consistently logging daily metrics to build lasting discipline and achieve peak performance over a period of {stats.totalDays} days.
          </p>
        </div>

        <div className="w-full border-t border-gray-100 dark:border-white/5 my-8" />

        {/* Quick Log Action */}
        <div className="w-full">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Quick Check-in</h3>
          <div className="flex items-center justify-between w-full p-2 bg-gray-50 dark:bg-[#16161f] rounded-2xl">
            <div className="flex items-center gap-2 pl-2">
              <div className="w-2 h-2 rounded-full bg-pink-500" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Today</span>
            </div>
            <a href="/dashboard/check-in" className="px-4 py-2 bg-white dark:bg-[#1f1f2b] shadow-sm rounded-xl text-xs font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-50 transition-colors">
              Log Now
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
