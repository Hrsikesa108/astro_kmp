export interface CityLocation {
  name: string;
  lat: number;
  lon: number;
  zone: string;
}

export const CITIES: CityLocation[] = [
  { name: 'Hyderabad, India', lat: 17.385, lon: 78.4867, zone: 'Asia/Kolkata' },
  { name: 'Vijayawada, India', lat: 16.5062, lon: 80.648, zone: 'Asia/Kolkata' },
  { name: 'Visakhapatnam, India', lat: 17.6868, lon: 83.2185, zone: 'Asia/Kolkata' },
  { name: 'Tirupati, India', lat: 13.6288, lon: 79.4192, zone: 'Asia/Kolkata' },
  { name: 'Warangal, India', lat: 17.9689, lon: 79.5941, zone: 'Asia/Kolkata' },
  { name: 'Guntur, India', lat: 16.3067, lon: 80.4365, zone: 'Asia/Kolkata' },
  { name: 'Rajahmundry, India', lat: 17.0005, lon: 81.804, zone: 'Asia/Kolkata' },
  { name: 'Nellore, India', lat: 14.4426, lon: 79.9865, zone: 'Asia/Kolkata' },
  { name: 'Kurnool, India', lat: 15.8281, lon: 78.0373, zone: 'Asia/Kolkata' },
  { name: 'Mogalturu / Narasapur, India', lat: 16.42, lon: 81.61, zone: 'Asia/Kolkata' },
  { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946, zone: 'Asia/Kolkata' },
  { name: 'Mysuru, India', lat: 12.2958, lon: 76.6394, zone: 'Asia/Kolkata' },
  { name: 'Mangaluru, India', lat: 12.9141, lon: 74.856, zone: 'Asia/Kolkata' },
  { name: 'Udupi, India', lat: 13.3409, lon: 74.7421, zone: 'Asia/Kolkata' },
  { name: 'Hubballi, India', lat: 15.3647, lon: 75.124, zone: 'Asia/Kolkata' },
  { name: 'Chennai, India', lat: 13.0827, lon: 80.2707, zone: 'Asia/Kolkata' },
  { name: 'Madurai, India', lat: 9.9252, lon: 78.1198, zone: 'Asia/Kolkata' },
  { name: 'Coimbatore, India', lat: 11.0168, lon: 76.9558, zone: 'Asia/Kolkata' },
  { name: 'Tiruchirappalli, India', lat: 10.7905, lon: 78.7047, zone: 'Asia/Kolkata' },
  { name: 'Thiruvananthapuram, India', lat: 8.5241, lon: 76.9366, zone: 'Asia/Kolkata' },
  { name: 'Kochi, India', lat: 9.9312, lon: 76.2673, zone: 'Asia/Kolkata' },
  { name: 'Mumbai, India', lat: 19.076, lon: 72.8777, zone: 'Asia/Kolkata' },
  { name: 'Pune, India', lat: 18.5204, lon: 73.8567, zone: 'Asia/Kolkata' },
  { name: 'Nagpur, India', lat: 21.1458, lon: 79.0882, zone: 'Asia/Kolkata' },
  { name: 'Nashik, India', lat: 19.9975, lon: 73.7898, zone: 'Asia/Kolkata' },
  { name: 'Ahmedabad, India', lat: 23.0225, lon: 72.5714, zone: 'Asia/Kolkata' },
  { name: 'Surat, India', lat: 21.1702, lon: 72.8311, zone: 'Asia/Kolkata' },
  { name: 'Vadodara, India', lat: 22.3072, lon: 73.1812, zone: 'Asia/Kolkata' },
  { name: 'New Delhi, India', lat: 28.6139, lon: 77.209, zone: 'Asia/Kolkata' },
  { name: 'Jaipur, India', lat: 26.9124, lon: 75.7873, zone: 'Asia/Kolkata' },
  { name: 'Lucknow, India', lat: 26.8467, lon: 80.9462, zone: 'Asia/Kolkata' },
  { name: 'Varanasi, India', lat: 25.3176, lon: 82.9739, zone: 'Asia/Kolkata' },
  { name: 'Prayagraj, India', lat: 25.4358, lon: 81.8463, zone: 'Asia/Kolkata' },
  { name: 'Ayodhya, India', lat: 26.7922, lon: 82.1998, zone: 'Asia/Kolkata' },
  { name: 'Ujjain, India', lat: 23.1765, lon: 75.7885, zone: 'Asia/Kolkata' },
  { name: 'Indore, India', lat: 22.7196, lon: 75.8577, zone: 'Asia/Kolkata' },
  { name: 'Bhopal, India', lat: 23.2599, lon: 77.4126, zone: 'Asia/Kolkata' },
  { name: 'Patna, India', lat: 25.5941, lon: 85.1376, zone: 'Asia/Kolkata' },
  { name: 'Kolkata, India', lat: 22.5726, lon: 88.3639, zone: 'Asia/Kolkata' },
  { name: 'Bhubaneswar, India', lat: 20.2961, lon: 85.8245, zone: 'Asia/Kolkata' },
  { name: 'Puri, India', lat: 19.8135, lon: 85.8312, zone: 'Asia/Kolkata' },
  { name: 'Guwahati, India', lat: 26.1445, lon: 91.7362, zone: 'Asia/Kolkata' },
  { name: 'Kathmandu, Nepal', lat: 27.7172, lon: 85.324, zone: 'Asia/Kathmandu' },
  { name: 'Colombo, Sri Lanka', lat: 6.9271, lon: 79.8612, zone: 'Asia/Colombo' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, zone: 'Asia/Singapore' },
  { name: 'Kuala Lumpur, Malaysia', lat: 3.139, lon: 101.6869, zone: 'Asia/Kuala_Lumpur' },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, zone: 'Asia/Dubai' },
  { name: 'Abu Dhabi, UAE', lat: 24.4539, lon: 54.3773, zone: 'Asia/Dubai' },
  { name: 'Doha, Qatar', lat: 25.2854, lon: 51.531, zone: 'Asia/Qatar' },
  { name: 'Muscat, Oman', lat: 23.588, lon: 58.3829, zone: 'Asia/Muscat' },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, zone: 'Asia/Tokyo' },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, zone: 'Australia/Sydney' },
  { name: 'Melbourne, Australia', lat: -37.8136, lon: 144.9631, zone: 'Australia/Melbourne' },
  { name: 'Auckland, New Zealand', lat: -36.8485, lon: 174.7633, zone: 'Pacific/Auckland' },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, zone: 'Europe/London' },
  { name: 'Frankfurt, Germany', lat: 50.1109, lon: 8.6821, zone: 'Europe/Berlin' },
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522, zone: 'Europe/Paris' },
  { name: 'New York, USA', lat: 40.7128, lon: -74.006, zone: 'America/New_York' },
  { name: 'Edison, New Jersey, USA', lat: 40.5187, lon: -74.4121, zone: 'America/New_York' },
  { name: 'Boston, USA', lat: 42.3601, lon: -71.0589, zone: 'America/New_York' },
  { name: 'Washington DC, USA', lat: 38.9072, lon: -77.0369, zone: 'America/New_York' },
  { name: 'Atlanta, USA', lat: 33.749, lon: -84.388, zone: 'America/New_York' },
  { name: 'Chicago, USA', lat: 41.8781, lon: -87.6298, zone: 'America/Chicago' },
  { name: 'Dallas, USA', lat: 32.7767, lon: -96.797, zone: 'America/Chicago' },
  { name: 'Houston, USA', lat: 29.7604, lon: -95.3698, zone: 'America/Chicago' },
  { name: 'Austin, USA', lat: 30.2672, lon: -97.7431, zone: 'America/Chicago' },
  { name: 'San Francisco Bay Area, USA', lat: 37.3382, lon: -121.8863, zone: 'America/Los_Angeles' },
  { name: 'Los Angeles, USA', lat: 34.0522, lon: -118.2437, zone: 'America/Los_Angeles' },
  { name: 'Seattle, USA', lat: 47.6062, lon: -122.3321, zone: 'America/Los_Angeles' },
  { name: 'Toronto, Canada', lat: 43.6532, lon: -79.3832, zone: 'America/Toronto' },
  { name: 'Vancouver, Canada', lat: 49.2827, lon: -123.1207, zone: 'America/Vancouver' }
];

