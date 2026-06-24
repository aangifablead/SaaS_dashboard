"use server"

import dbConnect from "@/lib/mongoose"
import { Notification } from "@/models/Notification"
import { User } from "@/models/User"
import { auth } from "@/auth"

export async function getDashboardNotifications() {
  const session = await auth()
  if (!session?.user?.email) return { notifications: [], unreadCount: 0 }

  await dbConnect()
  const user = await User.findOne({ email: session.user.email })
  if (!user) return { notifications: [], unreadCount: 0 }

  // Fetch recent 5 notifications
  const notifications = await Notification.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()

  // Fetch total unread count
  const unreadCount = await Notification.countDocuments({ userId: user._id, isRead: false })

  return {
    notifications: JSON.parse(JSON.stringify(notifications)),
    unreadCount
  }
}

export async function getPaginatedNotifications(page: number, limit: number = 10) {
  const session = await auth()
  if (!session?.user?.email) return { notifications: [], totalPages: 0 }

  await dbConnect()
  const user = await User.findOne({ email: session.user.email })
  if (!user) return { notifications: [], totalPages: 0 }

  const skip = (page - 1) * limit
  const total = await Notification.countDocuments({ userId: user._id })
  const notifications = await Notification.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return {
    notifications: JSON.parse(JSON.stringify(notifications)),
    totalPages: Math.ceil(total / limit)
  }
}

export async function markNotificationAsRead(id: string) {
  const session = await auth()
  if (!session?.user?.email) return { success: false }

  await dbConnect()
  await Notification.updateOne(
    { _id: id },
    { $set: { isRead: true } }
  )

  return { success: true }
}

export async function markAllNotificationsAsRead() {
  const session = await auth()
  if (!session?.user?.email) return { success: false }

  await dbConnect()
  const user = await User.findOne({ email: session.user.email })
  if (!user) return { success: false }

  await Notification.updateMany(
    { userId: user._id, isRead: false },
    { $set: { isRead: true } }
  )

  return { success: true }
}
