/* ==========================================================================
   Casa Común — site interactions
   Three independent features, no dependencies:
     1. Mobile nav toggle
     2. Scroll-reveal (elements marked with [data-reveal] in the HTML)
     3. "El organismo" diagram — click/hover a node to see its description
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
// ---------------------------------------------------------------------------
const organismData = {
  center: {
    eyebrow: 'Casa Común',
    title: 'El organismo completo',
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
  chocolate: {
    eyebrow: 'Iniciativa en marcha',
    title: 'Chocolate Común',
    text: 'Cacaos especiales de regiones afectadas por el conflicto, combinados con plantas medicinales cultivadas localmente. El proyecto más reciente del organismo — y una nueva forma de entender el chocolate como medicina y economía como cuidado.'
  }
};

const organismSvg = document.getElementById('organismSvg');

if (organismSvg) {
  const nodes = organismSvg.querySelectorAll('.organism-node');
  const connectors = organismSvg.querySelectorAll('.organism-connectors path');
  const panel = {
    eyebrow: document.getElementById('panelEyebrow'),
    title: document.getElementById('panelTitle'),
    text: document.getElementById('panelText'),
  };

  function showNode(nodeId) {
    nodes.forEach(n => n.classList.toggle('is-active', n.dataset.node === nodeId));
    connectors.forEach(c => c.classList.toggle('is-active', c.dataset.for === nodeId));

    const data = organismData[nodeId] || organismData.center;
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
