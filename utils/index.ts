// Fungsi Helper untuk Format Rupiah
export const formatRupiah = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0, // Menghilangkan koma desimal (,00)
  }).format(price);
};

// Fungsi Helper untuk Format Tanggal (Opsional, buat nanti)
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(date);
};