const express = require ('express');
const app = express();
const port = 3000;

app.use(express.json());
 let daftarReservasi = [
   {
     id: 1,
     peminjaman: "Najwa",
     ruangan: "355, Gedung A",
     waktu: "Selasa, 10:00 - 12:00",
     status: "Disetujui"
   }
 ];

app.get('/', (req, res) => {
  res.send('Server Peminjaman Ruangan');
});

app.get('/api/reservasi', (req, res) => {
  res.json(daftarReservasi);
});

app.post('/api/reservasi', (req,res) => {
  const dataBaru = req.body;
  const idBaru = daftarReservasi.length > 0
  ? daftarReservasi[daftarReservasi.length - 1].id + 1 : 1;
  
  const reservasiBaru = {
    id: idBaru,
    peminjaman: dataBaru.peminjaman,
    ruangan: dataBaru.ruangan,
    waktu: dataBaru.waktu,
    status: "Menunggu Persetujuan"
  };

  daftarReservasi.push(reservasiBaru);

  res.status(201).json({
    pesan: "Berhasil, ruangan sudah masuk antrean.",
    data: reservasiBaru
  });
});

app.put('/api/reservasi/:id', (req,res) => {
  const idPesanan = parseInt(req.params.id);
  const dataPerubahan = req.body;
  const indeks = daftarReservasi.findIndex(pesanan => pesanan.id === idPesanan);
  if (indeks !== -1){
    daftarReservasi[indeks].peminjaman = dataPerubahan.peminjaman;
    daftarReservasi[indeks].ruangan = dataPerubahan.ruangan;
    daftarReservasi[indeks].waktu = dataPerubahan.waktu;
    daftarReservasi[indeks].status = dataPerubahan.status || daftarReservasi[indeks].status;
    res.json({
      pesan: "Jadwal ruangan berhasil diubah.",
      data: daftarReservasi[indeks]
    });
  } else {
    res.status(404).json({ pesan: "Error: Pesanan tidak ditemukan."});
  }
});

app.delete('/api/reservasi/:id', (req, res) => {
  const idPesanan = parseInt(req.params.id);
  const indeks = daftarReservasi.findIndex(pesanan => pesanan.id === idPesanan);
  if (indeks !== -1){
    daftarReservasi.splice(indeks, 1);
    res.json ({ pesanan: `Pesanan ruangan dengan ID ${idPesanan} berhasil dibatalkan.`});

  } else {
    res.status(404).json({ pesan: "Error: Pesanan tidak ditemukan."});
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});


