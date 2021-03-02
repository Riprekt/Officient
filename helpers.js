const fs = require('fs');
const moment = require('moment');
const nmbrsAPI = require('./nmbrsAPI');

//regex for email - shamelessly stolen from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//regex for token based on supplied token: lowercase a-z and numbers from 0-9, total of 32 characters
const tokenRegex = /([a-z0-9]){32}/gm;

async function writeAllAbsences(username, token, source, group) {
    const companies = await nmbrsAPI.getCompanies(username, token);
    const employees = (await Promise.all(companies.map(company => nmbrsAPI.getEmployees(company.ID, username, token)))).flat();
    for (let i = 0; i < employees.length; i++) {
        var absences = await nmbrsAPI.getEmployeeAbsence(employees[i].Id, username, token);
        var json =
        {
            group_id: group,
            source_app: source,
            source_app_internal_id: employees[i].Id,
            historical_days_off: absences.map(absence => ({
                date: moment(absence.Start).format('YYYY-MM-DD'),
                data: {
                    duration_minutes: moment(absence.End).diff(absence.Start, 'minutes'),
                    day_off_name: absence.Dossier,
                    internal_code: absence.AbsenceId,
                    type_work: 0,
                    type_company_holiday: 0,
                    type_holiday: 1,
                }
            }))
        };

        fs.writeFile(`daysOff/${employees[i].Id}.json`, JSON.stringify(json, null, 2), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`File written for ${employees[i].DisplayName}`);
            }
        });
        
    }

};

function normalizeMessage(message) {
    let messageArray = (message.replace(/'/g,'').replace(/\n/g,'').replace(/{/g,'').replace(/}/g,'').replace(/ /g,'').split(',')).filter(function(element) {
        return element != '';
    });

    let normalizedMessage = [];
    messageArray.forEach(line => {
        let lineArray = line.split('=>');
        normalizedMessage[lineArray[0]] = lineArray[1];
    });
    return normalizedMessage;
}

function validateMessage(source, username, token, group, controller) {
    if (source ==  'nmbrs' && emailRegex.test(username) && tokenRegex.test(token) && group == '1234' && controller == 'importDaysoff') {
        return true;
    } else {
        return false;
    }
     
}

module.exports = {
    writeAllAbsences,
    normalizeMessage,
    validateMessage
}