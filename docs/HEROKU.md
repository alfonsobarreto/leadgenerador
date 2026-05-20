# Deploy en Heroku (`leadgenerador`)

Repo conectado a GitHub y app: **`leadgenerador`**. Remote Git clásico (por si no usas solo el integration):

`https://git.heroku.com/leadgenerador.git`

## Qué hace este repo en Heroku

1. **Buildpack Node** detecta `package.json`, instala dependencias y ejecuta **`npm run build`** (script `build` de Next.js).
2. El **Procfile** arranca el servidor con el puerto que Heroku inyecta: **`$PORT`**.
3. **`engines.node`** pide **Node 20.x** (alineado con Next.js 16).

## Checklist rápido (dashboard Heroku → app `leadgenerador`)

1. **Deploy method:** GitHub conectado y **Automatic deploys** activado en tu rama (p. ej. `main`).
2. **Primera compilación:** en **Activity** → logs del build si falla.
3. **Variables opcionales:** si ves errores tipo “no encuentra typescript/tailwind al build”, ejecuta desde tu máquina (con CLI logueada):

   ```bash
   heroku config:set NPM_CONFIG_PRODUCTION=false --app leadgenerador
   ```

   Con eso en el slug quedan también `devDependencies` necesarias para `next build` (TypeScript, Tailwind, ESLint según cómo los tengamos listados).

4. Abrí la app: **`heroku open --app leadgenerador`** (CLI) o el botón Open en el dashboard.

## Comandos útiles (CLI)

```bash
heroku logs --tail --app leadgenerador
heroku restart --app leadgenerador
```

Push manual al remote Git de Heroku (solo si **no** usas solo deploy desde GitHub):

```bash
git remote add heroku https://git.heroku.com/leadgenerador.git   # una sola vez
git push heroku main
```

## Notas Next.js / imágenes

- `/` es estática pre-renderizada; el proceso `web` sigue siendo necesario para `next start` y futuras rutas dinámicas.
- Imágenes remotas de `images.unsplash.com` ya están permitidas en `next.config.ts`.
