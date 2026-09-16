export type RiskLevel =
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "VERY HIGH"
  | "CRITICAL";

export interface RiskData {
  location: string;
  region?: string;

  latitude: number;
  longitude: number;

  riskLevel: RiskLevel;

  riskProbability?: number;
  probability?: number;

  rainfall24h: number;
  rainfall7d?: number;

  primaryDriver: string;

  soilMoisture?: number;
  elevation?: number;
  slope?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;

  rainfall?: {
    oneHour: number;
    sixHour: number;
    twentyFourHour: number;
    sevenDay: number;
  };

  terrain?: {
    elevation: number;
    slope: number;
    soilType: string;
  };

  deformation?: {
    current: number;
    velocity: number;
    trend: string;
  };

  weather?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
  };

  lastUpdated?: string;

  trend?: "increasing" | "stable" | "decreasing";
}

/* =====================================================
   LOCATION INTERFACE
===================================================== */

export interface Location {
  name: string;
  region: string;
}

/* =====================================================
   ALL LOCATIONS
===================================================== */

const locationNames: string[] = [
  // Arunachal Pradesh
  "Itanagar",
  "Tawang",
  "Bomdila",
  "Dirang",
  "Ziro",
  "Pasighat",
  "Roing",
  "Anini",
  "Aalo",
  "Tezu",
  "Namsai",
  "Changlang",
  "Seppa",
  "Yingkiong",
  "Daporijo",
  "Mechuka",
  "Naharlagun",
  "Bhalukpong",
  "Khonsa",

  // Assam
  "Guwahati",
  "Dispur",
  "Dibrugarh",
  "Silchar",
  "Jorhat",
  "Tezpur",
  "Dhemaji",
  "Tinsukia",
  "North Lakhimpur",
  "Haflong",
  "Diphu",
  "Sivasagar",
  "Nagaon",
  "Barpeta",
  "Bongaigaon",
  "Goalpara",
  "Kokrajhar",
  "Dhubri",
  "Golaghat",
  "Karimganj",
  "Hailakandi",
  "Hojai",
  "Digboi",
  "Duliajan",
  "Margherita",
  "Rangia",
  "Nalbari",

  // Meghalaya
  "Shillong",
  "Cherrapunji",
  "Sohra",
  "Mawsynram",
  "Tura",
  "Jowai",
  "Nongpoh",
  "Nongstoin",
  "Williamnagar",
  "Dawki",
  "Mairang",
  "Khliehriat",
  "Baghmara",
  "Ampati",
  "Mawlynnong",
  "Resubelpara",

  // Manipur
  "Imphal",
  "Churachandpur",
  "Ukhrul",
  "Senapati",
  "Tamenglong",
  "Chandel",
  "Moreh",
  "Jiribam",
  "Thoubal",
  "Bishnupur",
  "Kakching",
  "Kangpokpi",
  "Noney",
  "Tengnoupal",
  "Kamjong",

  // Mizoram
  "Aizawl",
  "Lunglei",
  "Champhai",
  "Serchhip",
  "Kolasib",
  "Saiha",
  "Lawngtlai",
  "Mamit",
  "Khawzawl",
  "Hnahthial",
  "Saitual",
  "Thenzawl",
  "Vairengte",

  // Nagaland
  "Kohima",
  "Dimapur",
  "Mokokchung",
  "Mon",
  "Wokha",
  "Tuensang",
  "Phek",
  "Zunheboto",
  "Kiphire",
  "Longleng",
  "Peren",
  "Chumoukedima",
  "Niuland",
  "Tseminyu",
  "Pfutsero",
  "Medziphema",

  // Sikkim
  "Gangtok",
  "Namchi",
  "Pelling",
  "Mangan",
  "Ravangla",
  "Lachung",
  "Lachen",
  "Yuksom",
  "Gyalshing",
  "Singtam",
  "Rangpo",
  "Jorethang",
  "Soreng",

  // Tripura
  "Agartala",
  "Dharmanagar",
  "Udaipur",
  "Kailashahar",
  "Ambassa",
  "Sabroom",
  "Belonia",
  "Khowai",
  "Teliamura",
  "Kumarghat",
  "Santirbazar",
  "Bishalgarh",
  "Sonamura",
  "Melaghar",
  "Amarpur",

  // Existing Himalayan locations
  "Mussoorie",
  "Shimla",
  "Darjeeling",
  "Dehradun",
  "Kullu",
];

/* =====================================================
   COORDINATES
===================================================== */

