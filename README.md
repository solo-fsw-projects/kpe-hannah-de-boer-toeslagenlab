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
* run `make build` of `npm run build`
* zie de bestanden in de dist map

De css en js wordt gedeployed naar een subdir op mijn mijn website bij transip mbv ssh ftp (bijvoorbeeld met FileZilla). Map toeslagen.

Versies gaan met een submap daar in. Zie de VERSION bestand in de root.

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
