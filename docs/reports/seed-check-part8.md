# Seed check, part 8: Australia and New Guinea

Checked file: `parts/part8.py`. Only that file was edited. Edits were made with the edit tool, except ten exact text replacements made by a short script at the end (eight coordinate nudges for four entries and the rewording of two notes, all listed below).

## Counts

| | before | after |
|---|---|---|
| entries | 111 | 110 |
| languages (the wash) | 38 | 38 |
| peoples | 57 | 56 |
| states | 16 | 16 |
| claims | 250 | 257 |
| claims by class (a, r, i) | not counted | 96, 99, 62 |
| groups | 13 | 12 |
| links | 16 | 15 |
| alive at 1, 500, 1000, 1500, 1800, 2026 | 52, 52, 55, 56, 57, 58 | 52, 52, 55, 56, 57, 57 |

The largest group is the south-east with 11 members at every keyframe. No group shows more than 14.

Gates at the end: `add_part.py --check` prints "ok, nothing written". `audit.py` prints "audit passes" with 0 early attested claims. `wash_check.py` reports 0 dark points, as expected.

## Pass 1: class

The audit listed no claim. I read every "a" claim of a people or state by hand against the rule that the record must be of that people, at that place, in those years. A single passing ship or expedition that named no one does not carry an attested claim across the decades that follow.

**No claim was demoted outright. Seven claims were split** into an earlier "r" claim and a later "a" claim:

