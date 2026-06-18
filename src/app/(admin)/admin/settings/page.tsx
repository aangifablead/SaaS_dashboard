import dbConnect from "@/lib/mongoose";
import { PlatformSetting } from "@/models/PlatformSetting";
import SettingsClient from "./SettingsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Settings | SaaS Kit",
  description: "Manage platform settings",
};

export default async function AdminSettingsPage() {
  await dbConnect();
  
  const settings = await PlatformSetting.find({});
  
  // Convert array to key-value record
  const settingsObj = settings.reduce((acc: Record<string, string>, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return <SettingsClient initialSettings={settingsObj} />;
}
