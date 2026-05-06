import { signIn, signUp } from "@/app/auth/actions";

export function AuthPanel({
  error,
  info,
}: {
  error?: string;
  info?: string;
}) {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#20201d]">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
        <div className="flex flex-col justify-center border-b border-[#ded8cd] pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#71695f]">
            Modulo 3
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-normal sm:text-5xl">
            Autenticacion para tu recetario privado
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#635b51]">
            En este paso conectamos Supabase Auth. El recetario queda protegido:
            solo aparece cuando hay una sesion valida.
          </p>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-lg border border-[#ded8cd] bg-white p-4 shadow-sm sm:p-5">
            {error ? (
              <p className="mb-4 rounded-md border border-[#e4b2a8] bg-[#fff1ef] px-3 py-2 text-sm text-[#8f2d1f]">
                {error}
              </p>
            ) : null}
            {info ? (
              <p className="mb-4 rounded-md border border-[#9cc8bd] bg-[#eef8f4] px-3 py-2 text-sm text-[#1d6356]">
                {info}
              </p>
            ) : null}

            <div className="grid gap-5">
              <AuthForm
                action={signIn}
                buttonLabel="Iniciar sesion"
                title="Ya tengo cuenta"
              />
              <div className="h-px bg-[#ebe5dc]" />
              <AuthForm
                action={signUp}
                buttonLabel="Crear cuenta"
                title="Crear cuenta nueva"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function AuthForm({
  action,
  buttonLabel,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  buttonLabel: string;
  title: string;
}) {
  return (
    <form action={action} className="grid gap-3">
      <h2 className="text-base font-semibold">{title}</h2>
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          autoComplete="email"
          className="min-h-11 rounded-md border border-[#cfc7ba] bg-[#fffdfa] px-3 text-base outline-none transition focus:border-[#28786c]"
          name="email"
          placeholder="tu@email.com"
          required
          type="email"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Password
        <input
          autoComplete="current-password"
          className="min-h-11 rounded-md border border-[#cfc7ba] bg-[#fffdfa] px-3 text-base outline-none transition focus:border-[#28786c]"
          minLength={6}
          name="password"
          required
          type="password"
        />
      </label>
      <button
        className="min-h-11 rounded-md bg-[#28786c] px-4 text-sm font-semibold text-white transition hover:bg-[#1e6258]"
        type="submit"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
