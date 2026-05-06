import { AuthPanel } from "@/components/auth-panel";
import { RecipeApp } from "@/components/recipe-app";
import { createClient } from "@/lib/supabase/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; info?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const params = await searchParams;

  if (!user) {
    return <AuthPanel error={params.error} info={params.info} />;
  }

  return <RecipeApp userEmail={user.email ?? "usuario"} />;
}
