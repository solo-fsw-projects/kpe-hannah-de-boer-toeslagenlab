# README

## Setup

..

## Deploy en versies
De css en js wordt gedeployed naar een subdir op mijn mijn website bij transip mbv filezilla. Map toeslagen.

Versies gaan met een submap daar in. Ondertussen zitten we op v2. Dat is om tussen onderzoeken geen problemen te krijgen.

Om dit lokaal ook expliciet te maken heb ik een build map gemaakt. Dus build/v2/ en daarbinnen een softlink naar toeslagen.js.

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


## Notes
