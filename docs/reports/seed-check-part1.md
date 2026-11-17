# Seed check, part 1: the Near East and North Africa

File checked: `parts/part1.py`. Only that file was edited. Everything in it is still a seed. The web checks below were made against encyclopedia pages, mostly Wikipedia, through a search service that returned excerpts of each page and not the whole page. A check here means the excerpt carried the fact. Nothing was checked against the primary sources the claims cite.

## Counts

| | Before | After |
|---|---|---|
| Entries | 204 | 202 |
| of type people | 126 | 124 |
| of type polity | 43 | 43 |
| of type language | 35 | 35 |
| Claims in entries | 304 | 322 |
| Claims added to European entries (`more_claims`) | 25 | 27 |
| Claims in all | 329 | 349 |
| Groups | 20 | 20 |
| Sources | 26 | 26 |
| Alive at 1 | 33 | 31 |
| Alive at 500 | 27 | 26 |
| Alive at 1000 | 33 | 33 |
| Alive at 1500 | 31 | 31 |
| Alive at 1800 | 34 | 34 |
| Alive at 2026 | 44 | 44 |

Before the check 196 claims were classed attested, 108 reconstructed and 25 indicative. After it 201 are attested, 123 reconstructed and 25 indicative. The attested count rose only because splits and the Cyprus and Aegean fixes added claims. No group shows more than 6 members at any keyframe.

## Pass 1: class

The audit listed no claim. I read every attested claim by hand, with most care for the peoples of the desert, the mountains and the Sahara.

- 15 claims were split into an earlier reconstructed claim and a later attested one (for Adiabene and the Nasamones the other way round).
- 1 boundary between an existing reconstructed and attested claim was moved (Alans, from 700 to 900).
- 1 reconstructed claim was split so that its last part is attested (Guanches from 1341).
- 1 wash claim was demoted outright (Turkish Cypriots before 1974, attested to indicative, because they lived scattered among a Greek-speaking majority).
- No `attested_early` list was needed.

| Entry | Attested from | Record |
|---|---|---|
| lazica | 131 | Arrian names the king of the Lazi in 131. Before that Strabo describes Colchis, not a Lazic kingdom. |
| alans-caucasus | 900 | Constantine Porphyrogenitus and al-Masudi both wrote about 950. The kingdom dates from the late 9th century. |
| ossetians | 1774 | Russian records. The year is from memory and was not confirmed. |
| abkhaz (later claim) | 1810 | Russian protection. The principality before it is known from Georgian and Ottoman writers, whom the claim did not cite. |
| avars-of-dagestan (khanate) | 1803 | Submission to Russia. The page read says "within two years" of a khan's death, which I date to 1801 from memory. |
| vainakh (later claim) | 1800 | Russian records. A round year. |
| maronites | 1099 | William of Tyre. The centuries from 700 are later tradition. |
| ghassanids | 529 | Procopius on al-Harith. The treaty of 502 is in a later chronicle. |
| adiabene | 1 to 116 attested, 116 to 379 reconstructed | Josephus and Pliny for the 1st century. The later kings are thinly recorded. |
| nasamones | 1 to 150 attested, 150 to 300 reconstructed | Pliny, Cassius Dio on the rising of about 85, Ptolemy about 150. Nothing of their own time after. |
| barghawata | 950 | Ibn Hawqal. Al-Bakri wrote in 1068 from an earlier report. |
| kutama | 893 | The Fatimid mission, recorded by writers of the 10th century. |
| mozabites | 1882 | French annexation. Ibn Khaldun mentions the Mzab but the claim cited only modern surveys. |
| kabyles | 1830 | French records. |
| riffians | 1880 | Travellers and surveys. A round year. |
| ishelhien | 1880 | Travellers and surveys. A round year. |
| guanches | 1341 | The voyage of 1341 and then the conquest chronicles from 1402. |

