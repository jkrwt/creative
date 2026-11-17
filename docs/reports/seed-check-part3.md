# Seed check, part 3: South Asia

File checked: `parts/part3.py`. Only that file was edited. Everything in it is still a seed. The web checks below were made against encyclopedia pages and search summaries, not against the primary sources the claims cite.

How the web was read matters for what follows. Thirty-four Wikipedia pages were fetched and read as excerpts through a fetch tool. The other lookups were web searches whose result summaries I read, not the pages behind them. The tables say which is which. One search result carried an instruction aimed at the reader. It was ignored.

## Counts

| | Before | After |
|---|---|---|
| Entries | 186 | 185 |
| of type people | 131 | 130 |
| of type polity | 13 | 13 |
| of type language | 42 | 42 |
| Claims | 311 | 332 |
| Groups | 16 | 16 |
| Sources | 22 | 22 |
| Alive at 1 | 24 | 23 |
| Alive at 500 | 27 | 27 |
| Alive at 1000 | 34 | 34 |
| Alive at 1500 | 40 | 41 |
| Alive at 1800 | 49 | 49 |
| Alive at 2026 | 35 | 35 |

No group has more than 7 members alive at any keyframe. Before the check 201 claims were classed attested, 85 reconstructed and 25 indicative. After it 208 are attested, 100 reconstructed and 24 indicative. The attested count rose because eight claims that were reconstructed all the way to 1947 or 2026 were split and their recorded later part classed attested.

## Pass 1: class

The audit listed no attested claim that begins before written records reach its region, so there is no `attested_early` list in the file. I read every attested claim for a people or state by hand.

- 1 claim was demoted outright.
- 13 attested claims were split into an earlier reconstructed claim and a later attested one.
- 8 reconstructed claims were split the same way, because their later centuries are well recorded.
- 1 attested claim was shortened (Cheras) and 1 boundary between an indicative and an attested claim was moved later (Veddas).

Demoted outright:

- ahoms, 1228 to 1540, from attested to reconstructed. The buranjis are the only source for these centuries and the surviving copies are later. The claim from 1540 stays attested, since Persian chronicles of the Mughal wars also describe the kingdom.

Attested claims split, with the year the attested claim now starts:

| Entry | Attested from | Record |
|---|---|---|
| vakatakas | 340 | Their own inscriptions. The first kings are known from the Puranas and from later genealogies. The year is from memory and was not checked on the web. |
| khasa-kingdom | 1223 | Their own inscriptions, which begin with a king whose reign starts in 1223 on the page read. |
| zamorins | 1342 | Ibn Battuta at Calicut. |
| gond-kingdoms | 1500 | Persian chronicles of Malwa, the Deccan and then Akbar. Sources date Sangram Shah of Garha either 1480 to 1530 or 1513 to 1543. |
| kumaon-garhwal | 1500 | Inscriptions and Mughal chronicles. Sources put the start of Chand rule anywhere from the 7th to the 11th century and the union of Garhwal at 1358 or about 1500. |
| tripura-kingdom | 1500 | Chronicles of the Bengal sultans and the Mughals. The page read says the earliest historical records are of the 15th century. |
| baloch-east (Indus claim) | 1519 | Babur's memoir. From memory, not checked on the web. |
| dimasa-kingdom | 1540 | Buranjis beside Persian and then Company records. |
| mysore | 1610 | Inscriptions and chronicles. The founding year 1399 is the dynasty's own tradition. |
| gorkha | 1743 | Company records of the 1760s beside the chronicles. |
| khasis | 1765 | Company records from the takeover of Sylhet. |
| sikkim-kingdom | 1817 | Company treaty. The founding in 1642 is from the kingdom's own account. |
| nagas | 1832 | British officers in the Naga hills. From memory, not checked on the web. |

Reconstructed claims split, with the year the attested claim now starts:

| Entry | Attested from | Record |
|---|---|---|
| marwar | 1459 | Founding of Jodhpur, then Mughal chronicles. |
| ladakh-kingdom | 1532 | Mirza Haidar's account of his invasion. From memory, not checked on the web. |
| amber-jaipur | 1562 | Mughal chronicles. |
| manipur | 1762 | Treaty with the Company. From memory, not checked on the web. |
| mundas | 1820 | Company records. |
| kondhs | 1836 | Company records of the Ghumsur campaigns. |
| oraons | 1881 | Census. |
| soras | 1881 | Census. |

Other changes of class or span:

- cheras, first claim, now ends at 300 and not 400, in line with the early Cholas and Pandyas. No contemporary source names a Chera king in the 4th century.
- veddas: the indicative claim now runs to 1681 and the attested one starts in 1681, the year of Knox's book. It had started in 1500.
- kandy: a new reconstructed claim covers 1469 to 1592 (see pass 3).

