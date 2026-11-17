# Seed check, part 6: Africa south of the Sahara

File checked: `parts/part6.py`. Only that file was edited. Everything in it is still a seed. The web checks below were made against encyclopedia pages and a few scholarly papers, not against the primary sources the claims cite.

## Counts

| | Before | After |
|---|---|---|
| Entries | 231 | 191 |
| of type people | 149 | 113 |
| of type polity | 36 | 32 |
| of type language | 46 | 46 |
| Claims | 391 | 376 |
| Groups | 29 | 29 |
| Sources | 18 | 18 |
| Alive at 1 | 20 | 19 |
| Alive at 500 | 27 | 26 |
| Alive at 1000 | 39 | 36 |
| Alive at 1500 | 66 | 52 |
| Alive at 1800 | 95 | 60 |
| Alive at 2026 | 77 | 57 |

No group has more than 7 members alive at any keyframe. After the check 147 claims are classed attested, 197 reconstructed and 32 indicative.

## Pass 1: class

The audit listed 11 attested claims that began too early. One of them (Mombasa) went with its entry in pass 2. The other ten were split or demoted, and I then read the rest of the attested claims.

- 24 claims were split into an earlier reconstructed claim and a later attested one (for Alwa the other way round).
- 3 claims were demoted outright.
- 2 entries are listed in `attested_early`.

Split, with the year the attested claim now starts and the record that justifies it:

| Entry | Attested from | Record |
|---|---|---|
| ghana-wagadu | 850 | Arab geographers name it from about 800 and al-Yaqubi describes it in the late 9th century. Al-Bakri describes the capital in 1068. |
| gao-kingdom | 850 | Al-Khwarizmi names Kawkaw before 850 and al-Yaqubi about 872. |
| sanhaja-south | 850 | Al-Yaqubi, then al-Bakri. |
| kanem | 872 | Al-Yaqubi, 872. |
| takrur | 1035 | Al-Bakri on the conversion of War Jabi. |
| tuareg-sahel (first claim) | 1068 | Al-Bakri on Tadmakka. Ibn Battuta in 1353. |
| tigrayans | 1270 | Ethiopian chronicles. The centuries after Aksum are poorly recorded. |
| somali-people | 1330 | Ibn Battuta at Zeila and Mogadishu about 1331. The name Somali appears in the early 15th century. |
| swahili (second claim) | 1331 | Ibn Battuta at Mombasa and Kilwa. |
| kilwa | 1331 | Ibn Battuta. |
| jolof | 1455 | Cadamosto. |
| temne | 1505 | Portuguese writers of the first years of the 16th century. |
| mutapa | 1506 | Portuguese letters from Sofala. |
| ndongo | 1520 | The Portuguese mission to the ngola. |
| makua | 1600 | Portuguese writers. |
| oyo | 1700 | European traders on the coast. |
| dahomey | 1724 | European traders at Whydah. |
| fula-people (Futa Jallon claim) | 1725 | Tied to the state. A weak "a": see the last section. |
| darfur-sultanate | 1793 | Browne. |
| segu | 1796 | Mungo Park. |
| wadai | 1810 | Al-Tunisi. |
| southern-cushitic-speakers (wash) | 1890 | German-period records. This is a language entry, changed because the class was wrong. |
| gwi | 1900 | Travellers and later ethnography. |
| alwa | 500 to 1300 attested, 1300 to 1504 reconstructed | Its last two centuries are barely recorded. |

Maravi was already split. The boundary moved from 1600 to 1616, the year of the first written account.

Demoted outright:

- sofala, 1000 to 1505, from attested to reconstructed. Arab writers use the name for a coast, and the town is first placed by the Portuguese.
- mossi, the claim from 1600, from attested to reconstructed up to 1888. Its sources were oral tradition and 19th-century travellers.
- sudanese-arabic (wash), the claim from 1350, from attested to reconstructed. The pace of the shift from Nubian to Arabic is debated.

`attested_early`:

- **swahili** and **kilwa**. The audit dates written records in the `lakes` and `zambezi` regions from 1500. Ibn Battuta visited Mombasa and Kilwa in person about 1331 and names both. The attested claims of both entries now start in 1331.

No exception was needed for the Sahel kingdoms, because splitting at 850 or 872 puts them inside the audit's date.

## Pass 2: grain

40 entries removed: 36 peoples and 4 modern states. Two entries were trimmed instead of removed. All can be restored when the map goes finer.

