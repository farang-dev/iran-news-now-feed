import { NewsSource } from '@/types/news';

export const REFRESH_INTERVAL = 300000; // 5 minutes

export const NEWS_SOURCES: NewsSource[] = [
    // English Sources
    { name: 'Tehran Times', url: 'https://www.tehrantimes.com/rss', language: 'en', reliability: 'high', type: 'local' },
    { name: 'IRNA (EN)', url: 'https://en.irna.ir/rss', language: 'en', reliability: 'high', type: 'local' },
    { name: 'Press TV', url: 'https://www.presstv.ir/rss', language: 'en', reliability: 'high', type: 'local' },
    { name: 'BBC Persian (EN)', url: 'https://www.bbc.com/persian/index.xml', language: 'fa', reliability: 'high', type: 'international' }, // Keep filtering for BBC as they cover world news
    { name: 'Al Jazeera Iran', url: 'https://www.aljazeera.com/xml/rss/all.xml', language: 'en', reliability: 'high', type: 'international' },

    // Persian / Regional Sources (Will be auto-translated)
    { name: 'IRNA (Provincial)', url: 'https://www.irna.ir/rss/tp/1000', language: 'fa', reliability: 'high', type: 'local' },
    { name: 'ISNA (Society)', url: 'https://www.isna.ir/rss/tp/1', language: 'fa', reliability: 'high', type: 'local' },
    { name: 'Mehr (Provincial)', url: 'https://www.mehrnews.com/rss/tp/1', language: 'fa', reliability: 'high', type: 'local' },
    { name: 'Tasnim (Provincial)', url: 'https://www.tasnimnews.com/fa/rss/feed/0/31/DEFAULT', language: 'fa', reliability: 'high', type: 'local' }
];

export const IRAN_CITIES = {
    tehran: { lat: 35.6892, lng: 51.3890, name: 'Tehran', faName: 'تهران' },
    mashhad: { lat: 36.2972, lng: 59.6067, name: 'Mashhad', faName: 'مشهد' },
    isfahan: { lat: 32.6546, lng: 51.6680, name: 'Isfahan', faName: 'اصفهان' },
    karaj: { lat: 35.8327, lng: 50.9915, name: 'Karaj', faName: 'کرج' },
    shiraz: { lat: 29.5918, lng: 52.5837, name: 'Shiraz', faName: 'شیراز' },
    tabriz: { lat: 38.0962, lng: 46.2738, name: 'Tabriz', faName: 'تبریز' },
    qom: { lat: 34.6416, lng: 50.8746, name: 'Qom', faName: 'قم' },
    ahvaz: { lat: 31.3183, lng: 48.6706, name: 'Ahvaz', faName: 'اهواز' },
    kermanshah: { lat: 34.3142, lng: 47.0650, name: 'Kermanshah', faName: 'کرمانشاه' },
    urmia: { lat: 37.5527, lng: 45.0760, name: 'Urmia', faName: 'ارومیه' },
    rasht: { lat: 37.2808, lng: 49.5832, name: 'Rasht', faName: 'رشت' },
    zahedan: { lat: 29.4963, lng: 60.8629, name: 'Zahedan', faName: 'زاهدان' },
    hamadan: { lat: 34.7981, lng: 48.5146, name: 'Hamadan', faName: 'همدان' },
    kerman: { lat: 30.2839, lng: 57.0833, name: 'Kerman', faName: 'کرمان' },
    yazd: { lat: 31.8974, lng: 54.3569, name: 'Yazd', faName: 'یزد' },
    ardabil: { lat: 38.2498, lng: 48.2933, name: 'Ardabil', faName: 'اردبیل' },
    bandar_abbas: { lat: 27.1833, lng: 56.2667, name: 'Bandar Abbas', faName: 'بندرعباس' },
    arak: { lat: 34.0917, lng: 49.6892, name: 'Arak', faName: 'اراک' },
    qazvin: { lat: 36.2668, lng: 50.0038, name: 'Qazvin', faName: 'قزوین' },
    zanjan: { lat: 36.6736, lng: 48.4787, name: 'Zanjan', faName: 'زنجان' },
    sanandaj: { lat: 35.3113, lng: 46.9960, name: 'Sanandaj', faName: 'سنندج' },
    gorgan: { lat: 36.8387, lng: 54.4348, name: 'Gorgan', faName: 'گرガン' },
    sari: { lat: 36.5659, lng: 53.0597, name: 'Sari', faName: 'ساری' },
    khorramabad: { lat: 33.4878, lng: 48.3558, name: 'Khorramabad', faName: 'خرم‌آباد' },
    bushehr: { lat: 28.9234, lng: 50.8203, name: 'Bushehr', faName: 'بوشهر' },
    birjand: { lat: 32.8663, lng: 59.2211, name: 'Birjand', faName: 'بیرجند' },
    ilam: { lat: 33.6374, lng: 46.4227, name: 'Ilam', faName: 'ایلام' },
    bojnurd: { lat: 37.4761, lng: 57.3317, name: 'Bojnurd', faName: 'بجنورد' },
    shahr_e_kord: { lat: 32.3256, lng: 50.8644, name: 'Shahrekord', faName: 'شهرکرد' },
    yasuj: { lat: 30.6694, lng: 51.5875, name: 'Yasuj', faName: 'یاسوج' },
    semnan: { lat: 35.5760, lng: 53.3951, name: 'Semnan', faName: 'سمنان' },
    kish: { lat: 26.5317, lng: 54.0175, name: 'Kish Island', faName: 'کیش' },
    abadan: { lat: 30.3392, lng: 48.3043, name: 'Abadan', faName: 'آبادان' }
};

export const MAP_CONFIG = {
    center: [32.4279, 53.6880] as [number, number],
    zoom: 6,
    maxZoom: 13,
    minZoom: 5
};