export interface RashiMeta {
  index: number; // 0..11
  rashi1: number; // 1..12
  en: string;
  sanskrit: string;
  deva: string;
  telugu: string;
  abbr: string;
  lord: PlanetName;
}

export type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu';

export const ALL9: PlanetName[] = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Rahu',
  'Ketu',
];

export const PLANET_SHORT: Record<PlanetName | 'Lagna', string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
  Lagna: 'La',
};

export const PLANET_SANSKRIT: Record<PlanetName | 'Lagna', string> = {
  Sun: 'Sūrya',
  Moon: 'Candra',
  Mars: 'Maṅgala',
  Mercury: 'Budha',
  Jupiter: 'Guru',
  Venus: 'Śukra',
  Saturn: 'Śani',
  Rahu: 'Rāhu',
  Ketu: 'Ketu',
  Lagna: 'Lagna',
};

export const RASHI_META: RashiMeta[] = [
  { index: 0, rashi1: 1, en: 'Aries', sanskrit: 'Mesha', deva: 'मेष', telugu: 'మేష', abbr: 'MES', lord: 'Mars' },
  { index: 1, rashi1: 2, en: 'Taurus', sanskrit: 'Vrishabha', deva: 'वृषभ', telugu: 'వృషభ', abbr: 'VRS', lord: 'Venus' },
  { index: 2, rashi1: 3, en: 'Gemini', sanskrit: 'Mithuna', deva: 'मिथुन', telugu: 'మిథున', abbr: 'MIT', lord: 'Mercury' },
  { index: 3, rashi1: 4, en: 'Cancer', sanskrit: 'Karka', deva: 'कर्क', telugu: 'కర్కాటక', abbr: 'KAR', lord: 'Moon' },
  { index: 4, rashi1: 5, en: 'Leo', sanskrit: 'Simha', deva: 'सिंह', telugu: 'సింహ', abbr: 'SIM', lord: 'Sun' },
  { index: 5, rashi1: 6, en: 'Virgo', sanskrit: 'Kanya', deva: 'कन्या', telugu: 'కన్య', abbr: 'KAN', lord: 'Mercury' },
  { index: 6, rashi1: 7, en: 'Libra', sanskrit: 'Tula', deva: 'तुला', telugu: 'తుల', abbr: 'TUL', lord: 'Venus' },
  { index: 7, rashi1: 8, en: 'Scorpio', sanskrit: 'Vrishchika', deva: 'वृश्चिक', telugu: 'వృశ్చిక', abbr: 'VRK', lord: 'Mars' },
  { index: 8, rashi1: 9, en: 'Sagittarius', sanskrit: 'Dhanu', deva: 'धनु', telugu: 'ధనుస్సు', abbr: 'DHA', lord: 'Jupiter' },
  { index: 9, rashi1: 10, en: 'Capricorn', sanskrit: 'Makara', deva: 'मकर', telugu: 'మకర', abbr: 'MAK', lord: 'Saturn' },
  { index: 10, rashi1: 11, en: 'Aquarius', sanskrit: 'Kumbha', deva: 'कुम्भ', telugu: 'కుంభ', abbr: 'KUM', lord: 'Saturn' },
  { index: 11, rashi1: 12, en: 'Pisces', sanskrit: 'Meena', deva: 'मीन', telugu: 'మీన', abbr: 'MEE', lord: 'Jupiter' },
];

