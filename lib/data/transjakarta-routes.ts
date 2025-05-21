// @ts-nocheck
import { Graph, Node, Edge, calculateDistance } from "@/lib/utils";

// Comprehensive TransJakarta stations data for Jabodetabek area
// In a real application, this would be fetched from an API or database
const stations: Node[] = [
  // Corridor 1: Blok M - Kota
  {
    id: "1",
    name: "Blok M",
    latitude: -6.2445,
    longitude: 106.7982,
    corridor: "1",
    stationType: "terminal",
    address: "Jl. Melawai, Blok M, Jakarta Selatan",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "2",
    name: "Masjid Agung",
    latitude: -6.2402,
    longitude: 106.7975,
    corridor: "1",
    stationType: "regular",
    address: "Jl. Sisingamangaraja, Jakarta Selatan",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "3",
    name: "Bundaran Senayan",
    latitude: -6.2273,
    longitude: 106.8027,
    corridor: "1",
    stationType: "interchange",
    address: "Jl. Jenderal Sudirman, Senayan, Jakarta Selatan",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "4",
    name: "Gelora Bung Karno",
    latitude: -6.218,
    longitude: 106.8023,
    corridor: "1",
    stationType: "interchange",
    address: "Jl. Jenderal Sudirman, Senayan, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "5",
    name: "Dukuh Atas",
    latitude: -6.2008,
    longitude: 106.8229,
    corridor: "1",
    stationType: "interchange",
    address: "Jl. Jenderal Sudirman, Dukuh Atas, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth", "elevator"],
    isActive: true,
  },
  {
    id: "6",
    name: "Sarinah",
    latitude: -6.1873,
    longitude: 106.8242,
    corridor: "1",
    stationType: "regular",
    address: "Jl. M.H. Thamrin, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "7",
    name: "Monas",
    latitude: -6.1751,
    longitude: 106.8272,
    corridor: "1",
    stationType: "interchange",
    address: "Jl. Medan Merdeka Barat, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "8",
    name: "Harmoni",
    latitude: -6.1658,
    longitude: 106.8159,
    corridor: "1",
    stationType: "interchange",
    address: "Jl. Gajah Mada, Harmoni, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth", "elevator"],
    isActive: true,
  },
  {
    id: "9",
    name: "Sawah Besar",
    latitude: -6.1608,
    longitude: 106.8274,
    corridor: "1",
    stationType: "regular",
    address: "Jl. Sawah Besar, Jakarta Pusat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "10",
    name: "Mangga Besar",
    latitude: -6.1494,
    longitude: 106.8261,
    corridor: "1",
    stationType: "regular",
    address: "Jl. Mangga Besar, Jakarta Barat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "11",
    name: "Olimo",
    latitude: -6.1399,
    longitude: 106.8223,
    corridor: "1",
    stationType: "regular",
    address: "Jl. Hayam Wuruk, Jakarta Barat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "12",
    name: "Glodok",
    latitude: -6.1455,
    longitude: 106.8185,
    corridor: "1",
    stationType: "regular",
    address: "Jl. Hayam Wuruk, Glodok, Jakarta Barat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "13",
    name: "Kota",
    latitude: -6.1375,
    longitude: 106.8129,
    corridor: "1",
    stationType: "terminal",
    address: "Jl. Lada, Kota Tua, Jakarta Barat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },

  // Corridor 2: Pulogadung - Harmoni
  {
    id: "14",
    name: "Pulogadung",
    latitude: -6.1841,
    longitude: 106.8993,
    corridor: "2",
    stationType: "terminal",
    address: "Terminal Pulogadung, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth", "elevator"],
    isActive: true,
  },
  {
    id: "15",
    name: "Bermis",
    latitude: -6.1839,
    longitude: 106.8889,
    corridor: "2",
    stationType: "regular",
    address: "Jl. Perintis Kemerdekaan, Jakarta Timur",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "16",
    name: "Pulomas",
    latitude: -6.1844,
    longitude: 106.8778,
    corridor: "2",
    stationType: "regular",
    address: "Jl. Perintis Kemerdekaan, Pulomas, Jakarta Timur",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "17",
    name: "Asmi",
    latitude: -6.185,
    longitude: 106.8667,
    corridor: "2",
    stationType: "regular",
    address: "Jl. Pemuda, Jakarta Timur",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "18",
    name: "Pramuka",
    latitude: -6.1856,
    longitude: 106.8556,
    corridor: "2",
    stationType: "interchange",
    address: "Jl. Pramuka, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "19",
    name: "Utan Kayu",
    latitude: -6.1861,
    longitude: 106.8444,
    corridor: "2",
    stationType: "regular",
    address: "Jl. Utan Kayu, Jakarta Timur",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "20",
    name: "Pasar Genjing",
    latitude: -6.1867,
    longitude: 106.8333,
    corridor: "2",
    stationType: "regular",
    address: "Jl. Kramat Raya, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "21",
    name: "Matraman",
    latitude: -6.1872,
    longitude: 106.8222,
    corridor: "2",
    stationType: "interchange",
    address: "Jl. Matraman Raya, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "22",
    name: "Salemba",
    latitude: -6.1878,
    longitude: 106.8111,
    corridor: "2",
    stationType: "regular",
    address: "Jl. Salemba Raya, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "23",
    name: "Senen",
    latitude: -6.1767,
    longitude: 106.8417,
    corridor: "2",
    stationType: "interchange",
    address: "Jl. Senen Raya, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "24",
    name: "Budi Utomo",
    latitude: -6.1711,
    longitude: 106.8288,
    corridor: "2",
    stationType: "regular",
    address: "Jl. Budi Utomo, Jakarta Pusat",
    facilities: ["waiting room"],
    isActive: true,
  },

  // Corridor 3: Kalideres - Pasar Baru
  {
    id: "25",
    name: "Kalideres",
    latitude: -6.1581,
    longitude: 106.7031,
    corridor: "3",
    stationType: "terminal",
    address: "Terminal Kalideres, Jakarta Barat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "26",
    name: "Pesakih",
    latitude: -6.1592,
    longitude: 106.7142,
    corridor: "3",
    stationType: "regular",
    address: "Jl. Daan Mogot, Jakarta Barat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "27",
    name: "Sumur Bor",
    latitude: -6.1603,
    longitude: 106.7253,
    corridor: "3",
    stationType: "regular",
    address: "Jl. Daan Mogot, Jakarta Barat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "28",
    name: "Rawa Buaya",
    latitude: -6.1614,
    longitude: 106.7364,
    corridor: "3",
    stationType: "regular",
    address: "Jl. Daan Mogot, Rawa Buaya, Jakarta Barat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "29",
    name: "Jembatan Gantung",
    latitude: -6.1625,
    longitude: 106.7475,
    corridor: "3",
    stationType: "regular",
    address: "Jl. Daan Mogot, Jakarta Barat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "30",
    name: "Dispenda",
    latitude: -6.1636,
    longitude: 106.7586,
    corridor: "3",
    stationType: "regular",
    address: "Jl. Daan Mogot, Jakarta Barat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "31",
    name: "Taman Kota",
    latitude: -6.1647,
    longitude: 106.7697,
    corridor: "3",
    stationType: "regular",
    address: "Jl. Daan Mogot, Jakarta Barat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "32",
    name: "Indosiar",
    latitude: -6.1658,
    longitude: 106.7808,
    corridor: "3",
    stationType: "regular",
    address: "Jl. Daan Mogot, Jakarta Barat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "33",
    name: "Jelambar",
    latitude: -6.1669,
    longitude: 106.7919,
    corridor: "3",
    stationType: "regular",
    address: "Jl. Daan Mogot, Jelambar, Jakarta Barat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "34",
    name: "Grogol",
    latitude: -6.1681,
    longitude: 106.8031,
    corridor: "3",
    stationType: "interchange",
    address: "Jl. S. Parman, Grogol, Jakarta Barat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "35",
    name: "RS Sumber Waras",
    latitude: -6.1692,
    longitude: 106.8142,
    corridor: "3",
    stationType: "regular",
    address: "Jl. Kyai Tapa, Jakarta Barat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },

  // Corridor 4: Pulogadung - Dukuh Atas
  {
    id: "36",
    name: "Cempaka Timur",
    latitude: -6.1839,
    longitude: 106.8778,
    corridor: "4",
    stationType: "regular",
    address: "Jl. Cempaka Putih Timur, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "37",
    name: "Cempaka Tengah",
    latitude: -6.1844,
    longitude: 106.8667,
    corridor: "4",
    stationType: "regular",
    address: "Jl. Cempaka Putih Tengah, Jakarta Pusat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "38",
    name: "Cempaka Barat",
    latitude: -6.185,
    longitude: 106.8556,
    corridor: "4",
    stationType: "regular",
    address: "Jl. Cempaka Putih Barat, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "39",
    name: "Pasar Cempaka Putih",
    latitude: -6.1856,
    longitude: 106.8444,
    corridor: "4",
    stationType: "interchange",
    address: "Jl. Cempaka Putih Raya, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "40",
    name: "RS Islam",
    latitude: -6.1861,
    longitude: 106.8333,
    corridor: "4",
    stationType: "regular",
    address: "Jl. Cempaka Putih Raya, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "41",
    name: "Kramat Sentiong",
    latitude: -6.1867,
    longitude: 106.8222,
    corridor: "4",
    stationType: "regular",
    address: "Jl. Kramat Raya, Jakarta Pusat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "42",
    name: "Pal Putih",
    latitude: -6.1872,
    longitude: 106.8111,
    corridor: "4",
    stationType: "regular",
    address: "Jl. Kramat Raya, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "43",
    name: "Budi Kemuliaan",
    latitude: -6.1878,
    longitude: 106.8,
    corridor: "4",
    stationType: "regular",
    address: "Jl. Budi Kemuliaan, Jakarta Pusat",
    facilities: ["waiting room"],
    isActive: true,
  },

  // Corridor 5: Ancol - Kampung Melayu
  {
    id: "44",
    name: "Ancol",
    latitude: -6.1264,
    longitude: 106.8306,
    corridor: "5",
    stationType: "terminal",
    address: "Jl. Lodan Raya, Ancol, Jakarta Utara",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "45",
    name: "Pademangan",
    latitude: -6.1339,
    longitude: 106.8319,
    corridor: "5",
    stationType: "regular",
    address: "Jl. Pademangan Raya, Jakarta Utara",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "46",
    name: "Gunung Sahari",
    latitude: -6.1414,
    longitude: 106.8333,
    corridor: "5",
    stationType: "regular",
    address: "Jl. Gunung Sahari, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "47",
    name: "Mangga Dua",
    latitude: -6.1489,
    longitude: 106.8347,
    corridor: "5",
    stationType: "interchange",
    address: "Jl. Mangga Dua Raya, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "48",
    name: "Pasar Baru",
    latitude: -6.1564,
    longitude: 106.8361,
    corridor: "5",
    stationType: "regular",
    address: "Jl. Pasar Baru, Jakarta Pusat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "49",
    name: "Budi Utomo",
    latitude: -6.1639,
    longitude: 106.8375,
    corridor: "5",
    stationType: "regular",
    address: "Jl. Budi Utomo, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "50",
    name: "Senen",
    latitude: -6.1714,
    longitude: 106.8389,
    corridor: "5",
    stationType: "interchange",
    address: "Jl. Senen Raya, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "51",
    name: "Atrium",
    latitude: -6.1789,
    longitude: 106.8403,
    corridor: "5",
    stationType: "regular",
    address: "Jl. Senen Raya, Jakarta Pusat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "52",
    name: "Kwitang",
    latitude: -6.1864,
    longitude: 106.8417,
    corridor: "5",
    stationType: "regular",
    address: "Jl. Kwitang, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "53",
    name: "Pasar Senen",
    latitude: -6.1939,
    longitude: 106.8431,
    corridor: "5",
    stationType: "interchange",
    address: "Jl. Kramat Raya, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },

  // Corridor 6: Dukuh Atas - Ragunan
  {
    id: "54",
    name: "Dukuh Atas 2",
    latitude: -6.2008,
    longitude: 106.8229,
    corridor: "6",
    stationType: "interchange",
    address: "Jl. Jenderal Sudirman, Dukuh Atas, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth", "elevator"],
    isActive: true,
  },
  {
    id: "55",
    name: "Setiabudi Utara",
    latitude: -6.2083,
    longitude: 106.8308,
    corridor: "6",
    stationType: "regular",
    address: "Jl. H.R. Rasuna Said, Jakarta Selatan",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "56",
    name: "Kuningan Madya",
    latitude: -6.2158,
    longitude: 106.8317,
    corridor: "6",
    stationType: "regular",
    address: "Jl. H.R. Rasuna Said, Kuningan, Jakarta Selatan",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "57",
    name: "Karet Kuningan",
    latitude: -6.2233,
    longitude: 106.8325,
    corridor: "6",
    stationType: "regular",
    address: "Jl. H.R. Rasuna Said, Kuningan, Jakarta Selatan",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "58",
    name: "Kuningan Timur",
    latitude: -6.2308,
    longitude: 106.8333,
    corridor: "6",
    stationType: "interchange",
    address: "Jl. H.R. Rasuna Said, Kuningan, Jakarta Selatan",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "59",
    name: "Patra Kuningan",
    latitude: -6.2383,
    longitude: 106.8342,
    corridor: "6",
    stationType: "regular",
    address: "Jl. Gatot Subroto, Jakarta Selatan",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "60",
    name: "Dept. Kesehatan",
    latitude: -6.2458,
    longitude: 106.835,
    corridor: "6",
    stationType: "regular",
    address: "Jl. H.R. Rasuna Said, Jakarta Selatan",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "61",
    name: "GOR Sumantri",
    latitude: -6.2533,
    longitude: 106.8358,
    corridor: "6",
    stationType: "regular",
    address: "Jl. Prof. Dr. Soepomo, Jakarta Selatan",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "62",
    name: "Ragunan",
    latitude: -6.2608,
    longitude: 106.8367,
    corridor: "6",
    stationType: "terminal",
    address: "Jl. Harsono RM, Ragunan, Jakarta Selatan",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },

  // Corridor 7: Kampung Melayu - Kampung Rambutan
  {
    id: "63",
    name: "Kampung Melayu",
    latitude: -6.2147,
    longitude: 106.8656,
    corridor: "7",
    stationType: "interchange",
    address: "Jl. Jatinegara Barat, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth", "elevator"],
    isActive: true,
  },
  {
    id: "64",
    name: "Bidara Cina",
    latitude: -6.2222,
    longitude: 106.8664,
    corridor: "7",
    stationType: "regular",
    address: "Jl. DI Panjaitan, Jakarta Timur",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "65",
    name: "Cawang Ciliwung",
    latitude: -6.2297,
    longitude: 106.8672,
    corridor: "7",
    stationType: "interchange",
    address: "Jl. DI Panjaitan, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "66",
    name: "Cawang UKI",
    latitude: -6.2372,
    longitude: 106.868,
    corridor: "7",
    stationType: "interchange",
    address: "Jl. Mayjen Sutoyo, Cawang, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "67",
    name: "PGC",
    latitude: -6.2447,
    longitude: 106.8689,
    corridor: "7",
    stationType: "interchange",
    address: "Jl. Mayjen Sutoyo, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "68",
    name: "BKN",
    latitude: -6.2522,
    longitude: 106.8697,
    corridor: "7",
    stationType: "regular",
    address: "Jl. Mayjen Sutoyo, Jakarta Timur",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "69",
    name: "Kampung Rambutan",
    latitude: -6.2597,
    longitude: 106.8706,
    corridor: "7",
    stationType: "terminal",
    address: "Terminal Kampung Rambutan, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth", "elevator"],
    isActive: true,
  },

  // Corridor 8: Lebak Bulus - Harmoni
  {
    id: "70",
    name: "Lebak Bulus",
    latitude: -6.2894,
    longitude: 106.7742,
    corridor: "8",
    stationType: "terminal",
    address: "Jl. Lebak Bulus Raya, Jakarta Selatan",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "71",
    name: "Pondok Pinang",
    latitude: -6.2819,
    longitude: 106.775,
    corridor: "8",
    stationType: "regular",
    address: "Jl. Sultan Iskandar Muda, Jakarta Selatan",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "72",
    name: "Pondok Indah 1",
    latitude: -6.2744,
    longitude: 106.7758,
    corridor: "8",
    stationType: "regular",
    address: "Jl. Metro Pondok Indah, Jakarta Selatan",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "73",
    name: "Pondok Indah 2",
    latitude: -6.2669,
    longitude: 106.7767,
    corridor: "8",
    stationType: "regular",
    address: "Jl. Metro Pondok Indah, Jakarta Selatan",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "74",
    name: "Permata Hijau",
    latitude: -6.2594,
    longitude: 106.7775,
    corridor: "8",
    stationType: "regular",
    address: "Jl. Permata Hijau, Jakarta Selatan",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "75",
    name: "Simprug",
    latitude: -6.2519,
    longitude: 106.7783,
    corridor: "8",
    stationType: "regular",
    address: "Jl. Simprug Raya, Jakarta Selatan",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "76",
    name: "Semanggi",
    latitude: -6.2444,
    longitude: 106.7792,
    corridor: "8",
    stationType: "interchange",
    address: "Jl. Jenderal Sudirman, Semanggi, Jakarta Selatan",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "77",
    name: "Senayan JCC",
    latitude: -6.2369,
    longitude: 106.78,
    corridor: "8",
    stationType: "regular",
    address: "Jl. Jenderal Sudirman, Senayan, Jakarta Selatan",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "78",
    name: "Gelora Bung Karno",
    latitude: -6.2294,
    longitude: 106.7808,
    corridor: "8",
    stationType: "interchange",
    address: "Jl. Jenderal Sudirman, Senayan, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "79",
    name: "Bundaran Senayan",
    latitude: -6.2219,
    longitude: 106.7817,
    corridor: "8",
    stationType: "interchange",
    address: "Jl. Jenderal Sudirman, Senayan, Jakarta Selatan",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "80",
    name: "Polda Metro Jaya",
    latitude: -6.2144,
    longitude: 106.7825,
    corridor: "8",
    stationType: "regular",
    address: "Jl. Jenderal Sudirman, Jakarta Selatan",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },

  // Corridor 9: Pinang Ranti - Pluit
  {
    id: "81",
    name: "Pinang Ranti",
    latitude: -6.2811,
    longitude: 106.8931,
    corridor: "9",
    stationType: "terminal",
    address: "Jl. Pinang Ranti, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "82",
    name: "Garuda Taman Mini",
    latitude: -6.2736,
    longitude: 106.8939,
    corridor: "9",
    stationType: "regular",
    address: "Jl. Taman Mini Raya, Jakarta Timur",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "83",
    name: "Cawang UKI",
    latitude: -6.2661,
    longitude: 106.8947,
    corridor: "9",
    stationType: "interchange",
    address: "Jl. Mayjen Sutoyo, Cawang, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "84",
    name: "PGC 2",
    latitude: -6.2586,
    longitude: 106.8956,
    corridor: "9",
    stationType: "interchange",
    address: "Jl. Mayjen Sutoyo, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "85",
    name: "Cawang BKN",
    latitude: -6.2511,
    longitude: 106.8964,
    corridor: "9",
    stationType: "regular",
    address: "Jl. Mayjen Sutoyo, Jakarta Timur",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "86",
    name: "Cawang Sutoyo",
    latitude: -6.2436,
    longitude: 106.8972,
    corridor: "9",
    stationType: "regular",
    address: "Jl. Mayjen Sutoyo, Jakarta Timur",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "87",
    name: "Cawang Ciliwung",
    latitude: -6.2361,
    longitude: 106.8981,
    corridor: "9",
    stationType: "interchange",
    address: "Jl. DI Panjaitan, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "88",
    name: "Bidara Cina",
    latitude: -6.2286,
    longitude: 106.8989,
    corridor: "9",
    stationType: "regular",
    address: "Jl. DI Panjaitan, Jakarta Timur",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "89",
    name: "Kampung Melayu",
    latitude: -6.2211,
    longitude: 106.8997,
    corridor: "9",
    stationType: "interchange",
    address: "Jl. Jatinegara Barat, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth", "elevator"],
    isActive: true,
  },

  // Corridor 10: Tanjung Priok - PGC
  {
    id: "90",
    name: "Tanjung Priok",
    latitude: -6.1089,
    longitude: 106.8756,
    corridor: "10",
    stationType: "terminal",
    address: "Jl. Enggano, Tanjung Priok, Jakarta Utara",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "91",
    name: "Enggano",
    latitude: -6.1164,
    longitude: 106.8764,
    corridor: "10",
    stationType: "regular",
    address: "Jl. Enggano, Jakarta Utara",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "92",
    name: "Koja",
    latitude: -6.1239,
    longitude: 106.8772,
    corridor: "10",
    stationType: "regular",
    address: "Jl. Yos Sudarso, Koja, Jakarta Utara",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "93",
    name: "Walikota Jakarta Utara",
    latitude: -6.1314,
    longitude: 106.8781,
    corridor: "10",
    stationType: "regular",
    address: "Jl. Yos Sudarso, Jakarta Utara",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "94",
    name: "Plumpang Pertamina",
    latitude: -6.1389,
    longitude: 106.8789,
    corridor: "10",
    stationType: "regular",
    address: "Jl. Yos Sudarso, Plumpang, Jakarta Utara",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "95",
    name: "Sunter Kelapa Gading",
    latitude: -6.1464,
    longitude: 106.8797,
    corridor: "10",
    stationType: "interchange",
    address: "Jl. Yos Sudarso, Sunter, Jakarta Utara",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "96",
    name: "Yos Sudarso Kodamar",
    latitude: -6.1539,
    longitude: 106.8806,
    corridor: "10",
    stationType: "regular",
    address: "Jl. Yos Sudarso, Jakarta Utara",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "97",
    name: "Cempaka Mas",
    latitude: -6.1614,
    longitude: 106.8814,
    corridor: "10",
    stationType: "interchange",
    address: "Jl. Letjen Suprapto, Cempaka Putih, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "98",
    name: "Pulomas",
    latitude: -6.1689,
    longitude: 106.8822,
    corridor: "10",
    stationType: "regular",
    address: "Jl. Perintis Kemerdekaan, Jakarta Timur",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "99",
    name: "ASMI",
    latitude: -6.1764,
    longitude: 106.8831,
    corridor: "10",
    stationType: "regular",
    address: "Jl. Perintis Kemerdekaan, Jakarta Timur",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "100",
    name: "Pulo Gadung",
    latitude: -6.1839,
    longitude: 106.8839,
    corridor: "10",
    stationType: "terminal",
    address: "Terminal Pulogadung, Jakarta Timur",
    facilities: ["toilet", "waiting room", "ticket booth", "elevator"],
    isActive: true,
  },

  // Bekasi Area
  {
    id: "101",
    name: "Bekasi Timur",
    latitude: -6.2361,
    longitude: 107.0056,
    corridor: "B1",
    stationType: "terminal",
    address: "Jl. Raya Bekasi Timur, Bekasi",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "102",
    name: "Bekasi Barat",
    latitude: -6.2386,
    longitude: 106.9889,
    corridor: "B1",
    stationType: "interchange",
    address: "Jl. KH Noer Ali, Bekasi Barat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "103",
    name: "Summarecon Bekasi",
    latitude: -6.2258,
    longitude: 107.0011,
    corridor: "B1",
    stationType: "regular",
    address: "Jl. Boulevard Ahmad Yani, Bekasi",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "104",
    name: "Harapan Indah",
    latitude: -6.1931,
    longitude: 106.9775,
    corridor: "B1",
    stationType: "regular",
    address: "Jl. Harapan Indah, Bekasi",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "105",
    name: "Grand Galaxy",
    latitude: -6.2653,
    longitude: 106.9775,
    corridor: "B1",
    stationType: "regular",
    address: "Jl. Grand Galaxy, Bekasi Selatan",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },

  // Tangerang Area
  {
    id: "106",
    name: "Poris",
    latitude: -6.1711,
    longitude: 106.6817,
    corridor: "T1",
    stationType: "terminal",
    address: "Terminal Poris Plawad, Tangerang",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "107",
    name: "Tanah Tinggi",
    latitude: -6.1778,
    longitude: 106.6428,
    corridor: "T1",
    stationType: "regular",
    address: "Jl. Tanah Tinggi, Tangerang",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "108",
    name: "Tangerang",
    latitude: -6.1783,
    longitude: 106.6319,
    corridor: "T1",
    stationType: "terminal",
    address: "Terminal Tangerang, Tangerang",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "109",
    name: "Batu Ceper",
    latitude: -6.1711,
    longitude: 106.6567,
    corridor: "T1",
    stationType: "interchange",
    address: "Jl. Daan Mogot, Batu Ceper, Tangerang",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "110",
    name: "Karang Tengah",
    latitude: -6.2025,
    longitude: 106.7142,
    corridor: "T1",
    stationType: "regular",
    address: "Jl. Raya Karang Tengah, Tangerang",
    facilities: ["waiting room"],
    isActive: true,
  },

  // Depok Area
  {
    id: "111",
    name: "Depok",
    latitude: -6.4,
    longitude: 106.8186,
    corridor: "D1",
    stationType: "terminal",
    address: "Terminal Depok, Depok",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "112",
    name: "Margonda",
    latitude: -6.3922,
    longitude: 106.8242,
    corridor: "D1",
    stationType: "regular",
    address: "Jl. Margonda Raya, Depok",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "113",
    name: "UI",
    latitude: -6.3644,
    longitude: 106.8286,
    corridor: "D1",
    stationType: "interchange",
    address: "Universitas Indonesia, Depok",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "114",
    name: "Lenteng Agung",
    latitude: -6.3367,
    longitude: 106.8331,
    corridor: "D1",
    stationType: "regular",
    address: "Jl. Lenteng Agung, Jakarta Selatan",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "115",
    name: "Depok Baru",
    latitude: -6.3922,
    longitude: 106.8242,
    corridor: "D1",
    stationType: "regular",
    address: "Jl. Margonda Raya, Depok",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },

  // Additional Central Jakarta Stations
  {
    id: "116",
    name: "Thamrin",
    latitude: -6.1933,
    longitude: 106.8236,
    corridor: "C1",
    stationType: "interchange",
    address: "Jl. M.H. Thamrin, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "117",
    name: "Tosari ICBC",
    latitude: -6.19,
    longitude: 106.8229,
    corridor: "C1",
    stationType: "regular",
    address: "Jl. Jenderal Sudirman, Jakarta Pusat",
    facilities: ["waiting room", "ticket booth"],
    isActive: true,
  },
  {
    id: "118",
    name: "Bundaran HI",
    latitude: -6.195,
    longitude: 106.823,
    corridor: "C1",
    stationType: "interchange",
    address: "Bundaran Hotel Indonesia, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth", "elevator"],
    isActive: true,
  },
  {
    id: "119",
    name: "Kebon Sirih",
    latitude: -6.1825,
    longitude: 106.8308,
    corridor: "C1",
    stationType: "regular",
    address: "Jl. Kebon Sirih, Jakarta Pusat",
    facilities: ["waiting room"],
    isActive: true,
  },
  {
    id: "120",
    name: "Juanda",
    latitude: -6.1667,
    longitude: 106.83,
    corridor: "C1",
    stationType: "interchange",
    address: "Jl. Ir. H. Juanda, Jakarta Pusat",
    facilities: ["toilet", "waiting room", "ticket booth"],
    isActive: true,
  },
];

