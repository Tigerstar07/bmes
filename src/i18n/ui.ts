export const languages = { lv: 'Latviski', en: 'English' } as const;
export const defaultLang = 'lv' as const;
export type Lang = keyof typeof languages;

/* ------------------------------------------------------------------
   Route map. Every page key has a real slug in each language, so the
   English URLs read as English rather than reusing Latvian ones.
   Change a slug here and the nav, footer, sitemap and language
   switcher all follow.
   ------------------------------------------------------------------ */
export const routes = {
  home:     { lv: '/',                      en: '/en/' },
  about:    { lv: '/par-mums/',             en: '/en/about/' },
  services: { lv: '/pakalpojumi/',          en: '/en/services/' },
  projects: { lv: '/paveiktie-darbi/',      en: '/en/projects/' },
  contact:  { lv: '/kontakti/',             en: '/en/contact/' },
  privacy:  { lv: '/privatuma-politika/',   en: '/en/privacy-policy/' },
} as const;

export type RouteKey = keyof typeof routes;

/* Service slugs per language. `key` is the stable id used in content
   frontmatter and to pair the two languages together. */
export const serviceSlugs = {
  buvnieciba:            { lv: 'buvnieciba',                   en: 'construction' },
  inzenierkomunikacijas: { lv: 'inzenierkomunikacijas',        en: 'engineering-systems' },
  rekonstrukcija:        { lv: 'rekonstrukcija-un-remonts',    en: 'renovation-and-repair' },
  arhitektura:           { lv: 'arhitektura-un-projektesana',  en: 'architecture-and-design' },
  interjers:             { lv: 'interjera-dizains',            en: 'interior-design' },
  apsekosana:            { lv: 'apsekosana-un-uzturesana',     en: 'inspection-and-maintenance' },
} as const;

export type ServiceKey = keyof typeof serviceSlugs;

/* ------------------------------------------------------------------
   Company details. Single source of truth. These are PLACEHOLDERS
   pending Jānis's real registration data.
   ------------------------------------------------------------------ */
export const company = {
  name: 'BMES',
  legalName: 'SIA BMES',
  regNr: 'LV00000000000',
  phone: '+371 20 000 000',
  phoneHref: '+37120000000',
  email: 'info@bmes.lv',
  street: 'Brīvības iela 1',
  city: 'Rīga',
  postalCode: 'LV-1010',
  country: 'LV',
  founded: '2012',
};

/* ------------------------------------------------------------------
   UI strings
   ------------------------------------------------------------------ */