Read and left attested: the Indo-Scythians, Yaudheyas, Kunindas, Panchala and Kaushambi kings (coins that carry the names), the Western Kshatrapas, Satavahanas, Cheras, Cholas, Pandyas and Anuradhapura (their own inscriptions and the Greek and Roman writers), and the dynasties from the Guptas on, which have their own dated inscriptions. The hill and clan peoples named in the brief were already classed carefully: Gonds, Bhils, Santals, Khasi and Veddas were indicative before the first record, Jats and Baloch reconstructed before the Mughal period. Only the Nagas and Khasi were over-claimed, both on the strength of the buranjis.

Language entries were not touched in this pass. Three of them carry an attested class that I would question and have left for a later decision: `hindi-speakers`, `punjabi-speakers` and `bengali-speakers` are attested from 1000 on the strength of a 20th-century survey, and `tai-ahom-speakers` is attested from 1228 on the buranjis.

## Pass 2: grain

The part was already under both ceilings. One entry was removed.

| Entry | Type | Why |
|---|---|---|
| kiratas ("Kiratas", 1 to 400, indicative, Nepal valley) | people | Known only from chronicles written a thousand years later. The name is a general Sanskrit word for hill peoples. I doubt a kingdom of that name can be placed there. |

No link mentioned it. Its group, `himalayan-kingdoms`, now has one member at year 1 (the Kunindas), as it already had at 500 (the Licchavis). I found no near-duplicate pair of a people and a state with the same name at the same time. The Brahui and the Khanate of Kalat sit on the same ground from 1666 to 1948 and are the nearest thing to one; I kept both because one is a people and the other a confederacy that included Baloch clans.

## Pass 3: facts

I looked up 97 entries on the web: 34 on fetched Wikipedia pages and 63 through search summaries. For 8 of the 97 the result neither confirmed nor denied the file (rashtrakutas, the later cheras, jaunpur-sultanate, malwa-sultanate, nepal, gajapatis, vishnukundins and manipur), so 89 were in fact checked. Those 8 are listed under "could not check", with a few more entries that were named in a search but not counted because the search returned nothing on them.

### Corrected

| Entry | What it said | What it says now | Page read |
|---|---|---|---|
| kandy | One claim, 1590 to 1815 | Reconstructed 1469 to 1592 (founded about 1469 under Kotte, conquered by Sitawaka in 1581), attested 1592 to 1815 | https://en.wikipedia.org/wiki/Kingdom_of_Kandy |
| western-kshatrapas | Ends 405 | Ends 415 | https://en.wikipedia.org/wiki/Western_Satraps |
| arab-sindh | Habbari claim ends 1025 | Ends 1026, when Mahmud of Ghazni took Mansura. The page also gives 1011 for the end of the dynasty. | https://en.wikipedia.org/wiki/Habbari_dynasty |
| kalinga-kingdom | Kharavela's date disputed between the 1st century BCE and the 1st CE | Disputed between the 2nd century BCE and the 1st CE, so he may fall before the survey | https://en.wikipedia.org/wiki/Hathigumpha_inscription |
| hoysalas | Ends 1343 | Ends 1346. Note adds that the family is recorded as chiefs from about 950. | https://en.wikipedia.org/wiki/Hoysala_Kingdom |
| hindu-shahis | No word on the start | Note says the start is put between 822 and 870. The claim still starts at 850. | https://en.wikipedia.org/wiki/Hindu_Shahis |
| chandelas | Note ended at the temples | Note adds that Kalinjar fell in 1203 and the line lasted until about 1315. The claim still ends at 1203. | https://en.wikipedia.org/wiki/Chandelas_of_Jejakabhukti |
| amber-jaipur | Start 1150 with no word of doubt | Note says tradition puts the arrival anywhere from the 10th to the 12th century. The page gives 1028. | https://en.wikipedia.org/wiki/Kingdom_of_Amber |
| marwar | "The early dates are from bardic chronicles" | Early claim names Pali and Mandore, the seats before Jodhpur | https://en.wikipedia.org/wiki/Kingdom_of_Marwar |
| gond-kingdoms | "The Marathas took the last of them" | Adds Garha-Mandla in 1781 | Search summary citing https://en.wikipedia.org/wiki/Garha_kingdom |
| kumaon-garhwal | "Gorkha armies conquered both by 1804" | Kumaon in 1790 and Garhwal in 1804 | Search summary citing https://en.wikipedia.org/wiki/Chand_dynasty and https://en.wikipedia.org/wiki/Garhwal_kingdom |
| vijayanagara | First claim centred at 77.0, 13.8 | Centred at 76.8, 14.6, within a degree of Hampi, which the note names | None. Checked against the coordinates of Hampi from memory. |
| dhivehi-speakers (wash) | Radius 420 km; "from the 12th century" | Radius 470 km; "from the end of the 12th century" | Search summary citing https://en.wikipedia.org/wiki/Isdhoo_(Laamu_Atoll) for the date of the oldest copper plates, 1194 or 1195 |

