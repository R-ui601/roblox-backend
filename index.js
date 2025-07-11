require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Para leer JSON del body en POST

// Crear cliente de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ✅ Ruta POST: guardar datos
app.post('/guardar-datos', async (req, res) => {
  try {
    const { userId, coins, level } = req.body;

    if (!userId || coins == null || level == null) {
      return res.status(400).json({ error: "Faltan datos necesarios" });
    }

    const { data, error } = await supabase
      .from('players_data')
      .upsert(
        { user_id: userId, coins: coins, level: level },
        { onConflict: 'user_id' }
      );

    if (error) throw error;

    res.status(200).json({ message: "Datos guardados correctamente", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Ruta GET: obtener datos
app.get('/obtener-datos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('players_data')
      .select('*');

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Escuchar en puerto 3000
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
