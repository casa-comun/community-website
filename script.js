/* ==========================================================================
   Casa Común — site interactions
   Four independent features, no dependencies:
     1. Mobile nav toggle
     2. Scroll-reveal (elements marked with [data-reveal] in the HTML)
     3. "El organismo" diagram — click/hover a node to see its description
     4. ES/EN language toggle
   ========================================================================== */

// ---------------------------------------------------------------------------
// 1. Mobile nav toggle
// ---------------------------------------------------------------------------
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close the menu whenever a link is used (mobile only; harmless on desktop).
siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------------------------------------------------------------------------
// 2. Scroll reveal
// Any element tagged data-reveal in the markup fades/slides in once it
// enters the viewport. Adding a new reveal target elsewhere on the page
// only requires the attribute — no selector list to maintain here.
// ---------------------------------------------------------------------------
const revealTargets = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ---------------------------------------------------------------------------
// 3. Organism diagram interactivity
// Text lives in two languages here because the panel content isn't part of
// the static HTML — it's written in by JS as the visitor explores.
// ---------------------------------------------------------------------------
const organismData = {
  es: {
    center: {
      eyebrow: 'Casa Común',
      title: 'Todo el organismo',
      text: 'Cada componente existe para alimentar a los demás: lo que se cultiva se transforma en el laboratorio, se vende en la tienda y el café, y circula a través de Los Comunes — cerrando el ciclo de vuelta a los productores. Toca cualquier nodo para explorarlo.'
    },
    laboratorio: {
      eyebrow: 'Componente',
      title: 'Laboratorio de transformación',
      text: 'Aumenta la capacidad de procesar productos locales — alimenticios, de cuidado e higiene personal — para su venta e intercambio. Aquí nacen las recetas co-creadas junto a los productores del territorio.'
    },
    tienda: {
      eyebrow: 'Componente',
      title: 'Tienda comunitaria',
      text: 'El punto donde los productos transformados en el laboratorio llegan a la comunidad, sosteniendo el intercambio y la conexión entre habitantes y recursos de la región.'
    },
    cafe: {
      eyebrow: 'Componente',
      title: 'Café Casa Común',
      text: 'Espacio de encuentro donde se pilotan nuevos productos, se comparten saberes y se vive — a pequeña escala, taza a taza — la economía regenerativa que Casa Común propone para todo el territorio.'
    },
    moneda: {
      eyebrow: 'Componente',
      title: 'Los Comunes',
      text: 'Nuestra moneda comunitaria mantiene el valor circulando dentro de Barichara, en vez de fugarse hacia afuera. Facilita el intercambio y fortalece la confianza entre quienes forman parte del organismo.'
    },
    caney: {
      eyebrow: 'Componente',
      title: 'Caney Común',
      text: 'Un espacio comunitario de encuentro donde se comparten el conocimiento y las experiencias locales — talleres, círculos de aprendizaje e intercambio de saberes entre productores y visitantes.'
    }
  },
  en: {
    center: {
      eyebrow: 'Casa Común',
      title: 'The whole organisation',
      text: 'Every component exists to feed the others: what is grown gets transformed in the lab, sold in the shop and café, and circulates through Los Comunes — closing the loop back to the producers. Tap any node to explore it.'
    },
    laboratorio: {
      eyebrow: 'Component',
      title: 'Transformation lab',
      text: 'Increases the capacity to process local products — food, personal care and hygiene items — for sale and exchange. This is where recipes are co-created with producers from the territory.'
    },
    tienda: {
      eyebrow: 'Component',
      title: 'Community shop',
      text: 'The point where products transformed in the lab reach the community, sustaining exchange and the connection between residents and the region\u2019s resources.'
    },
    cafe: {
      eyebrow: 'Component',
      title: 'Café Casa Común',
      text: 'A meeting space where new products are piloted and knowledge is shared — cup by cup — living out the regenerative economy Casa Común proposes for the whole territory.'
    },
    moneda: {
      eyebrow: 'Component',
      title: 'Los Comunes',
      text: 'Our community currency keeps value circulating inside Barichara instead of leaking out. It facilitates exchange and strengthens trust among everyone who is part of the organisation.'
    },
    caney: {
      eyebrow: 'Component',
      title: 'Caney Común',
      text: 'A communal gathering space where local knowledge and experience are shared — workshops, learning circles, and an exchange of know-how between producers and visitors.'
    }
  }
};

const organismSvg = document.getElementById('organismSvg');
let activeNodeId = 'center';