| Entry | Why |
|---|---|
| kaffa | Small kingdom, early date from tradition only. |
| sidama | Small neighbour of the Oromo. The claim mixed two peoples. |
| kalenjin | The name dates from the 1940s but the claim began in 1000. |
| nuer | Neighbour of the Dinka, who are kept. |
| shilluk | Small kingdom beside the Dinka. |
| turkana | Small neighbour, reconstructed only. |
| kaabu | Province of Mali for much of its span. Known mainly from tradition. |
| wassoulou | Lasted twenty years. |
| dogon | Small. Its family key (`gur`) fitted badly. |
| zaghawa | Small today. The early Arabic use of the name is much wider than the people. |
| bagirmi | Smaller neighbour of Bornu and Wadai. |
| futa-toro | Near-duplicate on the ground of Takrur and the Fula people. |
| nupe | Smaller neighbour of Oyo and the Hausa states. |
| tiv | Small. Its family key (`kwa`) fitted badly. |
| fante | Small coastal neighbour of Asante. Akan covers them later. |
| ewe | Small neighbour of Dahomey. |
| kru | Small. Its family key (`kwa`) fitted badly. |
| burundi-kingdom | Twin of Rwanda, which is kept. |
| loango | Smaller neighbour of Kongo. |
| tio | Smaller neighbour of Kongo. |
| ovimbundu | Several small kingdoms, reconstructed. |
| kazembe | Offshoot of Lunda, which is kept. |
| lozi | Smaller savanna kingdom. Its family key was doubtful (see below). |
| bemba | Smaller savanna kingdom. |
| mombasa | One city, covered by Swahili. |
| swazi | Small neighbour of the Zulu. |
| pedi | Small neighbour of the Tswana and Sotho. |
| himba | Herero speakers, covered by Herero. |
| kamba | Neighbour of the Kikuyu. |
| nyamwezi | Reconstructed before 1850. |
| hehe | Small and late. |
| yao-malawi | Neighbour of the Makua. |
| twa | A loose label for scattered groups, indicative only. |
| korana | Small Khoekhoe group. |
| griqua | Small and short. Its family key (`wgerm`) fitted badly. |
| xam | The San and Juǀʼhoansi entries cover the group. /Xam stays in the wash note. |
| ghana-state | Modern state beyond the largest. |
| mauritania-state | Modern state beyond the largest. The Bidan entry covers the country. |
| zambia-state | Modern state beyond the largest. |
| namibia-state | Modern state beyond the largest. |

Trimmed:

- **amhara** now starts in 1900, not 1300. Before that it duplicated the entry Ethiopia (the Solomonic kingdom) on the same ground.
- **agaw** now ends in 1300. Its later claim was a small remnant. The Agaw wash still shows the language to 2026, and the note says so.

Added, to keep the Congo basin from having only foragers and states in 2026: a modern claim for **kongo** (Bakongo, from 1914) and one for **luba** (Baluba, from 1889).

Modern states kept (15): Ethiopia, Nigeria, DR Congo, South Africa, Tanzania, Kenya, Sudan, South Sudan, Somalia, Angola, Mozambique, Mali, Niger, Chad and Liberia. Liberia is small but is kept for 1847 to 1960, when it was one of two independent states.

Spread of peoples and states by region:

| Region | 1500 | 1800 | 2026 |
|---|---|---|---|
| West Africa and the Guinea coast | 7 | 9 | 8 |
| The Sahel and Lake Chad | 9 | 9 | 7 |
| The Nile and the Horn | 12 | 10 | 12 |
| The Congo basin | 4 | 7 | 6 |
| The Great Lakes and East Africa | 9 | 10 | 8 |
| The Zambezi and the south | 11 | 15 | 16 |

Each entry is counted under the first region it lists, states included. The south is the heaviest: it holds the Khoe and San groups as well as the Nguni and Sotho. No links mentioned a removed entry. No group was left with fewer than two members, though some groups show one member at a given keyframe (Akan and Gbe in 1500 and 2026, Fula jihad states in 1800, Swahili coast and Zimbabwe plateau in 2026).

## Pass 3: facts

I looked up **62** kept people and polity entries on the web, and **2** wash entries (Hassaniya Arabic and Sudanese Arabic). The session could reach Wikipedia only through a search service, which returned excerpts of each page and not the whole page. A check here means the excerpt carried the fact.

### Corrected

