# Panel superior — título dinámico (`dynamicMessage`)

Este documento describe el mapa de interacciones para el texto del **panel superior** (junto al avatar), implementado con **Zustand** (`dynamicMessage` + `setDynamicMessage`).

La última interacción válida **sobrescribe** el mensaje anterior (no hay cola de mensajes).

---

## Mensajes y disparadores

| # | Disparador | Texto exacto |
|---|------------|--------------|
| 1 | **Estado inicial** (al montar la app) | `¡Alistemos maletas, nos mudamos!` |
| 2 | **Clic / cambio** en “Tu sueño” → **“Lote habitacional”** **o** **“Terreno”** | `Todo empezó con un lotesito.` |
| 3 | **Interacción**, **enfoque (`onFocus`)** o **cambio (`onChange`)** del `<select>` de **ubicación / desarrollo** | `¡Qué pro, el límite es el cielo!` |
| 4 | **Clic** en enganche **“10%”** | `¡Uray! Ya tenemos plusvalía` |
| 5 | **Clic** en enganche **“5%”** | `¡Bravo! Inversión inteligente` |
| 6 | **Clic** en enganche **“1%”** | `¡Vamos, que el sueño no tenga excusa!` |
| 7 | Valor en **“Tamaño de tu sueño” (m²)** **mayor a 150** (`onChange` / al escribir) | `¡Gran sueño! Tienes 48 meses sin intereses` |
| 8 | Tipo de cambio → **MXN** | `¡Órale! Aquí te van en Pesos` |
| 9 | Tipo de cambio → **USD** | `Alright! en dolores` |
| 10 | **Clic directo** en la imagen / tarjeta del **avatar** (Guardián del sueño) | `Hola, Soy el Guardian de tu sueño, Mucho gusto` |

---

## Implementación técnica

- **Store:** `lib/cotizador-ui-store.ts` — estado `dynamicMessage`.
- **Constantes literales:** `lib/cotizador-panel-messages.ts` — evita typos y documenta en código.
- **UI:** `financial-dashboard.tsx` (título + clic en avatar), `design-mesa.tsx` (formulario) — todos **Client Components** donde aplica.

## Criterios de aceptación manual

1. Al cargar la página, el título es el del ítem **#1**.
2. Elegir **Lote habitacional** o **Terreno** actualiza al **#2** (sin requerir opción tercera).
3. Abrir o cambiar el `<select>` de ubicación actualiza al **#3**.
4. Los tres porcentajes disparan **#4–#6** respectivamente al seleccionarlos.
5. Con **m² > 150** se muestra **#7**; con valor ≤ 150 no se aplica esta regla desde el input (el mensaje queda el de la última otra acción).
6. **MXN** y **USD** disparan **#8** y **#9**.
7. Clic en el avatar dispara **#10**.
