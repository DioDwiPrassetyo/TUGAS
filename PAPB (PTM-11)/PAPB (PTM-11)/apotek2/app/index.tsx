import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

const CLOUDINARY_CLOUD_NAME = "ddsfi1cvr"; 
const CLOUDINARY_UPLOAD_PRESET = "gambar_obat"; 

type Obat = {
  id: string;
  kode_obat: string;
  nama_obat: string;
  jenis_obat: string;
  stok: number;
  harga: number;
  keterangan: string;
  gambar_url: string;
};

export default function Index() {
  const [dataObat, setDataObat] = useState<Obat[]>([]);

  const [kodeObat, setKodeObat] = useState("");
  const [namaObat, setNamaObat] = useState("");
  const [jenisObat, setJenisObat] = useState("");
  const [stok, setStok] = useState("");
  const [harga, setHarga] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [gambarUrl, setGambarUrl] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); 
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getDataObat();
  }, []);

  async function getDataObat() {
    try {
      setRefreshing(true);
      const snapshot = await getDocs(collection(db, "tbobat"));

      const data: Obat[] = snapshot.docs.map((document) => {
        const item = document.data();

        return {
          id: document.id,
          kode_obat: item.kode_obat || "",
          nama_obat: item.nama_obat || "",
          jenis_obat: item.jenis_obat || "",
          stok: Number(item.stok || 0),
          harga: Number(item.harga || 0),
          keterangan: item.keterangan || "",
          gambar_url: item.gambar_url || "",
        };
      });

      setDataObat(data);
    } catch (error) {
      console.log("Gagal mengambil data obat:", error);
      Alert.alert("Error", "Gagal mengambil data obat dari Firebase.");
    } finally {
      setRefreshing(false);
    }
  }

  async function pilihDanUploadGambar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin Ditolak", "Aplikasi membutuhkan izin galeri untuk mengupload foto.");
      return;
    }

    const hasil = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, // Kompresi gambar agar upload lebih cepat
    });

    if (!hasil.canceled && hasil.assets && hasil.assets.length > 0) {
      const uriGambarLokal = hasil.assets[0].uri;
      
      try {
        setUploadingImage(true);

        const dataFormData = new FormData();
        const namaFile = uriGambarLokal.split("/").pop();
        const kecocokanEkstensi = /\.(\w+)$/.exec(namaFile || "");
        const tipeFile = kecocokanEkstensi ? `image/${kecocokanEkstensi[1]}` : `image`;

        dataFormData.append("file", {
          uri: uriGambarLokal,
          name: namaFile || "upload.jpg",
          type: tipeFile,
        } as any);
        
        dataFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        // Fetch request ke API Cloudinary
        const respon = await fetch(
          `https://api.cloudinary.com/v1_1/${"ddsfi1cvr"}/image/upload`,
          {
            method: "POST",
            body: dataFormData,
            headers: {
              "Accept": "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const dataHasilCloudinary = await respon.json();

        if (dataHasilCloudinary.secure_url) {
          setGambarUrl(dataHasilCloudinary.secure_url); // Simpan secure URL hasil upload
          Alert.alert("Berhasil", "Gambar berhasil diunggah ke Cloudinary.");
        } else {
          throw new Error("Gagal mendapatkan URL gambar.");
        }
      } catch (error) {
        console.log("Error Cloudinary Upload: ", error);
        Alert.alert("Gagal", "Terjadi kesalahan saat mengunggah gambar ke Cloudinary.");
      } finally {
        setUploadingImage(false);
      }
    }
  }

  function resetForm() {
    setKodeObat("");
    setNamaObat("");
    setJenisObat("");
    setStok("");
    setHarga("");
    setKeterangan("");
    setGambarUrl("");
    setEditId(null);
  }

  async function simpanObat() {
    if (
      kodeObat.trim() === "" ||
      namaObat.trim() === "" ||
      jenisObat.trim() === "" ||
      stok.trim() === "" ||
      harga.trim() === "" ||
      gambarUrl.trim() === ""
    ) {
      Alert.alert(
        "Peringatan",
        "Semua kolom termasuk foto obat wajib dilengkapi sebelum menyimpan."
      );
      return;
    }

    if (Number(stok) < 0 || Number(harga) <= 0) {
      Alert.alert("Peringatan", "Stok dan harga harus valid.");
      return;
    }

    try {
      setLoading(true);

      const dataSimpan = {
        kode_obat: kodeObat,
        nama_obat: namaObat,
        jenis_obat: jenisObat,
        stok: Number(stok),
        harga: Number(harga),
        keterangan: keterangan,
        gambar_url: gambarUrl,
        created_at: new Date().toISOString(),
      };

      if (editId === null) {
        await addDoc(collection(db, "tbobat"), dataSimpan);
        Alert.alert("Berhasil", "Data obat berhasil disimpan.");
      } else {
        await updateDoc(doc(db, "tbobat", editId), dataSimpan);
        Alert.alert("Berhasil", "Data obat berhasil diperbarui.");
      }

      resetForm();
      getDataObat();
    } catch (error) {
      console.log("Gagal menyimpan data obat:", error);
      Alert.alert("Error", "Gagal menyimpan data obat.");
    } finally {
      setLoading(false);
    }
  }

  function pilihEdit(item: Obat) {
    setEditId(item.id);
    setKodeObat(item.kode_obat);
    setNamaObat(item.nama_obat);
    setJenisObat(item.jenis_obat);
    setStok(String(item.stok));
    setHarga(String(item.harga));
    setKeterangan(item.keterangan);
    setGambarUrl(item.gambar_url);
  }

  function hapusObat(id: string) {
    Alert.alert("Konfirmasi", "Yakin ingin menghapus data obat ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "tbobat", id));
            if (editId === id) resetForm();
            Alert.alert("Berhasil", "Data obat berhasil dihapus.");
            getDataObat();
          } catch (error) {
            Alert.alert("Error", "Gagal menghapus data obat.");
          }
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Apotek Digital</Text>
          <Text style={styles.subHeader}>Management & Inventory System</Text>
        </View>

        {/* Action Banner Link */}
        <TouchableOpacity
          style={styles.laporanButton}
          onPress={() => router.push("/laporan")}
        >
          <Text style={styles.laporanButtonText}>📋 Lihat & Cetak Laporan Obat</Text>
        </TouchableOpacity>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editId === null ? "Tambah Obat Baru" : "Edit Data Obat"}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kode Obat</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: O001"
              placeholderTextColor="#64748b"
              value={kodeObat}
              onChangeText={setKodeObat}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Obat</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama obat"
              placeholderTextColor="#64748b"
              value={namaObat}
              onChangeText={setNamaObat}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Jenis Obat</Text>
            <TextInput
              style={styles.input}
              placeholder="Tablet / Sirup / Kapsul"
              placeholderTextColor="#64748b"
              value={jenisObat}
              onChangeText={setJenisObat}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Stok</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                value={stok}
                onChangeText={setStok}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 2 }]}>
              <Text style={styles.inputLabel}>Harga (Rp)</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 15000"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                value={harga}
                onChangeText={setHarga}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Keterangan (Opsional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Deskripsi singkat obat..."
              placeholderTextColor="#64748b"
              value={keterangan}
              onChangeText={setKeterangan}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gambar Obat</Text>
            <TouchableOpacity
              style={[styles.uploadButton, uploadingImage && styles.buttonDisabled]}
              onPress={pilihDanUploadGambar}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.uploadButtonText}>
                  {gambarUrl ? "Ubah / Upload Ulang Gambar" : "Pilih Gambar & Upload"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {gambarUrl !== "" && (
            <View style={styles.previewContainer}>
              <Text style={styles.inputLabel}>Preview Gambar Tersimpan:</Text>
              <Image
                source={{ uri: gambarUrl }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            </View>
          )}

          <View style={styles.actionFormGroup}>
            <TouchableOpacity
              style={[styles.saveButton, (loading || uploadingImage) && styles.buttonDisabled]}
              onPress={simpanObat}
              disabled={loading || uploadingImage}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>
                  {editId === null ? "Simpan Obat" : "Perbarui Obat"}
                </Text>
              )}
            </TouchableOpacity>

            {editId !== null && (
              <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Section List Obat */}
        <View style={styles.listSectionHeader}>
          <Text style={styles.listTitle}>Daftar Stok Obat</Text>
          <Text style={styles.listSubTitle}>{dataObat.length} Items terdaftar</Text>
        </View>

        {refreshing ? (
          <ActivityIndicator color="#6366f1" size="large" style={{ marginVertical: 20 }} />
        ) : dataObat.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Belum ada data obat yang tersimpan.</Text>
          </View>
        ) : (
          dataObat.map((item) => (
            <View key={item.id} style={styles.medicineCard}>
              <View style={styles.cardHeader}>
                {item.gambar_url ? (
                  <Image
                    source={{ uri: item.gambar_url }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.cardImage, styles.imagePlaceholder]}>
                    <Text style={{ color: "#94a3b8", fontSize: 20 }}>💊</Text>
                  </View>
                )}

                <View style={styles.cardInfo}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.cardKode}>{item.kode_obat}</Text>
                    <View style={styles.jenisBadge}>
                      <Text style={styles.jenisText}>{item.jenis_obat}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardNama}>{item.nama_obat}</Text>
                  <Text style={styles.cardHarga}>
                    Rp {item.harga.toLocaleString("id-ID")}
                  </Text>
                  <Text style={styles.cardStok}>
                    Stok: <Text style={item.stok > 5 ? styles.stokAman : styles.stokTipis}>{item.stok} pcs</Text>
                  </Text>
                </View>
              </View>

              {item.keterangan ? (
                <Text style={styles.cardKeterangan} numberOfLines={2}>
                  {item.keterangan}
                </Text>
              ) : null}

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.cardEditButton}
                  onPress={() => pilihEdit(item)}
                >
                  <Text style={styles.actionBtnText}>✏️ Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardDeleteButton}
                  onPress={() => hapusObat(item.id)}
                >
                  <Text style={[styles.actionBtnText, { color: "#ef4444" }]}>🗑️ Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f19",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? 20 : 40,
    marginBottom: 16,
  },
  header: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subHeader: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 2,
  },
  laporanButton: {
    backgroundColor: "#1e1b4b",
    borderWidth: 1,
    borderColor: "#4338ca",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  laporanButtonText: {
    color: "#c7d2fe",
    fontWeight: "600",
    fontSize: 14,
  },
  formCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1f2937",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 25,
  },
  formTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 10,
    padding: 12,
    color: "#ffffff",
    fontSize: 15,
  },
  uploadButton: {
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#6366f1",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: "#a5b4fc",
    fontWeight: "600",
    fontSize: 14,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  previewContainer: {
    marginBottom: 14,
  },
  previewImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: "#1f2937",
  },
  actionFormGroup: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelButton: {
    backgroundColor: "#374151",
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#d1d5db",
    fontWeight: "600",
  },
  listSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  listTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  listSubTitle: {
    color: "#64748b",
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  emptyText: {
    color: "#64748b",
    textAlign: "center",
  },
  medicineCard: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardHeader: {
    flexDirection: "row",
  },
  cardImage: {
    width: 75,
    height: 75,
    borderRadius: 10,
    backgroundColor: "#1f2937",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardKode: {
    color: "#6366f1",
    fontSize: 11,
    fontWeight: "700",
    backgroundColor: "#1e1b4b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  jenisBadge: {
    backgroundColor: "#374151",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  jenisText: {
    color: "#e2e8f0",
    fontSize: 10,
    fontWeight: "600",
  },
  cardNama: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  cardHarga: {
    color: "#10b981",
    fontSize: 15,
    fontWeight: "600",
  },
  cardStok: {
    color: "#94a3b8",
    fontSize: 12,
  },
  stokAman: {
    color: "#f8fafc",
    fontWeight: "600",
  },
  stokTipis: {
    color: "#f59e0b",
    fontWeight: "700",
  },
  cardKeterangan: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 10,
    lineHeight: 16,
    backgroundColor: "#0b0f19",
    padding: 8,
    borderRadius: 6,
  },
  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
    marginTop: 12,
    paddingTop: 10,
    justifyContent: "flex-end",
    gap: 16,
  },
  cardEditButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cardDeleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionBtnText: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "600",
  },
});