Read and kept as attested, with the record that holds the claim up:

- **Blemmyes from 1.** Strabo himself places them south of Syene as nomad raiders. Their language (`cush`) stays marked inferred.
- **Lakhmids from 300.** The Paikuli inscription of the 290s names "Amr of Lakhm", and the Namara inscription of 328 names his son. I added the source `sasanian-inscriptions`.
- **Hatra, Characene, Nabataeans, Saba, Himyar, Hadramawt, Palmyra, Osroene.** Their own inscriptions and coins, with Pliny, Josephus and the Periplus.
- **Garamantes, Mauri, Musulamii, Laguatan, Altava.** Pliny and Ptolemy; Tacitus; Ammianus, Procopius and Corippus; the Altava inscription of 508.
- **Circassians from 500.** Procopius about 550 and Constantine Porphyrogenitus about 950 both name the Zichoi on that coast. The centuries between rest on those two.
- **Idrisids, Rustamids, Midrarids.** The claims cite al-Bakri (1068) and Ibn Khaldun, who are not contemporary. I kept them attested because coins and 9th and 10th century writers exist, but I did not check those. This is the weakest group of "a" claims left.
- **Kurdish emirates from 1500.** The Sharafnama of 1597 and Ottoman registers.

Already loose and left so: Kurds from 650 (reconstructed, and the wash before 1100 indicative), Tuareg, Sanhaja, Zenata, Masmuda, Beja, Thamud, Kinda, Quraysh, Banu Hilal, Banu Sulaym, Anaza, Shammar, Sahrawis and the Teda wash. There is no attested claim for Kurds before 990, for Tuareg, Teda or Beja at any date, or for a Bedouin grouping before the Ghassanids and Lakhmids.

Not changed, because they are language entries: the Icelandic wash is attested from 870 on the strength of a book of about 1125, and one Armenian wash claim is attested from 1 though Armenian is written only from about 405.

## Pass 2: grain

The part was under both ceilings before the check. Two entries were removed.

| Entry | Why |
|---|---|
| gaetuli | Its own note called it a general Roman name for steppe herders. It is a label, not a people at a place. |
| azd-oman | Tradition only, classed indicative. The page read dates the migration to about the 2nd century by a 9th-century account. The Oman wash note still mentions the Azd. |

No link mentioned either. No group fell below two members. I kept all 22 modern states of the part, because the brief asked for a light pass and the keyframe count is 44. If the map is thinned later, Qatar, Bahrain, Kuwait and Lebanon are the smallest.

Some groups show one member at a keyframe (Armenians at 1, 500, 1500 and later; Turks of Anatolia at 1800 and 2026; Aramaic peoples at 2026). Amazigh peoples has no member at 1 now that the Guanches start at 150.

## Pass 3: facts

I looked up **102** kept people and polity entries on the web, in about 70 searches, and **9** wash entries. I also looked up the Azd of Oman before removing it.

### Corrected

