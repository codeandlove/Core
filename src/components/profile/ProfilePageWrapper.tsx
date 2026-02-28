/**
 * ProfilePageWrapper
 * Single island - AppLayout provides AuthProvider, ProfileContent guards inside it
 */
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { AvatarMenu } from "@/components/layout/AvatarMenu";
import { ProfileNav } from "./ProfileNav";
import { useAuth } from "@/contexts/AuthContext";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { SubscriptionSection } from "./sections/SubscriptionSection";
import { PaymentHistorySection } from "./sections/PaymentHistorySection";
import { ConsentsSection } from "./sections/ConsentsSection";
import { DeleteAccountSection } from "./sections/DeleteAccountSection";
import type { ProfileSection } from "@/types/profile.types";

interface ProfilePageWrapperProps {
  currentPath: string;
  section: ProfileSection;
}

function SectionContent({ section }: { section: ProfileSection }) {
  switch (section) {
    case "info":
      return <BasicInfoSection />;
    case "subscription":
      return <SubscriptionSection />;
    case "payments":
      return <PaymentHistorySection />;
    case "consents":
      return <ConsentsSection />;
    case "delete-account":
      return <DeleteAccountSection />;
  }
}

/**
 * Auth guard rendered INSIDE AppLayout — has access to AuthProvider context.
 * ProfilePageWrapper itself must NOT call useAuth() because AppLayout
 * (which provides AuthProvider) is rendered below it in the tree.
 */
function ProfileContent({ section }: { section: ProfileSection }) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <SectionContent section={section} />;
}

export function ProfilePageWrapper({
  currentPath,
  section,
}: ProfilePageWrapperProps) {
  return (
    <AppLayout
      scrollable={true}
      showSidebar={true}
      sidebarContent={<ProfileNav currentPath={currentPath} />}
      header={<Header avatarMenu={<AvatarMenu />} />}
      showSubscriptionBanner={false}
    >
      <div className="p-6 lg:p-8">
        <ProfileContent section={section} />
      </div>
    </AppLayout>
  );
}
