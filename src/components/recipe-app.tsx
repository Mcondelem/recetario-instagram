"use client";

import { FormEvent, useMemo, useState } from "react";

import { signOut } from "@/app/auth/actions";

type Difficulty = "Facil" | "Media" | "Alta";
type DishType = "Cena" | "Comida" | "Desayuno" | "Postre";
type RecipeStatus = "Guardada" | "Necesita revision";

type Recipe = {
  id: number;
  title: string;
  sourceUrl: string;
  sourceAuthor: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  dishType: DishType;
  estimatedTimeMinutes: number;
  difficulty: Difficulty;
  servings: number;
  status: RecipeStatus;
  favorite: boolean;
  tested: boolean;
  notes: string;
  warnings?: string[];
};

const starterRecipes: Recipe[] = [
  {
    id: 1,
    title: "Tacos de pollo con lima",
    sourceUrl: "https://www.instagram.com/reel/demo-tacos",
    sourceAuthor: "@cocina_de_diario",
    ingredients: ["pollo", "tortillas", "lima", "cilantro", "aguacate"],
    steps: [
      "Marinar el pollo con lima, sal y especias.",
      "Dorar el pollo en sarten hasta que quede jugoso.",
      "Montar los tacos con aguacate, cilantro y un toque de lima.",
    ],
    tags: ["rapida", "proteina", "entre semana"],
    dishType: "Cena",
    estimatedTimeMinutes: 25,
    difficulty: "Facil",
    servings: 2,
    status: "Guardada",
    favorite: true,
    tested: true,
    notes: "Probar con yogur griego como salsa.",
  },
  {
    id: 2,
    title: "Crema de calabaza especiada",
    sourceUrl: "https://www.instagram.com/reel/demo-crema",
    sourceAuthor: "@verduras_faciles",
    ingredients: ["calabaza", "cebolla", "jengibre", "caldo", "leche de coco"],
    steps: [
      "Asar la calabaza con cebolla hasta que este tierna.",
      "Triturar con caldo caliente, jengibre y leche de coco.",
      "Ajustar sal y servir con semillas tostadas.",
    ],
    tags: ["vegetariana", "batch cooking", "otono"],
    dishType: "Comida",
    estimatedTimeMinutes: 40,
    difficulty: "Facil",
    servings: 4,
    status: "Guardada",
    favorite: false,
    tested: false,
    notes: "Guardar en porciones individuales.",
  },
  {
    id: 3,
    title: "Tarta rapida de yogur",
    sourceUrl: "https://www.instagram.com/reel/demo-tarta",
    sourceAuthor: "@postres_sin_lio",
    ingredients: ["yogur", "huevos", "harina", "limon", "azucar"],
    steps: [
      "Mezclar todos los ingredientes hasta integrar.",
      "Hornear en molde pequeno hasta que el centro cuaje.",
      "Enfriar antes de cortar.",
    ],
    tags: ["postre", "horno", "domingo"],
    dishType: "Postre",
    estimatedTimeMinutes: 50,
    difficulty: "Media",
    servings: 6,
    status: "Necesita revision",
    favorite: false,
    tested: false,
    notes: "La IA no pudo confirmar temperatura exacta.",
    warnings: ["Falta la temperatura de horno en el texto original."],
  },
];

const generatedRecipe: Recipe = {
  id: 4,
  title: "Pasta cremosa con tomate y ricotta",
  sourceUrl: "https://www.instagram.com/reel/ejemplo",
  sourceAuthor: "@recetas_guardadas",
  ingredients: ["pasta", "tomate cherry", "ricotta", "albahaca", "ajo"],
  steps: [
    "Asar los tomates cherry con ajo y aceite hasta que se ablanden.",
    "Cocer la pasta y reservar un poco de agua de coccion.",
    "Mezclar pasta, tomates, ricotta y agua de coccion hasta lograr una salsa cremosa.",
  ],
  tags: ["italiana", "vegetariana", "rapida"],
  dishType: "Cena",
  estimatedTimeMinutes: 30,
  difficulty: "Facil",
  servings: 2,
  status: "Necesita revision",
  favorite: false,
  tested: false,
  notes: "Resultado simulado para entender el flujo antes de conectar la IA real.",
  warnings: ["Revisa cantidades: el texto pegado no incluia medidas exactas."],
};