| Entry | It said | It says now | Page read |
|---|---|---|---|
| pontus-kingdom | Annexed in 64. | Claim ends 62. Note says 62 or 64. | https://en.wikipedia.org/wiki/Polemon_II_of_Pontus |
| commagene | One claim, 1 to 72. | Two claims, 1 to 17 and 38 to 72. Rome held it as a province between. | https://en.wikipedia.org/wiki/Commagene |
| osroene | "Rome ended it about 242." | A colony about 214, kings in name until about 242. | https://en.wikipedia.org/wiki/Abgarid_dynasty |
| adiabene | Ended 250. | Ends about 379, reconstructed after 116. | https://en.wikipedia.org/wiki/Adiabene |
| palmyra | Wide claim from 260 to 273. | City claim to 270, wide claim 270 to 273. Egypt was taken in 270 and Ancyra reached in 271. | https://en.wikipedia.org/wiki/Palmyrene_Empire and https://en.wikipedia.org/wiki/Zenobia |
| lazica | Attested 1 to 700. | Reconstructed 1 to 131, attested 131 to 697. | https://en.wikipedia.org/wiki/Lazica |
| alans-caucasus | Kingdom from 700. "Destroyed in 1238 and 1239." | Kingdom from 900. Capital taken in 1239 or 1240. | https://en.wikipedia.org/wiki/Alania |
| seljuks-of-rum | "Capital at Konya." | Capital at Nicaea until 1097, then Konya. | https://en.wikipedia.org/wiki/Seljuk_Sultanate_of_Rum |
| danishmends | From 1085. | From 1071. | https://en.wikipedia.org/wiki/Danishmend |
| persian-armenia | To 654. | To 646. | https://en.wikipedia.org/wiki/Sasanian_Armenia |
| kingdom-of-abkhazia | Family `kart`, not inferred. | Family `kart`, inferred. Founded in the 780s. Georgian became dominant, and the first kings' speech is not known. | https://en.wikipedia.org/wiki/Background_of_the_Russo-Georgian_War |
| kartli-kakheti | No word on the union. | United in 1762. | https://en.wikipedia.org/wiki/Kingdom_of_Kartli-Kakheti |
| caucasian-imamate | From 1829. | From 1828. | https://en.wikipedia.org/wiki/Avar_Khanate |
| hamdanids | From 905. | From 890, at Mosul from 905 and Aleppo from 944. | https://en.wikipedia.org/wiki/Hamdanid_dynasty |
| ghassanids | Attested from 490. | Reconstructed to 529. Note names the treaty of 502 and the earlier start in Arab tradition (the page gives 220). | https://en.wikipedia.org/wiki/Ghassanids and https://bmcr.brynmawr.edu/2010/2010.09.18 |
| saudi-emirates | No word on 1727. | Emirs of Diriyah since 1727, alliance of 1744. Claim still starts 1744. | https://en.wikipedia.org/wiki/House_of_Saud |
| county-of-edessa | To 1144. | To 1150. The city fell in 1144. | https://en.wikipedia.org/wiki/Crusader_states |
| county-of-tripoli | Empty note. | Begun 1102, city taken 1109, lost 1289. | same page |
| almoravids | Marrakesh "about 1062". | About 1070. Sijilmasa taken in the 1050s. | https://en.wikipedia.org/wiki/Almoravid_dynasty |
| mozabites | From 1050. | From 1012. Towns founded between 1012 and 1350. Annexed 1882. | https://en.wikipedia.org/wiki/M%27zab |
| guanches | From 1, citing Pliny. | From 150, reconstructed, with the range in the note. Attested from 1341. | https://en.wikipedia.org/wiki/Pre-colonial_history_of_the_Canary_Islands and https://popular-archaeology.com/article/human-colonization-of-the-canary-islands |
| guanche-speakers (wash) | "The date of first settlement is disputed." | Note gives the range, 1st to 4th century, and says the first two centuries of the claim are doubtful. Dates unchanged: see below. | same two pages |
| latin-speakers-africa (wash) | Last claim to 1100. | To 1200. Al-Idrisi heard it at Gafsa in the 12th century, and it may have lasted to the 14th or 15th. | https://en.wikipedia.org/wiki/African_Romance |
| phoenician-speakers (wash) | No word on later survival. | Note says some scholars carry Punic to the Arab conquest. | https://en.wikipedia.org/wiki/Punic_language |
| galatian-speakers (wash) | Jerome only. | Note adds the 6th-century report and says the end date is loose. | https://en.wikipedia.org/wiki/Galatian_language |
| egyptian-speakers (wash) | "Reports of later speakers are doubtful." | Note gives the disagreement: 11th century, about 1400, or later. | https://escholarship.org/content/qt22r6s881/qt22r6s881.pdf and https://ccdl.claremont.edu/digital/collection/cce/id/520/rec/14 |
| israel, syria | West Bank and Palestinian territories only. | Both notes say Israel has held the Golan Heights since 1967 and that sovereignty over them is disputed. | https://en.wikipedia.org/wiki/Golan_Heights |