export const locationCoordinates: Record<
  string,
  {
    latitude: number;
    longitude: number;
    region: string;
  }
> = {
  // Arunachal Pradesh
  Itanagar: {
    latitude: 27.0844,
    longitude: 93.6053,
    region: "Arunachal Pradesh",
  },

  Tawang: {
    latitude: 27.586,
    longitude: 91.865,
    region: "Arunachal Pradesh",
  },

  Bomdila: {
    latitude: 27.264,
    longitude: 92.424,
    region: "Arunachal Pradesh",
  },

  Dirang: {
    latitude: 27.358,
    longitude: 92.241,
    region: "Arunachal Pradesh",
  },

  Ziro: {
    latitude: 27.544,
    longitude: 93.819,
    region: "Arunachal Pradesh",
  },

  Pasighat: {
    latitude: 28.066,
    longitude: 95.326,
    region: "Arunachal Pradesh",
  },

  Roing: {
    latitude: 28.14,
    longitude: 95.84,
    region: "Arunachal Pradesh",
  },

  Anini: {
    latitude: 28.78,
    longitude: 95.9,
    region: "Arunachal Pradesh",
  },

  Aalo: {
    latitude: 28.17,
    longitude: 94.8,
    region: "Arunachal Pradesh",
  },

  Tezu: {
    latitude: 27.912,
    longitude: 96.128,
    region: "Arunachal Pradesh",
  },

  Namsai: {
    latitude: 27.67,
    longitude: 95.86,
    region: "Arunachal Pradesh",
  },

  Changlang: {
    latitude: 27.12,
    longitude: 95.74,
    region: "Arunachal Pradesh",
  },

  Seppa: {
    latitude: 27.33,
    longitude: 93.05,
    region: "Arunachal Pradesh",
  },

  Yingkiong: {
    latitude: 28.61,
    longitude: 95.04,
    region: "Arunachal Pradesh",
  },

  Daporijo: {
    latitude: 27.98,
    longitude: 94.22,
    region: "Arunachal Pradesh",
  },

  Mechuka: {
    latitude: 28.59,
    longitude: 94.13,
    region: "Arunachal Pradesh",
  },

  Naharlagun: {
    latitude: 27.104,
    longitude: 93.695,
    region: "Arunachal Pradesh",
  },

  Bhalukpong: {
    latitude: 27.01,
    longitude: 92.64,
    region: "Arunachal Pradesh",
  },

  Khonsa: {
    latitude: 27.02,
    longitude: 95.57,
    region: "Arunachal Pradesh",
  },

  // Assam
  Guwahati: {
    latitude: 26.1445,
    longitude: 91.7362,
    region: "Assam",
  },

  Dispur: {
    latitude: 26.1433,
    longitude: 91.7898,
    region: "Assam",
  },

  Dibrugarh: {
    latitude: 27.4728,
    longitude: 94.912,
    region: "Assam",
  },

  Silchar: {
    latitude: 24.8333,
    longitude: 92.7789,
    region: "Assam",
  },

  Jorhat: {
    latitude: 26.7509,
    longitude: 94.2037,
    region: "Assam",
  },

  Tezpur: {
    latitude: 26.6528,
    longitude: 92.7926,
    region: "Assam",
  },

  Dhemaji: {
    latitude: 27.48,
    longitude: 94.58,
    region: "Assam",
  },

  Tinsukia: {
    latitude: 27.49,
    longitude: 95.36,
    region: "Assam",
  },

  "North Lakhimpur": {
    latitude: 27.23,
    longitude: 94.1,
    region: "Assam",
  },

  Haflong: {
    latitude: 25.1667,
    longitude: 93.0167,
    region: "Assam",
  },

  Diphu: {
    latitude: 25.843,
    longitude: 93.431,
    region: "Assam",
  },

  Sivasagar: {
    latitude: 26.984,
    longitude: 94.637,
    region: "Assam",
  },

  Nagaon: {
    latitude: 26.35,
    longitude: 92.68,
    region: "Assam",
  },

  Barpeta: {
    latitude: 26.32,
    longitude: 91,
    region: "Assam",
  },

  Bongaigaon: {
    latitude: 26.48,
    longitude: 90.56,
    region: "Assam",
  },

  Goalpara: {
    latitude: 26.17,
    longitude: 90.63,
    region: "Assam",
  },

  Kokrajhar: {
    latitude: 26.4,
    longitude: 90.27,
    region: "Assam",
  },

  Dhubri: {
    latitude: 26.02,
    longitude: 89.98,
    region: "Assam",
  },

  Golaghat: {
    latitude: 26.52,
    longitude: 93.97,
    region: "Assam",
  },

  Karimganj: {
    latitude: 24.87,
    longitude: 92.35,
    region: "Assam",
  },

  Hailakandi: {
    latitude: 24.68,
    longitude: 92.57,
    region: "Assam",
  },

  Hojai: {
    latitude: 26,
    longitude: 92.85,
    region: "Assam",
  },

  Digboi: {
    latitude: 27.39,
    longitude: 95.62,
    region: "Assam",
  },

  Duliajan: {
    latitude: 27.35,
    longitude: 95.32,
    region: "Assam",
  },

  Margherita: {
    latitude: 27.29,
    longitude: 95.68,
    region: "Assam",
  },

  Rangia: {
    latitude: 26.45,
    longitude: 91.62,
    region: "Assam",
  },

  Nalbari: {
    latitude: 26.44,
    longitude: 91.44,
    region: "Assam",
  },

  // Meghalaya
  Shillong: {
    latitude: 25.5788,
    longitude: 91.8933,
    region: "Meghalaya",
  },

  Cherrapunji: {
    latitude: 25.27,
    longitude: 91.73,
    region: "Meghalaya",
  },

  Sohra: {
    latitude: 25.27,
    longitude: 91.73,
    region: "Meghalaya",
  },

  Mawsynram: {
    latitude: 25.298,
    longitude: 91.582,
    region: "Meghalaya",
  },

  Tura: {
    latitude: 25.514,
    longitude: 90.203,
    region: "Meghalaya",
  },

  Jowai: {
    latitude: 25.45,
    longitude: 92.2,
    region: "Meghalaya",
  },

  Nongpoh: {
    latitude: 25.9,
    longitude: 91.88,
    region: "Meghalaya",
  },

  Nongstoin: {
    latitude: 25.52,
    longitude: 91.27,
    region: "Meghalaya",
  },

  Williamnagar: {
    latitude: 25.49,
    longitude: 90.6,
    region: "Meghalaya",
  },

  Dawki: {
    latitude: 25.19,
    longitude: 92.02,
    region: "Meghalaya",
  },

  Mairang: {
    latitude: 25.56,
    longitude: 91.63,
    region: "Meghalaya",
  },

  Khliehriat: {
    latitude: 25.36,
    longitude: 92.37,
    region: "Meghalaya",
  },

  Baghmara: {
    latitude: 25.2,
    longitude: 90.64,
    region: "Meghalaya",
  },

  Ampati: {
    latitude: 25.3,
    longitude: 89.87,
    region: "Meghalaya",
  },

  Mawlynnong: {
    latitude: 25.2,
    longitude: 91.92,
    region: "Meghalaya",
  },

  Resubelpara: {
    latitude: 25.9,
    longitude: 90.6,
    region: "Meghalaya",
  },

  // Manipur
  Imphal: {
    latitude: 24.817,
    longitude: 93.9368,
    region: "Manipur",
  },

  Churachandpur: {
    latitude: 24.333,
    longitude: 93.67,
    region: "Manipur",
  },

  Ukhrul: {
    latitude: 25.096,
    longitude: 94.36,
    region: "Manipur",
  },

  Senapati: {
    latitude: 25.27,
    longitude: 94.02,
    region: "Manipur",
  },

  Tamenglong: {
    latitude: 24.98,
    longitude: 93.5,
    region: "Manipur",
  },

  Chandel: {
    latitude: 24.68,
    longitude: 94.3,
    region: "Manipur",
  },

  Moreh: {
    latitude: 24.25,
    longitude: 94.3,
    region: "Manipur",
  },

  Jiribam: {
    latitude: 24.8,
    longitude: 93.12,
    region: "Manipur",
  },

  Thoubal: {
    latitude: 24.63,
    longitude: 94.01,
    region: "Manipur",
  },

  Bishnupur: {
    latitude: 24.63,
    longitude: 93.77,
    region: "Manipur",
  },

  Kakching: {
    latitude: 24.5,
    longitude: 93.98,
    region: "Manipur",
  },

  Kangpokpi: {
    latitude: 25.15,
    longitude: 93.67,
    region: "Manipur",
  },

  Noney: {
    latitude: 24.78,
    longitude: 93.63,
    region: "Manipur",
  },

  Tengnoupal: {
    latitude: 24.37,
    longitude: 94.15,
    region: "Manipur",
  },

  Kamjong: {
    latitude: 24.9,
    longitude: 94.25,
    region: "Manipur",
  },

  // Mizoram
  Aizawl: {
    latitude: 23.7271,
    longitude: 92.7176,
    region: "Mizoram",
  },

  Lunglei: {
    latitude: 22.89,
    longitude: 92.75,
    region: "Mizoram",
  },

  Champhai: {
    latitude: 23.47,
    longitude: 93.32,
    region: "Mizoram",
  },

  Serchhip: {
    latitude: 23.3,
    longitude: 92.85,
    region: "Mizoram",
  },

  Kolasib: {
    latitude: 24.22,
    longitude: 92.68,
    region: "Mizoram",
  },

  Saiha: {
    latitude: 22.48,
    longitude: 92.98,
    region: "Mizoram",
  },

  Lawngtlai: {
    latitude: 22.53,
    longitude: 92.9,
    region: "Mizoram",
  },

  Mamit: {
    latitude: 23.93,
    longitude: 92.48,
    region: "Mizoram",
  },

  Khawzawl: {
    latitude: 23.52,
    longitude: 93.18,
    region: "Mizoram",
  },

  Hnahthial: {
    latitude: 22.98,
    longitude: 92.93,
    region: "Mizoram",
  },

  Saitual: {
    latitude: 23.68,
    longitude: 92.97,
    region: "Mizoram",
  },

  Thenzawl: {
    latitude: 23.32,
    longitude: 92.75,
    region: "Mizoram",
  },

  Vairengte: {
    latitude: 24.52,
    longitude: 92.62,
    region: "Mizoram",
  },

  // Nagaland
  Kohima: {
    latitude: 25.6751,
    longitude: 94.1086,
    region: "Nagaland",
  },

  Dimapur: {
    latitude: 25.8629,
    longitude: 93.753,
    region: "Nagaland",
  },

  Mokokchung: {
    latitude: 26.32,
    longitude: 94.52,
    region: "Nagaland",
  },

  Mon: {
    latitude: 26.72,
    longitude: 95.03,
    region: "Nagaland",
  },

  Wokha: {
    latitude: 26.1,
    longitude: 94.27,
    region: "Nagaland",
  },

  Tuensang: {
    latitude: 26.27,
    longitude: 94.82,
    region: "Nagaland",
  },

  Phek: {
    latitude: 25.67,
    longitude: 94.52,
    region: "Nagaland",
  },

  Zunheboto: {
    latitude: 25.97,
    longitude: 94.52,
    region: "Nagaland",
  },

  Kiphire: {
    latitude: 25.87,
    longitude: 94.78,
    region: "Nagaland",
  },

  Longleng: {
    latitude: 26.48,
    longitude: 94.82,
    region: "Nagaland",
  },

  Peren: {
    latitude: 25.51,
    longitude: 93.73,
    region: "Nagaland",
  },

  Chumoukedima: {
    latitude: 25.86,
    longitude: 93.72,
    region: "Nagaland",
  },

  Niuland: {
    latitude: 25.77,
    longitude: 93.72,
    region: "Nagaland",
  },

  Tseminyu: {
    latitude: 26.02,
    longitude: 94.2,
    region: "Nagaland",
  },

  Pfutsero: {
    latitude: 25.68,
    longitude: 94.52,
    region: "Nagaland",
  },

  Medziphema: {
    latitude: 25.75,
    longitude: 93.85,
    region: "Nagaland",
  },

  // Sikkim
  Gangtok: {
    latitude: 27.3389,
    longitude: 88.6065,
    region: "Sikkim",
  },

  Namchi: {
    latitude: 27.1644,
    longitude: 88.3639,
    region: "Sikkim",
  },

  Pelling: {
    latitude: 27.305,
    longitude: 88.238,
    region: "Sikkim",
  },

  Mangan: {
    latitude: 27.509,
    longitude: 88.533,
    region: "Sikkim",
  },

  Ravangla: {
    latitude: 27.307,
    longitude: 88.363,
    region: "Sikkim",
  },

  Lachung: {
    latitude: 27.688,
    longitude: 88.739,
    region: "Sikkim",
  },

  Lachen: {
    latitude: 27.72,
    longitude: 88.56,
    region: "Sikkim",
  },

  Yuksom: {
    latitude: 27.37,
    longitude: 88.22,
    region: "Sikkim",
  },

  Gyalshing: {
    latitude: 27.29,
    longitude: 88.26,
    region: "Sikkim",
  },

  Singtam: {
    latitude: 27.23,
    longitude: 88.5,
    region: "Sikkim",
  },

  Rangpo: {
    latitude: 27.18,
    longitude: 88.53,
    region: "Sikkim",
  },

  Jorethang: {
    latitude: 27.12,
    longitude: 88.32,
    region: "Sikkim",
  },

  Soreng: {
    latitude: 27.17,
    longitude: 88.19,
    region: "Sikkim",
  },

  // Tripura
  Agartala: {
    latitude: 23.8315,
    longitude: 91.2868,
    region: "Tripura",
  },

  Dharmanagar: {
    latitude: 24.37,
    longitude: 92.17,
    region: "Tripura",
  },

  Udaipur: {
    latitude: 23.53,
    longitude: 91.48,
    region: "Tripura",
  },

  Kailashahar: {
    latitude: 24.33,
    longitude: 92.0,
    region: "Tripura",
  },

  Ambassa: {
    latitude: 23.93,
    longitude: 91.85,
    region: "Tripura",
  },

  Sabroom: {
    latitude: 23,
    longitude: 91.72,
    region: "Tripura",
  },

  Belonia: {
    latitude: 23.25,
    longitude: 91.45,
    region: "Tripura",
  },

  Khowai: {
    latitude: 24.07,
    longitude: 91.6,
    region: "Tripura",
  },

  Teliamura: {
    latitude: 24,
    longitude: 91.5,
    region: "Tripura",
  },

  Kumarghat: {
    latitude: 24.15,
    longitude: 92.03,
    region: "Tripura",
  },

  Santirbazar: {
    latitude: 23.32,
    longitude: 91.57,
    region: "Tripura",
  },

  Bishalgarh: {
    latitude: 23.67,
    longitude: 91.27,
    region: "Tripura",
  },

  Sonamura: {
    latitude: 23.48,
    longitude: 91.27,
    region: "Tripura",
  },

  Melaghar: {
    latitude: 23.49,
    longitude: 91.33,
    region: "Tripura",
  },

  Amarpur: {
    latitude: 23.53,
    longitude: 91.65,
    region: "Tripura",
  },

  // Existing locations
  Mussoorie: {
    latitude: 30.4598,
    longitude: 78.0644,
    region: "Uttarakhand",
  },

  Shimla: {
    latitude: 31.1048,
    longitude: 77.1734,
    region: "Himachal Pradesh",
  },

  Darjeeling: {
    latitude: 27.041,
    longitude: 88.2663,
    region: "West Bengal",
  },

  Dehradun: {
    latitude: 30.3165,
    longitude: 78.0322,
    region: "Uttarakhand",
  },

  Kullu: {
    latitude: 31.9579,
    longitude: 77.1095,
    region: "Himachal Pradesh",
  },
};

