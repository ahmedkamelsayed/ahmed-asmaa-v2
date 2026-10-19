// =====================================================================
//  INVITATION CONFIGURATION
//  Every event-specific detail lives here. Edit this file only — the
//  rest of the site reads from it.
//  Two versions are built: Arabic (index.html) and English (en.html).
// =====================================================================

export const config = {
  event: {
    // Event date, YYYY-MM-DD (confirmed).
    date: '2026-11-06',
    // Start time, 24-hour HH:MM, Cairo local time.
    // PROVISIONAL — change it here and both versions + countdown update.
    time: '16:00',
    // IANA time zone the date/time above are expressed in.
    timeZone: 'Africa/Cairo',
  },

  venue: {
    // Exact Google Maps link supplied by the couple — do not replace.
    mapsUrl: 'https://maps.app.goo.gl/5KmoQZbjWEy62JJC8',
  },

  // Couple photo. Put the file in public/images/ and update `src`.
  // `objectPosition` controls the crop focus ("x% y%"); adjust if faces get cut.
  photo: {
    src: 'images/ahmed-asmaa-portrait.jpg',
    width: 1024,
    height: 1536,
    objectPosition: '50% 22%',
  },

  // Saved invitation card ("Save Invitation" button).
  // `background`: the cover artwork (9:16, Bismillah on top, hands with rings
  // at the bottom) in public/images/; the card is laid out like the site's
  // cover on top of it. Set to '' for a plain paper card.
  card: {
    background: 'images/cover-artwork.jpg',
  },

  // Optional background music. Leave `src` empty to hide the music button.
  // To add music: put a licensed file in public/audio/ and set e.g.
  // src: 'audio/our-song.mp3'
  music: {
    src: 'audio/ya-leila-beida.mp3',
    // Try to play as soon as the site opens. If the browser blocks sound
    // until the guest interacts, it starts on their first tap instead.
    autoStart: true,
  },

  // Live address once deployed, e.g. 'https://<username>.github.io/<repo>/'.
  // Needed so link previews (WhatsApp etc.) get an absolute image URL.
  siteUrl: 'https://ahmedkamelsayed.github.io/ahmed-asmaa-v2/',

  // ---------------------------------------------------------------
  //  Wording for each version. Change text freely.
  // ---------------------------------------------------------------
  content: {
    ar: {
      meta: {
        title: 'أحمد وأسماء · حفلة خطوبة',
        description: 'بكل الحب، ندعوكم لحفلة خطوبة أحمد وأسماء — الجمعة ٦ نوفمبر ٢٠٢٦',
      },
      names: { first: 'أحمد', joiner: 'و', second: 'أسماء', together: 'أحمد وأسماء' },
      photoAlt: 'أحمد وأسماء في حديقة وقت الغروب',
      cover: { eyebrow: 'بكل الحب ندعوكم لحفلة خطوبة', type: 'حفلة خطوبة', open: 'افتح الدعوة' },
      story: {
        eyebrow: 'بداية حكاية جديدة',
        title: 'بكل الحب والفرحة',
        message:
          'يسعدنا نشارككم أجمل لحظاتنا في بداية حكاية جديدة، ونفرح بوجودكم معانا في يوم خطوبتنا. فرحتنا بتكمل بيكم.',
      },
      details: { eyebrow: 'احفظوا الموعد', title: 'تفاصيل الحفلة', date: 'اليوم', time: 'الساعة', venue: 'المكان' },
      venue: { name: 'الريف الأوروبي', location: 'طريق مصر–إسكندرية الصحراوي، مصر' },
      countdown: {
        eyebrow: 'العد التنازلي',
        title: 'باقي على فرحتنا',
        units: { days: 'يوم', hours: 'ساعة', minutes: 'دقيقة', seconds: 'ثانية' },
        passedTitle: 'بدأت الفرحة',
        passedLine: 'شكرًا لمحبتكم ووجودكم معانا',
      },
      location: { eyebrow: 'مكان الحفلة', title: 'مستنيينكم في', button: 'افتح اللوكيشن' },
      closing: { line: 'وجودكم معانا هو أجمل هدية', withLove: 'مع كل الحب' },
      music: { play: 'موسيقى', pause: 'إيقاف', off: 'غير متاحة', playLabel: 'تشغيل الموسيقى', pauseLabel: 'إيقاف الموسيقى', blocked: 'المتصفح منع التشغيل، جرّب تاني', failed: 'الموسيقى غير متاحة حاليًا' },
      save: { button: 'احفظ الدعوة كصورة', working: 'جاري تجهيز الصورة…', failed: 'تعذّر حفظ الصورة، جرّب تاني', fileName: 'ahmed-asmaa-engagement-invitation-ar.png' },
      switchTo: { label: 'English', href: 'en', lang: 'en' },
    },

    en: {
      meta: {
        title: 'Ahmed & Asmaa · Engagement',
        description: 'With love, you are invited to the engagement of Ahmed & Asmaa — Friday, November 6, 2026',
      },
      names: { first: 'Ahmed', joiner: '&', second: 'Asmaa', together: 'Ahmed & Asmaa' },
      photoAlt: 'Ahmed and Asmaa in a garden at golden hour',
      cover: { eyebrow: 'You’re invited to the engagement of', type: 'Engagement Celebration', open: 'Open Invitation' },
      story: {
        eyebrow: 'A New Chapter Begins',
        title: 'With Love & Joy',
        message:
          'With hearts full of love, we would be delighted to share the beginning of our new story with you. Your presence on our engagement day would make our joy complete.',
      },
      details: { eyebrow: 'Save the Date', title: 'The Celebration', date: 'Date', time: 'Time', venue: 'Venue' },
      // `name`: English spelling of the venue — edit if you prefer another transliteration.
      venue: { name: 'El Reef El Orobi', location: 'Cairo–Alexandria Desert Road, Egypt' },
      countdown: {
        eyebrow: 'Counting the Moments',
        title: 'Until We Celebrate',
        units: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
        passedTitle: 'The celebration has begun',
        passedLine: 'Thank you for your love',
      },
      location: { eyebrow: 'Where We Celebrate', title: 'Join Us At', button: 'View Location' },
      closing: { line: 'Your presence is the most beautiful gift', withLove: 'With love' },
      music: { play: 'Music', pause: 'Pause', off: 'Unavailable', playLabel: 'Play background music', pauseLabel: 'Pause background music', blocked: 'Your browser blocked playback — tap again', failed: 'Music is unavailable right now' },
      save: { button: 'Save Invitation', working: 'Preparing image…', failed: 'Could not save the image — please try again', fileName: 'ahmed-asmaa-engagement-invitation.png' },
      switchTo: { label: 'العربية', href: './', lang: 'ar' },
    },
  },
};
