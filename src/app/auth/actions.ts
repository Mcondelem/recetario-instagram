"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function encodedMessage(type: "error" | "info", message: string) {
  const params = new URLSearchParams({ [type]: message });

  return `/?${params.toString()}`;
}

function authErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("email not confirmed")) {
    return "El email aun no esta confirmado. Revisa tu correo y confirma la cuenta antes de iniciar sesion.";
  }

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Email o password incorrectos.";
  }

  if (normalizedMessage.includes("user already registered")) {
    return "Ya existe una cuenta con este email. Prueba a iniciar sesion.";
  }

  return message;
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
    console.error("Supabase sign in error:", error.message);
    redirect(encodedMessage("error", authErrorMessage(error.message)));
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
    console.error("Supabase sign up error:", error.message);
    redirect(encodedMessage("error", authErrorMessage(error.message)));
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