// Create edges between stations
// In a real app, you would have actual route connections and measured times
function generateEdges(): Edge[] {
  const edges: Edge[] = [];

  // Helper function to connect stations in sequence
  function connectCorridorStations(
    stationIds: string[],
    corridorNumber: string
  ) {
    for (let i = 0; i < stationIds.length - 1; i++) {
      edges.push(createEdge(stationIds[i], stationIds[i + 1], corridorNumber));
    }
  }

  // Corridor 1: Blok M to Kota (stations 1-13)
  connectCorridorStations(
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
    "1"
  );

  // Corridor 2: Pulogadung to Harmoni (stations 14-24)
  connectCorridorStations(
    ["14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "8"],
    "2"
  );

  // Corridor 3: Kalideres to Pasar Baru (stations 25-35)
  connectCorridorStations(
    ["25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "8"],
    "3"
  );

  // Corridor 4: Pulogadung to Dukuh Atas (stations 36-43)
  connectCorridorStations(
    ["14", "36", "37", "38", "39", "40", "41", "42", "43", "5"],
    "4"
  );

  // Corridor 5: Ancol to Kampung Melayu (stations 44-53)
  connectCorridorStations(
    ["44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "63"],
    "5"
  );

  // Corridor 6: Dukuh Atas to Ragunan (stations 54-62)
  connectCorridorStations(
    ["54", "55", "56", "57", "58", "59", "60", "61", "62"],
    "6"
  );
  // Connect Dukuh Atas to Dukuh Atas 2
  edges.push(createEdge("5", "54", "6"));

  // Corridor 7: Kampung Melayu to Kampung Rambutan (stations 63-69)
  connectCorridorStations(["63", "64", "65", "66", "67", "68", "69"], "7");

  // Corridor 8: Lebak Bulus to Harmoni (stations 70-80)
  connectCorridorStations(
    ["70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "8"],
    "8"
  );

  // Corridor 9: Pinang Ranti to Pluit (stations 81-89)
  connectCorridorStations(
    ["81", "82", "83", "84", "85", "86", "87", "88", "89"],
    "9"
  );

  // Corridor 10: Tanjung Priok to PGC (stations 90-100)
  connectCorridorStations(
    ["90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100"],
    "10"
  );

  // Connect Bekasi Area (stations 101-105) - Feeder Route B1
  connectCorridorStations(["101", "102", "103", "104"], "B1");
  edges.push(createEdge("102", "105", "B1"));
  // Connect Bekasi to Jakarta
  edges.push(createEdge("102", "100", "B1")); // Bekasi Barat to Pulo Gadung

  // Connect Tangerang Area (stations 106-110) - Feeder Route T1
  connectCorridorStations(["106", "107", "108"], "T1");
  edges.push(createEdge("106", "109", "T1"));
  edges.push(createEdge("109", "110", "T1"));
  // Connect Tangerang to Jakarta
  edges.push(createEdge("106", "25", "T1")); // Poris to Kalideres

  // Connect Depok Area (stations 111-115) - Feeder Route D1
  connectCorridorStations(["111", "112", "113", "114"], "D1");
  edges.push(createEdge("111", "115", "D1"));
  // Connect Depok to Jakarta
  edges.push(createEdge("113", "19", "D1")); // UI to Cawang

  // Connect Additional Central Jakarta Stations (stations 116-120) - Central Route C1
  connectCorridorStations(["116", "117", "118", "119", "120"], "C1");
  // Connect to main corridors
  edges.push(createEdge("5", "116", "C1")); // Dukuh Atas to Thamrin
  edges.push(createEdge("7", "120", "C1")); // Monas to Juanda

  // Add some cross-corridor connections for better connectivity
  // Connect major interchange stations with appropriate corridor information
  edges.push(createEdge("5", "54", "6")); // Dukuh Atas to Dukuh Atas 2 (Corridor 6)
  edges.push(createEdge("7", "116", "C1")); // Monas to Thamrin (Central Route)
  edges.push(createEdge("8", "120", "C1")); // Harmoni to Juanda (Central Route)
  edges.push(createEdge("63", "89", "7")); // Kampung Melayu connections (Corridor 7)
  edges.push(createEdge("66", "83", "7")); // Cawang UKI connections (Corridor 7)
  edges.push(createEdge("67", "84", "7")); // PGC connections (Corridor 7)
  edges.push(createEdge("4", "78", "8")); // Gelora Bung Karno connections (Corridor 8)
  edges.push(createEdge("3", "79", "8")); // Bundaran Senayan connections (Corridor 8)

  // Make connections bidirectional
  const bidirectionalEdges = [...edges];
  edges.forEach((edge) => {
    bidirectionalEdges.push({
      source: edge.target,
      target: edge.source,
      weight: edge.weight,
      distance: edge.distance,
      corridor: edge.corridor,
      color: edge.color,
      routeNumber: edge.routeNumber,
      isActive: edge.isActive,
    });
  });

  return bidirectionalEdges;
}

// Helper function to create an edge with calculated distance and estimated travel time
function createEdge(
  sourceId: string,
  targetId: string,
  corridorOverride?: string
): Edge {
  const sourceNode = stations.find((node) => node.id === sourceId)!;
  const targetNode = stations.find((node) => node.id === targetId)!;

  const distance = calculateDistance(
    sourceNode.latitude,
    sourceNode.longitude,
    targetNode.latitude,
    targetNode.longitude
  );

  // Estimate travel time: assume 2 minutes per km + 1 minute for station stop
  const weight = Math.round(distance * 2) + 1;

  // Determine corridor - use override if provided, otherwise use source node's corridor
  const corridor =
    corridorOverride || sourceNode.corridor || targetNode.corridor;

  // Define corridor colors
  const corridorColors: Record<string, string> = {
    "1": "#d32f2f", // Red
    "2": "#1976d2", // Blue
    "3": "#388e3c", // Green
    "4": "#ffa000", // Amber
    "5": "#7b1fa2", // Purple
    "6": "#c2185b", // Pink
    "7": "#0097a7", // Cyan
    "8": "#f57c00", // Orange
    "9": "#5d4037", // Brown
    "10": "#455a64", // Blue Grey
  };

  return {
    source: sourceId,
    target: targetId,
    weight,
    distance,
    corridor,
    color: corridor ? corridorColors[corridor] : "#757575", // Grey if no corridor
    isActive: true,
  };
}

// Create the TransJakarta network graph
export const transjakartaGraph: Graph = {
  nodes: stations,
  edges: generateEdges(),
};

// Get node by ID
export function getNodeById(id: string): Node | undefined {
  return stations.find((node) => node.id === id);
}

// Get all stations
export function getAllStations(): Node[] {
  return stations;
}
