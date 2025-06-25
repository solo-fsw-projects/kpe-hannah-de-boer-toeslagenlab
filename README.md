# README

## Local Setup
### Linux or Windows (with docker)
- install git and checkout this repo
- install docker
- install make & git
- run `make init`

### Windows (without docker)
- install git and checkout this repo
- install nodejs and make sure it is added to the path
- run `npm install`
- run `windows-create-symlinks.bat`
- run `npm run test-env`
- open displayed url

## Lokale preview
### Linux or Windows (with docker)
- run `make test-env`
- open displayed url + /test-env/

### Windows (without docker)
- run `npm run test-env`
- open displayed url + /test-env/

## Ontwikkelen
* Gebruik Jira om nieuwe features of bugs te tracken
* Maak branch aan voor de nieuwe versie (bijv v99), en commit de ontwikkelingen daar in, pas VERSION aan
* Test handmatig wijzigingen uit met lokale preview
* Schrijf evt automatische testen voor de wijzigingen of pas bestaande aan
* Commit wijzigingen (hoe vaker hoe beter)
* Push wijzigingen naar bitbucket
* Test handmatig wijzigingen in demo project op Qualtrics
* Check of bitbucket pipelines groen licht geven (voeren de automatische tests uit)
* Wanneer klaar dan kan het jira ticket naar done

## Deploy en versies
Je "build" een nieuwe versie die in de dist map terecht komt met het versienummer uit VERSION (in dit voorbeeld v6). Vervolgens kun je het mapje van het versienummer uploaden via sftp naar mijn servertje.
Als je een nieuwe versie hebt gemaakt dan moet de html + js uit de qualtrics-header-v6.html worden gekopieerd naar de look and feel van de survey. En url van externe css worden aangepast.

* run `make build` of `npm run build`
* zie de nieuwe bestanden in de dist map onder het versie nummer. Bijv dist/v6.
* Upload/overschrijf het mapje via sftp naar vps.chrisdejager.nl in /var/apps/cdn/toeslagen/

Indien nieuwe versie (van v5 -> v6 bijvoorbeeld), of er veranderd iets anders in de header html / js:
* onder look & feel van betreffende survey(s) -> general -> header -> edit -> source button, en plak de html + js uit qualtrics-header-v6.html, dan opslaan, en dan apply
* onder look & feel van betreffende survey(s) -> style -> external css, en pas de url aan https://cdn.chrisdejager.nl/toeslagen/v6/toeslagen.css, dan apply

## Instructie voor onderzoekers
Zie https://docs.google.com/document/d/1LBQ41OCzh_k5DWEfWEhUqVtw20O3pfrtpFUCvKefhi0/
Met titel "Instructie Dienst Toeslagen Onderzoek"

## Gebruik in Qualtrics
- Plaats html uit qualtrics-header.html in de header van theme van survey (look and feel).
- Er zijn 3 dynamische blokken: Inkomen, Vast lasten, en Variabele uitgaven.
- De blokken staan in de Qualtrics library.
- Elk blok heeft een stukje javascript:
Qualtrics.SurveyEngine.addOnPageSubmit(function(type) {
	if (type === "next") {
		window.toeslagen.applyIncomes();
	}
});
Qualtrics.SurveyEngine.addOnPageSubmit(function(type) {
	if (type === "next") {
		window.toeslagen.applyFixedExpenses();
	}
});
Qualtrics.SurveyEngine.addOnPageSubmit(function(type) {
	if (type === "next") {
		window.toeslagen.applyVariableExpense();
	}
});
- Er is een optie om een aangepast bedrag toe te passen. Dit wordt gebruikt om de terugvordering te doen.
Qualtrics.SurveyEngine.addOnPageSubmit(function(type) {
	if (type === "next") {
		window.toeslagen.applyCustomExpense();
	}
});


## Notes