| Entry | It said | It says now | Page read |
|---|---|---|---|
| nobatia | Joined to Makuria by about 700. Claim to 700. | Joined in the 7th century, probably before 652. Claim to 650. Link year 650. | https://en.wikipedia.org/wiki/Nobatia and https://en.wikipedia.org/wiki/Makuria |
| makuria | Remnant "in the north" at 21.0 N. | Court at Gebel Adda in Lower Nubia. Last known king in the 1480s. Centre moved to 21.6 N. | https://en.wikipedia.org/wiki/Makuria |
| alwa | "It fell about 1500." | First named in 569, Christian from 580. Whether Arabs or Funj took Soba is disputed. | https://en.wikipedia.org/wiki/Alodia |
| ifat | Family `cush`. Ended 1415. | Family `ethsem`, inferred. The last sultan died in 1403 or 1415 and sources disagree. | https://en.wikipedia.org/wiki/Sultanate_of_Ifat |
| ghana-wagadu | "Weakened after the Almoravids, and taken into Mali about 1240." | The Almoravid conquest is disputed. The Sosso took it about 1203 and Mali by about 1240. | https://en.wikipedia.org/wiki/Ghana_Empire |
| gao-kingdom | "Under Mali for part of the 14th." | Under Mali from about 1300 to the early 15th century. | https://en.wikipedia.org/wiki/Gao_Empire and https://en.wikipedia.org/wiki/Songhai_Empire |
| mali-empire | Ended 1670. | Ended 1610. | https://en.wikipedia.org/wiki/Mali_Empire |
| kanem | Islam "about 1085". | Islam in the 11th century. Founded about 700 by later reckoning. | https://en.wikipedia.org/wiki/Kanem%E2%80%93Bornu_Empire |
| sokoto | Claim from 1808. | Claim from 1804, the year of the jihad. | https://en.wikipedia.org/wiki/Sokoto_Caliphate |
| mossi | No word on founding. | Founding dates from tradition range from the 11th to the 15th century. | https://en.wikipedia.org/wiki/Mossi_Kingdoms |
| wadai | "France took it in 1909." | France took the capital in 1909 and ended the sultanate in 1912. | https://en.wikipedia.org/wiki/Wadai_Sultanate |
| darfur-sultanate | One claim, 1650 to 1916. | A gap from 1874 to 1898, between the Egyptian conquest and Ali Dinar's restoration. | https://en.wikipedia.org/wiki/Sultanate_of_Darfur |
| oyo | "Collapsed by 1836." | The capital was destroyed about 1835. | https://en.wikipedia.org/wiki/Oyo_Empire |
| rwanda-kingdom | Ended 1962. Founded "between the 15th and 17th centuries". | Ended 1961. Founded between the 14th and 17th centuries. | https://en.wikipedia.org/wiki/Kingdom_of_Rwanda |
| luba | No word on founding. | Scholars date its founding from before 1500 to the 18th century. | https://en.wikipedia.org/wiki/Kingdom_of_Luba |
| maravi | Known to the Portuguese "from about 1600". | First described by Bocarro in 1616. | https://en.wikipedia.org/wiki/Maravi |
| kilwa | No word on founding. | The Kilwa Chronicle gives a 10th-century founding and archaeology a later one. | https://en.wikipedia.org/wiki/Kilwa_Sultanate |
| mapungubwe | "A hilltop capital" from 1075. | At K2 first, and on the hill from about 1220. | https://en.wikipedia.org/wiki/Kingdom_of_Mapungubwe |
| butua, rozvi | Butua ended and Rozvi began in 1684. Portuguese driven off "in 1693". | 1683. Driven off "in the 1690s". Link year 1683. | https://en.wikipedia.org/wiki/Kingdom_of_Butua and https://en.wikipedia.org/wiki/Rozvi_Empire |
| herero | No word on arrival. | Accounts of their arrival range from the 15th to the 18th century. | https://en.wikipedia.org/wiki/Herero_people |
| fula-people | Central Sahel claim from 1750. | From 1500. Fula reached Hausaland by the 15th century and Bagirmi by the 16th. | https://en.wikipedia.org/wiki/Fula_people |
| tuareg-sahel | "Kel Tamasheq in their own language." | The same, with the gloss "speakers of Tamasheq" and a note that Tuareg is an outside name. | https://en.wikipedia.org/wiki/Tuareg_people |
| juhoansi | Name written Ju/'hoansi. | Juǀʼhoansi, with the older spelling in the note. | https://en.wikipedia.org/wiki/Ju%C7%80%CA%BChoansi |
| gwi | Name written G/ui and G//ana. | Gǀui and Gǁana, to match. Not looked up. | none |
| sudanese-arabic (wash) | Arabic the main language from 1350, attested. | Reconstructed. The note says the pace is debated and that some place the shift under the Funj. | https://en.wikipedia.org/wiki/Makuria and https://afrikanistik.phil-fak.uni-koeln.de/sites/inst_afrika/grafiken/mitarbeit/Jakobi/Jakobi_2008_Nubian_EALL.pdf |

