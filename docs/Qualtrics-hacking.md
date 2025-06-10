# Qualtrics Hacking

## How Qualtrics runs a survey

I've reverse engineered a little bit of how Qualtrics runs a survey.

Relevant steps that happen:
* Single page application: Qualtrics loads a survey as a single page application. In preview mode it loads the survey in two iframes, one for desktop and one for mobile.
* "Page load": every time a "next" or "previous" button is clicked, qualtrics loads all the custom additions. That means the header html from the survey "look and feel" configuration, question html and all question javascript is reloaded and run again. For the rest of this text I will refer to this event as "page loading".
* Embedded data variables: These variables are replaced by their defined values from embedded data blocks on every page load.
* Next/previous transition animation: Transition animations are run on every page load. You should run javascript changes to the DOM only after the transition animation has finished.
* addOnReady: This can be done by registering a callback with the Qualtrics.SurveyEngine.addOnReady function. The addOnReady callback is called when the page is ready.
* addOnPageSubmit: This can be done by registering a callback with the Qualtrics.SurveyEngine.addOnPageSubmit function. The addOnPageSubmit callback is called when the user clicks a "next" or "previous" button.
* Callback resets: Registered addOnReady and addOnPageSubmit callbacks etc are reset every time a new page is loaded.

## How toeslagen script hacks into Qualtrics

* Header: The progress bar and balance span over multiple blocks and are therefore part of the "look and feel" header html.
* External main script: To minimize the number of changes needed through the Qualtrics interface it is an external script which is hosted on cdn.chrisdejager.nl.
* The header html is reloaded on every "page load" so the script in the header html checks if the external script was already loaded.
* It runs the init function to register the addOnReady and addOnPageSubmit callbacks.
* The addOnReady callback runs "runOnNewSlide" to run the main toeslagen function on every "page load" after the transition animation has finished.
* The addOnPageSubmit callback will track previous button clicks. 
* The progress bar (and balance) is hidden by default. It is shown only when the embedded data variable "header" is set to "simulation-start".

Rest of the workings are explained in the README.md in the root and the "Instructie Dienst Toeslagen Onderzoek" document.
