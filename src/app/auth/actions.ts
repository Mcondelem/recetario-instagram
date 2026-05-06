"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function encodedMessage(type: "error" | "info", message: string) {
  const params = new URLSearchParams({ [type]: message });

  return `/?${params.toString()}`;
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(encodedMessage("error", "No se pudo iniciar sesion."));
  }

  redirect("/");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(encodedMessage("error", "No se pudo crear la cuenta."));
  }

  redirect(
    encodedMessage(
      "info",
      "Cuenta creada. Si Supabase pide confirmar email, revisa tu correo antes de iniciar sesion.",
    ),
  );
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/");
}