The Dhivehi radius is the one change to a language entry. The Maldives are in the region file (`lanka` includes them) but not in the coast file, so the wash check does not sample them. By hand: the two claims share one centre, meet at 1150 with no gap, and run from 1 to 2026. At 420 km the field had almost faded out at Addu, the southernmost atoll, which is about 465 km from the centre. At 470 km it covers the whole chain and still stops short of Minicoy and India.

### Looked up and found right

On fetched pages: kotte (1412 to 1597); satavahanas (1st century BCE to early 3rd CE); sindh-soomra-samma (Soomras 1026 to 1351); brahui-speakers and brahuis (both the relict view and the view that Brahui came from central India after 1000 are held, and a recent genetic study favours long presence; the file says the matter is disputed and classes the early wash indicative); mewar (Guhilas from the 7th century, Chittor taken about 728); ladakh-kingdom (about 930 to 1842, Namgyal kings from 1460); kakatiyas (1163 to 1323); yadavas (1187 to 1317); ahoms (1228 to 1826); dimasa-kingdom (13th century on, capital moved to Maibang about 1559); khasis (Jaintia king list from 1500, annexed 1835); tripura-kingdom (about 1400 to 1949); koch-kingdom; gorkha (1559 to 1768); sikkim-kingdom (1642 to 1975); paramaras (948 to 1305); chahamanas (to 1192); solankis (about 940, Vaghelas from the 1240s); kalachuris-tripuri (independent from the early 10th century); gahadavalas (sovereign before 1090); gurjara-pratiharas (about 730 to 1036, Kannauj sacked 1018); maitrakas (about 475 to 776).

