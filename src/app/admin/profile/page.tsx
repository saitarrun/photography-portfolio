"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import type { PhotographerProfile } from "@/types/database";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<PhotographerProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const supabase = createClient();
    const { data } = await supabase
      .from("photographer_profile")
      .select("*")
      .limit(1)
      .single();
    if (data) setProfile(data as unknown as PhotographerProfile);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("photographer_profile")
      .update({
        name: profile.name,
        bio: profile.bio,
        portrait_url: profile.portrait_url,
        email: profile.email,
        social_links: profile.social_links,
      } as never)
      .eq("id", profile.id);

    setSaving(false);
    setMessage(error ? `Error: ${error.message}` : "Profile saved.");
  }

  if (!profile) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface mb-4">
          Profile
        </h1>
        <p className="font-body text-sm text-on-surface-variant">
          No profile found. Create one in your Supabase database.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface mb-8">
        Profile
      </h1>

      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        <Input
          label="Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={profile.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <Input
          label="Portrait URL"
          value={profile.portrait_url || ""}
          onChange={(e) =>
            setProfile({ ...profile, portrait_url: e.target.value })
          }
        />
        <TextArea
          label="Bio"
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />

        {message && (
          <p
            className={`font-body text-xs ${message.startsWith("Error") ? "text-red-400" : "text-primary"}`}
          >
            {message}
          </p>
        )}

        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
