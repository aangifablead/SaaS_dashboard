import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { EmailTemplate } from "@/models/EmailTemplate";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role?.toUpperCase() !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    
    const deletedTemplate = await EmailTemplate.findByIdAndDelete(params.id);
    
    if (!deletedTemplate) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EMAIL_TEMPLATE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
