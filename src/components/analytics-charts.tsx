"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const trafficData = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  users: Math.floor(Math.random() * 5000) + 1000,
  sessions: Math.floor(Math.random() * 7000) + 1500,
  pageviews: Math.floor(Math.random() * 15000) + 3000,
}))

const signupsData = [
  { month: 'Jan', signups: 120 }, { month: 'Feb', signups: 150 },
  { month: 'Mar', signups: 180 }, { month: 'Apr', signups: 220 },
  { month: 'May', signups: 350 }, { month: 'Jun', signups: 420 },
  { month: 'Jul', signups: 480 }, { month: 'Aug', signups: 550 },
  { month: 'Sep', signups: 700 }, { month: 'Oct', signups: 850 },
  { month: 'Nov', signups: 950 }, { month: 'Dec', signups: 1200 },
]

const sourcesData = [
  { name: 'Organic', value: 45 },
  { name: 'Direct', value: 25 },
  { name: 'Social', value: 15 },
  { name: 'Referral', value: 10 },
  { name: 'Email', value: 5 },
]

export function TrafficOverviewChart() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trafficData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} tickCount={15} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line type="monotone" dataKey="users" name="Users" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="pageviews" name="Pageviews" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SignupsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={signupsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ fill: '#f1f5f9' }}
          />
          <Bar dataKey="signups" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TrafficSourcesChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sourcesData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 500 }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`${value}%`, 'Share']}
            cursor={{ fill: '#f1f5f9' }}
          />
          <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
