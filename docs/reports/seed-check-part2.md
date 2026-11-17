# Seed check, part 2: Iran and Central Asia

File checked: `parts/part2.py`. Only that file was edited. Everything in it is still a seed. The web checks below were made against encyclopedia pages, mostly Wikipedia, and not against the primary sources the claims cite.

## Counts

| | Before | After |
|---|---|---|
| Entries | 169 | 166 |
| of type people | 102 | 99 |
| of type polity | 22 | 22 |
| of type language | 45 | 45 |
| Claims in entries | 275 | 277 |
| Claims added to European entries (`more_claims`) | 6 | 6 |
| Groups | 16 | 16 |
| Sources | 23 | 23 |
| Alive at 1 | 24 | 23 |
| Alive at 500 | 17 | 16 |
| Alive at 1000 | 24 | 23 |
| Alive at 1500 | 32 | 32 |
| Alive at 1800 | 40 | 40 |
| Alive at 2026 | 42 | 42 |

No group shows more than 9 members at any keyframe (Mountain and border peoples, and Western Siberia, in 1800 and 2026). In the entries 134 claims are now classed attested, 112 reconstructed and 31 indicative. Before, the figures were 139, 104 and 32.

## Pass 1: class

The audit listed 5 attested claims that began too early, in 4 entries. I then read the rest of the attested claims.

- 5 claims were split into an earlier reconstructed claim and a later attested one.
- 4 claims were demoted outright.
- 4 entries are listed in `attested_early`.

Split:

| Entry | Attested from | Record |
|---|---|---|
| kyrgyz-yenisei | 650 | The Tang histories describe the kingdom, and Turkic inscriptions name it from the 8th century. The years 550 to 650 are now reconstructed. |
| sibir-khanate | 1555 | Russian records of Yediger's dealings with Moscow after the fall of Kazan. The years 1468 to 1555 are now reconstructed. |
| volga-bulgars | 922 | Ibn Fadlan. The years 700 to 922 are now reconstructed, because accounts of when the state formed range from the late 7th to the late 9th century. |
| khwarezmians | 712 | Arabic writers from the conquest of 712. The earlier claim rested on al-Biruni, who wrote about 1000, and on coins. |
| kangju | 1 to 280 attested, 280 to 400 reconstructed | The Hanshu, the Hou Hanshu and the Weilue of the 3rd century. After that Chinese report thins. |

Demoted outright:

- bashkirs, 900 to 1557, from attested to reconstructed. Ibn Fadlan met Bashkirs in 922 west of the mountains, on his road to the Bulgars, and the friars use the name for Great Hungary. Their place in the southern Urals in those centuries is set by later scholarship.
- turkmen-speakers (wash), the Gorgan plain from 1500 and north-western Afghanistan from 1700, from attested to reconstructed. Both cited only modern surveys.
- volga-bulgar-speakers (wash), Chuvash from 1400, from attested to reconstructed. It cited only the census of 1897.

`attested_early`:

- **aorsi**, 1 to 100. Strabo, writing in these years, places the Upper Aorsi along the Caspian. Tacitus names their king under the year 49. The audit dates steppe records from 550.
- **kyrgyz-yenisei**, from 650. Tang histories and Old Turkic inscriptions. The audit dates western Siberia from 1580.
- **sibir-khanate**, from 1555. Russian records of the 1550s.
- **bashkirs**, from 1557. Russian records of their submission in the 1550s. The entry lists `wsiberia` beside `east`, which is why the audit's date of 1580 applies to it.

Kangju, Wusun and Yuezhi were not flagged by the audit, because each lists `turan` or `afghanistan`, where the audit dates records from 1. They rest on the Shiji, Hanshu and Hou Hanshu and stay attested, so no entry in the list was needed for them.

On `WRITTEN_FROM` in `tools/audit.py`: the year 550 for the steppe is too late for its southern and western edges. Strabo, Ptolemy and the Han histories place the Aorsi, Alans, Kangju and Wusun from the 1st century. The year 1580 for `wsiberia` is right for the Ob and too late for the upper Yenisei, where Tang histories and runiform inscriptions start in the 7th and 8th centuries. I did not edit the tool.

Attested claims I read and left: the Oghuz from 766 and the Kimeks from 750 lean on geographers of the 9th and 10th centuries. The Sogdians from 1 lean on Chinese histories until their own letters begin in the 4th century. The Kazakh Khanate from 1465 leans on a history written about 80 years later. All are named by near-contemporary writers at a place, and I kept them.

