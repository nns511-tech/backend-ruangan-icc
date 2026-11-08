const express = require ('express');
const cors = require ('cors');
const { createClient } = require ('@supabase/supabase-js');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
  const supabaseUrl = 'https://xubesxqqvzujstlgvhsr.supabase.co';
  const supabaseKey = 'sb_publishable_WHusOQyVtX_JLVa9QSQnQQ_azHG09lM';
  const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.send('Server Peminjaman Ruangan');
});

app.get('/api/reservasi', async (req, res) => {
  const { data, error } = await supabase
  .from('daftar_reservasi')
  .select('*');
  .order('id', { ascending: true});

  if (error){
    return res.status(500).json({ pesan: "Gagal mengambil data", error});
  }
  res.json(data);
});

app.post('/api/reservasi', async (req,res) => {
  const dataBaru = req.body;
  const { data, error } = await supabase
    .from('daftar_reservasi')
    .insert([
      {
        peminjaman: dataBaru.peminjaman,
        ruangan: dataBaru.ruangan,
        waktu: dataBaru.waktu,
        status: "Menunggu Persetujuan"
      }
    ])

    .select();
  if (error){
    return res.status(500).json({ pesan: "Gagal menambah jadwal", error});
  }

  res.status(201).json({
    pesan: "Berhasil, ruangan sudah masuk antrean.",
    data: data
  });
});

app.put('/api/reservasi/:id',async (req,res) => {
  const idPesanan = parseInt(req.params.id);
  const dataPerubahan = req.body;
  const { data, error } = await supabase
    .from ('daftar_reservasi')
    .update ({
      peminjaman: dataPerubahan.peminjaman,
      ruangan: dataPerubahan.ruangan,
      waktu: dataPerubahan.waktu,
      status: dataPerubahan.status      
    })
    .eq('id', idPesanan)
    .select();

  if (error){
    return res.status(500).json({ pesan: "Gagal memperbarui antrean", error});
  }
  res.json({
    pesan: "Antrean berhasil diperbarui.",
    data: data
  });
});

app.delete('/api/reservasi/:id', async (req, res) => {
  const idPesanan = parseInt(req.params.id);
  const { error }= await supabase
    .from('daftar_reservasi')
    .delete()
    .eq('id', idPesanan);

  if ( error ) {
    return res.status(500).json({ pesan: "Gagal menghapus antrean", error});
  }
  res.json({ pesan: `Antrean dengan ID ${idPesanan} berhasil dihapus dari database.`});
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