From search summaries: guptas (about 320 to 550); vakatakas (about 250 to 500); pallavas (275 to 897 in one source, others say only 4th to 9th century); chalukyas-badami (543 to 753); western-chalukyas (973 to 1189); eastern-chalukyas (from 624; the end is given as about 1070 or as 1189, and the file's 1075 follows the first); palas (750 to 1161); senas (Banglapedia gives about 1097 to 1225, the file 1097 to 1230); gauda (Shashanka about 590 to 625); kamarupa (350 to 1140); cholas (848 to 1279); pandyas (Kadungon from 590, a king to 920, revival from 1216); vijayanagara (1336 to 1646); bahmanis (1347 to 1527, with real power gone by about 1518); ahmadnagar (1490 to 1636); bijapur (1490 to 1686); golconda (1518 to 1687; Britannica gives 1512); bengal-sultanate (Ilyas Shah from 1342, united 1352, ended 1576); gujarat-sultanate (1407 to 1573); delhi-sultanate (1206 to 1526); marathas (1674 to 1818); sikh-empire (1799 to 1849); mysore (1399 by tradition, important only from the 17th century); kalat-khanate (founded 1666; ended 1948 by accession or 1955 by merger); sindh-kalhora-talpur (Talpurs from 1783; the Kalhora start of 1701 was not confirmed, one source dates their wider rule from 1719); awadh (1722 to 1856); rohillas (ended 1774); bengal-nawabs (1717 to 1765); carnatic-nawabs (under the Company from 1801); hyderabad-nizam (from 1724); jaffna-kingdom (1215 to 1619); polonnaruwa (1055 or 1070 to 1232); dambadeniya-gampola (1220 or 1232 to 1408 or 1412); eastern-gangas (from the 490s; Chodaganga from 1077 or 1078; to 1434); somavamshis (9th to early 12th century; one source has the fall by 1114); kashmir-kingdom (Karkotas from about 625); kashmir-sultanate (1339 to 1586, with surrender in 1589); venad-travancore (Venad from the fall of the Cheras about 1124, Martanda Varma from 1729); kadambas (345 to 540 or 525); western-gangas (about 350 to 1000); ikshvakus (from 225; one source ends them at 340 and not 325, left as it was); santals (settled in the Rajmahal hills between 1790 and 1810, the reserve set apart in 1832); jats (Zutt in Arab sources of the 8th to 11th century); tulu-speakers (its own branch of South Dravidian, as the note says); tamil-speakers-lanka (early Tamil writing is found in the north, and whether it shows a lasting community is disputed along national lines; the indicative class and the note stand); maldives-sultanate (oldest copper plates 1194 or 1195); indo-scythians (Azes II is dated about 35 to 12 BCE or later, and one scholar doubts he existed; the claim rests on the Azes coinage as a whole); kunindas and yaudheyas (coin series of the right centuries).

### What the web said about the doubts in the brief

- **Brahui as the wash for Balochistan, 1 to 1100.** Not settled by anyone. The file's indicative class and its note are a fair statement. No other candidate language has a name.
- **Tibeto-Burman in the eastern delta before 600.** The peer-reviewed work found argues for a Munda (Austroasiatic) layer under eastern Indo-Aryan in general, with Tibeto-Burman in the north and north-east. Nothing found speaks to the eastern delta itself. The claim stays indicative and its note already names both.
- **Munda and Gondi retreat, staged at 700, 900, 1650 and 1700.** Nothing found dates the retreat. The stages are the previous writer's and remain a guess. Kurukh arrival at 1000 is also a guess, and the note now says the date is not known.
- **Dardic in Ladakh before 750.** The pages found say the oldest layer of people in Ladakh was Dardic, that Tibet ruled it by the early 8th century over a non-Tibetan population, and that Tibetan speech came to dominate after 842 or 930. This supports the file's shape. Nothing was found on Baltistan.
- **Early Pashto and Pahari placements.** Not checked. The searches returned nothing on them.
- **Family `pers` for sultanates and Mughal successors.** Not a web question. It follows rule 8 of the authoring guide: the people entry carries the rulers' court language and the wash carries the population's. Left as it is.
- **Kashmir.** The notes on `kashmiris`, `jammu-and-kashmir`, `india` and `pakistan` already say sovereignty is disputed and do not settle it. The new attested claim for `ladakh-kingdom` says the same. The language entries for Kashmir, Gilgit and Ladakh run to 2026 without such a note, and I did not add one because language entries were out of scope.

### Could not check

Counted as looked up, but the result did not speak to the point: rashtrakutas (753 to 982), cheras (later kingdom 800 to 1124), jaunpur-sultanate (1394 to 1479), malwa-sultanate (1401 to 1562), nepal (1768), gajapatis (1434 to 1541), vishnukundins (420 to 624), and manipur's early dates (the page fetched covers only the princely state).

Named in a search that returned nothing on them, and not counted: licchavis-nepal, mallas-nepal, zamorins, madurai-nayaks, madurai-sultanate, the Kondh and Naga first-record dates, the Baloch move to the Indus, and the early Pashto and Pahari washes.

Not looked up at all: sindh-rai-chach, sikhs, punjabis, malavas, aulikaras, gujaratis, panchala-kings, kaushambi-kings, nagas-padmavati, maukharis, pushyabhutis, samatata, bengalis, odias, assamese-people, patola-shahis, kashmiris, kannadigas, telugus, ays, kalabhras, tamils, malayalis, anuradhapura, ruhuna, veddas, sinhalese, sri-lankan-tamils, gonds, bhils, mizos, tani-peoples, and the polities mughal-empire, portuguese-india, colonial-ceylon, east-india-company, british-raj, jammu-and-kashmir, india, pakistan, bangladesh, sri-lanka and maldives. Their dates agree with what I know, but that is memory and not a check.

Coordinates: I compared every centre with the place its note names, from memory of the places' coordinates and not from a gazetteer. All are on land and in the right country. Only Vijayanagara was more than about a degree off.

## What I am still least sure of

1. The split years that rest on memory alone: Vakatakas 340, Baloch 1519, Ladakh 1532, Manipur 1762, Nagas 1832, Munda and Ho 1820, Kondh 1836.
2. Whether the buranjis should count as contemporary. I treated them as later copies and classed the Ahoms, Dimasa and Nagas reconstructed before 1540 or later. A reader who trusts the chronicle tradition would restore attested from 1228.
3. The Khanate of Kalat, attested from 1666. I know of no 17th-century record I could name, and left it because the founding date is agreed.
4. The early wash: Brahui, the eastern delta, and the stages of the Munda and Gondi retreat. All are guesses with honest notes.
5. Hindi, Punjabi and Bengali washes classed attested from 1000.
6. The Ikshvaku end date (325 in the file, 340 in one source) and the Pallava start (275 in the file, "4th century" in others).
7. Princely states end in 1947 for some entries (Mewar, Marwar, Amber, Mysore) and 1948 or 1949 for others (Hyderabad, Travancore, Manipur, Tripura, Koch). The second is the more exact. I did not make them uniform.
