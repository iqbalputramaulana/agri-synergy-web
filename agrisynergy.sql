-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: agrisynergy
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.24.04.1

USE agrisynergy;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chatingan`
--
ROP TABLE IF EXISTS `chatingan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatingan` (
  `id_chat` int(11) NOT NULL,
  `id_konsultasi` int(11) NOT NULL,
  `id_sender` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `gambar` varchar(225) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chatingan`
--
LOCK TABLES `chatingan` WRITE;
/*!40000 ALTER TABLE `detail_sawah` DISABLE KEYS */;
INSERT INTO `chatingan` (`id_chat`, `id_konsultasi`, `id_sender`, `message`, `sent_at`, `gambar`) VALUES
(1, 4, 2, 'aku memiliki masalah dengan hama', '2024-12-18 02:53:02', NULL),
(2, 4, 3, 'kamu dapat menggunakan pestisida organik untuk mengatasi maslah hama dan agar tetap mengurangi zat kimia pada tanamanmu', '2024-12-18 03:33:47', NULL);
/*!40000 ALTER TABLE `detail_sawah` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_sawah`
--



DROP TABLE IF EXISTS `detail_sawah`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_sawah` (
  `id_lokasi` int NOT NULL AUTO_INCREMENT,
  `id_sawah` int NOT NULL,
  `jenis_tanah` varchar(255) NOT NULL,
  `hasil_panen` varchar(255) NOT NULL,
  `produksi` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  PRIMARY KEY (`id_lokasi`),
  KEY `detail_sawah_ibfk_1` (`id_sawah`),
  CONSTRAINT `detail_sawah_ibfk_1` FOREIGN KEY (`id_sawah`) REFERENCES `sawah` (`id_sawah`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_sawah`
--

LOCK TABLES `detail_sawah` WRITE;
/*!40000 ALTER TABLE `detail_sawah` DISABLE KEYS */;
INSERT INTO `detail_sawah` VALUES (1,1,'Liat Berpasir','537 kg (Jagung Manis: 400 kg, Tepung Jagung: 137 kg)\n','jagung','Lahan subur dengan drainase baik, cocok untuk jagung. Pemantauan rutin dan pupuk organik meningkatkan hasil panen.',-3.31669400,114.59011100),(2,2,'Liat Berpasir','537 kg (Jagung Manis: 400 kg, Tepung Jagung: 137 kg)\n','jagung','Lahan subur dengan drainase baik, cocok untuk jagung. Pemantauan rutin dan pupuk organik meningkatkan hasil panen.',-7.25044500,112.76884500);
/*!40000 ALTER TABLE `detail_sawah` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dropship`
--

DROP TABLE IF EXISTS `dropship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dropship` (
  `id_dropship` int NOT NULL AUTO_INCREMENT,
  `id_produk` int NOT NULL,
  `id_user` int NOT NULL,
  `status` enum('menunggu','berhasil','batal') DEFAULT 'menunggu',
  `dropship` date NOT NULL,
  PRIMARY KEY (`id_dropship`),
  KEY `id_user` (`id_user`),
  KEY `id_produk` (`id_produk`),
  CONSTRAINT `dropship_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  CONSTRAINT `dropship_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dropship`
--

LOCK TABLES `dropship` WRITE;
/*!40000 ALTER TABLE `dropship` DISABLE KEYS */;
/*!40000 ALTER TABLE `dropship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kalender`
--

DROP TABLE IF EXISTS `kalender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kalender` (
  `id_kalender` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `jenis` varchar(255) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `tanggal` date NOT NULL,
  `deskripsi` text NOT NULL,
  `gambar` varchar(255) NOT NULL,
  PRIMARY KEY (`id_kalender`),
  KEY `fk_kalender_user_id` (`id_user`),
  CONSTRAINT `fk_kalender_user_id` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kalender`
--

LOCK TABLES `kalender` WRITE;
/*!40000 ALTER TABLE `kalender` DISABLE KEYS */;
INSERT INTO `kalender` VALUES (1,2,'pengingat','bercocok tanam','2024-12-19','malesuada sociis netus rutrum, nibh natoque neque aliquam torquent. Pellentesque ullamcorper nunc orci mollis, semper odio.','1732794630115.jpg');
/*!40000 ALTER TABLE `kalender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kategori`
--

DROP TABLE IF EXISTS `kategori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kategori` (
  `id_kategori` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_kategori`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategori`
--

LOCK TABLES `kategori` WRITE;
/*!40000 ALTER TABLE `kategori` DISABLE KEYS */;
INSERT INTO `kategori` VALUES (1,'pertanian'),(2,'peralatan'),(3,'hasil panen');
/*!40000 ALTER TABLE `kategori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keranjang`
--

DROP TABLE IF EXISTS `keranjang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keranjang` (
  `id_keranjang` int NOT NULL AUTO_INCREMENT,
  `id_produk` int NOT NULL,
  `id_user` int NOT NULL,
  `total_produk` int NOT NULL,
  `total_harga` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_keranjang`),
  KEY `id_user` (`id_user`),
  KEY `id_produk` (`id_produk`),
  CONSTRAINT `keranjang_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  CONSTRAINT `keranjang_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keranjang`
--

LOCK TABLES `keranjang` WRITE;
/*!40000 ALTER TABLE `keranjang` DISABLE KEYS */;
INSERT INTO `keranjang` VALUES (3,1,1,1,20000.00);
/*!40000 ALTER TABLE `keranjang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `komentator`
--

DROP TABLE IF EXISTS `komentator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `komentator` (
  `id_komentator` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_komunitas` int NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `type` enum('like','dislike') DEFAULT NULL,
  PRIMARY KEY (`id_komentator`),
  KEY `id_user` (`id_user`),
  KEY `id_komunitas` (`id_komunitas`),
  CONSTRAINT `komentator_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE,
  CONSTRAINT `komentator_ibfk_2` FOREIGN KEY (`id_komunitas`) REFERENCES `komunitas` (`id_komunitas`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `komentator`
--

LOCK TABLES `komentator` WRITE;
/*!40000 ALTER TABLE `komentator` DISABLE KEYS */;
INSERT INTO `komentator` VALUES (1,3,1,'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque, euismod felis nascetur arcu ',NULL),(2,2,1,'','dislike');
/*!40000 ALTER TABLE `komentator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `komunitas`
--

DROP TABLE IF EXISTS `komunitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `komunitas` (
  `id_komunitas` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `gambar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `like_count` int(11) DEFAULT 0,
  `dislike_count` int(11) DEFAULT 0,
  `deskripsi` text NOT NULL,
  `topic` varchar(225) NOT NULL,
  `waktu` timestamp NOT NULL DEFAULT current_timestamp()
  PRIMARY KEY (`id_komunitas`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `komunitas_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `komunitas`
--

LOCK TABLES `komunitas` WRITE;
/*!40000 ALTER TABLE `komunitas` DISABLE KEYS */;
INSERT INTO `komunitas` (`id_komunitas`, `id_user`, `gambar`, `like_count`, `dislike_count`, `deskripsi`, `topic`, `waktu`) VALUES
(1, 1, '1734272687057.jpg', 2, 1, 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque, euismod felis nascetur arcu', '#pertanian jagung', '2024-12-17 22:55:45'),
(3, 2, '1734433790298.jpg', 4, 0, 'hai aku petani', '', '2024-12-17 23:00:14'),
(4, 2, '1734440019929.png', 0, 0, 'aku bisa memanen 12ton jagung tahun ini dengan melakukan perawatan yang baik terhadap tanaman jagungku seperti menyiramnya secara rutin, memberinya pupuk serta pemberian pestisida organik secara berkala', '#menanam_jagung', '2024-12-17 12:53:39');
/*!40000 ALTER TABLE `komunitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `konsultasi`
--

DROP TABLE IF EXISTS `konsultasi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `konsultasi` (
  `id_konsultasi` int(11) NOT NULL,
  `petani_id` int(11) NOT NULL,
  `ahli_id` int(11) NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `konsultasi`
--

LOCK TABLES `konsultasi` WRITE;
/*!40000 ALTER TABLE `konsultasi` DISABLE KEYS */;
INSERT INTO `konsultasi` (`id_konsultasi`, `petani_id`, `ahli_id`, `started_at`) VALUES
(4, 2, 3, '2024-12-18 02:53:02');
/*!40000 ALTER TABLE `konsultasi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memesan`
--

DROP TABLE IF EXISTS `memesan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memesan` (
  `id_memesan` int NOT NULL AUTO_INCREMENT,
  `id_produk` int NOT NULL,
  `id_user` int NOT NULL,
  `total_harga` decimal(10,2) NOT NULL,
  `kuantitas` int NOT NULL,
  `tgl_memesan` datetime NOT NULL,
  `status` enum('pending','dikirim','berhasil','batal') DEFAULT 'pending',
  PRIMARY KEY (`id_memesan`),
  KEY `id_user` (`id_user`),
  KEY `id_produk` (`id_produk`),
  CONSTRAINT `memesan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  CONSTRAINT `memesan_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memesan`
--

LOCK TABLES `memesan` WRITE;
/*!40000 ALTER TABLE `memesan` DISABLE KEYS */;
INSERT INTO `memesan` VALUES (1,1,1,133000.00,1,'2024-12-14 08:22:34','pending'),(2,2,1,133000.00,2,'2024-12-14 08:22:34','pending');
/*!40000 ALTER TABLE `memesan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengiriman`
--

DROP TABLE IF EXISTS `pengiriman`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengiriman` (
  `id_pengiriman` int NOT NULL AUTO_INCREMENT,
  `id_memesan` int NOT NULL,
  `status` enum('pending','berhasil','batal') DEFAULT 'pending',
  `tgl_pengiriman` date NOT NULL,
  `tgl_penerima` date DEFAULT NULL,
  `harga` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_pengiriman`),
  KEY `id_memesan` (`id_memesan`),
  CONSTRAINT `pengiriman_ibfk_1` FOREIGN KEY (`id_memesan`) REFERENCES `memesan` (`id_memesan`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengiriman`
--

LOCK TABLES `pengiriman` WRITE;
/*!40000 ALTER TABLE `pengiriman` DISABLE KEYS */;
INSERT INTO `pengiriman` VALUES (1,1,'pending','2024-02-22',NULL,60.00);
/*!40000 ALTER TABLE `pengiriman` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produk`
--

DROP TABLE IF EXISTS `produk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produk` (
  `id_produk` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_kategori` int NOT NULL,
  `nama` varchar(255) NOT NULL,
  `harga` decimal(10,2) NOT NULL,
  `kuantitas` int NOT NULL,
  `deskripsi` text NOT NULL,
  `tanggal_diposting` date NOT NULL,
  `foto_produk` varchar(255) NOT NULL,
  PRIMARY KEY (`id_produk`),
  KEY `id_user` (`id_user`),
  KEY `fk_kategori_id` (`id_kategori`),
  CONSTRAINT `fk_kategori_id` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `produk_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produk`
--

LOCK TABLES `produk` WRITE;
/*!40000 ALTER TABLE `produk` DISABLE KEYS */;
INSERT INTO `produk` VALUES (1,2,3,'jagung',20000.00,2,'Lorem ipsum dolor sit amet consectetur adipiscing elit dignissim, a pellentesque odio luctus parturient tellus nulla enim pharetra, morbi facilisis cum netus hac velit himenaeos.','2024-12-05','1732882508237.png'),(2,1,2,'Fetilizer Spreader',56000.00,10,'Alat untuk membantu menyebarkan pupuk secara merata ke lahan jagung','2024-12-08','1733659505310.png');
/*!40000 ALTER TABLE `produk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id_review` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_produk` int NOT NULL,
  `rating` int NOT NULL,
  `koment` text NOT NULL,
  `tgl_masuk` date NOT NULL,
  PRIMARY KEY (`id_review`),
  KEY `id_user` (`id_user`),
  KEY `id_produk` (`id_produk`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,4,1,5,'bagus','2024-12-02');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `riwayat_transaksi`
--

DROP TABLE IF EXISTS `riwayat_transaksi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `riwayat_transaksi` (
  `id_rt` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_pengiriman` int NOT NULL,
  `id_memesan` int NOT NULL,
  `metode_pembayaran` varchar(255) NOT NULL,
  PRIMARY KEY (`id_rt`),
  KEY `id_user` (`id_user`),
  KEY `id_memesan` (`id_memesan`),
  KEY `id_pengiriman` (`id_pengiriman`),
  CONSTRAINT `riwayat_transaksi_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  CONSTRAINT `riwayat_transaksi_ibfk_2` FOREIGN KEY (`id_memesan`) REFERENCES `memesan` (`id_memesan`),
  CONSTRAINT `riwayat_transaksi_ibfk_3` FOREIGN KEY (`id_pengiriman`) REFERENCES `pengiriman` (`id_pengiriman`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `riwayat_transaksi`
--

LOCK TABLES `riwayat_transaksi` WRITE;
/*!40000 ALTER TABLE `riwayat_transaksi` DISABLE KEYS */;
/*!40000 ALTER TABLE `riwayat_transaksi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sawah`
--

DROP TABLE IF EXISTS `sawah`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sawah` (
  `id_sawah` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `luas` decimal(10,2) NOT NULL,
  `foto_lokasi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_sawah`),
  KEY `sawah_ibfk_1` (`id_user`),
  CONSTRAINT `sawah_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sawah`
--

LOCK TABLES `sawah` WRITE;
/*!40000 ALTER TABLE `sawah` DISABLE KEYS */;
INSERT INTO `sawah` VALUES (1,1,'banjarmasin',2.50,'1733430109098.jpg'),(2,1,'surabaya',2.50,'1733430109098.jpg');
/*!40000 ALTER TABLE `sawah` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `no_hp` varchar(255) NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `katasandi` varchar(255) NOT NULL,
  `role` enum('petani','pembeli','ahli','admin','tengkulak') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pembeli',
  `foto` varchar(255) DEFAULT NULL,
  `provinsi` varchar(255) DEFAULT NULL,
  `kota` varchar(255) DEFAULT NULL,
  `kodepos` char(5) DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','08123451729','jkdjafhaf','admin@gmail.com','$2b$10$Uvec4ij9UVml253O/p6vCurQuodZoqPQwIqi7ORRl9j.Fh2XZJjni','admin','','Jawa Timur','Kota Surabaya','12345'),(2,'petani','08223451729','jkdjafhaf','petani@gmail.com','$2b$10$5ts4468GrOIF6.QxU7HofOQmeQBhH2BT8/mweeIYKhqemoe1rg9mS','petani','',NULL,NULL,NULL),(3,'ahli','08323451729','jkdjafhaf','ahli@gmail.com','$2b$10$Y4SuY6JS/nYNu1nZmYR80OmNBB20wbNjCeNNw1SYcfz6o9hNmHQrG','ahli','',NULL,NULL,NULL),(4,'pembeli','08423451729','jkdjafhaf','pembeli@gmail.com','$2b$10$2VDzjRCJs9d7GHMLF/jNyOL.u3I67mkFimKUn4MyUJSSPbHhzUDw.','pembeli','',NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'agrisynergy'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-15 22:20:39
