require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Permitir JSON en las peticiones POST
app.use(express.json());

// Conectar con Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Ruta GET solo para verificar que está activo
app.get('/', (req, res) => {
  res.send('Servidor de Roblox activo.');
});

// 🟢 Ruta POST para guardar datos desde Roblox
app.post('/guardar-datos', async (req, res) => {
  const { userId, coins, level } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Falta el userId' });
  }

  try {
    const { data, error } = await supabase
      .from('players_data')
      .upsert([{ user_id: userId, coins, level }], { onConflict: ['user_id'] });

    if (error) throw error;

    res.status(200).json({ mensaje: 'Datos guardados correctamente', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