Also changed without a web source, from the brief: the Bidan note now says that Western Sahara's sovereignty is disputed, and the Dinka note says the same of Abyei. The Somalia and South Sudan notes already did so for Somaliland and Abyei.

### Looked up and found right

- **Nile and Horn:** meroe-kush (ended about 350), funj (1504 to 1821, origin unclear), aksum-kingdom (to about 940 or 960), zagwe (1137 to 1270, with other start dates on the page), adal (1415 to 1577, Harar from 1520), oromo-people (movement in the 16th century), ajuran (13th to 17th century).
- **Sahel:** songhai-empire (1464, 1591), takrur (1030s, about 1285), bornu (Rabih 1893), hausa-states (conquered by 1808), jolof (about 1350 or 1360 to 1549), segu (1712, 1861), futa-jallon (1725, 1896).
- **Guinea coast:** benin-kingdom (about 1180 to 1200, 1485, 1897), bono (fell 1722 to 1723), asante (first European in Kumasi about 1701), dahomey (early 17th century, 1894).
- **Congo and the lakes:** kongo (about 1390, 1914), kitara (Chwezi dated 1300 to 1500 by one of several schemes), buganda (founded between the 12th and 14th centuries), lunda (17th century to 1887), ndongo (1520).
- **Zimbabwe and the south:** great-zimbabwe (capital from the 13th century, decline by 1450 to 1500), mutapa (first account 1506, vassal 1629, break-up about 1760), gaza (1824 to 1895), cape-colony (1652, British in 1795 and 1806), transvaal-republic and orange-free-state (1854 for the latter), sotho (Moshoeshoe in the 1820s).
- **Early Iron Age:** urewe (about 500 BCE to the 6th century), kwale (first to third century on the coast), matola (first dates in the first to third century in southern Mozambique, with the name now often replaced by Silver Leaves, 280 to 450), kalundu (5th century in southern Zambia). The wash dates of 250 for the coastal plain, 400 for Natal and 400 north of the Vaal agree with the pages read.
- **Names:** khoekhoe, nama (Namaqua is the older form), fula-people (Fulbe own name, Fulani from Hausa, Peul in French), ovambo (Aawambo, in the far north from about the 14th century and further south in the 17th).
- **Wash:** hassaniya-arabic (the war of Char Bouba, 1673 to 1677).

Pages for these: the Wikipedia articles Kingdom_of_Kush, Funj_Sultanate, Kingdom_of_Aksum, Zagwe_dynasty, Adal_Sultanate, Oromo_expansion, Ajuran_Sultanate, Songhai_Empire, Takrur, Kanem–Bornu_Empire, Hausa_Kingdoms, Jolof_Empire, Bamana_Empire, Imamate_of_Futa_Jallon, Kingdom_of_Benin, Bonoman, Asante_Empire, Kingdom_of_Dahomey, Kingdom_of_Kongo, Empire_of_Kitara, Buganda, Lunda_Empire, Kingdom_of_Ndongo, Great_Zimbabwe, Kingdom_of_Mutapa, Gaza_Empire, Dutch_Cape_Colony, South_African_Republic, Orange_Free_State, Sotho_people, Urewe, Bantu_expansion, Khoekhoe, Nama_people, Fula_people, Ovambo_people and Char_Bouba_war, all under https://en.wikipedia.org/wiki/. For the pottery traditions also https://www.archaeology.org.za/sites/default/files/attachments/publications/2020/09/15/The%20Digging%20Stick%20%20August%202020%20%28Final%20Print%29.pdf, https://www.uu.se/download/18.21bc08b51a0fb7f4506ec7a/1791272427777/Morais.pdf and https://sahistory.org.za/sites/default/files/archive-files3/andrew_roberts_history_of_zambiabook4you.pdf.

### Looked up, left as it was, and not settled

- **kuba.** The page gives 1625 to 1884. The file keeps 1900, which I believe is when the Congo Free State's forces took the capital. I did not find a page that confirms 1900.
- **rozvi.** The page gives an end in 1866. The file keeps 1834, when Nguni armies broke the state.
- **oyo.** The page gives a founding about 1300. The file keeps 1400, classed reconstructed, with a note that early dates are tradition.
- **buganda.** The file's start of 1400 is at the late end of the range on the page.

### Could not check