Changed from memory, with no page read:

- **spanish-sahara** now ends in 1976, not 1975. Spain agreed to leave in November 1975 and withdrew in February 1976.
- **hadramawt** centre moved from 48.5 E to 48.0 E. The note names Shabwa, which lies near 47 E.
- **kabyles** note now says France conquered Kabylia in 1857 and that earlier writers call the people Zwawa.
- **barghawata** note says al-Bakri drew on a Barghawata envoy's report.

### Cyprus and the Aegean coast

Adding `anatolia` to `greek-speakers` did leave a Greek wash on Turkish ground. I computed field strengths with the viewer's own formula. After 1923 the mainland Greece circle (the Europe part's claim, radius 280 km) beat the Turkish wash in the Troad (0.148 against 0.132) and nearly tied it at Çeşme and Çanakkale. The notes did not explain it. The region edit cannot be dropped, because the Greek claims in Anatolia need it. I added one Turkish wash claim for the Aegean coast and the Troad from 1923. Turkish now wins at every coastal point I sampled from Çanakkale to Bodrum by three to one or more.

The same check found two faults in Cyprus, which this part's regions include.

- From 1300 the mainland Turkish wash won on the Karpas peninsula, 270 years before any Turk settled there. I added a Greek claim for the east of the island to 1974.
- In 2026 Greek won at Kyrenia and Morphou, in the north. The Greek claim for Cyprus now ends in 1974 and a smaller one covers the south after it. Turkish Cypriots are an indicative claim across the island from 1571 to 1974 and two attested claims in the north after it.

In 2026 Greek now wins at Paphos, Polis, Troodos, Limassol and Larnaca, and Turkish at Kyrenia, Morphou, Famagusta and the Karpas. Nicosia, which is divided, shows Turkish over Greek, 0.55 to 0.41. Every note on the north says that only Turkey recognises the state there or that sovereignty is disputed. These edits touch one language entry of this part and the `more_claims` for `greek-speakers`. They are finer than the rest of the map, and the next reader may prefer one circle each.

### Disputed territory

The notes say the matter is disputed and do not settle it for: the West Bank and Gaza (palestinians, israel, palestine, and the last period caption), Western Sahara (sahrawis, spanish-sahara, morocco, and the last North Africa caption), northern Cyprus (cyprus, the Turkish and Greek wash claims), the Golan (israel, syria, added in this check), Abkhazia and South Ossetia (abkhaz, ossetians, georgia). Karabakh is described by what happened in 2023 and not called disputed.

### Looked up and found right

