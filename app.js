(() => {
  const site = window.WASABI_SITE;
  const categories = window.WASABI_MENU;
  if (!site || !categories) return;

  document.title = `${site.titre} — ${site.sousTitre}`;
  document.querySelector('#titre').textContent = site.titre;
  document.querySelector('#sous-titre').textContent = site.sousTitre;
  document.querySelector('#description').textContent = site.description;

  const nav = document.querySelector('#navigation');
  const menu = document.querySelector('#menu');
  const safeId = (text) => `cat-${text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const money = (value) => new Intl.NumberFormat(site.langue || 'fr-FR', { style: 'currency', currency: site.devise || 'EUR' }).format(value);

  categories.forEach((category) => {
    const id = safeId(category.categorie);
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = category.categorie;
    nav.append(link);

    const section = document.createElement('section');
    section.id = id;
    const heading = document.createElement('h2');
    heading.textContent = category.categorie;
    section.append(heading);

    category.plats.forEach((dish) => {
      const row = document.createElement('article');
      row.className = 'plat';
      const media = document.createElement('div');
      media.className = 'plat-media';
      media.setAttribute('aria-hidden', 'true');
      const placeholder = document.createElement('span');
      placeholder.textContent = 'Image à venir';
      media.append(placeholder);
      row.append(media);

      const details = document.createElement('div');
      const name = dish.code ? `${dish.code} — ${dish.description}` : dish.nom;
      const title = document.createElement('strong');
      title.textContent = name || 'Plat';
      details.append(title);
      if (dish.code && dish.description && dish.nom) {
        const extra = document.createElement('small');
        extra.textContent = dish.nom;
        details.append(extra);
      }
      row.append(details);
      if (typeof dish.prix === 'number') {
        const price = document.createElement('span');
        price.className = 'prix';
        price.textContent = money(dish.prix);
        row.append(price);
      }
      section.append(row);
    });
    menu.append(section);
  });

  const contact = document.querySelector('#contact');
  const addLine = (label, value, href) => {
    if (!value || value === 'À compléter') return;
    const p = document.createElement('p');
    p.append(document.createTextNode(`${label} : `));
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = value;
      p.append(a);
    } else {
      p.append(document.createTextNode(value));
    }
    contact.append(p);
  };
  addLine('Adresse', site.contact.adresse);
  addLine('Téléphone', site.contact.telephone, `tel:${(site.contact.telephone || '').replace(/[^+\d]/g, '')}`);
  addLine('Email', site.contact.email, `mailto:${site.contact.email || ''}`);
  addLine('Horaires', site.contact.horaires);
  addLine('Accès', site.contact.transport);
  if (!contact.childElementCount) contact.textContent = 'Coordonnées à renseigner.';
  document.querySelector('#pied-page').textContent = `© ${new Date().getFullYear()} ${site.titre}`;
})();
