"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [lowStock, setLowStock] = useState(true);

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        Back to overview
      </Link>

      <div className="mt-6">
        <p className="text-sm font-medium text-primary">
          Workspace preferences
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage notifications and catalog defaults.
        </p>
      </div>

      <section className="mt-8 rounded-xl border bg-card p-6 max-w-3xl">
        <div className="flex items-center gap-3 border-b pb-5">
          <div className="grid size-10 place-items-center rounded-lg bg-secondary">
            <Settings2 className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              Choose which updates reach your inbox.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-5">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium">Product updates</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Receive weekly catalog activity summaries.
              </span>
            </span>
            <input
              type="checkbox"
              checked={emailUpdates}
              onChange={(event) => setEmailUpdates(event.target.checked)}
              className="size-4 accent-primary cursor-pointer"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium">
                Low-stock alerts
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Get notified when products need attention.
              </span>
            </span>
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(event) => setLowStock(event.target.checked)}
              className="size-4 accent-primary cursor-pointer"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t pt-5">
          <span className="text-sm text-primary" aria-live="polite">
            {saved ? (
              <>
                <Check className="mr-1 inline size-4" />
                Changes saved
              </>
            ) : (
              ""
            )}
          </span>
          <Button onClick={save} className="cursor-pointer">Save preferences</Button>
        </div>
      </section>
    </div>
  );
}
