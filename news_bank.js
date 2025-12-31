/**
 * PARAM YANG DIPERLUKAN :
 * ?ocid=windirect => on dekstop
 * ?ocid=hpmsn     => on mobile
 * 
 * ?cvid={random-generate-id}
 * ?ei={number-that-increased-2-after-new-tab}
 */

const news_bank = [
  "en-xl/africa/top-stories/african-union-expresses-deep-grief-following-tragic-helicopter-crash-in-ghana/ar-AA1K3dpE", 
  "en-xl/africa/top-stories/gerd-powering-a-nation-inspiring-a-continent/ar-AA1JjESR",
  "en-xl/asia/pakistan/openai-unveils-powerful-free-ai-models-for-developers/ar-AA1JZWhg",
  "en-xl/lifestyle/shopping/samsung-chips-away-at-apple-s-us-lead-with-mass-market-ai-phones/ar-AA1JQSXW", 
  "en-xl/lifestyle/other/the-world-s-most-lavish-palaces-you-can-actually-visit/ss-AA1rgiWm",
  "en-xl/money/other/hanoi-metro-triples-profit-in-h1/ar-AA1K3Mh3", 
  "en-xl/news/other/i-m-a-travel-agent-this-is-the-first-thing-i-do-on-entering-a-hotel-room-and-it-s-not-unpacking/ar-AA1HVQty",
  "en-xl/news/other/cork-or-galway-which-city-besides-dublin-should-you-visit-in-ireland/ar-AA1I3fOZ", 
  "en-xl/news/other/russian-missile-and-drone-strikes-injure-at-least-18-across-ukraine/ar-AA1JOvQr", 
  "en-xl/news/other/what-is-acute-myocardial-infarction-ozzy-osbourne-s-cause-of-death-explained-as-death-certificate-is-released/ar-AA1K0neJ", 
  "en-xl/news/other/ukraine-updates-trump-says-likely-to-meet-putin-very-soon/ar-AA1JZMtG", 
  "en-xl/news/other/lost-to-history-countries-that-no-longer-exist/ss-AA1zF5kh", 
  "en-xl/news/other/starting-a-garden-try-these-26-budget-friendly-hacks/ss-AA1sYdPw", 
  "en-xl/news/other/what-us-city-has-the-most-stolen-cars/ss-AA1qLofg", 
  "en-xl/news/other/walk-japan-s-ancient-travellers-highway-for-historic-post-towns-teahouses-and-mountain-shrines/ar-AA1yZjpo", 
  "en-xl/news/other/china-unveils-humanoid-robot-with-self-swapping-battery/vi-AA1K2OD8", 
  "en-xl/news/other/bmw-i5-five-reasons-why-we-love-it-and-five-why-we-don-t/ss-AA1JN2Zy", 
  "en-xl/news/other/9-best-and-5-worst-things-to-order-at-the-capital-grille/vi-AA1p8X06", 
  "en-xl/news/other/common-habits-that-negatively-affect-your-mental-health/ss-AA1meYJM", 
  "en-xl/news/other/what-to-visit-in-havana-7-unmissable-spots-for-an-unforgettable-trip-to-cuba-s-capital/ar-AA1ybw0i", 
  "en-xl/news/other/5-picturesque-villages-to-visit-in-the-dolomites-all-year-round/ar-AA1wjj6Q", 
  "en-xl/news/other/some-interesting-junkyard-finds-at-collins-auto-salvage-in-auburn-georgia/ss-AA1EKTAy", 
  "en-xl/news/other/fes-hotel-stays-up-19-through-may-tourism-data-shows/ar-AA1K2f86", 
  "en-xl/news/other/what-i-d-do-differently-to-get-hired-faster-if-i-were-a-student-again/ar-AA1ENpbU", 
  "en-xl/news/other/the-most-fun-countries-in-the-world/ss-AA1K0M0j", 
  "en-xl/news/other/the-perfect-10-day-road-trip-to-discover-the-italian-island-of-sardinia/ar-AA1ujigO",
  "en-xl/news/other/students-create-robot-that-solves-rubik-s-cube-faster-than-a-blink-of-an-eye/vi-AA1F4qKv",
  "en-xl/news/other/this-invention-spelled-the-end-for-evs-first-golden-age/ar-AA1r49Hq",
  "en-xl/news/other/dedicated-motorcycle-lanes-sound-great-but-only-if-they-re-well-thought-out/ar-AA1uRfSe",
  "en-xl/news/other/the-best-war-movies-on-netflix/ss-AA1H0nap",
  "en-xl/news/other/underwater-city-discovered-near-resting-place-of-noah-s-ark-rewrites-bible-story/ar-AA1K1QDl",
  "en-xl/news/other/tv-theme-songs-that-made-it-onto-the-charts/ss-BB1nOw1V",
  "en-xl/news/other/choosing-the-right-college-major-in-us-what-every-international-student-s-parent-should-know/ar-AA1DlzjL4",
  "en-xl/news/other/60-seconds-in-okinawa/vi-AA1qzfCw",
  "en-xl/news/other/explore-ouarzazate-s-souks/ar-AA1tKOTo",
  "en-xl/news/other/used-tesla-model-s-five-things-we-love-and-five-things-we-loathe/ss-AA1Iu6lc",
  "en-xl/news/other/zero-starts-delivering-its-most-important-ev-motorcycle-yet/ar-AA1JWL7Q",
  "en-xl/news/other/debunking-major-misconceptions-about-space/ss-AA1hMQFi",
  "en-xl/news/other/the-junkyard-gems-of-jim-s-vintage-automotive-idaho/ss-AA1GWq4M",
  "en-xl/news/other/9-things-to-never-do-on-the-golf-course/vi-AA1rIiE6",
  "en-xl/news/other/some-interesting-junkyard-finds-at-collins-auto-salvage-in-auburn-georgia/ss-AA1EKTAy",
  "en-xl/news/other/26-underwater-treasures-that-are-worth-billions/ss-AA1q2WGj",
  "en-xl/news/other/tanum-s-rock-carvings-unravel-the-mysteries-of-the-bronze-age/ar-AA1xodTm",
  "en-xl/news/other/19-inventors-you-ve-never-heard-of-who-shaped-the-world/ss-BB1rfp9U",
  "en-xl/news/other/1993-british-troops-help-evacuate-more-than-2000-refugees-from-srebrenica/vi-AA1HxeeT",
];