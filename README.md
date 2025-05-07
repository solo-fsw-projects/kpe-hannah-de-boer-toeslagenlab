# README
bla
## Local Setup
- install docker
- install make
- run `make init`
- run `make console`
- run `make test`

bla2
## Deploy en versies
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
