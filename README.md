# Érase unha vez un proxecto Open Source

Un conto para aprender sobre licenzas, comunidades e contribucións.

## Qué es esto

Repositorio de trabajo para desarrollar una charla y, después, un cuento
ilustrado (físico y en PDF) que explica los conceptos fundamentales del
Open Source a través de una metáfora infantil: una caja de cartón, una
gatita llamada **Teky** y los animales del bosque.

Este repo es el espacio donde vamos a:

1. Organizar todo el material narrativo y conceptual ya decidido.
2. Seguir cerrando los huecos que quedan abiertos (ver `notas/pendientes.md`).
3. Iterar sobre el texto con pasadas de corrección y edición.
4. Preparar, más adelante, la maquetación como charla y como cuento/PDF.

## Abstract (galego, versión actual)

> E se che dixese que se pode explicar o Open Source cunha caixa de cartón,
> un grupo de animais con formato de conto de antes de durmir? Nesta charla
> faremos un percorrido polos conceptos fundamentais do Open Source: como
> liberar un proxecto, escoller unha licenza, recibir contribucións facer
> medrar unha comunidade. Todo contado como se fose un conto infantil,
> porque entender o Open Source non debería dar máis medo que unha historia
> para ir para a cama.

## Idea central

> Liberar un proyecto no es dejar una caja tirada en la plaza. Es ponerle
> nombre, explicar cómo se usa, decidir con qué reglas se comparte y
> construir un lugar donde otras personas puedan contribuir sin miedo.

## Nota sobre idiomas

- El **título y el abstract** de la charla están en galego.
- El **trabajo de guion y notas** (este repo) se lleva en castellano por
  ahora, para agilizar la edición conjunta.
- Hay que decidir en qué idioma(s) se redacta el texto narrativo final del
  cuento (¿galego, castellano, ambos?). Ver `notas/pendientes.md`.

## Estructura del repositorio

```
teky-open-source-cuento/
├── README.md                  → este archivo
├── charla/
│   ├── 00-abstract-y-enfoque.md   → abstract, prioridades y formato de la charla
│   ├── guion-breve-10min.md       → guion consolidado de 10 minutos
│   ├── build_plantilla_charla.js  → script pptxgenjs que genera la plantilla de slides
│   └── plantilla-charla.pptx      → plantilla de la charla (título + 8 escenas + outro), para importar en Canva
├── cuento/
│   ├── mapa-metaforas.md          → tabla de equivalencias (caja = proyecto, etc.)
│   ├── personajes.md              → fichas de Teky y el resto de animales
│   ├── fichas-personajes-ilustracion.md → ficha visual de cada personaje
│   ├── texto-extendido.md         → borrador del cuento en versión libro (sin límite de 10 min)
│   ├── estructura-libro.md        → el texto extendido repartido en spreads/páginas concretas
│   ├── plantilla-libro.md         → guía de estilo del libro (formato, plantillas de página, paleta, tipografía)
│   ├── plantilla-libro-36-paginas.md → desglose página a página (36 pp.) con composición y texto aproximado
│   ├── maquetacion-inicial.md     → dossier página a página listo para montar en Affinity (huecos, recortes, estado)
│   ├── plan-arte.md               → workflow de ilustración (composición IA + dibujo a mano)
│   ├── estructura-actos.md        → índice y resumen de todos los actos
│   └── actos/
│       ├── 01-teky-crea-la-caja.md
│       ├── 02-otros-gatitos-quieren-la-caja.md
│       ├── 03-la-nota-de-la-caja.md
│       ├── 04-la-caja-llega-a-la-plaza.md
│       ├── 05-aparecen-otros-animales.md
│       ├── 06-los-mapaches-hacen-fork.md
│       ├── 07-la-caja-se-hace-famosa.md
│       ├── 08-se-busca-ayuda.md
│       └── 09-final.md
├── notas/
│   ├── decisiones.md           → decisiones ya cerradas, con fecha
│   ├── pendientes.md           → huecos abiertos y preguntas para Andrea
│   ├── licencia.md             → estado de la licencia del propio cuento/charla
│   └── plan-copias-fisicas.md  → cronología y checklist para las copias físicas (WordCamp oct. 2026)
└── assets/                     → portada-mockup.svg y contraportada-mockup.svg (bocetos, no arte final)
```

## Estado actual (2026-07-01)

- Concepto, abstract, protagonista y metáfora principal: **cerrados**.
- Mapa de equivalencias técnicas: **cerrado** (ver `cuento/mapa-metaforas.md`).
- Actos 1 a 7 más la escena "se busca ayuda" y el final: **esquematizados**,
  pendientes de convertir en texto narrativo definitivo.
- Quedan huecos abiertos importantes: identidad de la rana del acto 4,
  redacción final del cierre, y la licencia concreta del propio cuento.
  Ver `notas/pendientes.md`.
- Todavía no se ha escrito ninguna versión narrativa en prosa: este primer
  commit organiza el brainstorming, no redacta el cuento.

## Licencia

Esta obra —texto, guion, personajes e ilustraciones— se publica bajo
**Creative Commons Reconocimiento-NoComercial 4.0 Internacional
(CC BY-NC 4.0)**.

Puedes compartirla y adaptarla libremente citando la autoría; el uso
comercial requiere permiso. La autora conserva los derechos, así que el
uso comercial es posible mediante acuerdo aparte.

- Resumen: <https://creativecommons.org/licenses/by-nc/4.0/deed.es>
- Texto completo en [`LICENSE`](LICENSE)

Las licencias que se explican *dentro* del cuento (MIT, GPL, Apache) son
parte de la historia, no la licencia de esta obra.

## Créditos y recursos

- **Tipografía**: Lora y Caveat (Google Fonts, licencia [SIL Open Font
  License 1.1](https://scripts.sil.org/OFL)) — elegidas a propósito de
  código abierto, coherente con el tema del libro. Detalle completo en
  `cuento/plantilla-libro.md`.

## Próximos pasos sugeridos

1. Cerrar los pendientes de `notas/pendientes.md` (empezando por la rana y
   el idioma final del texto).
2. Elegir un acto piloto (por ejemplo el Acto 1 o el Acto 3, que están más
   maduros) y convertirlo en texto narrativo definitivo para fijar tono y voz.
3. Repetir para el resto de actos, con pasadas de corrección.
4. Pasar a maquetación (charla primero, cuento/PDF después).
