import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { Invite } from "@/models/Invite";
import { User } from "@/models/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  await dbConnect();
  
  const { token } = await params;
  
  // Find the invite
  const invite = await Invite.findOne({ token }).populate("senderId", "name email");
  
  if (!invite) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-sm border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Invalid Invitation</CardTitle>
            <CardDescription className="text-base mt-2">
              This invitation link is invalid or doesn't exist. Please check the link and try again, or request a new invitation.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-8">
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Check if expired
  if (new Date() > new Date(invite.expiresAt)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-sm border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-4">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Invitation Expired</CardTitle>
            <CardDescription className="text-base mt-2">
              This invitation has expired. Invitations are only valid for 7 days. Please ask the sender for a new invitation.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-8">
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Check if already accepted
  if (invite.accepted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-sm border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Already Accepted</CardTitle>
            <CardDescription className="text-base mt-2">
              This invitation has already been accepted.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-8">
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Get current session
  const session = await auth();
  
  // Accept invite Server Action
  async function acceptInvite() {
    "use server";
    
    const currentSession = await auth();
    if (!currentSession || !currentSession.user) {
      redirect("/login");
    }

    await dbConnect();
    
    // Find invite again to be safe
    const currentInvite = await Invite.findOne({ token });
    if (!currentInvite || currentInvite.accepted || new Date() > new Date(currentInvite.expiresAt)) {
      throw new Error("Invalid or expired invite");
    }

    // Verify email matches
    if (currentSession.user.email !== currentInvite.email) {
      throw new Error("Email mismatch");
    }

    // Update user's organization and role
    await User.findByIdAndUpdate(currentSession.user.id, {
      organizationId: currentInvite.organizationId,
      role: currentInvite.role || "User",
    });

    // Mark invite as accepted
    currentInvite.accepted = true;
    await currentInvite.save();

    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  const senderName = invite.senderId?.name || "Someone";

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-sm border-gray-200">
        <CardHeader className="text-center pt-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <span className="text-2xl font-bold text-primary">{senderName.charAt(0).toUpperCase()}</span>
          </div>
          <CardTitle className="text-2xl font-bold">You've been invited!</CardTitle>
          <CardDescription className="text-base mt-2">
            <strong>{senderName}</strong> has invited you to join their workspace as a <strong>{invite.role || 'Member'}</strong>.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4 pb-6">
          {!session ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-500">
                You need to log in with <strong>{invite.email}</strong> to accept this invitation.
              </p>
              <Link href={`/login?callbackUrl=/invite/${token}`}>
                <Button className="w-full">Log In to Accept</Button>
              </Link>
              <div className="mt-4 text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href={`/register?email=${encodeURIComponent(invite.email)}`} className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          ) : session.user?.email !== invite.email ? (
            <div className="text-center space-y-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
                You are logged in as <strong>{session.user?.email}</strong>, but this invite is for <strong>{invite.email}</strong>.
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Please log out and log in with the correct email address.
              </p>
              <Link href="/api/auth/signout?callbackUrl=/login" className="block w-full">
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                  Log Out
                </Button>
              </Link>
            </div>
          ) : (
            <form action={acceptInvite} className="w-full text-center">
              <Button type="submit" className="w-full h-11 text-base font-semibold">
                Accept Invitation
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