export const SIGN_LORDS: PlanetName[] = RASHI_META.map((r) => r.lord);

// South Indian 4x4 grid coordinates [row (1..4), col (1..4)]
export const SI_POS: Record<number, [number, number]> = {
  11: [1, 1],
  0: [1, 2],
  1: [1, 3],
  2: [1, 4],
  3: [2, 4],
  4: [3, 4],
  5: [4, 4],
  6: [4, 3],
  7: [4, 2],
  8: [4, 1],
  9: [3, 1],
  10: [2, 1],
};

export const NAKSHATRA_NAMES = [
  'Ashvini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Svati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purvashadha', 'Uttarashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

export const NAKSHATRA_LORDS: PlanetName[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

export const VIMSHOTTARI_ORDER: PlanetName[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

export const VIMSHOTTARI_YEARS: Record<PlanetName, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

export const MASA_NAMES = [
  'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada',
  'Ashvayuja', 'Kartika', 'Margashira', 'Pausha', 'Magha', 'Phalguna',
];

export const RITU_NAMES = [
  'Vasanta (Spring)', 'Vasanta (Spring)',
  'Grishma (Summer)', 'Grishma (Summer)',
  'Varsha (Monsoon)', 'Varsha (Monsoon)',
  'Sharad (Autumn)', 'Sharad (Autumn)',
  'Hemanta (Early Winter)', 'Hemanta (Early Winter)',
  'Shishira (Late Winter)', 'Shishira (Late Winter)',
];

export const YOGA27_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
  'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata',
  'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
];

export const TITHI_META: Record<number, { name: string; devata: string; cls: string; lord: string }> = {
  1: { name: 'Pratipada', devata: 'Agni (Vahni)', cls: 'Nanda', lord: 'Sun' },
  2: { name: 'Dwitiya', devata: 'Brahma (Vidhata)', cls: 'Bhadra', lord: 'Moon' },
  3: { name: 'Tritiya', devata: 'Gauri', cls: 'Jaya', lord: 'Mars' },
  4: { name: 'Chaturthi', devata: 'Ganesha (Vighnesha)', cls: 'Rikta', lord: 'Mercury' },
  5: { name: 'Panchami', devata: 'Nagas (Ahi)', cls: 'Purna', lord: 'Jupiter' },
  6: { name: 'Shashthi', devata: 'Skanda (Kartikeya)', cls: 'Nanda', lord: 'Venus' },
  7: { name: 'Saptami', devata: 'Surya (Ravi)', cls: 'Bhadra', lord: 'Saturn' },
  8: { name: 'Ashtami', devata: 'Shiva (Rudra)', cls: 'Jaya', lord: 'Rahu' },
  9: { name: 'Navami', devata: 'Durga', cls: 'Rikta', lord: 'Sun' },
  10: { name: 'Dashami', devata: 'Yama (Antaka)', cls: 'Purna', lord: 'Moon' },
  11: { name: 'Ekadashi', devata: 'Vishvedevas', cls: 'Nanda', lord: 'Mars' },
  12: { name: 'Dwadashi', devata: 'Vishnu (Hari)', cls: 'Bhadra', lord: 'Mercury' },
  13: { name: 'Trayodashi', devata: 'Kamadeva (Manmatha)', cls: 'Jaya', lord: 'Jupiter' },
  14: { name: 'Chaturdashi', devata: 'Shiva (Sharva)', cls: 'Rikta', lord: 'Venus' },
  15: { name: 'Purnima', devata: 'Chandra (Soma)', cls: 'Purna', lord: 'Saturn' },
  30: { name: 'Amavasya', devata: 'Pitris (Ancestors)', cls: 'Purna', lord: 'Rahu' },
};

export const VARA_META = [
  { dow: 0, en: 'Sunday', sanskrit: 'Ravivāra', lord: 'Sun' },
  { dow: 1, en: 'Monday', sanskrit: 'Somavāra', lord: 'Moon' },
  { dow: 2, en: 'Tuesday', sanskrit: 'Maṅgalavāra', lord: 'Mars' },
  { dow: 3, en: 'Wednesday', sanskrit: 'Budhavāra', lord: 'Mercury' },
  { dow: 4, en: 'Thursday', sanskrit: 'Guruvāra', lord: 'Jupiter' },
  { dow: 5, en: 'Friday', sanskrit: 'Śukravāra', lord: 'Venus' },
  { dow: 6, en: 'Saturday', sanskrit: 'Śanivāra', lord: 'Saturn' },
];

export interface NityaTheme {
  id: string;
  name: string;
  desc: string;
  c1: string;
  c2: string;
}

export const NITYA_THEMES: NityaTheme[] = [
  { id: 'auto', name: 'Auto', desc: 'Follows your light or dark system setting', c1: '#F4F5F8', c2: '#15141D' },
  { id: 'kumkum', name: 'Kumkum', desc: 'Clean light canvas with kumkum red', c1: '#F4F5F8', c2: '#A6281F' },
  { id: 'talapatra', name: 'Palm leaf (Talapatra)', desc: 'Palm-leaf manuscript ochre', c1: '#E6D7B5', c2: '#8A2E12' },
  { id: 'tulasi', name: 'Tulasi', desc: 'Tulasi green on soft white', c1: '#EDF2EA', c2: '#2E6B3B' },
  { id: 'kesari', name: 'Kesari', desc: 'Saffron and marigold', c1: '#FFF3E6', c2: '#C4520B' },
  { id: 'purnima', name: 'Purnima', desc: 'Moonlit silver and indigo', c1: '#E9EDF6', c2: '#3A4CA6' },
  { id: 'gopuram', name: 'Gopuram', desc: 'Temple maroon and gold', c1: '#24090C', c2: '#E3A83C' },
  { id: 'amavasya', name: 'Amavasya', desc: 'New-moon night sky', c1: '#0F1020', c2: '#9EA8FF' },
];

export interface SampleProfile {
  id: string;
  label: string;
  subtitle: string;
  name: string;
  date: string;
  time: string;
  place: CityLocation;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'chiranjeevi',
    label: 'Konidela Sivasankara Varaprasad',
    subtitle: '22 Aug 1955 · 10:15 IST · Mogalturu',
    name: 'Chiranjeevi',
    date: '1955-08-22',
    time: '10:15',
    place: { name: 'Mogalturu / Narasapur, India', lat: 16.42, lon: 81.61, zone: 'Asia/Kolkata' },
  },
  {
    id: 'indira',
    label: 'Indra (Blockbuster Release)',
    subtitle: '24 Jul 2002 · 09:00 IST · Hyderabad',
    name: 'Indra',
    date: '2002-07-24',
    time: '09:00',
    place: { name: 'Hyderabad, India', lat: 17.385, lon: 78.4867, zone: 'Asia/Kolkata' },
  },
  {
    id: 'jvas',
    label: 'Jagadeka Veerudu Athiloka Sundari',
    subtitle: '09 May 1990 · 09:00 IST · Hyderabad',
    name: 'Jagadeka Veerudu Athiloka Sundari',
    date: '1990-05-09',
    time: '09:00',
    place: { name: 'Hyderabad, India', lat: 17.385, lon: 78.4867, zone: 'Asia/Kolkata' },
  },
  {
    id: 'aravind',
    label: 'Aravind Cherala (Natal Study)',
    subtitle: '15 Oct 1992 · 09:15 IST · Hyderabad',
    name: 'Aravind',
    date: '1992-10-15',
    time: '09:15',
    place: { name: 'Hyderabad, India', lat: 17.385, lon: 78.4867, zone: 'Asia/Kolkata' },
  },
];
