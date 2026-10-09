# Friends&Family Eyewear — sito

Sito statico (HTML, CSS, JavaScript), senza build: basta pubblicare la cartella così com'è.

## Pagine

| Pagina | Italiano | English |
|---|---|---|
| Home | `index.html` | `en/index.html` |
| Catalogo | `catalogo.html` | `en/catalogue.html` |
| Gallery | `gallery.html` | `en/gallery.html` |

Il sito si adatta da solo a computer, tablet e telefono.

## Struttura

```
assets/css/style.css     stile di tutto il sito
assets/js/site.js        menu su mobile
assets/js/catalog.js     catalogo: Vista/Sole, filtri, colori, gioco "Meglio 1 o 2?"
assets/js/gallery.js     gallery a schermo intero
assets/img/frames/       foto occhiali  (modello-colore-lato/front.jpg)
assets/img/gallery/      foto della campagna
```

I dati dei modelli (nomi, calibri, colori, foto) sono in fondo a `catalogo.html` e `en/catalogue.html`, nella riga `window.FF_MODELS = ...`.

## Da completare

- Calibri di Axel, Arrow, Big Theo e Bond (ora `[calibro]`)
- "Dove trovarci" e P.IVA nel footer

## Pubblicare

- **Netlify / Vercel**: importa questo repository, nessuna impostazione di build, cartella di pubblicazione = radice.
- **GitHub Pages**: Settings → Pages → Branch `main`, cartella `/ (root)`.
- **Lovable**: importa il repository da GitHub.
