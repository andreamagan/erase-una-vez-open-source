// Pinta "As persoas" dos créditos a partir de equipo.json (a única fonte de persoas).
//
// Formato: { "persoas": [ { ... }, ... ] }, unha entrada por persoa, na orde en que se mostran.
//   nome     (obrigatorio) nome tal e como se le nos créditos
//   papel    (obrigatorio) que fixo, en minúscula: "revisión do galego"
//   github   (opcional) usuario de GitHub, sen @: dá o avatar e a ligazón principal
//   linkedin (opcional) URL completa do perfil: ligazón principal se non hai github,
//            ou unha ligazón pequena despois do papel se o hai
//   foto     (opcional) ruta dunha imaxe propia en lugar do avatar de GitHub
// Sen github nin foto móstranse as iniciais. O HTML trae a primeira persoa como reserva sen JavaScript.
(function () {
  var list = document.querySelector('.people');
  if (!list) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function link(href, text) {
    var a = el('a', null, text);
    a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
    return a;
  }
  function initials(nome) {
    var av = el('span', 'av', nome.split(/\s+/).map(function (w) { return w.charAt(0); }).slice(0, 2).join(''));
    av.setAttribute('aria-hidden', 'true');
    return av;
  }
  function avatar(p) {
    var src = p.foto || (p.github ? 'https://github.com/' + encodeURIComponent(p.github) + '.png?size=120' : null);
    if (!src) return initials(p.nome);
    var img = el('img', 'av');
    img.src = src; img.alt = ''; img.loading = 'lazy'; img.width = 120; img.height = 120;
    img.onerror = function () { img.replaceWith(initials(p.nome)); };
    return img;
  }

  fetch('equipo.json').then(function (r) { return r.json(); }).then(function (data) {
    var items = (data.persoas || []).filter(function (p) { return p && p.nome; }).map(function (p) {
      var li = el('li', 'chip');
      var href = p.github ? 'https://github.com/' + encodeURIComponent(p.github) : p.linkedin;
      var av = avatar(p);
      var name = el('strong');
      if (href) {
        var avLink = link(href);
        avLink.className = 'av-link';
        avLink.tabIndex = -1;
        avLink.setAttribute('aria-hidden', 'true');
        avLink.append(av);
        li.append(avLink);
        name.append(link(href, p.nome));
      } else {
        li.append(av);
        name.textContent = p.nome;
      }
      var role = el('small', null, p.papel || '');
      if (p.github && p.linkedin) {
        role.append(' · ');
        role.append(link(p.linkedin, 'LinkedIn'));
      }
      li.append(name, role);
      return li;
    });
    if (items.length) list.replaceChildren.apply(list, items);
  }).catch(function () {});
})();
