"""Load the claim tables. Every read is explicit UTF-8."""
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Branches in legend order: key, display name. A branch is what the viewer colours, shapes and switches.
_BRANCHES = [
    ("celtic", "Celtic"), ("germanic", "Germanic"), ("romance", "Romance"), ("slavic", "Slavic"), ("baltic", "Baltic"),
    ("hellenic", "Greek"), ("uralic", "Uralic"), ("turkic", "Turkic"), ("iranian", "Iranian"),
    ("paleobalkan", "Balkan and Anatolian"), ("basque", "Basque"), ("afroasiatic", "Semitic"), ("other", "Unclassified"),
    ("berber", "Berber"), ("egyptian", "Egyptian"), ("cushitic", "Cushitic"), ("chadic", "Chadic"),
    ("armenian", "Armenian"), ("kartvelian", "Kartvelian"), ("caucasian", "North Caucasian"),
    ("tocharian", "Tocharian"), ("indoaryan", "Indo-Aryan"), ("dravidian", "Dravidian"),
    ("austroasiatic", "Austroasiatic"), ("sinotibetan", "Sino-Tibetan"), ("taikadai", "Tai"), ("hmongmien", "Hmong-Mien"),
    ("austronesian", "Austronesian"), ("koreanic", "Korean"), ("japonic", "Japanese"),
    ("paleosiberian", "Old Siberian"), ("mongolic", "Mongolic"), ("tungusic", "Tungusic"),
    ("nilosaharan", "Nilo-Saharan"), ("mande", "Mande"), ("nigercongo", "Atlantic-Congo"), ("bantu", "Bantu"),
    ("khoisan", "Khoe and San"),
    ("eskaleut", "Inuit and Aleut"), ("nadene", "Na-Dene"), ("algic", "Algonquian"), ("iroquoian", "Iroquoian"),
    ("siouan", "Siouan"), ("naother", "Other North American"), ("pacificnw", "Pacific coast"),
    ("utoaztecan", "Uto-Aztecan"), ("mayan", "Mayan"), ("otomanguean", "Oto-Manguean"), ("mesoam", "Other Mesoamerican"),
    ("chibchan", "Chibchan"), ("arawakan", "Arawakan"), ("cariban", "Cariban"), ("tupian", "Tupian"),
    ("je", "Macro-Jê"), ("andean", "Quechua and Aymara"), ("amazonother", "Other Amazonian"),
    ("southcone", "Southern Cone"),
    ("pamanyungan", "Pama-Nyungan"), ("ausother", "Other Australian"), ("papuan", "Papuan"),
]
BRANCH_NAMES = dict(_BRANCHES)