export const ui = {
  lv: {
    'nav.home': 'Sākums',
    'nav.about': 'Par mums',
    'nav.services': 'Pakalpojumi',
    'nav.projects': 'Paveiktie darbi',
    'nav.contact': 'Kontakti',
    'nav.menu': 'Izvēlne',
    'nav.close': 'Aizvērt',
    'nav.skip': 'Pāriet uz saturu',

    'site.tagline': 'Būvniecība, projektēšana un inženierrisinājumi',
    'site.description':
      'BMES ir pilna cikla būvuzņēmums Latvijā. Būvniecība, inženierkomunikācijas, rekonstrukcija, arhitektūra, interjera dizains un objektu uzturēšana.',

    'hero.eyebrow': 'Pilna cikla būvuzņēmums',
    'hero.line1': 'Viens uzņēmums,',
    'hero.line2': 'viss objekts',
    'hero.lead':
      'Projektējam, būvējam un uzturam. No pirmās skices līdz nodotam objektam, ar vienu atbildīgo par visu.',
    'hero.cta': 'Sākt sarunu',
    'hero.cta2': 'Skatīt darbus',
    'hero.scroll': 'Ritiniet',

    'stats.title': 'Skaitļos',
    'stats.projects': 'Pabeigti objekti',
    'stats.years': 'Gadi nozarē',
    'stats.area': 'Uzbūvētie kvadrātmetri',
    'stats.team': 'Speciālisti komandā',

    'services.eyebrow': 'Pakalpojumi',
    'services.title': 'Seši virzieni, viena atbildība',
    'services.lead':
      'Katrs virziens ir patstāvīgs, bet strādā kopā ar pārējiem. Tāpēc projektā nav robu starp projektētāju, būvnieku un uzturētāju.',
    'services.all': 'Visi pakalpojumi',
    'services.more': 'Uzzināt vairāk',
    'services.related': 'Saistītie objekti',
    'services.whatWeDo': 'Ko tas ietver',
    'services.process': 'Kā tas notiek',
    'services.next': 'Nākamais pakalpojums',

    'projects.eyebrow': 'Paveiktie darbi',
    'projects.title': 'Objekti, ko esam nodevuši',
    'projects.lead':
      'Katrs objekts ir konkrēts uzdevums ar konkrētu risinājumu. Šeit ir daļa no tiem.',
    'projects.all': 'Visi objekti',
    'projects.filter': 'Filtrēt pēc pakalpojuma',
    'projects.view': 'Skatīt objektu',
    'projects.year': 'Gads',
    'projects.location': 'Atrašanās vieta',
    'projects.area': 'Platība',
    'projects.scope': 'Apjoms',
    'projects.client': 'Pasūtītājs',
    'projects.gallery': 'Galerija',
    'projects.back': 'Visi objekti',
    'projects.none': 'Šajā kategorijā objektu vēl nav.',

    'about.eyebrow': 'Par mums',
    'about.title': 'Būvuzņēmums, kas paliek līdz galam',

    'contact.eyebrow': 'Kontakti',
    'contact.title': 'Parunāsim par jūsu objektu',
    'contact.lead':
      'Pastāstiet, ko plānojat. Atbildam vienas darba dienas laikā.',
    'contact.form.name': 'Vārds, uzvārds',
    'contact.form.email': 'E-pasts',
    'contact.form.phone': 'Tālrunis',
    'contact.form.service': 'Kas jūs interesē',
    'contact.form.servicePlaceholder': 'Izvēlieties pakalpojumu',
    'contact.form.serviceOther': 'Cits / vēl nezinu',
    'contact.form.message': 'Par projektu',
    'contact.form.messageHint': 'Objekta veids, platība, termiņš. Jo vairāk detaļu, jo precīzāka atbilde.',
    'contact.form.consent':
      'Piekrītu, ka mani dati tiek apstrādāti šī pieprasījuma izskatīšanai.',
    'contact.form.submit': 'Nosūtīt pieprasījumu',
    'contact.form.sending': 'Sūta…',
    'contact.form.success': 'Paldies, pieprasījums saņemts. Atbildēsim tuvākajā darba dienā.',
    'contact.form.error': 'Neizdevās nosūtīt. Lūdzu, rakstiet tieši uz info@bmes.lv',
    'contact.form.required': 'obligāts',
    'contact.direct': 'Tiešie kontakti',
    'contact.office': 'Birojs',
    'contact.details': 'Rekvizīti',
    'contact.hours': 'Darba laiks',
    'contact.hoursValue': 'P.-Pk. 8.00-17.00',

    'cta.title': 'Plānojat jaunu objektu?',
    'cta.lead': 'Atsūtiet dažas rindas par to, ko plānojat. Bez saistībām.',
    'cta.button': 'Sazināties',

    'footer.nav': 'Lapas',
    'footer.services': 'Pakalpojumi',
    'footer.contact': 'Kontakti',
    'footer.rights': 'Visas tiesības aizsargātas.',
    'footer.privacy': 'Privātuma politika',

    '404.title': 'Šāda lapa neeksistē',
    '404.lead': 'Iespējams, adrese ir mainījusies vai ierakstīta ar kļūdu.',
    '404.back': 'Uz sākumu',

    'lang.switch': 'Switch to English',
  },

  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.skip': 'Skip to content',

    'site.tagline': 'Construction, design and engineering',
    'site.description':
      'BMES is a full-cycle construction company in Latvia. Construction, engineering systems, renovation, architecture, interior design and property maintenance.',

    'hero.eyebrow': 'Full-cycle construction',
    'hero.line1': 'One company,',
    'hero.line2': 'the whole build',
    'hero.lead':
      'We design, we build, we maintain. From the first sketch to the finished building, with one team accountable for all of it.',
    'hero.cta': 'Start a conversation',
    'hero.cta2': 'See our work',
    'hero.scroll': 'Scroll',

    'stats.title': 'In numbers',
    'stats.projects': 'Projects delivered',
    'stats.years': 'Years in the trade',
    'stats.area': 'm² built',
    'stats.team': 'Specialists on the team',

    'services.eyebrow': 'Services',
    'services.title': 'Six disciplines, one accountability',
    'services.lead':
      'Each discipline stands on its own, but they work as one. That is why there are no gaps between the designer, the builder and the people who maintain it afterwards.',
    'services.all': 'All services',
    'services.more': 'Read more',
    'services.related': 'Related projects',
    'services.whatWeDo': 'What it covers',
    'services.process': 'How it works',
    'services.next': 'Next service',

    'projects.eyebrow': 'Projects',
    'projects.title': 'Buildings we have handed over',
    'projects.lead':
      'Every project is a specific problem with a specific solution. Here is a part of them.',
    'projects.all': 'All projects',
    'projects.filter': 'Filter by service',
    'projects.view': 'View project',
    'projects.year': 'Year',
    'projects.location': 'Location',
    'projects.area': 'Floor area',
    'projects.scope': 'Scope',
    'projects.client': 'Client',
    'projects.gallery': 'Gallery',
    'projects.back': 'All projects',
    'projects.none': 'No projects in this category yet.',

    'about.eyebrow': 'About us',
    'about.title': 'A contractor that stays to the end',

    'contact.eyebrow': 'Contact',
    'contact.title': "Let's talk about your project",
    'contact.lead': 'Tell us what you are planning. We reply within one working day.',
    'contact.form.name': 'Full name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.service': 'What you need',
    'contact.form.servicePlaceholder': 'Choose a service',
    'contact.form.serviceOther': 'Other / not sure yet',
    'contact.form.message': 'About the project',
    'contact.form.messageHint': 'Building type, area, timeline. The more detail you give, the more useful our answer.',
    'contact.form.consent':
      'I agree to my details being processed in order to answer this enquiry.',
    'contact.form.submit': 'Send enquiry',
    'contact.form.sending': 'Sending…',
    'contact.form.success': 'Thank you. We have your enquiry and will reply on the next working day.',
    'contact.form.error': 'Could not send. Please email info@bmes.lv directly.',
    'contact.form.required': 'required',
    'contact.direct': 'Direct',
    'contact.office': 'Office',
    'contact.details': 'Company details',
    'contact.hours': 'Office hours',
    'contact.hoursValue': 'Mon to Fri, 08.00-17.00',

    'cta.title': 'Got a project in mind?',
    'cta.lead': 'Send us a few lines about it. No commitment.',
    'cta.button': 'Get in touch',

    'footer.nav': 'Pages',
    'footer.services': 'Services',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy policy',

    '404.title': 'This page does not exist',
    '404.lead': 'The address may have changed, or been typed slightly wrong.',
    '404.back': 'Back to home',

    'lang.switch': 'Pārslēgt uz latviešu',
  },
} as const;

export type UIKey = keyof (typeof ui)['lv'];
