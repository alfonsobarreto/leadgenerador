# Panel superior — título dinámico (`dynamicMessage`)

Mapa de interacciones para **texto**, **avatar** y **estado activo** de la Mesa de diseño.

Se implementa en **Zustand** (`lib/cotizador-ui-store.ts`) y `lib/terreno-sqm-panel.ts`. La última acción con triada completa **sobrescribe** texto y avatar en pantalla.

**`baselineTrip`**: último par fijado por acciones distintas al slider (ubicación, enganche, divisa, clic en categoría de sueño, etc.).

---

## Mensajes y disparadores (especificación actual)

| # | Disparador | Texto exacto | Avatar (`via.placeholder.com` `text=`) |
|---|------------|--------------|------------------------------------------|
| 1 | **Estado inicial** (primera carga) | `Hola, Soy el Guardian de Tu sueño, Mucho Gusto` | `Inicial` |
| 2 | Clic **Mi casa** (`lote-habitacional`) | `Alistemos Maletas Nos Mudamos.` | `Casa` |
| 3 | Clic **Mi Terreno** | `Todo Empezo con un lotesito` | `Terreno` |
| 4 | Clic **Mi Negocio** | `Que Pro, el cielo es el limite` | `Negocio` |
| 5 | **Selección** de una opción en **Ubicación** (valor distinto de vacío) | `Ubicacion Seleccionada` | `Ubicacion` |
| 6 | Clic enganche **10%** | `¡Uray! Ya Tenemos plusvalia` | `10` |
| 7 | Clic enganche **5%** | `¡Bravo! Inversion Inteligente` | `5` |
| 8 | Clic enganche **1%** | `¡Vamos, Que el sueño no Tenga Excusa` | `1` |
| — | Slider m² con **Mi Terreno** y **m² ≥ 200** | `¡Gran Sueño! Tienes 48 meses sin intereses` | `48MSI` |
| — | Slider m² con **Mi Terreno** y **m² ≤ 199** | `¡Tamaño perfecto! Tienes 36 meses sin intereses` | `36MSI` |
| — | Slider m² con **Mi casa** o **Mi Negocio** | Sin MSI: mantiene mensaje de categoría (Casa / Negocio) | `Casa` / `Negocio` |
| — | Tipo de cambio **MXN** / **USD** | `¡Órale! Aquí te van en Pesos` / `Alright! en dolores` | `MXN` / `USD` |
| — | Clic en **avatar** (Guardián) | `Hola, Soy el Guardian de Tu sueño, Mucho Gusto` | `Inicial` |

**Ubicación:** el texto “Ubicacion Seleccionada” solo aplica cuando el usuario **elige** una propiedad en el `<select>`, no al hacer foco o abrir el desplegable.

---

## Implementación técnica

- **Store:** `lib/cotizador-ui-store.ts` — `dynamicMessage`, `avatarUrl`, `baselineTrip`, `pickPurpose`, `setUbicacionSeleccionada`, `pickInvestmentPct`, `updateDreamSqmRaw`, etc.
- **Mensajes + URLs:** `lib/cotizador-panel-messages.ts` (`COTIZADOR_PANEL_MESSAGES`, `COTIZADOR_PANEL_AVATARS`).
- **UI:** `financial-dashboard.tsx`, `design-mesa.tsx` (radios / botones reflejan `purpose`, `investmentPct`, `currency`).

## Criterios de aceptación manual

1. Carga inicial: fila **#1** en panel y avatar `Inicial`.
2. **Mi casa / Mi Terreno / Mi Negocio** actualizan texto, avatar y **resaltado** del control correspondiente (**#2–#4**).
3. Elegir ubicación concreta: **#5**; foco en el select sin cambiar valor **no** cambia el panel.
4. **10% / 5% / 1%** disparan **#6–#8** y un solo enganche aparece activo.
5. Slider m²: MSI **solo** con **Mi Terreno** (≥200 → 48 MSI; ≤199 → 36 MSI). Con **Mi casa** o **Mi Negocio**, el panel no cambia a promos MSI.
6. **MXN** / **USD** y clic en **avatar** actualizan panel y `baselineTrip`.