if (organismSvg) {
  const nodes = organismSvg.querySelectorAll('.organism-node');
  const connectors = organismSvg.querySelectorAll('.organism-connectors path');
  const panel = {
    eyebrow: document.getElementById('panelEyebrow'),
    title: document.getElementById('panelTitle'),
    text: document.getElementById('panelText'),
  };

  function showNode(nodeId) {
    activeNodeId = nodeId;
    nodes.forEach(n => n.classList.toggle('is-active', n.dataset.node === nodeId));
    connectors.forEach(c => c.classList.toggle('is-active', c.dataset.for === nodeId));

    const dict = organismData[currentLang] || organismData.es;
    const data = dict[nodeId] || dict.center;
    panel.eyebrow.textContent = data.eyebrow;
    panel.title.textContent = data.title;
    panel.text.textContent = data.text;
  }

  nodes.forEach(node => {
    const activate = () => showNode(node.dataset.node);
    node.addEventListener('mouseenter', activate);
    node.addEventListener('focus', activate);
    node.addEventListener('click', activate);
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
}

// ---------------------------------------------------------------------------
// 4. ES/EN language toggle
// Spanish is the source of truth: it's read straight out of the HTML the
// first time the page loads, so there's only one English dictionary to
// maintain below — nothing to keep in sync on the Spanish side.
// ---------------------------------------------------------------------------
const translations = {
  en: {
    'nav.organismo': 'The Organisation',
    'nav.impacto': 'Impact',
    'nav.galeria': 'Gallery',
    'nav.tienda': 'Shop',
    'nav.suenos': 'Dreams',
    'nav.visitanos': 'Visit us',

    'hero.eyebrow': 'Barichara, Santander · Colombia',
    'hero.title': 'An experiment for a <em>wellbeing economy</em>',
    'hero.lede': 'Casa Común transforms Barichara\u2019s economy into a fabric of shared abundance — where the territory\u2019s resources, its producers\u2019 work, and care for the environment become wealth for everyone.',
    'hero.cta1': 'Meet the organisation',
    'hero.cta2': 'Our dreams →',

    'que.label': 'What we do',
    'que.p1': 'We are a community space where value isn\u2019t measured only in money, but in the strength of the relationships that sustain the territory. Through a transformation lab, a shop, a café and our own currency, we turn what Barichara\u2019s land already offers — harvests, medicinal plants, ancestral knowledge — into products, income and exchange for the people who live here.',
    'que.p2': 'We\u2019re not chasing competitive scarcity. We co-create shared abundance, trusting that together we can transform our surroundings and build a prosperous future for everyone.',

    'organismo.label': 'The organisation',
    'organismo.title': 'Five components, <em>one single root</em>',
    'organismo.intro': 'Casa Común doesn\u2019t work like a company with separate departments. It works like an organisation — every part feeds the others. Tap a node to learn about it.',

    'motiv.label': 'Why we exist',
    'motiv.title': 'The curiosity to create value <em>beyond money</em>',
    'motiv.p1': 'On an individual level, we\u2019re driven by curiosity to explore the potential of our human and natural resources, together with a desire to research how value can be created — and circulated — beyond money, as the basis for a socially and environmentally just economy.',
    'motiv.p2': 'Collectively, we dream of a community space that promotes sustainability and wellbeing for all. We seek to co-create shared abundance instead of competitive scarcity. We trust that, together, we can transform our surroundings.',

    'impacto.label': 'Impact',
    'impacto.title': 'The territory, <em>told through people</em>',
    'impacto.stat1': 'Producers connected',
    'impacto.stat2': 'Women producers',
    'impacto.stat3': 'Men producers',
    'impacto.stat4': 'Community groups',
    'impacto.stat5': 'Consumers who are part of Casa Común',
    'impacto.stat6': 'Pesos mobilized within the community economy',
    'impacto.note': 'Our goal is to promote the transformation of local resources, fostering a growing role for women in transforming harvests, medicinal plants and forest products from the territory — and to share this regenerative economy with everyone who visits Barichara.',

    'galeria.label': 'Gallery',
    'galeria.title': 'Our community, <em>in action</em>',
    'galeria.intro': 'We don\u2019t have our own photo library yet — in the meantime, these videos and our Instagram tell the story better than we can.',
    'galeria.igTitle': 'Follow us on Instagram',
    'galeria.igSub': '@casacomunbarichara — day-to-day photos and updates',
    'galeria.featured': 'Featured from Instagram',

    'tienda.label': 'Shop',
    'tienda.title': 'Products that <em>sustain the organisation</em>',
    'tienda.intro': 'Every purchase directly supports Casa Común\u2019s producers and helps sustain the lab, the shop and the café. Reach out to order any of these products.',
    'tienda.p1.name': 'Menta Viva line',
    'tienda.p1.desc': 'Natural cleaning products made by the Menta Viva women\u2019s collective.',
    'tienda.p2.name': 'Café Casa Común',
    'tienda.p2.desc': 'Coffee grown and roasted by local producers from the territory.',
    'tienda.p3.name': 'Plants & infusions',
    'tienda.p3.desc': 'Dried medicinal plants and infusion blends, grown in Barichara.',
    'tienda.order': 'Order this product',
    'tienda.note': 'Catalog under construction — prices and photos will be updated as the lab finalizes them.',

    'brochure.menta': 'Brochure — Menta Viva',
    'brochure.download': 'Download PDF ↓',
    'brochure.casacomun': 'Brochure — Casa Común',
    'brochure.soon': 'Coming soon',

    'prod.label': 'Our people',
    'prod.title': 'Who makes <em>the organisation </em> possible',
    'prod.intro': 'A look at some of the people who grow, transform and exchange within Casa Común. This section grows as more producers join.',
    'prod.p1.name': 'Producer name',
    'prod.p1.role': 'Craft or product',
    'prod.p2.name': 'Producer name',
    'prod.p2.role': 'Craft or product',
    'prod.p3.name': 'Producer name',
    'prod.p3.role': 'Craft or product',
    'prod.p4.name': 'Producer name',
    'prod.p4.role': 'Craft or product',

    'suenos.label': 'What we dream of',
    'suenos.title': 'Two dreams <em>looking for wings</em>',
    'suenos.intro': 'These two projects don\u2019t exist yet — they\u2019re in the works, and we\u2019re looking for allies who can contribute funding or expertise to make them real.',
    'suenos.d1.label': 'Dream in progress',
    'suenos.d1.title': 'Chocolate Común',
    'suenos.d1.tagline': 'Regenerating the territory through medicinal chocolate',
    'suenos.d1.body': 'Chocolate Común will weave together special cacaos from conflict-affected regions with freeze-dried medicinal plants grown locally — moringa, soursop, passionfruit. Each chocolate will be a vehicle for wellbeing and a story of interdependence between people, plants and territory.',
    'suenos.d2.label': 'Dream in progress',
    'suenos.d2.title': 'Centro de Transformación Común',
    'suenos.d2.tagline': 'A production plant for the whole community',
    'suenos.d2.body': 'We dream of an equipped lab to power the transformation of food, hygiene and personal-care products — a space where a growing number of producers and consumers take part in a community economy built on trust, solidarity and care for the environment.',
    'suenos.support': 'I want to support this dream →',
    'suenos.closing': 'We dream of continuing to connect the potential of our territory and its lush abundance, the kindness and eagerness to learn, to become an ever more resilient and prosperous community.',

    'contacto.label': 'Visit us',
    'contacto.title': 'Come weave with us',
    'contacto.text': 'Casa Común is located in Barichara, Santander — open to anyone who wants to learn, exchange knowledge, or simply share a cup of coffee with us.',
    'contacto.maps': 'Get directions',
    'contacto.mapsSub': 'Location on Google Maps',
    'contacto.wp': 'WhatsApp group',
    'contacto.wpSub': 'Join the community',
    'contacto.cal': 'Calendar',
    'contacto.calSub': 'Workshops and activities',
    'contacto.form': 'Form',
    'contacto.formSub': 'Write to us or apply',

    'footer.tag': 'An organisation of Fundación Barichara Regenerativa',
  }
};

let currentLang = localStorage.getItem('casa-comun-lang') || 'es';

const i18nElements = document.querySelectorAll('[data-i18n]');
const originalContent = {};
i18nElements.forEach(el => {
  originalContent[el.dataset.i18n] = el.innerHTML;
});

const langToggle = document.getElementById('langToggle');

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  i18nElements.forEach(el => {
    const key = el.dataset.i18n;
    const translated = translations.en[key];
    el.innerHTML = (lang === 'en' && translated !== undefined) ? translated : originalContent[key];
  });

  langToggle.textContent = lang === 'es' ? 'EN' : 'ES';
  localStorage.setItem('casa-comun-lang', lang);

  // Keep the organism panel in sync with whichever node is currently shown.
  if (organismSvg) {
    const dict = organismData[lang] || organismData.es;
    const data = dict[activeNodeId] || dict.center;
    document.getElementById('panelEyebrow').textContent = data.eyebrow;
    document.getElementById('panelTitle').textContent = data.title;
    document.getElementById('panelText').textContent = data.text;
  }
}

langToggle.addEventListener('click', () => {
  applyLanguage(currentLang === 'es' ? 'en' : 'es');
});

applyLanguage(currentLang);