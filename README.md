# README

## Local Setup

### Linux / Windows (met docker)
- installeer git, docker en make
- checkout deze repo
- run `make init`

### Windows (zonder docker)
- installeer git en nodejs
- checkout deze repo
- run `npm install`
- run `windows-create-symlinks.bat`
- run `npm run test-env`
- open de getoonde url

## Lokale preview

### Linux / Windows (met docker)
- run `make test-env`
- open de getoonde url + `/test-env/`

### Windows (zonder docker)
- run `npm run test-env`
- open de getoonde url + `/test-env/`

## Testen

Er zijn unit- en functionele testen in de `tests/` map.

```bash
npm test                    # alle testen
npm run test:unit           # alleen unit testen
npm run test:functional     # alleen functionele testen
```

CI draait automatisch bij elke push via GitHub Actions (`.github/workflows/test.yml`).
Bitbucket Pipelines doet hetzelfde voor de Bitbucket mirror.

## Ontwikkelen

* Gebruik Jira om nieuwe features of bugs te tracken
* Maak een branch aan (bijv. `feature/dto-34`), commit je wijzigingen daar in
* Test handmatig met de lokale preview
* Schrijf of pas automatische testen aan bij je wijzigingen
* Push naar GitHub/Bitbucket — CI testen draaien automatisch
* Test handmatig in het demo-project op Qualtrics
* Zet het Jira ticket op done als alles groen is

## Deploy en versies

Deploy gaat via GitHub Actions naar GitHub Pages. Trigger de workflow handmatig vanuit de branch die je wilt deployen:

- GitHub → **Actions → Deploy build to GitHub Pages → Run workflow** (selecteer de juiste branch)

De workflow bouwt automatisch en publiceert het resultaat onder de branchnaam als versienummer. De bestanden komen terecht op de `github-pages` branch en zijn beschikbaar via:

```
https://solo-fsw-projects.github.io/kpe-hannah-de-boer-toeslagenlab/<versie>/
```

Bij een nieuwe versie (bijv. v5 → v6) of gewijzigde header html/js:
- **Look & feel → General → Header → Edit → Source**: plak de inhoud van `qualtrics-header-v6.html`, sla op en apply
- **Look & feel → Style → External CSS**: pas de url aan naar `https://solo-fsw-projects.github.io/kpe-hannah-de-boer-toeslagenlab/v6/toeslagen.css`, apply

## Gebruik in Qualtrics

Plaats de html uit `qualtrics-header.html` in de header van het survey-thema (look and feel).

Er zijn 4 dynamische blokken in de Qualtrics library, elk met eigen javascript:

| Blok | Functie |
|------|---------|
| Inkomen | `window.toeslagen.applyIncomes()` |
| Vaste lasten | `window.toeslagen.applyFixedExpenses()` |
| Variabele uitgaven | `window.toeslagen.applyVariableExpense()` |
| Aangepast bedrag (terugvordering) | `window.toeslagen.applyCustomExpense()` |

Elk blok gebruikt hetzelfde patroon:

```js
Qualtrics.SurveyEngine.addOnPageSubmit(function(type) {
  if (type === "next") {
    window.toeslagen.<functie>();
  }
});
```

## Instructie voor onderzoekers

Zie [Instructie Dienst Toeslagen Onderzoek](https://docs.google.com/document/d/1LBQ41OCzh_k5DWEfWEhUqVtw20O3pfrtpFUCvKefhi0/)

## Notes
