import SettingsClient from "./SettingsClient";
import { getProfileData, getApiKeys, getLoginHistory } from "@/actions/settings";

export default async function SettingsPage() {
  const profile = await getProfileData();
  const apiKeys = await getApiKeys();
  const loginHistory = await getLoginHistory();

  return <SettingsClient initialProfile={profile} initialApiKeys={apiKeys} initialLoginHistory={loginHistory} />;
}