- The pages for the Kwale and Kalundu traditions did not exist under the names I tried. They were checked from search excerpts only. Nkope, Gokomere and the Upemba culture were not looked up.
- The Zulu kingdom page returned no dates. 1816 and 1879 stand unchecked. The 1852 date for the South African Republic was not in the excerpt either.
- The founding of Kaabu was not on the page read. The entry was removed.
- Not looked up at all: noba, beja-people, nubians, tigrayans, agaw, amhara, afar-people, somali-people (the date the name first appears), southern-cushites, dinka, luo-people, maasai, middle-niger-towns, sanhaja-south, bidan, teda, sao-culture, hausa-people, massina, tukulor, nok-culture, igbo-ukwu, igbo, ife, yoruba, akan, temne, mende, western-bantu-farmers, nkope, gokomere, bunyoro, kisalian, azania, swahili, sofala, zanzibar, shona, xhosa, northern-nguni, zulu, tswana, ndebele, ngoni, kikuyu, makua, mbuti, baka-aka, damara, san, gwi, hadza, sandawe, and all the colonial and modern states except the Cape Colony and the two Boer republics.
- The travellers' dates I put into notes from memory and did not look up: Cadamosto 1455, Browne 1793, Mungo Park 1796, al-Tunisi about 1810, the first Portuguese naming of the Temne about 1505, Europeans at Ouagadougou in the 1880s.
- Coordinates were checked by eye against what I know of each capital, not against a gazetteer. One was moved (the Makuria remnant).

## Family keys

Checked against `FAMILIES` in `atlas/model.py`.

Moved:

- **ifat** from `cush` to `ethsem`, inferred. The pages read say its people spoke Ethiopian Semitic languages (Harari, Argobba) and Cushitic ones, with Arabic written.

Removed with their entry: kru, tiv, dogon, lozi, griqua (people entries).

Still a bad fit, and why they stay:

- **kru-speakers** (wash) under `kwa`. Kru is its own branch. There is no closer key.
- **middle-belt-speakers** (wash) under `kwa`. Nupe fits. Tiv and the Plateau languages do not, and Tiv is closer to Bantu. There is no closer key.
- **meroitic-speakers** and **meroe-kush** under `nsother`, inferred. If Meroitic is near Nubian, as many now hold, `nubian` would be nearer, but Meroitic is not Nubian. Left under "Other Nilo-Saharan".
- **funj** under `arab`, inferred. The Funj's own language is unknown. Arabic was the language of the court and of record, so the rule for rulers and ruled applies.
- **adal** under `cush`, inferred. Its armies were Somali and Afar, its towns spoke Harari and its records are Arabic. `ethsem` would be as defensible. I left it because Ifat now carries the Semitic side.
- **luba** and **lunda** under `bantuw`. They are savanna Bantu, placed with the west or the centre depending on the scheme. Of the three Bantu keys `bantuw` is the least bad.
- **sofala** under `bantus`, inferred. Its traders were Swahili and its hinterland Shona.
- **mbuti** and **baka-aka** under `bantuw`, inferred. Baka speak an Ubangi language and Efe a Central Sudanic one. The note says so.
- **nok-culture** under `kwa`, inferred. The language is unknown.
- **transvaal-republic** and **orange-free-state** under `wgerm` fit: the key covers Dutch.

## What I am still least sure of

1. **The class of claims between first contact and about 1850.** I split where I knew of a dated record. Several attested claims still rest on the bucket of 19th-century travellers for years before any traveller came: Juǀʼhoansi from 1850, the Futa Jallon Fula from 1725, Igbo from 1700, Bidan from 1650, Hausa city states from 1450, Beja from 650.
2. **Which entries to drop.** The choice between, say, Shilluk and Maasai, or Swazi and Ndebele, is a judgment about importance. The Guinea coast west of Asante and the Congo forest are now thin.
3. **Trimming Amhara and Agaw** in place of removing them. It keeps the count down but makes the Amhara appear in 1900, which is an artefact of the map and not a fact.
4. **The click letters** in Juǀʼhoansi, Gǀui and Gǁana. They are the standard spelling. I have not seen whether the map's font draws them.
5. **Dates from tradition** that the pages themselves give as ranges: Ghana before 790, Kanem about 700, Oyo, Buganda, Rwanda, Luba, Kitara, Mossi, Mutapa's founding, Kilwa's founding. All are classed reconstructed or indicative.
6. **The Bantu arrival dates in the wash** agree with the pages I read for the coast and the Limpopo. The dates for western and central Tanzania, the Angolan plateau and the upper Zambezi are still guesses and say so. The highveld Sotho date of 1400 matched one line of one page. The Herero date is disputed.
7. **Arabic on the middle Nile.** The wash still starts Arabic in 1350 and ends Nubian in 1500 across most of the valley. The pages read suggest Nubian lasted longer in places.
8. **Kuba's end date** and **Rozvi's end date**, as above.