# Families in list order: key, display name, branch.
_FAMILIES = [
    ("goid", "Irish and Gaelic (Goidelic)", "celtic"),
    ("gaul", "Gaulish and continental Celtic", "celtic"),
    ("brit", "Brittonic and Breton", "celtic"),
    ("hisp", "Hispano-Celtic", "celtic"),
    ("north", "Pictish and northern British", "celtic"),
    ("eng", "English and Scots", "germanic"),
    ("wgerm", "German, Dutch and Frankish", "germanic"),
    ("egerm", "Gothic, Vandal and Burgundian", "germanic"),
    ("norse", "Norse and Scandinavian", "germanic"),
    ("lat", "Latin and early Romance", "romance"),
    ("fr", "French (langue d'oïl)", "romance"),
    ("oc", "Occitan and Catalan", "romance"),
    ("ibrom", "Castilian, Portuguese and their neighbours", "romance"),
    ("itrom", "Italian", "romance"),
    ("erom", "Romanian", "romance"),
    ("slavw", "West Slavic (Polish, Czech, Sorbian)", "slavic"),
    ("slave", "East Slavic (Rus, Russian, Ukrainian)", "slavic"),
    ("slavs", "South Slavic (Serbian, Croatian, Bulgarian)", "slavic"),
    ("balt", "Baltic", "baltic"),
    ("greek", "Greek", "hellenic"),
    ("finnic", "Finnic and Sami", "uralic"),
    ("ugric", "Hungarian", "uralic"),
    ("volga", "Volga and Permic (Mordvin, Mari, Komi)", "uralic"),
    ("samoyed", "Ob-Ugric and Samoyedic", "uralic"),
    ("turk", "Old Turkic and Bulgar", "turkic"),
    ("oghuz", "Oghuz (Turkish, Azeri, Turkmen)", "turkic"),
    ("kipch", "Kipchak (Tatar, Kazakh, Kyrgyz)", "turkic"),
    ("karluk", "Uyghur and Uzbek", "turkic"),
    ("sibturk", "Siberian Turkic (Yakut, Tuvan)", "turkic"),
    ("iran", "Scythian, Sarmatian and Alan", "iranian"),
    ("pers", "Persian", "iranian"),
    ("wiran", "Parthian, Kurdish and Baloch", "iranian"),
    ("eiran", "Sogdian, Bactrian, Saka and Pashto", "iranian"),
    ("pbalk", "Illyrian, Thracian, Dacian and Albanian", "paleobalkan"),
    ("anat", "Old Anatolian languages and Phrygian", "paleobalkan"),
    ("vasc", "Basque and Aquitanian", "basque"),
    ("arab", "Arabic", "afroasiatic"),
    ("aram", "Aramaic and Syriac", "afroasiatic"),
    ("canaan", "Hebrew and Phoenician", "afroasiatic"),
    ("sarab", "Old South Arabian", "afroasiatic"),
    ("ethsem", "Ethiopian Semitic (Ge'ez, Amharic, Tigrinya)", "afroasiatic"),
    ("iber", "Iberian and Tartessian", "other"),
    ("lus", "Lusitanian", "other"),
    ("steppeunk", "Xiongnu, Rouran and Hephthalite (language unknown)", "other"),
    ("isolate", "Isolates (Burushaski, Andamanese and others)", "other"),
    ("berb", "Berber (Amazigh)", "berber"),
    ("egyp", "Egyptian and Coptic", "egyptian"),
    ("cush", "Cushitic (Beja, Somali, Oromo)", "cushitic"),
    ("omot", "Omotic", "cushitic"),
    ("hausa", "Hausa and Chadic", "chadic"),
    ("armn", "Armenian", "armenian"),
    ("kart", "Georgian and Kartvelian", "kartvelian"),
    ("nwcauc", "Circassian and Abkhaz", "caucasian"),
    ("necauc", "Chechen and Dagestanian", "caucasian"),
    ("toch", "Tocharian", "tocharian"),
    ("indn", "Hindi belt, Punjabi and the central Prakrits", "indoaryan"),
    ("inde", "Bengali, Odia and Assamese", "indoaryan"),
    ("indw", "Gujarati, Sindhi and Marathi", "indoaryan"),
    ("sinh", "Sinhala and Dhivehi", "indoaryan"),
    ("dard", "Kashmiri, Dardic and Nuristani", "indoaryan"),
    ("tamil", "Tamil and Malayalam", "dravidian"),
    ("telkan", "Telugu and Kannada", "dravidian"),
    ("dravn", "Gondi, Kurukh and Brahui", "dravidian"),
    ("munda", "Munda", "austroasiatic"),
    ("monkhmer", "Mon and Khmer", "austroasiatic"),
    ("viet", "Vietnamese", "austroasiatic"),
    ("aaother", "Other Austroasiatic (Khasi, Palaung, Nicobarese)", "austroasiatic"),
    ("sinitic", "Chinese", "sinotibetan"),
    ("tibetic", "Tibetan", "sinotibetan"),
    ("burm", "Burmese and Yi", "sinotibetan"),
    ("tbother", "Other Tibeto-Burman (Qiang, Tangut, Karen, Naga)", "sinotibetan"),
    ("tai", "Tai and Kra-Dai", "taikadai"),
    ("hmong", "Hmong and Mien", "hmongmien"),
    ("formosan", "Formosan", "austronesian"),
    ("malayic", "Malay, Javanese and western Indonesia", "austronesian"),
    ("philip", "Philippine", "austronesian"),
    ("cham", "Chamic", "austronesian"),
    ("malagasy", "Malagasy", "austronesian"),
    ("oceanic", "Oceanic (Melanesia and Micronesia)", "austronesian"),
    ("polynesian", "Polynesian", "austronesian"),
    ("kor", "Korean", "koreanic"),
    ("jap", "Japanese and Ryukyuan", "japonic"),
    ("ainu", "Ainu", "paleosiberian"),
    ("paleosib", "Chukchi, Koryak, Yukaghir, Nivkh and Ket", "paleosiberian"),
    ("mong", "Mongolic", "mongolic"),
    ("xianbei", "Xianbei and Khitan (para-Mongolic)", "mongolic"),
    ("tung", "Tungusic (Jurchen, Manchu, Evenki)", "tungusic"),
    ("nubian", "Nubian", "nilosaharan"),
    ("nilotic", "Nilotic (Dinka, Luo, Maasai)", "nilosaharan"),
    ("saharan", "Saharan (Kanuri, Teda)", "nilosaharan"),
    ("songhay", "Songhay", "nilosaharan"),
    ("nsother", "Other Nilo-Saharan (Fur, Maba, Central Sudanic)", "nilosaharan"),
    ("mande", "Mande (Soninke, Malinke, Bambara)", "mande"),
    ("atl", "Fula, Wolof and Serer", "nigercongo"),
    ("kwa", "Akan, Ewe, Yoruba and Igbo", "nigercongo"),
    ("gur", "Gur (Mossi) and Senufo", "nigercongo"),
    ("ubangi", "Adamawa and Ubangi (Zande, Gbaya)", "nigercongo"),
    ("bantuw", "Western Bantu (Kongo, Mbundu, forest)", "bantu"),
    ("bantue", "Eastern Bantu (Great Lakes, Swahili, Kikuyu)", "bantu"),
    ("bantus", "Southern Bantu (Shona, Nguni, Sotho)", "bantu"),
    ("khoe", "Khoekhoe and Khoe", "khoisan"),
    ("san", "San, Hadza and Sandawe", "khoisan"),
    ("inuit", "Inuit, Yupik and Aleut", "eskaleut"),
    ("athab", "Athabaskan, Tlingit and Apachean", "nadene"),
    ("algon", "Algonquian", "algic"),
    ("iroq", "Iroquoian", "iroquoian"),
    ("sioux", "Siouan", "siouan"),
    ("musk", "Muskogean", "naother"),
    ("caddo", "Caddoan", "naother"),
    ("pueblo", "Pueblo languages, Kiowa and Yuman", "naother"),
    ("naisol", "Timucua, Natchez and other small families", "naother"),
    ("salish", "Salish, Wakashan, Haida and Tsimshian", "pacificnw"),
    ("calif", "Plateau and California families", "pacificnw"),
    ("nahua", "Nahuatl and southern Uto-Aztecan", "utoaztecan"),
    ("numic", "Northern Uto-Aztecan (Hopi, Shoshone, Comanche)", "utoaztecan"),
    ("maya", "Mayan", "mayan"),
    ("otom", "Zapotec, Mixtec and Otomi", "otomanguean"),
    ("mixezoq", "Mixe-Zoque, Totonac and Purépecha", "mesoam"),
    ("camisc", "Lenca, Xinca and Misumalpan", "mesoam"),
    ("chib", "Chibchan (Muisca, Kuna, Bribri)", "chibchan"),
    ("arawak", "Arawakan (Taíno, Arawak, Mojo)", "arawakan"),
    ("carib", "Cariban", "cariban"),
    ("tupi", "Tupi and Guarani", "tupian"),
    ("je", "Macro-Jê", "je"),
    ("quechua", "Quechua", "andean"),
    ("aymara", "Aymara", "andean"),
    ("andisol", "Mochica, Puquina and other Andean languages", "andean"),
    ("pano", "Panoan and Tacanan", "amazonother"),
    ("tucano", "Tucanoan and other Amazonian families", "amazonother"),
    ("choco", "Chocó, Barbacoan and Páez", "amazonother"),
    ("mapuche", "Mapudungun", "southcone"),
    ("chon", "Tehuelche, Selk'nam and the far south", "southcone"),
    ("chaco", "Guaicuruan, Matacoan and Charrúa", "southcone"),
    ("pama", "Pama-Nyungan", "pamanyungan"),
    ("ausnp", "Non-Pama-Nyungan (Arnhem Land, Kimberley)", "ausother"),
    ("tasm", "Tasmanian", "ausother"),
    ("tng", "Trans-New Guinea", "papuan"),
    ("papother", "Other Papuan families", "papuan"),
]
FAMILIES = {k: name for k, name, _ in _FAMILIES}
# Every family belongs to one branch. The viewer groups and highlights by branch.
BRANCHES = {k: branch for k, _, branch in _FAMILIES}

