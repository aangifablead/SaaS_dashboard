import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";
import { Invite } from "@/models/Invite";
import { LoginEvent } from "@/models/LoginEvent";
import TeamClient from "./TeamClient";
import { formatDistanceToNow } from "date-fns";

export default async function TeamPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  await dbConnect();

  const currentUser = await User.findById(session.user.id).lean();
  if (!currentUser) {
    redirect("/login");
  }

  const orgId = currentUser.organizationId || currentUser._id;

  // Fetch users in the same organization
  const users = await User.find({ organizationId: orgId })
    .sort({ createdAt: -1 })
    .select("name email role plan isActive createdAt updatedAt")
    .lean();

  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = users.length - activeUsers;
  
  // Calculate new users this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newUsers = users.filter((u) => new Date(u.createdAt) >= startOfMonth).length;

  const stats = {
    totalUsers: users.length,
    activeUsers,
    inactiveUsers,
    newUsers,
  };

  // Fetch latest login event for each user
  const userIds = users.map(u => u._id);
  const loginEvents = await LoginEvent.aggregate([
    { $match: { userId: { $in: userIds } } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: "$userId", lastActive: { $first: "$createdAt" } } }
  ]);
  
  const loginEventsMap = loginEvents.reduce((acc: any, curr: any) => {
    acc[curr._id.toString()] = curr.lastActive;
    return acc;
  }, {});

  const usersData = users.map((user) => {
    const lastActiveDate = loginEventsMap[user._id.toString()] || user.updatedAt;
    return {
      id: user._id.toString(),
      name: user.name || "",
      email: user.email || "",
      role: user.role || "User",
      plan: user.plan || "Free",
      isActive: !!user.isActive,
      joined: new Date(user.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
      lastActive: lastActiveDate ? formatDistanceToNow(new Date(lastActiveDate), { addSuffix: true }) : "Unknown"
    };
  });

  // Fetch pending invites
  const invites = await Invite.find({ organizationId: orgId, accepted: false })
    .sort({ createdAt: -1 })
    .lean();

  const invitesData = invites.map((inv) => ({
    id: inv._id.toString(),
    email: inv.email,
    role: inv.role,
    status: "Pending",
    sentOn: new Date(inv.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
  }));

  return <TeamClient usersData={usersData} stats={stats} invitesData={invitesData} />;
}
