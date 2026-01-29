import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  const supabase = createClient(supabaseUrl, supabaseKey)

  const results = {
    timestamp: new Date().toISOString(),
    steps: [] as any[]
  }

  try {
    // Paso 1: Agregar métricas diarias
    const { error: metricsError } = await supabase.rpc('aggregate_daily_metrics')
    results.steps.push({
      step: 'aggregate_daily_metrics',
      success: !metricsError,
      error: metricsError?.message
    })

    // Paso 2: Crear snapshots de usuarios
    const { error: snapshotsError } = await supabase.rpc('create_user_snapshots')
    results.steps.push({
      step: 'create_user_snapshots',
      success: !snapshotsError,
      error: snapshotsError?.message
    })

    // Paso 3: Podar logs viejos (30+ días)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 30)
    
    const { error: pruneError } = await supabase
      .from('ritual_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
    
    results.steps.push({
      step: 'prune_old_logs',
      success: !pruneError,
      error: pruneError?.message
    })

    return new Response(JSON.stringify({
      success: true,
      message: 'Agregación completada',
      results
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      results
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