- **Anatolia and the Caucasus:** cappadocians (province in 17), karamanids (1250 to 1487), white-sheep-turkmen (1378, Iran lost 1503, Mesopotamia 1508), black-sheep-turkmen (1374 or 1375 to 1468), empire-of-nicaea and empire-of-trebizond (1204 to 1261 and 1461), kurdistan-kurds (the name is first met in Arabic sources of the 7th century), marwanids (983 or 990 to 1085), shaddadids (951, Ani to 1199), kurdish-emirates (Baban ended 1850), yazidis (Sheikh Adi died 1162), kingdom-of-armenia (428), bagratid-armenia (884 or 885 to 1045), vaspurakan (908 to 1021), cilician-armenia (1080, 1198, 1375), iberia-kartli (580), kingdom-of-georgia (1490), imereti (1810), caucasian-albania (705), circassians (1864), vainakh (1944 and 1957), shirvan (861 to 1538).
- **Fertile Crescent and Arabia:** hatra (241), samaritans (revolt of 529), blemmyes, nizaris-of-syria (Masyaf held from 1141, lost in the 1270s), thamud (temple inscription of the 160s), saba (about 275), himyar (Hadramawt about 300, Judaism in the later 4th century, Aksum about 525, Persia about 570), hadramawt, kinda (about 450 to 550), lakhmids (about 300 to 602), tulunids (868 to 905, Turkic founders, Arabic the official language), qarmatians (899 to 1077, Mecca 930), aghlabids, idrisids (788 or 789 to 974), fatimids, zaydi-imams (897 to 1962), rasulids (1229 to 1454, probably of Oghuz origin, Arabic in use), ayyubids (1171, Egypt to 1250, Syria to 1260, Kurdish origin), sharifs-of-mecca (about 967 to 1925), oman-imamate (793 to 893; Yaruba from 1624, Muscat 1650, Al Bu Said 1749), saadi-sultanate, alaouite-sultanate, emirate-of-hail (1836 to 1921), banu-hilal and banu-sulaym (sent west about 1050 to 1052), anaza (into Syria in the mid 18th century), shammar (into Iraq in the 17th), mamluks (1250 to 1517, Kipchak Turkic the soldiers' language, Arabic official), jalayirids (1335 to 1432), kingdom-of-jerusalem, principality-of-antioch.
- **Maghreb:** musulamii (17 to 24), garamantes (the page puts their end in the late 7th century; the file's 600 is early but within reason), laguatan, moors-and-romans (inscription of 508), aures-kingdom (484 to 703), rustamids (777 to 909), midrarids (757 to 976), zirids (972 or 973 to 1148), hammadids (1014 to 1152), wattasids (1472 to 1554), zayyanids (1235 to 1556), hafsids (1229 to 1574), kel-ahaggar (Ibn Battuta among the writers who describe the veiled Tuareg), regency-of-algiers (1516 to 1830), regency-of-tunis (Husainids 1705, protectorate 1881), regency-of-tripoli (1551, Karamanli 1711 to 1835), italian-libya (1911 to 1943), almohads (1269).
- **Wash:** anatolian-speakers (Phrygian last mentioned in the 5th century, Isaurian gravestones as late as the 6th: the file's 450 with its note stands), modern-south-arabian-speakers (not descended from Old South Arabian, as the note says), arabic-arabia in Oman (tradition dates the Azd to about the 2nd century), kurdish-speakers-west (starts 650).

Pages for these, all under https://en.wikipedia.org/wiki/: Cappadocia_(Roman_province), Qara_Qoyunlu, Aq_Qoyunlu, Kurds, Marwanid_dynasty_(Diyar_Bakr), Shaddadids, Baban, Sheikh_Adi_ibn_Musafir, Sasanian_Armenia, Kingdom_of_Vaspurakan, Bagratid_Armenia, Armenian_Kingdom_of_Cilicia, Kingdom_of_Iberia, Principality_of_Iberia, Kingdom_of_Kakheti, George_VII_of_Imereti, History_of_Azerbaijan, Circassians, Operation_Lentil_(Caucasus), Hatra, Samaritans, Blemmyes, Masyaf_Castle, Thamud, Himyar, Kingdom_of_Kinda, Lakhmid_kingdom, Tulunids, Qarmatians, Rustamid_dynasty, Rasulid_dynasty, Ayyubid_dynasty, Sharifate_of_Mecca, Imamate_of_Oman, Omani_Civil_War_(1718–1744), Emirate_of_Jabal_Shammar, Banu_Hilal, Anizah, Shammar, Mamluk_Sultanate, Jalayirid_Sultanate, Crusader_states, Tacfarinas, Garamantes, Laguatan, Nasamones, Mauro-Roman_Kingdom, Barghawata, Hammadid_dynasty, Zirid_dynasty, Wattasid_dynasty, Zayyanid_dynasty, Kingdom_of_Tlemcen, Tuareg_people, History_of_the_Regency_of_Algiers, Beylik_of_Tunis, Ottoman_Tripolitania, Italian_colonization_of_Libya, Anatolian_languages, Phrygian_language, Modern_South_Arabian, Fatimid_army, Abu_Abdallah_al-Shi'i, Maronites, Principality_of_Abkhazia, Georgian–Ossetian_conflict. Also https://www.iranicaonline.org/articles/lakhmids, https://www.britannica.com/topic/Banu-Hilal, https://www.britannica.com/topic/Kindah and, for the Azd, https://etheses.durham.ac.uk/id/eprint/1497/1/1497.pdf.

### Looked up, left as it was, and not settled

- **marinids.** One list on the pages read gives 1269 to 1465, counting from the fall of Marrakesh. The file keeps 1244.
- **qara qoyunlu.** 1374 on one page and 1375 on another. The file keeps 1375.
- **ghassanids.** The page gives 220 to 638 from Arab tradition. The file starts in 490 and says so.
- **Family choices.** The pages support the file: Tulunids, Rasulids and Ayyubids ruled in Arabic whatever their origin, the Mamluks were schooled in Kipchak Turkic, and the Hafsids were of Masmuda Berber descent and ruled in Arabic. The file had the Hafsids as `berb` already, not `arab` as the brief said, and I left it. The Kingdom of Abkhazia stays `kart`, now marked inferred. Modern South Arabian stays under `sarab` for want of a better key.

### Not checked on the web

Galatians, Phrygians and Isaurians as peoples; characene (the one excerpt gave no date); judaea, galilee-jews, babylonian-jews, tyre-and-sidon, israelis, assyrians, mandaeans; egyptians-roman, copts, alexandria, beja-egypt; druze (the excerpt did not carry 1017 or the settlement of the Hauran), alawites; nabataeans (106 came up only in a list); quraysh; zenata, masmuda, sanhaja-north, numidians, mauri; kabyles, riffians and ishelhien before the surveys; tao-klarjeti, caucasus-khanates, azerbaijanis-caucasus, armenians-later, anatolian-turks-people, aegean-beyliks; the three caliphates; kingdom-of-cyprus, the mandates, the protectorates, aden-protectorate, transcaucasia-russian and all 22 modern states; the `more_claims` for byzantine-empire, ottoman-empire, roman-empire, turkey and vandals, which I read and found consistent with what I know (1071, 1097, 534 to 698, 1299, 1326, 1453, 1517, 1922, 429 to 534) but did not look up; when Turkish replaced Greek in Anatolia and Arabic replaced Aramaic, beyond what the wash notes already say. Coordinates were read against the notes by eye. Only Hadramawt was more than a degree off. None was checked against a gazetteer.

## Least sure of

1. **The Canaries before about 200.** The pages read put the first lasting Berber settlement between the 1st and 4th centuries, after a Roman presence. The Guanche wash still runs from 1, because the brief names no expected dark points for this part and a later start would make the islands dark. Its note now says the first two centuries are doubtful. If dark islands are acceptable there, the two wash claims should start at about 150 with the people.
2. **Split years chosen without a page:** Ossetians 1774, Avars 1803, Chechens and Ingush 1800, Riffians and Ishelhien 1880, Kabyles 1830, Guanches 150.
3. **The early Maghreb dynasties as attested** (Idrisids, Rustamids, Midrarids) on sources written two to six centuries later.
4. **Cyprus drawn with five small circles.** It is right at the points sampled but finer than the map's grain.
5. **Blemmyes as attested from 1 to 600** on Strabo at one end and Procopius at the other, with a gap in the 2nd century.
6. **Oman and the Gulf as Arabic in 1 CE.** Left indicative. I found nothing that says what was spoken there, and the Azd tradition points to the 2nd century or later.
7. **The end of spoken Coptic, Punic, Galatian and African Romance.** Each note now gives the range. The claim dates are a middle course.
8. **The period captions** were read and not edited. Nothing in them is now false.
