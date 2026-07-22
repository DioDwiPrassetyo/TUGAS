import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Cetak() {
  const { namaPemesan, title, harga, jam, jumlahTiket, nomorKursi, totalBayar } =
    useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Ticket</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.ticketContainer}>
        <View style={styles.topSection}>
          <Ionicons name="film" size={28} color="#38bdf8" />
          <Text style={styles.brand}>IDLIX</Text>
          <Text style={styles.brandSub}>Tiket Masuk Bioskop</Text>
        </View>

        <View style={styles.tearLine} />

        <View style={styles.movieSection}>
          <Text style={styles.movieTitle}>{title || "-"}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="person" size={14} color="#94a3b8" />
              <Text style={styles.infoLabel}>Pemesan</Text>
              <Text style={styles.infoValue}>{namaPemesan || "-"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={14} color="#94a3b8" />
              <Text style={styles.infoLabel}>Jam</Text>
              <Text style={styles.infoValue}>{jam || "-"}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="cube" size={14} color="#94a3b8" />
              <Text style={styles.infoLabel}>Jumlah</Text>
              <Text style={styles.infoValue}>{jumlahTiket || "0"} Tiket</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="grid" size={14} color="#94a3b8" />
              <Text style={styles.infoLabel}>Kursi</Text>
              <Text style={styles.infoValue}>{nomorKursi || "-"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tearLine} />

        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Harga per Tiket</Text>
          <Text style={styles.priceValue}>
            Rp {Number(harga).toLocaleString("id-ID")}
          </Text>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Bayar</Text>
            <Text style={styles.totalValue}>
              Rp {Number(totalBayar).toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        <View style={styles.tearLine} />

        <View style={styles.barcodeSection}>
          <View style={styles.barcodePlaceholder}>
            <View style={styles.barcodeBar} />
            <View style={[styles.barcodeBar, { width: 3 }]} />
            <View style={[styles.barcodeBar, { width: 1 }]} />
            <View style={[styles.barcodeBar, { width: 4 }]} />
            <View style={[styles.barcodeBar, { width: 2 }]} />
            <View style={[styles.barcodeBar, { width: 1 }]} />
            <View style={[styles.barcodeBar, { width: 5 }]} />
            <View style={[styles.barcodeBar, { width: 2 }]} />
            <View style={[styles.barcodeBar, { width: 1 }]} />
            <View style={[styles.barcodeBar, { width: 3 }]} />
            <View style={[styles.barcodeBar, { width: 4 }]} />
            <View style={[styles.barcodeBar, { width: 1 }]} />
            <View style={[styles.barcodeBar, { width: 2 }]} />
            <View style={[styles.barcodeBar, { width: 5 }]} />
            <View style={[styles.barcodeBar, { width: 1 }]} />
            <View style={[styles.barcodeBar, { width: 3 }]} />
            <View style={[styles.barcodeBar, { width: 2 }]} />
            <View style={[styles.barcodeBar, { width: 4 }]} />
            <View style={[styles.barcodeBar, { width: 1 }]} />
            <View style={[styles.barcodeBar, { width: 2 }]} />
          </View>
          <Text style={styles.ticketId}>
                    TKT-{String(namaPemesan || "XXXX").toUpperCase().slice(0, 4)}-{String(title || "XXXX").slice(0, 4).toUpperCase()}
                  </Text>
        </View>
      </View>

      <View style={styles.successBox}>
        <Ionicons name="checkmark-circle" size={20} color="#6ee7b7" />
        <Text style={styles.successText}>
          Pemesanan berhasil! Tunjukkan e-ticket ini di loket.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(tabs)/dashboard")}
      >
        <Ionicons name="home" size={18} color="#ffffff" />
        <Text style={styles.buttonText}>Kembali ke Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  ticketContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
  },
  topSection: {
    backgroundColor: "#0f172a",
    alignItems: "center",
    paddingVertical: 20,
  },
  brand: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 6,
  },
  brandSub: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  tearLine: {
    height: 1,
    backgroundColor: "#e2e8f0",
    borderStyle: "dashed",
    marginHorizontal: 0,
  },
  movieSection: {
    backgroundColor: "#ffffff",
    padding: 20,
  },
  movieTitle: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  infoLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    marginTop: 4,
  },
  infoValue: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 16,
  },
  priceSection: {
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  priceLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  priceValue: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    padding: 14,
  },
  totalLabel: {
    color: "#0284c7",
    fontSize: 14,
    fontWeight: "600",
  },
  totalValue: {
    color: "#0284c7",
    fontSize: 20,
    fontWeight: "bold",
  },
  barcodeSection: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 20,
  },
  barcodePlaceholder: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 40,
  },
  barcodeBar: {
    width: 2,
    backgroundColor: "#0f172a",
    height: 35,
    borderRadius: 1,
  },
  ticketId: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 12,
    letterSpacing: 1,
  },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#064e3b",
    borderRadius: 14,
    padding: 15,
    marginTop: 20,
  },
  successText: {
    color: "#6ee7b7",
    fontWeight: "600",
    flex: 1,
    fontSize: 13,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0284c7",
    padding: 16,
    borderRadius: 14,
    marginTop: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
