ALMA — CATÁLOGO WEB (v3)
========================

Archivos en la raíz; las fotos de producto están en la carpeta img/ (145 JPG, 1000 px, ~95 KB c/u).

ARCHIVOS
--------
index.html, styles.css, script.js
camiseta-referencia.jpeg      foto principal (hero y producto HERO-01)
etiqueta-alma-referencia.jpeg etiqueta de talla (sección Tallas)
alma_logo_clean.png           logotipo
skull-halloween.png           calavera de la portada Halloween
guia-tallas-referencia.jpeg / campana-halloween-referencia.jpeg
                              referencias de diseño; la página no las usa

ANTES DE PUBLICAR (obligatorio)
-------------------------------
1. WhatsApp: ya configurado (+52 1 998 353 4113) en script.js, CONFIG.whatsapp. Botón flotante incluido.
   Redes: sección "Mira nuestras redes" (Instagram y Facebook) en index.html, id="redes".
2. En index.html, cambia og:image a la URL absoluta de tu dominio.

CÓMO AGREGAR FOTOS Y NOMBRES REALES
-----------------------------------
En script.js, objeto OVERRIDES, por código de producto:
  "HORROR-05": { name: "Nombre del diseño", image: "horror-05.jpg", description: "Opcional" }
Sin foto, el producto muestra una ficha ilustrada con su número.
Formato de las fotos: horizontal 3:2 (ej. 1000 x 667 px), JPG, menos de 150 KB. Las tarjetas ahora son 3:2.

CATÁLOGO
--------
Precio único: $250 MXN (CONFIG.price). Tallas: S / M / L / XL (SIZES).
Halloween 30 · Superhéroes/Villanos 60 · Rock 40 · Variedades 15 · Anime (próximamente).
Para activar Anime: en CATEGORIES cambia count de 0 al número de diseños.
Cuenta regresiva a Halloween: CONFIG.halloween. Al terminar, muestra un mensaje.

URL
---
?categoria=Halloween abre el catálogo filtrado (Halloween, Anime, "Superhéroes / Villanos", Rock, Variedades).

CAMBIOS V3
----------
Diseño
- Portada Halloween rediseñada: panel oscuro a todo el ancho con sangre, telarañas, póster con calavera y sello. El resto del sitio conserva la paleta arena.
- Se eliminó el título "HALLOWEEN" recortado, el clip-path irregular y los textos de 8–9 px (ahora mínimo 11 px).
- Franja animada con datos reales (precio, diseños, tallas). Se respeta "reducir movimiento".
- Ficha sin foto: silueta de camiseta con el número del diseño (antes: 135 recuadros iguales con texto).
- Sección "Intro" repetida sustituida por una franja de especificaciones; la página es más corta.
- Navegación de categorías con scroll horizontal en móvil y contador por categoría.
CSS
- Reescrito desde cero: 850 líneas con capas de sobrescrituras y !important → una hoja ordenada con variables.
- Corregido el desborde horizontal en móvil.
- Header sticky (antes: fixed con márgenes compensatorios).
JavaScript
- Reescrito legible (antes: líneas minificadas a mano).
- Carrito: solo guarda id, talla y cantidad; nombre, foto y precio salen del catálogo. Valida lo guardado y tolera localStorage bloqueado.
- Modal y carrito accesibles: foco atrapado, el resto de la página queda inerte, Escape cierra y el foco regresa al botón de origen.
- Mensaje claro si no se elige talla (antes: botón deshabilitado sin explicación) y aviso al agregar al carrito.
- Tarjetas de producto como <button> reales (antes: article con role="button").
- Texto escapado al insertarse en HTML.
- Estado vacío con botón de WhatsApp (Anime y búsquedas sin resultado).
- Cuenta regresiva: se pausa con la pestaña oculta y muestra mensaje al terminar (antes quedaba en 00:00:00).
Rendimiento
- Se quitó la pantalla de carga que bloqueaba el contenido hasta que cargara todo.
- Imágenes recomprimidas (etiqueta 435 → 52 KB; logo 189 → 64 KB) y logo duplicado eliminado.
- Fuentes: de 3 familias a 2 (se quitó Permanent Marker).
SEO
- Meta description, Open Graph y Twitter Card; lang="es-MX".
