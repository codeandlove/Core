/**
 * Dashboard View Component
 * Main dashboard for authenticated users
 * Shows subscription status and placeholder for premium features
 */

import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, Settings, Zap } from "lucide-react";

/**
 * Calculate days remaining in trial
 */
function getDaysRemaining(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get subscription status display info
 */
function getSubscriptionInfo(profile: {
  subscription_status: string;
  trial_expires_at: string | null;
}) {
  const status = profile.subscription_status;
  const daysLeft = getDaysRemaining(profile.trial_expires_at);

  switch (status) {
    case "trial":
      return {
        badge: "Trial Active",
        badgeClass:
          "bg-blue-600/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400",
        message: daysLeft
          ? `Your free trial expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`
          : "Your free trial is active",
        icon: "⏱️",
        showUpgrade: daysLeft !== null && daysLeft <= 3,
      };
    case "active":
      return {
        badge: "Active Subscription",
        badgeClass:
          "bg-green-600/10 text-green-700 dark:bg-green-400/10 dark:text-green-400",
        message: "You have full access to all premium features",
        icon: "✅",
        showUpgrade: false,
      };
    case "expired":
      return {
        badge: "Trial Expired",
        badgeClass:
          "bg-red-600/10 text-red-700 dark:bg-red-400/10 dark:text-red-400",
        message:
          "Your trial has ended. Upgrade to continue using premium features",
        icon: "🔒",
        showUpgrade: true,
      };
    case "canceled":
      return {
        badge: "Subscription Canceled",
        badgeClass: "bg-muted text-muted-foreground",
        message: "Your subscription has been canceled",
        icon: "⚠️",
        showUpgrade: true,
      };
    case "past_due":
      return {
        badge: "Payment Required",
        badgeClass:
          "bg-yellow-600/10 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400",
        message: "Your payment is past due. Please update your payment method",
        icon: "💳",
        showUpgrade: true,
      };
    default:
      return {
        badge: "Unknown Status",
        badgeClass: "bg-muted text-muted-foreground",
        message: "Unable to determine subscription status",
        icon: "❓",
        showUpgrade: false,
      };
  }
}

export function DashboardView() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">🔒</div>
          <p className="text-muted-foreground">
            Please log in to access the dashboard
          </p>
        </div>
      </div>
    );
  }

  const displayName = user.email?.split("@")[0] || "User";
  const subInfo = getSubscriptionInfo(profile);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome back, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your account and features
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Subscription Status Card */}
        <Card className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="mb-1 text-xl font-semibold">
                Subscription Status
              </h2>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${subInfo.badgeClass}`}
              >
                {subInfo.badge}
              </span>
            </div>
            <span className="text-4xl">{subInfo.icon}</span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            {subInfo.message}
          </p>

          {subInfo.showUpgrade && (
            <Button
              className="w-full"
              onClick={() => (window.location.href = "/checkout")}
            >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          )}

          {!subInfo.showUpgrade && profile.subscription_status === "active" && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = "/checkout")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
          )}
        </Card>

        {/* Quick Stats Card */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Account Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg">📧</span>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {profile.trial_expires_at &&
              profile.subscription_status === "trial" && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Trial Expires</p>
                    <p className="text-muted-foreground">
                      {new Date(profile.trial_expires_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

            {profile.current_period_end &&
              profile.subscription_status === "active" && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Next Billing Date</p>
                    <p className="text-muted-foreground">
                      {new Date(
                        profile.current_period_end,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
          </div>
        </Card>
      </div>

      {/* Premium Feature Placeholder */}
      <Card className="mt-6 p-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold">
            Your Premium Feature Goes Here
          </h2>
          <p className="mb-6 text-muted-foreground">
            This is a placeholder for your main application feature. Replace
            this section with your custom functionality.
          </p>

          {/* Placeholder Content */}
          <div className="mx-auto max-w-2xl rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-8">
            <div className="space-y-4 text-left">
              <p className="text-sm font-semibold text-muted-foreground">
                💡 Implementation Guide:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Replace this Card component with your main feature UI</li>
                <li>• Add API calls to fetch your data</li>
                <li>
                  • Implement premium feature gating based on
                  subscription_status
                </li>
                <li>• Use the useAuth hook to access user and profile data</li>
                <li>• See STARTER_GUIDE.md for detailed instructions</li>
              </ul>
            </div>
          </div>

          {profile.subscription_status !== "active" && (
            <div className="mt-6">
              <p className="mb-3 text-sm text-muted-foreground">
                Unlock premium features with a subscription
              </p>
              <Button
                size="lg"
                onClick={() => (window.location.href = "/checkout")}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
