# Seed check, part 7: the Americas

Checked file: `parts/part7.py`. Only that file was edited. Every edit was made by hand with the edit tool.

## Counts

| | before | after |
|---|---|---|
| entries | 278 | 169 |
| languages (the wash) | 50 | 50 |
| peoples | 198 | 97 |
| states | 30 | 22 |
| claims | 672 | 585 |
| groups | 30 | 30 |
| links | 21 | 18 |
| alive at 1, 500, 1000, 1500, 1800, 2026 | 36, 54, 83, 112, 130, 125 | 22, 31, 40, 54, 60, 60 |

No group has more than seven members alive at any keyframe.

Gates at the end: `add_part.py --check` prints "ok, nothing written". `audit.py` prints "audit passes" with 0 early attested claims. `wash_check.py` reports 19 dark points, all expected: the Falklands before 1751 to 1767, Jamaica before about 576, the Bahamas before about 676 to 726 and from about 1526 to 1626.

## Pass 1: class

Of the 22 claims the audit listed, 4 belonged to entries that were removed in pass 2 (St Lawrence Iroquoians, Mi'kmaq, Lenape, Ava Guaraní). The other 18 were handled as follows.

- **Demoted to r, 3 claims.** The three Inca empire claims (1438, 1470 and 1480 to 1532). The Spanish saw only the last four years and wrote the history afterwards.
- **Split at the first record, 15 claims** (earlier part r, later part a): Norse Greenland in both the language entry and the people entry (4 claims, split at 1124); Zuni and Hopi wash (1540); St Lawrence Iroquoian wash (1535); Taíno wash on Hispaniola (1492); Chiriguano Guaraní wash (1550); three Quechua wash claims (1534, 1534, 1538); Aymara people (1535); Wendat (1615, Champlain's visit); Taíno chiefdoms (1492); Querandí (1536).

Further "a" claims that I read and changed, though the audit did not list them:

- Mexica empire 1428 to 1521: demoted to r. Eyewitness accounts begin in 1519.
- Purépecha state 1350 to 1530: demoted to r. The Relación de Michoacán was written about 1540.
- Mixtec 900 to 1521: split at 1300, the date of the oldest surviving painted histories.
- Wayuu 1500 to 2026: split at 1700. I could not find when Spanish records first place them, so the split year is a guess.
- Cree 1600 to 2026: split at 1670, the start of the Hudson's Bay Company records.
- Powhatan 1570 to 1646: split at 1607.
- Mvskoke 1650 to 1836: split at 1700.
- Inuit of Nunavik and Labrador 1600 to 2026: split at 1771.
- Kalaallit 1600 to 2026: split at 1721.
- Tupinambá of Maranhão 1500 to 1700: split at 1612.
- Qom 1550 to 2026: split at 1650.

Totals: 5 claims demoted outright, 24 claims split.

**`attested_early` exceptions: 2.** `norse-greenlanders` and `norse-greenland-speakers`. The audit sets written records for the Arctic at 1576, but the Greenland settlements are named in Ari Thorgilsson's Book of the Icelanders (about 1125, already a source in the atlas as `islendingabok`), had bishops appointed from the 1120s, and are last recorded in the letters about the Hvalsey wedding of 1408. I did not read Ari's text for this check. The claim rests on what the pages listed under pass 3 say about it. The years 985 to 1124 are now class r.

## Pass 2: grain

109 entries removed: 101 peoples and 8 states. Every one can be restored when the map goes finer. Two short-lived states were folded into their successors as an extra claim instead of being lost: Gran Colombia is now the 1819 to 1831 claim of `colombia-state`, and the Empire of Brazil is the 1822 to 1889 claim of `brazil-state`.

| Removed | Why |
|---|---|
| kaqchikel, huastec | Small neighbours of the K'iche' and the Maya; Maya group kept at five |
| teuchitlan, otomi, tlaxcala, totonac | Small or loosely placed neighbours of Teotihuacan and the Mexica |
| lenca, pipil, diquis, bribri | Isthmus thinned to Gran Coclé, Chorotega, Miskito and Guna |
| sican, chincha | Small coastal neighbours of Chimor |
| recuay, chachapoya, uru | Small highland neighbours; Recuay's language was a guess |
| quimbaya, zenu, canari, kogi | Northern Andes thinned; languages of the first three unknown |
| weeden-island, coles-creek, fort-ancient, oneota, natchez | Archaeological cultures beside Hopewell, Cahokia and the Mississippian chiefdoms |
| laurel, beothuk, st-lawrence-iroquoians, innu, mikmaq, wabanaki, wampanoag, lenape, shawnee | North-east thinned to Wendat, Haudenosaunee, Anishinaabe, Cree and Powhatan |
| timucua, choctaw, chickasaw, seminole, catawba | South-east thinned to Calusa, Cherokee and Mvskoke |
| mandan-hidatsa, pawnee, wichita, osage, apsaalooke, nakoda, cheyenne, kiowa, metis | Plains thinned to Niitsitapi, Očhéthi Šakówiŋ and Comanche |
| mogollon, fremont, paquime, hopi, zuni, nde, oodham, yuman-peoples, yoeme, raramuri, wixarika | Southwest thinned to Ancestral Pueblo, Hohokam, Pueblo peoples and Diné |
| haida, tsimshian, kwakwakawakw, nuu-chah-nulth, chinook | Northwest Coast thinned to Tlingit and Coast Salish |
| nimiipuu, ute, paiute, yokuts, miwok-ohlone | West thinned to Shoshone and Chumash |
| ipiutak, norton-tradition, taltheilei | Archaeological traditions beside Dorset and Old Bering Sea |
| inupiat, sugpiaq, denaina, tlicho, dakelh | Arctic thinned to Inuit, Kalaallit, Yup'ik, Unangan, Gwich'in and Denesuline |
| lucayan, garifuna, warao, maroons | Caribbean and Guianas thinned to Taíno, Kalinago, Lokono and Kalina |
| manao, shipibo-konibo, tukano, munduruku | Amazon thinned; Tukano was a collective name |
| potiguara, krenak, kariri, tenetehara, bororo | Brazil thinned to Kaingang, Tupinambá, Aratu and Xavante |
| lickanantay, huarpe, picunche, huilliche | Neighbours of the Mapuche and Diaguita |
| ava-guarani, comechingon, wichi, mbaya, ayoreo | Chaco thinned to Guaraní, Qom and Charrúa |
| ranquel, yagan, kawesqar | Patagonia thinned to Querandí, Günün a küna, Aónikenk and Selk'nam |
| greenland-state | Same ground as the Kalaallit entry |
| central-america-federation, gran-colombia, empire-of-brazil | Short-lived states (the last two folded into successors) |
| guatemala-state, haiti-state, paraguay-state, uruguay-state | Modern states beyond the largest dozen |

The twelve modern states kept are the United States, Canada, Mexico, Cuba, Colombia, Venezuela, Ecuador, Peru, Bolivia, Chile, Argentina and Brazil. Cuba is smaller than Guatemala by population and Paraguay by area. I kept it so the Caribbean has one state. That is a judgment the next reader may reverse.

Spread at 2026, peoples plus states: North America north of Mexico 16, Mesoamerica and the Caribbean 11, the Andes and northern South America 11, Amazonia and Brazil 9, the Southern Cone 7 and the Arctic 6.

Links removed with their entries: Tairona to Kogi, Hohokam to O'odham, Norton to Yup'ik, Taltheilei to Denesuline, and the links through Gran Colombia and the Empire of Brazil, which were rewritten to point at Colombia and Brazil. No group fell below two members, so no group was removed.

Not fully met: some groups show one member at some keyframes (Maya, Oaxaca and Central Mexico at 1 and 500; Mound builders at 1 and 500; Mapuche and Andes at 1, 500, 1800 and 2026; Plains at 1500). Fixing this would cost places elsewhere.

## Pass 3: facts

I looked up 60 entries on the web, in 12 searches. I read search excerpts of the pages below, not the full pages.

### Corrected

| Entry | Said | Says now | Page read |
|---|---|---|---|
| toltec | Tula to 1170 | To 1150, burned and largely left | https://www.cambridge.org/core/journals/ancient-mesoamerica/article/revised-chronology-and-settlement-history-of-tula-and-the-tula-region/B82102468C38BAF62DB2E2FE72D72D9D |
| tupinamba | On the coast from 1000 | From 500 at Bahia and 400 at Rio, class r, with the dispute stated | https://www.scielo.br/j/aabc/a/dpG37LbvVdVp5hHD84PCGKK?lang=en and https://onlinelibrary.wiley.com/doi/10.1002/ajpa.24876 |
| tupian-speakers (wash) | Coast claims from 1000, 900 and 700 | From 500, 500 and 400 | same two pages |
| guarani | From 400 | From 200, with the Paraná pottery dates in the note | https://pmc.ncbi.nlm.nih.gov/articles/PMC8492182 |
| norse-greenlanders, norse-greenland-speakers | Attested from 985; Western Settlement "found deserted about 1350" | Attested from 1124; note adds that radiocarbon suggests about 1400 | https://pure.kb.dk/ws/files/7775575/Arneborg_PROFF_09_juli_2015_jar_05_08_2015.pdf and https://www.science.org/doi/10.1126/science.354.6313.696 |
| kalinago | From 1200 | From 1400, class r, range of dates stated; territory dated 1903 | https://dlis.gov.dm/images/e-resources/sba/kalinago/The_Dominica_story_by_Lennox_Honychurch.pdf and https://kalinago.ictu.gov.dm/kalinago-territory/ |
| comanche | From 1720 | From 1706, first Spanish record | http://www.tshaonline.org/handbook/entries/comanche-indians |
| querandi | To 1700 | To 1680, fading from records | https://es.wikipedia.org/wiki/Querand%C3%AD and https://pueblosoriginarios.com/sur/pampa/querandies/querandies.html |
| rio-de-la-plata | To 1816 | To 1810, when the viceroy was deposed | https://www.britannica.com/place/Viceroyalty-of-the-Rio-de-la-Plata |
| argentina-state | From 1816 | From 1810, independence declared 1816 | same page |
| russian-america | "Fur posts of the Russian-American Company" from 1784 | First post 1784, company from 1799 | https://www.loc.gov/collections/meeting-of-frontiers/articles-and-essays/alaska/russian-colonization |
| aonikenk | From 1520 | From 1500, class r, so southern Patagonia is not empty at the 1500 keyframe (my own change, not from a page) | none |

### Looked up and found right

Aymara placed early in central and south-central Peru, and Puquina for Tiwanaku (aymara-speakers, tiwanaku); Wari's language debated between Quechua and Aymara (wari); Aymara as one proposal for Nazca (nazca); Nahuatl in central Mexico from about 500 to 700 (nahuatl-speakers); Thule spread in the 13th century (thule-culture); Dorset to about 1300 (dorset-culture); Haudenosaunee founding range 1142 to about 1600 (haudenosaunee); Cahokia about 1050 to 1350, language unknown (cahokia); Manteño about 800 to 1530 (manteno); San Agustín 1 to 900 (san-agustin); Tairona and Muisca dates (tairona, muisca); also zenu, quimbaya and canari before they were removed; spellings Očhéthi Šakówiŋ, Nʉmʉnʉʉ, Niitsitapi, Unangan, Diné, Anishinaabe, Denesuline, Guna, Magüta, A'uwẽ, Mebêngôkre, Aónikenk, Günün a küna, Selk'nam, Asháninka, Lokono and Kalina; New Spain 1535 to 1821; Viceroyalty of Peru 1542 to 1824; New Granada 1717 and 1739; colonial Brazil; Charrúa and 1831; Qom in the Chaco from about 1550; Marajoara 400 to 1400; Tapajó seen in 1542; Purépecha about 1350 to 1530; K'iche' to 1524; Mayapan 1441 and Yucatan 1546; Itza 1697; Kaqchikel about 1470 (removed); Caddo treaty of 1835; Calusa to the early 18th century; Kalaallit and 1721; Inca in Ecuador from the 1460s.

Notes on spelling: Unangan is the eastern plural and Unangax̂ the singular, and both are in use. Mebêngôkre is written with and without a tilde on the first e.

### Not checked on the web

Wayuu first records; Shuar; the spelling Mvskoke; the settlement dates of Jamaica and the Bahamas; the Cree in the Jesuit Relations of 1640 (the search returned nothing useful); founding dates of New France, the Thirteen Colonies, Rupert's Land and British North America; all the modern states; Hopewell, Mississippian, Ancestral Pueblo, Hohokam, Pueblo, Shoshone, Chumash, Tlingit, Coast Salish, Yup'ik, Gwich'in; Moche, Pukara, Chimú, Colla and Lupaqa; Upano, Acre, Mojos, Omagua, Xingu, Yanomami, Kaingang, Sambaqui, Aratu; Mapuche, Diaguita, Chorotega, Gran Coclé, Miskito, Zapotec, Teotihuacan, Nasa. These rest on memory only. Coordinates were read against the notes by eye and none looked wrong, but none was checked against a gazetteer. The self-names on the brief's list that belonged to removed entries (Kwakwaka'wakw, Nimiipuu, O'odham, Rarámuri, Wixárika) were not checked.

### The Falklands

There is no people or state entry for the islands. The two wash claims (Spanish 1767 to 1833, English from 1833) both say that sovereignty is disputed between the United Kingdom and Argentina and do not settle it. I left them as they were.

## Least sure of

1. **The Tupi coast.** Dates for the first Tupinambá pottery range from about 1000 BCE to 500 CE. I moved the wash and the people to 400 and 500 and kept them class r. The Macro-Jê and sambaqui washes they overlap were not restaged.
2. **Split years chosen without a page:** Wayuu 1700, Qom 1650, Mvskoke 1700, Cree 1670, Mixtec 1300, Guaraní of the foothills 1550, Inuit of Labrador 1771.
3. **Which twelve states, and Cuba in particular.**
4. **Languages assumed for cultures that are kept:** Siouan for Cahokia, Aymara for Nazca, Quechua for Wari, Chocoan for San Agustín and Manteño (filed there for want of a better family), Arawakan for Acre, Mojos and Marajoara. All are marked inferred and say so in the note.
5. **Norse Greenland as attested from 1124.** The year is that of the first bishop. One page says bishops were appointed from about 1120 and the first known to have gone there arrived in 1212.
6. **The period captions** were not edited. They still name Lakota, Comanche, Mapuche and others that remain, and nothing they say is now false, but they were not rechecked line by line.
