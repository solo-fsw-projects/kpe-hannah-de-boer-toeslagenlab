# Toeslagen

Webgebaseerde financiële simulatietool ingebed in Qualtrics-surveys. Zie [DESIGN.md](DESIGN.md) voor de architectuur en technische integratie-referentie.

## Setup

### Linux / Windows (met Docker)
- Installeer git, docker en make
- Checkout deze repo
- Run `make init`

### Windows (zonder Docker)
- Installeer git en Node.js
- Checkout deze repo
- Run `npm install`
- Run `windows-create-symlinks.bat`

## Lokale preview

### Met Docker
```bash
make test-env
```

### Zonder Docker
```bash
npm run test-env
```

Open de getoonde URL + `/test-env/`

## Testen

```bash
make test              # alle testen (Docker)
make test-unit         # alleen unit testen
make test-functional   # alleen functionele testen
make run CMD="node --experimental-vm-modules node_modules/jest/bin/jest.js <pad>"  # specifiek testbestand
```

Zonder Docker: vervang `make test` door `npm test`, etc.

CI draait automatisch bij elke push via GitHub Actions (`.github/workflows/test.yml`).

## Ontwikkelen

1. Maak een branch aan (bijv. `feature/dto-34`)
2. Test lokaal met `make test-env`
3. Schrijf of pas automatische testen aan
4. Push — CI draait automatisch
5. Test handmatig in het demo-project op Qualtrics
6. Zet het Jira ticket op done als alles groen is

## Bouwen

```bash
make build
```

Produceert `dist/<branch-name>/` met de gebundelde JS/CSS en `dist/qualtrics-header-<branch-name>.html`.

## Deploy

Deploy gaat via GitHub Actions naar GitHub Pages:

**GitHub → Actions → Deploy build to GitHub Pages → Run workflow** (selecteer de juiste branch)

De bestanden zijn daarna beschikbaar via:
```
https://solo-fsw-projects.github.io/kpe-hannah-de-boer-toeslagenlab/<branch-name>/
```

### Qualtrics bijwerken na deploy

Bij een nieuwe versie of gewijzigde header/JS:
- **Look & feel → General → Header → Edit → Source**: plak de inhoud van `qualtrics-header-<branch-name>.html`
- **Look & feel → Style → External CSS**: pas de URL aan naar `.../toeslagen.css`

## Gebruik in Qualtrics

Zie [DESIGN.md — Qualtrics Integration](DESIGN.md#qualtrics-integration) voor de volledige beschrijving van embedded variables en de publieke API.

De vier dynamische blokken in de Qualtrics-library:

| Blok | Functie |
|---|---|
| Inkomen | `window.toeslagen.applyIncomes()` |
| Vaste lasten | `window.toeslagen.applyFixedExpenses()` |
| Variabele uitgaven | `window.toeslagen.applyVariableExpense()` |
| Aangepast bedrag | `window.toeslagen.applyCustomExpense(amount)` |

## CORS-proxy (`resources/proxy.php`)

Voor het inladen van een publiek gedeeld Excel-bestand vanuit de browser (bijv. via OneDrive/SharePoint) is een server-side proxy nodig om CORS-beperkingen te omzeilen.

**Gebruik:**
```
https://cdn.chrisdejager.nl/proxy.php?url=<onedrive-url>
```

De proxy:
- Voegt automatisch `&download=1` toe aan de OneDrive-URL als dat nog niet aanwezig is
- Volgt SharePoint-omleidingen inclusief sessiebeheer (cookies)
- Stuurt het bestand terug met `Access-Control-Allow-Origin: *`

**Vereisten:** PHP met cURL-extensie. Het gedeelde bestand moet anonieme toegang toestaan ("Anyone with the link").

## Instructie voor onderzoekers

Zie [Instructie Dienst Toeslagen Onderzoek](https://docs.google.com/document/d/1LBQ41OCzh_k5DWEfWEhUqVtw20O3pfrtpFUCvKefhi0/)
