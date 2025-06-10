const blocks = [
    {
        google_sheet_csv_url: 'test-data.csv',
        enable_previous_button: '1',
        text: 'Introductie experiment. Klik op volgende',
    },
    {
        start_saldo: '1000',
        month: 'oktober 2024',
        header: 'simulation-start',
        text: 'Start van de simulatie. Klik op volgende',
    },
    {
        text: 'Je krijgt inkomen: {{income}}',
        javascript: function () {
            Qualtrics.SurveyEngine.addOnPageSubmit(function(type) {
                if (type === "next") {
                    window.toeslagen.applyIncomes();
                }
            });
        }
    },
    {
        text: 'Je moet je vaste lasten betalen: {{fixed_expenses}}',
        javascript: function () {
            Qualtrics.SurveyEngine.addOnPageSubmit(function(type) {
                if (type === "next") {
                    window.toeslagen.applyFixedExpenses();
                }
            });
        }
    },
    {
        text: '{{variable_expense_description}} (€ {{variable_expense_amount}}). Betaal {{variable_expense_name}}.',
        javascript: function () {
            Qualtrics.SurveyEngine.addOnPageSubmit(function(type) {
                if (type === "next") {
                    window.toeslagen.applyVariableExpense();
                }
            });
        }
    },
    {
        text: 'Dit is de laatste pagina van de simulatie. Klik op volgende',
    },
    {
        header: ' ',
        text: 'Dit is het einde.',
    },
];

export { blocks };