create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_url text,
  source_platform text default 'instagram',
  source_author text,
  source_caption text,
  title text not null,
  description text,
  servings integer,
  estimated_time_minutes integer,
  difficulty text,
  dish_type text,
  calories_estimate integer,
  status text not null default 'pending_processing',
  is_favorite boolean not null default false,
  is_tested boolean not null default false,
  private_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  constraint recipes_status_check check (
    status in ('pending_processing', 'needs_review', 'completed', 'failed')
  ),
  constraint recipes_difficulty_check check (
    difficulty is null or difficulty in ('easy', 'medium', 'hard')
  )
);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null,
  quantity numeric,
  unit text,
  raw_text text,
  position integer
);

create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  step_number integer not null,
  description text not null,
  estimated_time_minutes integer
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  constraint tags_user_name_unique unique (user_id, name)
);

create table public.recipe_tags (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (recipe_id, tag_id)
);

create table public.processing_jobs (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  status text not null default 'queued',
  error_message text,
  raw_input text,
  ai_output_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  constraint processing_jobs_status_check check (
    status in ('queued', 'running', 'completed', 'failed')
  )
);

create index recipes_user_id_created_at_idx on public.recipes(user_id, created_at desc);
create index recipes_user_id_status_idx on public.recipes(user_id, status);
create index recipe_ingredients_recipe_id_idx on public.recipe_ingredients(recipe_id);
create index recipe_ingredients_name_idx on public.recipe_ingredients(lower(name));
create index recipe_steps_recipe_id_idx on public.recipe_steps(recipe_id);
create index tags_user_id_idx on public.tags(user_id);
create index processing_jobs_recipe_id_idx on public.processing_jobs(recipe_id);

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.tags enable row level security;
alter table public.recipe_tags enable row level security;
alter table public.processing_jobs enable row level security;

create policy "Profiles are visible to their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can read their recipes"
  on public.recipes for select
  using (auth.uid() = user_id);

create policy "Users can create their recipes"
  on public.recipes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their recipes"
  on public.recipes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their recipes"
  on public.recipes for delete
  using (auth.uid() = user_id);

create policy "Users can read ingredients for their recipes"
  on public.recipe_ingredients for select
  using (
    exists (
      select 1
      from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
        and recipes.user_id = auth.uid()
    )
  );

create policy "Users can manage ingredients for their recipes"
  on public.recipe_ingredients for all
  using (
    exists (
      select 1
      from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
        and recipes.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
        and recipes.user_id = auth.uid()
    )
  );

create policy "Users can read steps for their recipes"
  on public.recipe_steps for select
  using (
    exists (
      select 1
      from public.recipes
      where recipes.id = recipe_steps.recipe_id
        and recipes.user_id = auth.uid()
    )
  );

create policy "Users can manage steps for their recipes"
  on public.recipe_steps for all
  using (
    exists (
      select 1
      from public.recipes
      where recipes.id = recipe_steps.recipe_id
        and recipes.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.recipes
      where recipes.id = recipe_steps.recipe_id
        and recipes.user_id = auth.uid()
    )
  );

create policy "Users can manage their tags"
  on public.tags for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage recipe tags for their recipes"
  on public.recipe_tags for all
  using (
    exists (
      select 1
      from public.recipes
      join public.tags on tags.id = recipe_tags.tag_id
      where recipes.id = recipe_tags.recipe_id
        and recipes.user_id = auth.uid()
        and tags.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.recipes
      join public.tags on tags.id = recipe_tags.tag_id
      where recipes.id = recipe_tags.recipe_id
        and recipes.user_id = auth.uid()
        and tags.user_id = auth.uid()
    )
  );

create policy "Users can read processing jobs for their recipes"
  on public.processing_jobs for select
  using (
    exists (
      select 1
      from public.recipes
      where recipes.id = processing_jobs.recipe_id
        and recipes.user_id = auth.uid()
    )
  );

create policy "Users can manage processing jobs for their recipes"
  on public.processing_jobs for all
  using (
    exists (
      select 1
      from public.recipes
      where recipes.id = processing_jobs.recipe_id
        and recipes.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.recipes
      where recipes.id = processing_jobs.recipe_id
        and recipes.user_id = auth.uid()
    )
  );