# Regions. A region keeps an entry's field on its own land: a field never crosses into a region the entry
# does not list. They are cut from present-day country outlines by tools/coast.py (REGION_SPEC there), with
# a few large countries split along lines of longitude and latitude. Join several with "+".
REGION_LIST = [
    # Europe
    "britain", "ireland", "man", "gaul", "iberia", "italy", "central", "north", "balkans", "east",
    # Near East and North Africa
    "anatolia", "caucasus", "levant", "mesopotamia", "arabia", "egypt", "maghreb",
    # Iran and Central Asia
    "iran", "afghanistan", "turan", "steppe", "wsiberia", "esiberia",
    # South Asia
    "indus", "hindustan", "bengal", "deccan", "lanka",
    # East Asia
    "tibet", "tarim", "mongolia", "manchuria", "chinan", "chinas", "korea", "japan", "taiwan",
    # Southeast Asia and the Pacific
    "burma", "indochina", "malaya", "sumatra", "java", "borneo", "eindonesia", "philippines", "papua",
    "melanesia", "micronesia", "polynesia", "newzealand", "madagascar",
    # Africa south of the Sahara
    "sahelw", "guinea", "chad", "nile", "horn", "congo", "lakes", "zambezi", "southafrica",
    # The Americas
    "arcticam", "canada", "usaeast", "usawest", "mexico", "centralam", "caribbean",
    "andesn", "guianas", "andes", "amazon", "brazil", "cone",
    # Australia
    "australia",
]
# Shorthands. "all" keeps its first meaning, the ten regions of Europe, so the first seed is unchanged.
REGION_SETS = {
    "isles": ["britain", "ireland", "man"],
    "continent": ["gaul", "iberia"],
    "europe": ["gaul", "iberia", "italy", "central", "north", "balkans", "east"],
    "all": ["britain", "ireland", "man", "gaul", "iberia", "italy", "central", "north", "balkans", "east"],
    "neareast": ["anatolia", "caucasus", "levant", "mesopotamia", "arabia", "egypt"],
    "centralasia": ["iran", "afghanistan", "turan", "steppe"],
    "siberia": ["wsiberia", "esiberia"],
    "india": ["indus", "hindustan", "bengal", "deccan"],
    "china": ["chinan", "chinas"],
    "seasia": ["burma", "indochina", "malaya"],
    "indonesia": ["sumatra", "java", "borneo", "eindonesia"],
    "pacific": ["melanesia", "micronesia", "polynesia", "newzealand"],
    "westafrica": ["sahelw", "guinea"],
    "northam": ["arcticam", "canada", "usaeast", "usawest"],
    "southam": ["andesn", "guianas", "andes", "amazon", "brazil", "cone"],
}
# Soft borders. Regions in one of these clusters share land, and the lines between them are present-day
# borders or plain lines of longitude that no people of the past knew. A field that lists one region of a
# cluster may run on into the others at four fifths strength, so it ends softly and not on a ruled line. Seas and
# the borders between clusters stay hard.
REGION_SOFT = [
    ["tibet", "tarim", "mongolia", "manchuria", "chinan", "chinas"],
    ["indus", "hindustan", "bengal", "deccan"],
    ["east", "steppe", "wsiberia", "esiberia"],
    ["iran", "afghanistan", "turan"],
    ["levant", "mesopotamia", "arabia"],
    ["burma", "indochina", "malaya"],
    ["maghreb", "egypt", "sahelw", "guinea", "chad", "nile", "horn", "congo", "lakes", "zambezi", "southafrica"],
    ["arcticam", "canada", "usaeast", "usawest", "mexico", "centralam"],
    ["andesn", "guianas", "andes", "amazon", "brazil", "cone"],
]
REGIONS = set(REGION_LIST) | set(REGION_SETS)
# The regions the survey has reached. Land in any other region is hatched. Add a part's regions when its
# language wash is complete.
COVERED = [
    "britain", "ireland", "man", "gaul", "iberia", "italy", "central", "north",
    "balkans", "east", "anatolia", "caucasus", "levant", "mesopotamia", "arabia", "egypt",
    "maghreb", "iran", "afghanistan", "turan", "steppe", "wsiberia", "esiberia", "indus",
    "hindustan", "bengal", "deccan", "lanka", "tibet", "tarim", "mongolia", "manchuria",
    "chinan", "chinas", "korea", "japan", "taiwan", "burma", "indochina", "malaya",
    "sumatra", "java", "borneo", "eindonesia", "philippines", "papua", "melanesia", "micronesia",
    "polynesia", "newzealand", "madagascar", "sahelw", "guinea", "chad", "nile", "horn",
    "congo", "lakes", "zambezi", "southafrica", "arcticam", "canada", "usaeast", "usawest",
    "mexico", "centralam", "caribbean", "andesn", "guianas", "andes", "amazon", "brazil",
    "cone", "australia",
]

