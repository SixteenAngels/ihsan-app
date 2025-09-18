import postgres, { Sql } from 'postgres'

const connectionString = process.env.DATABASE_URL

// Guard: return a no-op client if env is missing to avoid runtime crashes
const createClient = (): Sql<any> => {
  if (!connectionString) {
    // @ts-expect-error - return a minimal shape to avoid crashes when not configured
    return async () => []
  }
  return postgres(connectionString, {
    ssl: 'require',
    max: 5,
    idle_timeout: 20,
  })
}

export const sql = createClient()

export async function testDbConnection() {
  if (!connectionString) return { ok: false, error: 'DATABASE_URL not set' }
  try {
    const result = await sql`select now() as now`
    return { ok: true, now: result?.[0]?.now }
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Unknown error' }
  }
}


