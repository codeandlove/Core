/**
 * BasicInfoSection
 * Shows user email + inline password reset request form
 */
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";
import { Mail, KeyRound, CheckCircle } from "lucide-react";
import { supabaseClient } from "@/db/supabase.client";

export function BasicInfoSection() {
  const { user } = useAuth();
  const toast = useToast();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendReset = async () => {
    if (!user?.email) return;
    setIsSending(true);
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(
        user.email,
        { redirectTo: `${window.location.origin}/auth/reset-password` },
      );
      if (error) throw error;
      setSent(true);
      toast.success(
        "Email wysłany!",
        "Sprawdź skrzynkę i kliknij link resetujący.",
      );
    } catch {
      toast.error("Błąd", "Nie udało się wysłać emaila. Spróbuj ponownie.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section aria-labelledby="basic-info-heading">
      <h1 id="basic-info-heading" className="mb-6 text-2xl font-semibold">
        Informacje o koncie
      </h1>
      <div className="space-y-0 rounded-lg border">
        {/* Email row */}
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Adres email
            </p>
            <div className="flex items-center gap-2">
              <Mail
                className="h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Password row */}
        <div className="border-t">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Hasło
              </p>
              <p className="text-sm text-muted-foreground">••••••••••••</p>
            </div>
            {!showPasswordForm && !sent && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordForm(true)}
              >
                <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
                Zmień hasło
              </Button>
            )}
          </div>

          {/* Inline password reset form */}
          {showPasswordForm && !sent && (
            <div className="border-t bg-muted/30 px-6 py-4">
              <p className="mb-4 text-sm text-muted-foreground">
                Wyślemy link do zmiany hasła na adres{" "}
                <strong>{user?.email}</strong>. Kliknij link w emailu, aby
                ustawić nowe hasło.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => void handleSendReset()}
                  disabled={isSending}
                  size="sm"
                >
                  {isSending ? "Wysyłanie..." : "Wyślij link resetujący"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordForm(false)}
                  disabled={isSending}
                >
                  Anuluj
                </Button>
              </div>
            </div>
          )}

          {/* Success state */}
          {sent && (
            <div className="border-t bg-green-50 px-6 py-4 dark:bg-green-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Email wysłany
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    Sprawdź skrzynkę <strong>{user?.email}</strong> i kliknij
                    link, aby ustawić nowe hasło.
                  </p>
                  <button
                    className="mt-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    onClick={() => {
                      setSent(false);
                      setShowPasswordForm(false);
                    }}
                  >
                    Wyślij ponownie
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