/* =====================================================
   LOCATIONS FOR APP UI
===================================================== */

export const locations: Location[] = locationNames.map(
  (name) => {
    const coordinate = locationCoordinates[name];

    return {
      name,
      region:
        coordinate?.region ?? "Northeast India",
    };
  }
);

/* =====================================================
   DEFAULT MOCK RISK DATA
===================================================== */

export const mockRiskData: Record<string, RiskData> =
  {};

locations.forEach((location) => {
  const name = location.name;

  const coordinates = locationCoordinates[name] ?? {
    latitude: 25,
    longitude: 92,
    region: "Northeast India",
  };

  mockRiskData[name] = {
    location: name,

    region: coordinates.region,

    latitude: coordinates.latitude,
    longitude: coordinates.longitude,

    riskLevel: "MODERATE",

    riskProbability: 45,
    probability: 45,

    rainfall24h: 0,
    rainfall7d: 0,

    primaryDriver:
      "Rainfall and terrain conditions",

    soilMoisture: 0,

    elevation: 1000,
    slope: 25,

    temperature: 24,
    humidity: 75,
    windSpeed: 8,

    rainfall: {
      oneHour: 0,
      sixHour: 0,
      twentyFourHour: 0,
      sevenDay: 0,
    },

    terrain: {
      elevation: 1000,
      slope: 25,
      soilType: "Mountain soil",
    },

    deformation: {
      current: 0,
      velocity: 0,
      trend: "stable",
    },

    weather: {
      temperature: 24,
      humidity: 75,
      windSpeed: 8,
    },

    lastUpdated: new Date().toISOString(),

    trend: "stable",
  };
});