# Panel superior — título dinámico (`dynamicMessage`)

Mapa de interacciones para **texto**, **avatar** y **estado activo** de la Mesa de diseño.

Se implementa en **Zustand** (`lib/cotizador-ui-store.ts`). La última acción con triada completa **sobrescribe** texto y avatar en pantalla (salvo el override temporal por **m² > 150**, ver abajo).

Además se guarda **`baselineTrip`**: último par (mensaje, avatar) fijado por acciones distintas al override de tamaño. Sirve para **restaurar** el panel cuando el valor de m² vuelve a **≤ 150** tras haber estado por encima.

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
| — | **m² > 150** (al escribir / cambiar) | `¡Gran sueño! Tienes 48 meses sin intereses` | `Tamano` (placeholder; no altera `baselineTrip`) |
| — | **m² ≤ 150** tras haber estado > 150 | Restaura **`baselineTrip`** (último estado no-tamaño) | (mismo que `baselineTrip`) |
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
5. **m² > 150**: mensaje de gran sueño; al pasar a **≤ 150**, el panel vuelve al último estado guardado en **`baselineTrip`**.
6. **MXN** / **USD** y clic en **avatar** actualizan panel y `baselineTrip`.