## Pass 2: grain

The part was inside the ceiling before the check. Three entries were removed.

| Entry | Why |
|---|---|
| sabirs | Indicative only. Its note said the placing in western Siberia was a guess. The written sources put the Sabirs north of the Caucasus. |
| saka-tian-shan | Near-duplicate of the Wusun on the same ground. The page read says the Wusun realm included Saka, and the Saka wash covers the language. |
| sogdian-colonies | Near-duplicate of the Sogdians. The Sogdian wash already has a claim for the towns on the Chu and the Talas. |

No link mentioned a removed entry and no group fell below two members.

Moved: **kyrgyz-yenisei** from the group Turkic khaganates to Western Siberia. It was the only member of Turkic khaganates before 552, and it lies in western Siberia.

Kept on purpose: **parthians** beside **parthian-empire**. The people entry is the Arsacid homeland in the north-east and the state is the whole empire, so the two are not the same ground. The five Soviet republics are short-lived but are not alive at any keyframe.

## Pass 3: facts

I looked up **52** kept people and polity entries on the web, the 2 removed entries Sabirs and Saka of the Tian Shan, the Golden Horde (a European entry this part adds a claim to), and **7** wash entries. Wikipedia could not be reached directly. I read it through a fetch service that returned excerpts of each page, and then through a search tool that returned a summary of the pages it found, most of them Wikipedia or mirrors of it. A check here means the excerpt or summary carried the fact.

### Corrected

| Entry | It said | It says now | Page read |
|---|---|---|---|
| western-turks | Ended 659. Court "near Suyab". | Ended 657. Court at Suyab. A khaganate of its own from about 600. | https://en.wikipedia.org/wiki/Western_Turkic_Khaganate |
| khwarazmian-empire | From 1097. | From 1077. Vassals of the Seljuks and the Kara-Khitai, independent late in the 12th century. | https://en.wikipedia.org/wiki/Khwarazmian_Empire and https://en.wikipedia.org/wiki/Kara-Khanid_Khanate |
| kidarites | Ended 470. | Ended 467, when Peroz beat them. | https://en.wikipedia.org/wiki/Kidarites |
| wusun-semirechye | Family unknown (`steppeunk`). "Their language is not known." | Family `eiran`, inferred. In Chinese records until 436. Most scholars take the language to be Iranian, and others have argued for Tocharian or Turkic. | https://en.wikipedia.org/wiki/Wusun |
| kangju | Language "assumed from names". One claim to 400. | Taken to be eastern Iranian, close to Sogdian. Split at 280. | https://en.wikipedia.org/wiki/Kangju |
| aorsi | Cited Strabo only. | Cites Strabo and Tacitus. Replaced by the Alans in the 1st century. | https://en.wikipedia.org/wiki/Aorsi |
| kyrgyz-yenisei | Turkic-speaking and attested from 550. | No evidence for the language before the Tang period. Attested from 650. | https://en.wikipedia.org/wiki/Yenisei_Kyrgyz |
| ghaznavids-ghazna | Centre at 66.0 E, 34.0 N. Kept Ghazni to 1163. | Centre at 67.5 E, 33.8 N, nearer Ghazni. Ghazni was lost in 1151 or 1163 and Lahore held until 1186. | https://en.wikipedia.org/wiki/Ghaznavids (through search), https://www.newworldencyclopedia.org/entry/Ghaznavid_Empire |
| khanate-of-bukhara | "A Russian protectorate from 1868." | Treaty in 1868, formally a protectorate from 1873. | https://en.wikipedia.org/wiki/Emirate_of_Bukhara |
| kazakh-khanate | Centre at 71.0 E, 45.0 N. No word on Tauke. | Centre at 69.0 E, 44.5 N, nearer Turkistan. 1465 is the date usually given. Tauke died in 1715 or 1718. | https://en.wikipedia.org/wiki/Kazakh_Khanate and https://en.wikipedia.org/wiki/Tauke_Khan |
| kyrgyz-tian-shan | No word on arrival. | The name is recorded there by the 16th century. When they came, and whether many came from the Yenisei, is not settled. | https://www.zti.hu/sipos_ebook/kirgiz/fejezetek/chapters/SK_02-01.html (through search) |
| qajar-iran | From 1796. | From 1794, when the last Zand fell. Crowned 1796. This closes a gap of two years after the Zands. | https://iranicaonline.org/articles/aga-mohammad-khan and https://www.britannica.com/topic/Qajar-dynasty (through search) |
| sibir-khanate | Yermak and Kuchum only. | Adds Yediger's dealings with Moscow in the 1550s and Kuchum's accession by 1563. | https://en.wikipedia.org/wiki/Khanate_of_Sibir and https://en.wikipedia.org/wiki/Conquest_of_the_Khanate_of_Sibir |
| volga-bulgars | A state from 700. | The date the state formed is given as anything from the late 7th to the late 9th century. | https://en.wikipedia.org/wiki/Volga_Bulgaria |
| samoyedic-speakers (wash) | Notes for the tundra gave no doubt about 1 CE, except west of the Urals. | All three tundra notes say Samoyedic speakers may have come north only in the first millennium, or some time before the 12th century. Class and shape are unchanged. | https://en.wikipedia.org/wiki/Nenets_people |
| yeniseian-speakers (wash) | East of the Yenisei: "Yeniseian or other Old Siberian languages are assumed." | Yeniseian speakers are thought to have come north late from the Sayan and Baikal country, so the claim stands for unknown languages. | https://en.wikipedia.org/wiki/Yeniseian_languages |