ENTITY_TYPES = {"people", "polity", "language"}
KINDS = {"range", "centre", "named-at", "movement"}
CLASSES = {"attested", "reconstructed", "indicative"}
STATUSES = {"seed", "checked", "reviewed"}
RELATIONS = {"continues", "name-continues", "merged-into", "absorbed-by", "split-from"}
PROJECTIONS = {"", "equal-earth", "local"}

# The whole world. E05 only catches a point that is not on the globe or sits on the ice.
REGION_BBOX = (-180.0, -60.0, 180.0, 84.0)  # west, south, east, north
YEAR_MIN, YEAR_MAX = -10000, 2026


def region_names(cell):
    """The plain region names an entry's region cell stands for, in REGION_LIST order."""
    names = set()
    for part in cell.split("+"):
        names.update(REGION_SETS.get(part, [part]))
    return [r for r in REGION_LIST if r in names]


def read_table(path):
    with open(path, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def load(root=ROOT):
    data = Path(root) / "data"
    return {
        "peoples": read_table(data / "peoples.csv"),
        "claims": read_table(data / "claims.csv"),
        "sources": read_table(data / "sources.csv"),
        "links": read_table(data / "links.csv"),
        "groups": read_table(data / "groups.csv"),
        "views": read_table(data / "views.csv"),
        "periods": read_table(data / "periods.csv"),
        "events": read_table(data / "events.csv"),
    }


def split_ids(cell):
    return [s.strip() for s in cell.split(";") if s.strip()]