export function RecipeApp({ userEmail }: { userEmail: string }) {
  const [recipes, setRecipes] = useState<Recipe[]>(starterRecipes);
  const [selectedRecipeId, setSelectedRecipeId] = useState(starterRecipes[0].id);
  const [query, setQuery] = useState("");
  const [maxTime, setMaxTime] = useState("60");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyPending, setOnlyPending] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [reviewRecipe, setReviewRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const parsedMaxTime = Number(maxTime);

    return recipes.filter((recipe) => {
      const searchableText = [
        recipe.title,
        recipe.dishType,
        ...recipe.ingredients,
        ...recipe.tags,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);
      const matchesTime =
        !Number.isFinite(parsedMaxTime) ||
        parsedMaxTime <= 0 ||
        recipe.estimatedTimeMinutes <= parsedMaxTime;
      const matchesFavorite = !onlyFavorites || recipe.favorite;
      const matchesPending =
        !onlyPending || recipe.status === "Necesita revision";

      return matchesQuery && matchesTime && matchesFavorite && matchesPending;
    });
  }, [maxTime, onlyFavorites, onlyPending, query, recipes]);

  const selectedRecipe =
    recipes.find((recipe) => recipe.id === selectedRecipeId) ?? recipes[0];

  function processRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextRecipe = {
      ...generatedRecipe,
      id: Date.now(),
      sourceUrl: sourceUrl || generatedRecipe.sourceUrl,
      notes: rawText
        ? "Texto recibido. En la proxima fase lo enviaremos a OpenAI y validaremos el JSON."
        : generatedRecipe.notes,
    };

    setReviewRecipe(nextRecipe);
    setSelectedRecipeId(nextRecipe.id);
  }

  function saveReviewedRecipe() {
    if (!reviewRecipe) {
      return;
    }

    const completedRecipe = {
      ...reviewRecipe,
      status: "Guardada" as const,
    };

    setRecipes((currentRecipes) => [completedRecipe, ...currentRecipes]);
    setSelectedRecipeId(completedRecipe.id);
    setReviewRecipe(null);
    setSourceUrl("");
    setRawText("");
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#20201d]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-[#ded8cd] pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#71695f]">
              Recetario privado
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#20201d] sm:text-4xl">
              Recetas guardadas de Instagram
            </h1>
            <p className="mt-2 text-sm text-[#71695f]">
              Sesion iniciada como {userEmail}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="grid grid-cols-3 gap-3 text-center">
              <Metric label="Recetas" value={recipes.length.toString()} />
              <Metric
                label="Favoritas"
                value={recipes.filter((recipe) => recipe.favorite).length.toString()}
              />
              <Metric
                label="Por revisar"
                value={recipes
                  .filter((recipe) => recipe.status === "Necesita revision")
                  .length.toString()}
              />
            </div>
            <form action={signOut}>
              <button
                className="min-h-11 w-full rounded-md border border-[#cfc7ba] bg-white px-4 text-sm font-semibold text-[#20201d] transition hover:bg-[#f8f5f0] sm:w-auto"
                type="submit"
              >
                Cerrar sesion
              </button>
            </form>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-5">
            <section className="rounded-lg border border-[#ded8cd] bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold">Anadir receta</h2>
              <form className="mt-4 flex flex-col gap-3" onSubmit={processRecipe}>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  URL de Instagram
                  <input
                    className="min-h-11 rounded-md border border-[#cfc7ba] bg-[#fffdfa] px-3 text-base outline-none transition focus:border-[#28786c]"
                    onChange={(event) => setSourceUrl(event.target.value)}
                    placeholder="https://www.instagram.com/reel/..."
                    type="url"
                    value={sourceUrl}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Texto de la receta
                  <textarea
                    className="min-h-32 rounded-md border border-[#cfc7ba] bg-[#fffdfa] px-3 py-2 text-base outline-none transition focus:border-[#28786c]"
                    onChange={(event) => setRawText(event.target.value)}
                    placeholder="Pega aqui caption, ingredientes o pasos si Instagram no permite extraerlos."
                    value={rawText}
                  />
                </label>
                <button
                  className="min-h-11 rounded-md bg-[#28786c] px-4 text-sm font-semibold text-white transition hover:bg-[#1e6258]"
                  type="submit"
                >
                  Procesar receta
                </button>
              </form>
            </section>

            <section className="rounded-lg border border-[#ded8cd] bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold">Filtros</h2>
              <div className="mt-4 flex flex-col gap-3">
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Buscar por ingrediente, etiqueta o titulo
                  <input
                    className="min-h-11 rounded-md border border-[#cfc7ba] bg-[#fffdfa] px-3 text-base outline-none transition focus:border-[#28786c]"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="pollo, rapida, postre..."
                    type="search"
                    value={query}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Tiempo maximo
                  <input
                    className="min-h-11 rounded-md border border-[#cfc7ba] bg-[#fffdfa] px-3 text-base outline-none transition focus:border-[#28786c]"
                    min="0"
                    onChange={(event) => setMaxTime(event.target.value)}
                    type="number"
                    value={maxTime}
                  />
                </label>
                <label className="flex items-center gap-3 text-sm font-medium">
                  <input
                    checked={onlyFavorites}
                    className="h-4 w-4 accent-[#28786c]"
                    onChange={(event) => setOnlyFavorites(event.target.checked)}
                    type="checkbox"
                  />
                  Solo favoritas
                </label>
                <label className="flex items-center gap-3 text-sm font-medium">
                  <input
                    checked={onlyPending}
                    className="h-4 w-4 accent-[#28786c]"
                    onChange={(event) => setOnlyPending(event.target.checked)}
                    type="checkbox"
                  />
                  Pendientes de revision
                </label>
              </div>
            </section>
          </aside>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-lg border border-[#ded8cd] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#ebe5dc] p-4">
                <h2 className="text-base font-semibold">Listado</h2>
                <span className="text-sm text-[#71695f]">
                  {filteredRecipes.length} resultados
                </span>
              </div>
              <div className="divide-y divide-[#ebe5dc]">
                {filteredRecipes.map((recipe) => (
                  <button
                    className={`flex w-full flex-col gap-3 p-4 text-left transition hover:bg-[#f8f5f0] ${
                      selectedRecipe?.id === recipe.id ? "bg-[#eef6f2]" : ""
                    }`}
                    key={recipe.id}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    type="button"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{recipe.title}</h3>
                        <p className="mt-1 text-sm text-[#71695f]">
                          {recipe.sourceAuthor} - {recipe.dishType} -{" "}
                          {recipe.estimatedTimeMinutes} min
                        </p>
                      </div>
                      <StatusPill status={recipe.status} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <span
                          className="rounded-md bg-[#f0ebe2] px-2.5 py-1 text-xs font-medium text-[#635b51]"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {reviewRecipe ? (
                <section className="rounded-lg border border-[#cfba7c] bg-[#fff9e8] p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold">Revision IA</h2>
                      <p className="mt-1 text-sm text-[#74633a]">
                        Esta ficha simula el JSON que luego generara OpenAI.
                      </p>
                    </div>
                    <button
                      className="min-h-10 rounded-md bg-[#20201d] px-3 text-sm font-semibold text-white"
                      onClick={saveReviewedRecipe}
                      type="button"
                    >
                      Guardar
                    </button>
                  </div>
                  <RecipeDetail recipe={reviewRecipe} compact />
                </section>
              ) : null}

              <section className="rounded-lg border border-[#ded8cd] bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold">Detalle</h2>
                {selectedRecipe ? (
                  <RecipeDetail recipe={selectedRecipe} />
                ) : (
                  <p className="mt-4 text-sm text-[#71695f]">
                    No hay recetas que coincidan con los filtros.
                  </p>
                )}
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-24 rounded-lg border border-[#ded8cd] bg-white px-4 py-3 shadow-sm">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-[#71695f]">
        {label}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: RecipeStatus }) {
  const isPending = status === "Necesita revision";

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
        isPending
          ? "bg-[#fff1c2] text-[#765a00]"
          : "bg-[#dff0e8] text-[#1d6356]"
      }`}
    >
      {status}
    </span>
  );
}

function RecipeDetail({
  compact = false,
  recipe,
}: {
  compact?: boolean;
  recipe: Recipe;
}) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-xl font-semibold">{recipe.title}</h3>
          <StatusPill status={recipe.status} />
        </div>
        <p className="mt-2 text-sm text-[#71695f]">
          {recipe.difficulty} - {recipe.servings} raciones -{" "}
          {recipe.estimatedTimeMinutes} min
        </p>
        <a
          className="mt-2 block break-words text-sm font-medium text-[#28786c] underline-offset-4 hover:underline"
          href={recipe.sourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          Abrir enlace original
        </a>
      </div>

      {recipe.warnings?.length ? (
        <div className="rounded-md border border-[#e4cf82] bg-[#fff8df] p-3 text-sm text-[#6f5c23]">
          {recipe.warnings.join(" ")}
        </div>
      ) : null}

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#71695f]">
          Ingredientes
        </h4>
        <ul className="mt-2 grid gap-2">
          {recipe.ingredients.map((ingredient) => (
            <li
              className="rounded-md border border-[#ebe5dc] bg-[#fffdfa] px-3 py-2 text-sm"
              key={ingredient}
            >
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      {!compact ? (
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#71695f]">
            Pasos
          </h4>
          <ol className="mt-2 grid gap-2">
            {recipe.steps.map((step, index) => (
              <li
                className="rounded-md border border-[#ebe5dc] bg-[#fffdfa] px-3 py-2 text-sm"
                key={step}
              >
                <span className="font-semibold">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#71695f]">
          Notas privadas
        </h4>
        <p className="mt-2 rounded-md border border-[#ebe5dc] bg-[#fffdfa] px-3 py-2 text-sm">
          {recipe.notes}
        </p>
      </div>
    </div>
  );
}