- Guugu Yimithirr 1770 to 2026: now "r" from 1770 (Cook's word list, people not named) and "a" from 1873 (Cooktown, then the mission of 1886).
- Pitjantjatjara 1873 to 2026: "r" from 1873 (Giles and Gosse named no one) and "a" from 1933 (Tindale, then Ernabella mission in 1937).
- Martu 1906 to 2026: "r" from 1906 (Canning's survey) and "a" from 1946 (Jigalong mission).
- Bidjara 1846 to 2026: "r" from 1846 (Mitchell) and "a" from 1860 (the districts opened to squatters).
- Palawa 1777 to 1835: "r" from 1772 to 1803 (ships on the south-east coast only) and "a" from 1803 to 1835.
- Palawa on the main island 1835 to 2026: "r" to 1971, placed loosely, and "a" from 1971, the first census to count Aboriginal people fully.
- The Bass Strait islands claim from 1810 (moved into Palawa, see pass 2): "r" to 1830 and "a" from 1830.

**Three first-record years were moved** without a split, the earlier "i" or "r" claim being stretched or cut to meet them: Abelam from 1930 to 1937, Mee from 1936 to 1938, Asmat from 1912 to 1904. See pass 3.

**`attested_early` exceptions: none.** No claim in this part is attested before 1770.

"a" claims that I read and kept, with the reason:

- First Fleet and settlement records at the place and date: Eora 1788, Wiradjuri 1815, Kulin 1835, Kaurna 1836, Noongar 1826, Yuggera 1825, Larrakia 1869.
- Missions, protectors and stations at the place: Gunditjmara 1841, Yorta Yorta 1841, Ngarrindjeri 1840, Diyari 1866, Arrernte 1872, Yolŋu 1923, Bininj 1912, Wik 1904, Maluligal 1871, Gurindji 1883, Yawuru 1883, Bunuba 1885, Yindjibarndi 1866, Yamatji 1850, Kuku Yalanji 1873, Kalkadoon 1867, Warlpiri 1910, Bundjalung 1840, Kamilaroi 1832, Barkandji 1835.
- New Guinea: every "a" claim starts at a mission, a post or a named patrol. The highlands start between 1933 and 1938.
- Tiwi from 1824 and Manus Islanders from 1875 rest on one record each followed by a long gap (Fort Dundas to 1829, then little until 1911; the Challenger in 1875, then traders). I kept them because an island people cannot be mistaken for another. The Tiwi note now says so.
- Native title is cited beside an older record in every case and never carries a claim alone.

Names recorded under an older spelling or an outsider's name at the time (Arunta, Dieyerie, Bangerang for Yorta Yorta, Murray Islanders for Meriam) were accepted as records of that people. The names Martu and Tiwi are 20th-century and the notes say so.

## Pass 2: grain

| Removed | Why |
|---|---|
| cape-barren-islanders (Bass Strait Islanders) | A near-duplicate. Its own note said "they are Palawa", and the community's own bodies do not treat the Islanders as a separate people. Its claim is now two claims of `palawa` centred on Cape Barren Island, so nothing is lost from the map. |
| group aus-tasmania (Tasmania) | Left with one member. Palawa moved to the sibling group `aus-southeast`, and that group's story now names Tasmania and the names Palawa and Pakana. |

The link from cape-barren-islanders to palawa was removed with the entry.

Nothing else was removed. I looked for other near-duplicates and found none: no people shares a name and a date with a state, and the successive territories of Papua and New Guinea do not overlap in time.

Spread at 2026, peoples only: south-east with Tasmania 11, Top End and Kimberley 7, Queensland 6, desert 5, west 3, Torres Strait 2; New Guinea highlands 6, southern coasts 6, Sepik and north coast 4, islands 4. States: 3. Western Australia south of the Kimberley is thin, with Noongar, Yamatji, Yindjibarndi and Martu for a third of the continent. In New Guinea the western half has 6 peoples (Dani, Mee, Biak, Arfak, Asmat and Marind, with none in the Mamberamo basin) and the eastern half and its islands 14. I added nothing, since the job was to remove.

## Pass 3: facts

I looked up 46 entries on the web in 51 search calls, 4 of which failed on a rate limit and were repeated with another tool. I read search excerpts of the pages below, not the full pages.

### Corrected

| Entry | Said | Says now | Page read |
|---|---|---|---|
| barkindji | Name "Barkindji" | Name "Barkandji", the spelling of the people's own native title body. Note gives Paakantyi and Barkindji. Determination of 2015 confirmed (16 June 2015). | https://barkandjipbc.com/barkandji-native-title-claim |
| maluilgal | Name "Maluilgal" | Name "Maluligal", with "also written Maluilgal". The islanders' sea and land council and the island council call Badu, Mabuiag and Moa the Maluligal Nation. The registered native title body is spelled Maluilgal and covers Saibai, Dauan, Mabuiag, Badu and Boigu. | https://www.gbk.org.au/pbcs/ and https://tsirc.qld.gov.au/our-work/planning-and-building/native-title and https://nativetitle.org.au/find/pbc/4549 |
| pitjantjatjara | Attested from 1873 | Reconstructed 1873 to 1933, attested from 1933. Note on the start date now gives the linguists' range of one to two thousand years. | https://library.oapen.org/bitstream/handle/20.500.12657/33576/459870.pdf and https://vuir.vu.edu.au/32634/1/OSBORNE%20Samuel%20-%20Thesis.pdf and https://books.openedition.org/pacific/561?lang=en |
| martu | Attested from 1906 | Reconstructed 1906 to 1946, attested from 1946. Note says the name dates from the 1980s. | https://en.wikipedia.org/wiki/Martu_people and https://www.findandconnect.gov.au/entity/aborigines-rescue-mission-jigalong |
| bidjara | Attested from 1846 | Reconstructed 1846 to 1860, attested from 1860 | https://www.bushheritage.org.au/uploads/documents/Reserve-history/Carnarvon-history-Libby-Smith.pdf |
| guugu-yimithirr | Attested from 1770 | Reconstructed 1770 to 1873, attested from 1873. Note adds the spelling Guugu Yimidhirr and Cape Bedford. | https://history.cass.anu.edu.au/centres/andc/borrowings-australian-aboriginal-languages |
| tiwi | Fort Dundas "until it was abandoned" | Abandoned in 1829. Note adds the gap in records and that the name Tiwi was taken up about 1930. | https://brill.com/view/journals/bki/178/1/article-p5_2.xml?language=en and https://en.wikipedia.org/wiki/Tiwi_people |
| diyari | Mission "from 1866" | "Founded in 1866 and settled in 1867". Two pages give the two years. | https://en.wikipedia.org/wiki/Killalpaninna_Mission and https://www.findandconnect.gov.au/entity/killalpaninna-mission |
| palawa | One attested claim 1777 to 1835, one 1835 to 2026 | Seven claims as set out in pass 1, with Wybalenna named and the islands added | https://www.utas.edu.au/library/companion_to_tasmanian_history/A/Aboriginal%20Islanders.htm and https://www.flinders.tas.gov.au/aboriginal-history |
| yuggera | No other spelling | Note adds Jagera and Yagara | https://www.slq.qld.gov.au/blog/aboriginal-languages-greater-brisbane-area |
| meriam | "Described by passing ships about 1800" | The Pandora named the Murray Islands in 1791 and Flinders traded with the islanders in 1802. The first-record year of 1802 was right. | https://www.museum.qld.gov.au/assets/media/project/qm/qm-website/collections-and-research/memoirs/cultural-memoirs/culture-volume-9/mqm-c9-2-gesner.pdf and https://en.wikipedia.org/wiki/Matthew_Flinders |
| abelam | Attested from 1930, "patrols and ethnographers from about the 1930s" | Attested from 1937, the Maprik patrol post. Thurnwald's passage before the First World War is in the earlier note. | https://www.encyclopedia.com/humanities/encyclopedias-almanacs-transcripts-and-maps/abelam |
| mee | Attested from 1936, the sighting from the air | Attested from 1938, the Dutch post | https://en.wikipedia.org/wiki/Paniai_Lakes |
| asmat | Attested from 1912, post "about 1938" | Attested from 1904, the first Dutch visit to the bay. Post in 1938. Carstensz in 1623 added beside Cook in 1770. | https://www.papuaerfgoed.org/sites/default/files/collectie/files/2005-09/van_Amelsvoort_1964_Early.pdf |
| biak | "Recorded by missionaries from 1855" | The mission of 1855 was at Mansinam in Doreh Bay, among Numfor settlers, and not on Biak | https://doi.org/10.1163/ej.9789004170261.i-1004.61 |
| huli | "First met by the Hides and O'Malley patrol in 1935" | Recorded by that patrol. Two prospectors crossed the basin in 1934. | https://adb.anu.edu.au/biography/hides-jack-gordon-6660 and https://doi.org/10.1215/00141801-2007-003 |
| chimbu | "The 1933 patrol" | The Leahy and Taylor expedition of 1933. Note adds where the name came from. One page gives 1934 for the first meeting. | https://www.encyclopedia.com/humanities/encyclopedias-almanacs-transcripts-and-maps/chimbu and https://www.pngaa.net/Library/Kiap1.html |
| tolai | Crossing "perhaps after" the eruption of the 7th century | After the eruption, now dated 667 to 699. The crossings are undated and may be only a few centuries older than 1875. Still class i from 1000. | https://press-files.anu.edu.au/downloads/press/n11414/pdf/book.pdf and https://pure.mpg.de/rest/items/item_3594253/component/file_3594254/content |
| makassan-trepangers | "Running by about 1700 and some argue for an earlier start. Australian law ended it in 1907." | The start is disputed: trade records suggest 1720 to 1780 and dated camp sites before 1650. Last boat in 1907 after licences were refused. Dates and class r unchanged. | https://onlinelibrary.wiley.com/doi/full/10.1002/arco.5301 and https://press-files.anu.edu.au/downloads/press/p241301/pdf/ch01.pdf |
| territory-of-new-guinea | "Mandate from 1921" | Mandate granted in 1920, civil rule from 1921 | https://en.wikipedia.org/wiki/Territory_of_New_Guinea |
| dutch-new-guinea | No mention of how it ended | Note adds the handover to a United Nations administration in October 1962 | https://www.mpil.de/files/pdf2/mpunyb_gruss_9_97_126.pdf |

Coordinates. I tested every people and state centre against the land of its regions in `site/data/coast.json`. Four centres lay in water within 6 km of the shore and were moved onto the land they name: Larrakia to Darwin (130.85, 12.45 south), Yawuru to Broome (122.25, 17.95 south), the Palawa islands claim to Cape Barren Island (148.2, 40.4 south) and Maluligal to Badu (142.15, 10.12 south). Four centres are still at sea on purpose: Makassan trepangers 8 km off Arnhem Land, Post-Lapita societies, German New Guinea and the Territory of New Guinea in the Bismarck Sea between the islands they cover. No centre was checked against a gazetteer.

### Mer

The Meriam entry does not draw a field, and changing its regions or centre would not fix that honestly. The `australia` region is cut at 10 south and Mer is at 9.92 south. More to the point, the coastline file has no land at all for Mer, Erub or Ugar: the nearest land of any kind is the New Guinea mainland 126 km away, and the nearest land of the `australia` region is 183 km away. The field reaches 65 km. Listing `papua` as well would light a strip of the Papua New Guinea coast if the radius were widened, which would be false. The label is drawn from the centre and does not need land, so the name Meriam still appears at the right place over the sea. The wash entry `meriam-mir` is in the same position. I left both as they were. The fix belongs in the coastline and region files, which I may not edit: add the eastern islands to the land and move the cut to about 9 south.

### Looked up and found right

Orokaiva first met by MacGregor on the Mambare in 1894 and by miners from 1895, the name applied by outsiders (orokaiva); Marind and the founding of Merauke in 1902 (marind); the Challenger at the Admiralty Islands in March 1875 (manus-islanders); Kriol at the Roper River mission from 1908 and at Fitzroy Crossing from 1955, elsewhere since the Second World War (kriol; the Kimberley and Barkly dates of 1950 and 1960 are consistent with this); the Leahy brothers among the Enga in 1934 and the patrol of 1938 (enga); the Wahgi expedition of 1933 (melpa); the protectorate of 1884, annexation of 1888 and transfer of 1906 (british-new-guinea, territory-of-papua); the union of 1949 and independence on 16 September 1975 (papua-and-new-guinea, papua-new-guinea); German rule from 1884 to 1914 (german-new-guinea); the Dutch claim of 1828, the transfer to Indonesia on 1 May 1963 and the disputed vote of 1969 (dutch-new-guinea, indonesian-papua); Van Diemen's Land separate in 1825 and renamed in 1856 (van-diemens-land); Milingimbi mission 1923 and Yirrkala 1935 (yolngu); Aurukun mission 1904 (wik); the Gurindji walk-off of 1966 and the hand-back of 1975 (gurindji); Battle Mountain 1884 and settlers from the 1860s (kalkadoon); Budj Bim at 6,600 years and the Eumeralla war of the 1840s (gunditjmara); the Sacred Heart mission on Yule Island in 1885 (mekeo); the Methodist mission of 1894 and the French naming of 1793 (trobriand-islanders); the Bougainville conflict of 1988 to 1998 (nasioi); D'Albertis and Beccari in the Arfak Mountains in 1872 (arfak-peoples); George Brown's arrival on 15 August 1875 (tolai); the spelling Noongar and fourteen groups (noongar); Gamilaraay, Gamilaroi and Kamilaroi all listed by AIATSIS (kamilaroi); the sealer community of the islands from about 1810 (cape-barren-islanders, before it was folded in).

### West Papua

The notes on `indonesian-papua`, on the link from Dutch New Guinea, and in the last two period captions all say that Indonesian rule is contested and do not settle it. I left them as they were. The entry's name, "Papua (Indonesia)", names who governs and the note carries the dispute.

### Family keys

No key was changed. The fixed list has nothing closer. Biak belongs to the nearest relatives of Oceanic, so `oceanic` is the nearest key. Aru, Kei and Tanimbar are filed under `malayic`, the same key the neighbouring part uses for the Maluku languages. Kiwai and Marind are placed in Trans-New Guinea by some classifications and kept apart by others, and the notes say so. I did not check any of these on the web.

### Not checked on the web

The searches for the first records of Dani, Motu, Kiwai and Iatmul returned nothing useful, so 1938, 1874, 1875 and 1912 rest on memory. Also on memory: the year Wave Hill station was set up; Marist missionaries among the Nasioi in 1902; Dutch ships at the Tiwi Islands in 1705; Jansz in 1606; the founding dates of Bathurst, Melbourne, Adelaide, Brisbane, Roebourne, Broome, Geraldton and Palmerston; Mitchell on the Darling in 1835; Curr and the Yorta Yorta; the Canning survey beyond what the Martu page says; New South Wales, Western Australia, South Australia, Victoria, Queensland and the Commonwealth; Tidore's reach and the Dutch posts of 1898; every language entry other than Kriol, including the end dates of the native wash in settled districts and the dates of the English wash, which I read and did not change; the spellings Yolŋu, Arrernte, Warlpiri, Pitjantjatjara, Wiradjuri, Yorta Yorta, Kulin, Palawa, Kaurna, Ngarrindjeri, Gurindji, Kuku Yalanji, Yawuru, Bundjalung, Eora, Gunditjmara, Larrakia, Bininj, Bunuba, Yindjibarndi, Yamatji, Wik, Enga, Huli, Dani, Melpa, Motu, Marind, Iatmul and Mekeo, which are the spellings I know to be current but did not look up. Dharug and Dharawal appear only in a wash note.

## Least sure of

1. **Moving Palawa into the south-east group.** It keeps the rule of two members per group, and Tasmania loses its own lead. The other honest choice is to restore the Tasmania group with Palawa alone in it.
2. **Split years chosen from one page each:** Bidjara 1860, Martu 1946, Pitjantjatjara 1933, Guugu Yimithirr 1873 (the last from memory of Cooktown's founding).
3. **Start dates that are still guesses:** Pitjantjatjara and Martu from 1000, within a range of one to two thousand years ago that linguists give for the Western Desert spread. Tolai from 1000, where the pages give only "after the eruption of the late 7th century" and "centuries ago". All three are class i and say so.
4. **Biak as attested from 1855.** The record of that year is at Doreh Bay, about 200 km from the centre on Biak. I did not find when records begin on the islands themselves.
5. **Tiwi and Manus Islanders** as attested through long gaps in the record.
6. **Chimbu first met in 1933 or 1934.** Two pages disagree. I kept 1933.
7. **Makassan voyages from 1700.** The claim is class r and the range in the note runs from before 1650 to 1780.
8. **The thin west** of both lands, noted under pass 2.
9. **The period captions** were not edited. Nothing they say is now false.