### Looked up and found right

- **Iran before Islam:** parthian-empire (to 224), elymais (to 221 or 224, Aramaic written and no evidence that it was spoken, as the note says), indo-parthians (Gondophares from 19, Sistan to about 230).
- **Bactria and the Huns:** yuezhi-bactria (the Kushan division dominant between about 30 and 50), kushans (Kujula about 50 to 90, Kanishka's era from 127), hephthalites (440s to about 560, princes to 710), nezaks (from 484), turk-shahis (7th to 9th century, at Kabul).
- **Dynasties of Iran:** tahirids (821 to 873), saffarids (861 to 1002 or 1003), samanids (819 to 999), buyids (934 to 1062), ghurids-ghor (ended 1215), great-seljuks (recognised in Nishapur and Merv in 1037, Baghdad 1055), afsharids (1736 to 1796), zands (ended 1794), hotaks (1709 to 1738).
- **The steppe:** kara-khanids-west (840 to 1212, Bukhara taken in 992 and again 999), kara-khitai-west (gurkhan in Mongolia in 1124, moved west in 1130, ended 1218), kimeks (743 on one list), oghuz-yabgu (750 to 1055), chagatai-khanate (from 1225 or 1226, split in the 1340s), moghulistan (from 1347), timurid-empire (1370 to 1507), ilkhanate (ended 1335), uzbek-ulus (1428 to 1468), nogai-horde (1440s to 1634, capital Saraychik), kazan-khanate (1438 to 1552), kazakh-zhuzes (the Dzungar attack of 1723), khanate-of-kokand (about 1709), kalmyks (1630 to 1771, those west of the Volga stayed), dzungars-west (destroyed by the Qing), golden-horde.
- **Afghanistan:** durrani-afghanistan (1747 to 1823, capital to Kabul in 1776), afghanistan (the Barakzai emirate follows the Durranis).
- **Peoples:** baloch-iran (homeland near the Caspian, moving east from late Sasanian times), nenets, magna-hungaria (Julian's journey of 1235 to 1236. The identification of Great Hungary is still argued, and the claim is indicative).
- **Wash:** early-hungarian-speakers (the southern Urals and western Siberia are one of the source regions on the page read), median-speakers (Old Azari declining from the 11th century and gone by the 16th or 17th), saka-speakers (eastern Iranian).

Pages for these, all under https://en.wikipedia.org/wiki/ and read as excerpts: Elymais, Yuezhi, Kushan_Empire, Hephthalites, Kidarites, Nezak_Huns, Indo-Parthian_Kingdom, Turk_Shahis, Kara-Khanid_Khanate, Qara_Khitai, Kangju, Wusun, Aorsi, Sabirs, Yenisei_Kyrgyz, Saka, Samoyedic_peoples, Nenets_people, Evenks, Yeniseian_languages, Hungarian_prehistory, Old_Azeri, Baloch_people. Named in search summaries: Timeline_of_the_Chagatai_Khanate, Moghulistan, Durrani_Empire, Nogai_Horde, Khanate_of_Kazan, Uzbek_Khanate, Kalmyk_Khanate, Iranian_Intermezzo, Friar_Julian, Barefooted_Flight.

### Looked up, left as it was, and not settled

- **karluks-west.** One list on the pages read gives the Karluks 665 to 744. The file keeps 766 to 940, from their taking of Suyab to the Kara-Khanids.
- **saffarids.** The end is 1002 on some pages and 1003 on others. The file keeps 1003.
- **evenki-speakers-yenisei** (wash). The pages say only that Tungusic reached the Yenisei after Uralic, Yeniseian and Turkic. No date was found. The file keeps about 1200, indicative.
- **pashto-speakers** (wash). The search found no dated evidence for the early area. The note already calls it a guess.
- **Kangju's end.** The page says the 5th century. The file ends the entry in 400.

### Could not check

- Not found on the pages read, and left from memory: the Ilkhanate's start in 1256, the Safavid dates, the dates of Khiva, Kokand's end in 1876, the Sasanian dates, the first Russian naming of the Chuvash, the Karakalpaks about 1600, Stephen of Perm, the Dzungar removal of the Yenisei Kyrgyz in 1703, the Qing and Soviet dates for Tuva.
- Dates I put into notes from memory and did not confirm: Tacitus on the Aorsi under the year 49, the Arab entry into Khwarezm in 712, Yediger's tribute "in the 1550s" (the page confirms his message of 1552 and limited tribute after it), and the split year of 650 for the Yenisei Kyrgyz.
- Not looked up at all: parthians, persians, atropatene, hyrcanians, tabaristan-princes, aq-qoyunlu-iran, kurds-iran, lurs, daylamites, gilaks-and-mazandaranis, pashtuns-afghanistan, hazaras, qashqai, khuzestan-arabs, azeris-iran, arabs-of-khurasan, sogdians, chach, fergana, bactrians, zunbils, tajiks, pamiris, badakhshan, sakastan, dahae, kipchaks-east, khazars-volga, ulus-of-orda, khanate-of-khiva, uzbeks, kazakhs, karakalpaks, turkmens, the Volga and Kama peoples other than the Bulgars and Eastern Magyars, the western Siberian peoples other than the Nenets and the Yenisei Kyrgyz, sasanian-empire, safavid-iran, iran, russian-siberia, russian-turkestan and the Soviet and modern republics.
- The added claims for sarmatian-speakers, alani, huns and pechenegs were read and left. They are classed reconstructed or indicative and agree with the pages read for the Aorsi and Kangju (Yancai renamed Alanliao in the Hou Hanshu). The Pecheneg claim was not looked up.
- Coordinates were checked by eye against what I know of each capital, not against a gazetteer. Two were moved (Ghaznavids, Kazakh Khanate).

## Family keys

- **wusun-semirechye** moved from `steppeunk` to `eiran`, inferred.
- **elymais** stays under `aram`, inferred. The page read says nothing is known of the spoken language and that there is no evidence Aramaic was spoken. There is no key for Elamite. The note says so.
- **yuezhi-bactria** stays under `steppeunk`. Tocharian and Iranian are both argued.
- **kidarites, hephthalites, nezaks** stay under `steppeunk`. The pages say their written language was Bactrian and their own speech is unknown, perhaps Turkic.
- **khanty, mansi and ob-ugric-speakers** are under `samoyed`, which is the key for "Ob-Ugric and Samoyedic". That is correct by the list.
- **ghurids-ghor** under `eiran`, inferred, was not looked up.

## What I am still least sure of

1. **The tundra wash before about 1000.** Samoyedic is drawn from the White Sea to Taymyr from 1 CE. The pages read suggest the speakers came north later. Nothing else is known to put there, so the claims stay indicative and the notes now say so.
2. **Siberia east of the Yenisei.** The Yeniseian claim before 1300 and the Evenki date of 1200 are placeholders.
3. **Wusun as Iranian.** It follows the majority view on one page. The Saka wash note beside it still says their language is not known.
4. **The split years** 280 for Kangju, 650 for the Yenisei Kyrgyz and 1555 for Sibir are my own choices inside what the pages allow.
5. **The Kyrgyz in the Tian Shan from 1500** stays attested on the strength of 16th-century Persian histories, which I did not read.
6. **Bashkirs before 1557** are now reconstructed. A reader who trusts Ibn Fadlan's placing could argue for attested from 922.
7. **Persian standing in for Makran and Carmania before 1050**, and Pashto's area before 1500, are still guesses and say so.
8. **Elymais under Aramaic** paints a people in the colour of a script.
