// Flash Deals migration script using DATABASE_URL
// Safe/idempotent: adds columns, types, table, policies, and triggers if missing

require('dotenv').config({ path: '.env.local' })
const postgres = require('postgres')

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set. Add it to .env.local')
  process.exit(1)
}

const sql = postgres(connectionString, { ssl: 'require', max: 1 })

async function migrate() {
  console.log('Starting flash_deals migration...')
  try {
    await sql`begin`;

    // Ensure extra profile columns exist
    await sql`alter table if exists profiles add column if not exists vendor_status text`;
    await sql`alter table if exists profiles add column if not exists is_active boolean default true`;

    // Create sale_kind enum type if missing
    await sql`
      do $$
      begin
        if not exists (select 1 from pg_type where typname = 'sale_kind') then
          create type sale_kind as enum ('flash','daily');
        end if;
      end$$;
    `;

    // Create flash_deals table if missing
    await sql`
      create table if not exists flash_deals (
        id uuid default gen_random_uuid() primary key,
        sale_type sale_kind not null default 'flash',
        product_id uuid references products(id) on delete set null,
        title text not null,
        description text,
        image_url text,
        category text,
        vendor text,
        original_price numeric(10,2) not null,
        sale_price numeric(10,2) not null,
        discount integer generated always as (
          greatest(0, least(100, round((100 * (original_price - sale_price) / nullif(original_price, 0))::numeric)))
        ) stored,
        rating numeric(2,1) default 0,
        reviews integer default 0,
        sold integer default 0,
        stock integer default 0,
        start_time timestamptz not null,
        end_time timestamptz not null,
        is_active boolean default true,
        is_hot boolean default false,
        created_by uuid references profiles(id) on delete set null,
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      )
    `;

    // Indexes
    await sql`create index if not exists idx_flash_deals_type on flash_deals (sale_type)`
    await sql`create index if not exists idx_flash_deals_active on flash_deals (is_active)`
    await sql`create index if not exists idx_flash_deals_time on flash_deals (start_time, end_time)`

    // Enable RLS
    await sql`alter table flash_deals enable row level security`;

    // Policies (create if missing)
    await sql`
      do $$
      begin
        if not exists (
          select 1 from pg_policies where schemaname = 'public' and tablename = 'flash_deals' and policyname = 'Public can view active deals'
        ) then
          create policy "Public can view active deals" on flash_deals
            for select using (is_active = true and now() between start_time and end_time);
        end if;
      end$$;
    `;

    await sql`
      do $$
      begin
        if not exists (
          select 1 from pg_policies where schemaname = 'public' and tablename = 'flash_deals' and policyname = 'Admins can view all deals'
        ) then
          create policy "Admins can view all deals" on flash_deals
            for select using (
              exists (select 1 from profiles where id = auth.uid() and role in ('admin','manager'))
            );
        end if;
      end$$;
    `;

    await sql`
      do $$
      begin
        if not exists (
          select 1 from pg_policies where schemaname = 'public' and tablename = 'flash_deals' and policyname = 'Admins can modify deals'
        ) then
          create policy "Admins can modify deals" on flash_deals
            for all using (
              exists (select 1 from profiles where id = auth.uid() and role in ('admin','manager'))
            ) with check (
              exists (select 1 from profiles where id = auth.uid() and role in ('admin','manager'))
            );
        end if;
      end$$;
    `;

    // updated_at trigger function (create or replace)
    await sql`
      create or replace function update_updated_at_column()
      returns trigger as $$
      begin
        new.updated_at = now();
        return new;
      end;
      $$ language plpgsql;
    `;

    // Create trigger if missing
    await sql`
      do $$
      begin
        if not exists (
          select 1 from pg_trigger where tgname = 'update_flash_deals_updated_at'
        ) then
          create trigger update_flash_deals_updated_at
            before update on flash_deals
            for each row execute function update_updated_at_column();
        end if;
      end$$;
    `;

    await sql`commit`;
    console.log('✅ Migration completed successfully')
  } catch (err) {
    console.error('❌ Migration failed:', err?.message || err)
    try { await sql`rollback`; } catch {}
    process.exit(1)
  } finally {
    await sql.end({ timeout: 5 })
  }
}

migrate()

