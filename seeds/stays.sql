-- Idempotent upsert of the four Havn stays (same slugs, copy, photos as lib/stays.ts).
-- Apply with: npx @insforge/cli db import seeds/stays.sql
insert into public.stays (
  slug,
  name,
  region,
  country,
  mood,
  season,
  sleeps,
  setting,
  lede,
  body,
  image_src,
  image_alt,
  image_photographer,
  image_profile_url,
  image_unsplash_url,
  sort_order
) values
  (
    'eggum',
    'Eggum Lodge',
    'Lofoten',
    'Norway',
    'Cliff wind, still water, a fire that lasts.',
    'September–April',
    'Four',
    'Outer islands, above the drop',
    'A lodge on the outer islands, where the road ends and the Atlantic keeps time.',
    array[
      $p$The rooms face the cliff. In winter the sun barely clears the ridge; in June it refuses to leave. You come for the silence between gusts, and for a fire that is never quite allowed to go out.$p$,
      $p$There is no spa menu and no welcome cocktail. There is rye, butter, and a window that holds the whole of Vestfjorden. Arrivals are arranged quietly, when the desk opens in a later stay.$p$
    ],
    'https://images.unsplash.com/photo-1663428520845-056989f8a664?auto=format&fit=crop&w=2000&q=80',
    'Crimson rorbuer cabins on the rocky shore of Reine, Lofoten, beneath steep grey peaks',
    'Benoît Deschasaux',
    'https://unsplash.com/@benowa',
    'https://unsplash.com/photos/ut7XZMquCoU',
    1
  ),
  (
    'kide',
    'Kide',
    'Inari',
    'Finnish Lapland',
    'Glass, snow, and the slow green of the sky.',
    'November–March',
    'Two',
    'Snowline, under glass',
    'A glass cabin held above the snow in Inari. At night the roof is all sky.',
    array[
      $p$There is no television. There is weather, and the occasional green. The glass is warm to the touch so the frost stays outside, and the bed is placed where the aurora, if it comes, will find you without asking.$p$,
      $p$Days are for walking the fell and returning to silence. The cabin is a single room, a stove, and enough linen. The north does not decorate.$p$
    ],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80',
    'Snow-covered mountain peaks under a star-filled violet night sky',
    'Benjamin Voros',
    'https://unsplash.com/@vorosbenisop',
    'https://unsplash.com/photos/phIFdC6lA4E',
    2
  ),
  (
    'havblik',
    'Havblik',
    'North Zealand',
    'Denmark',
    'A pale house facing the Kattegat.',
    'Year-round',
    'Six',
    'Coastal manor, wind and lawn',
    'A pale manor on the North Zealand coast, windows to the Kattegat.',
    array[
      $p$The rooms are high-ceilinged and slightly faded, which is the point. Breakfast is rye, cold butter, and whatever the garden still offers. The sea is always in the house, even when you cannot see it.$p$,
      $p$Walks follow the beach in either direction until the light goes. There is a library with too few books and too many chairs. The manor does not try to be new.$p$
    ],
    'https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=2000&q=80',
    'A pale manor house reflected in still water, set against a wooded rise',
    'Unsplash',
    'https://unsplash.com',
    'https://unsplash.com/photos/91cabc968266',
    3
  ),
  (
    'lysfjord',
    'Lysfjord',
    'Sognefjord',
    'Norway',
    'Steam over black water. The mountain does not speak.',
    'October–May',
    'Two',
    'Fjord edge, outdoor pool',
    'A spa house on a black fjord in western Norway. Steam from the pool meets the mountain.',
    array[
      $p$Treatments are few and slow. You come to be emptied, not entertained. The water is hot; the air is not. Between them, a wooden deck and the sound of the fjord against rock.$p$,
      $p$Evenings end when the last light leaves the opposite shore. There is a single dining table and a cook who prefers not to be praised. The mountain, as ever, does not speak.$p$
    ],
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=80',
    'A wooden cabin on stilts over a still mountain lake at dusk',
    'Luca Bravo',
    'https://unsplash.com/@lucabravo',
    'https://unsplash.com/photos/zAjdgNXsMeg',
    4
  )
on conflict (slug) do update set
  name = excluded.name,
  region = excluded.region,
  country = excluded.country,
  mood = excluded.mood,
  season = excluded.season,
  sleeps = excluded.sleeps,
  setting = excluded.setting,
  lede = excluded.lede,
  body = excluded.body,
  image_src = excluded.image_src,
  image_alt = excluded.image_alt,
  image_photographer = excluded.image_photographer,
  image_profile_url = excluded.image_profile_url,
  image_unsplash_url = excluded.image_unsplash_url,
  sort_order = excluded.sort_order,
  updated_at = now();
