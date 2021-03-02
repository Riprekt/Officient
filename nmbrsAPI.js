const soap = require('soap');
const company_url = 'https://api.nmbrs.nl/soap/v3/CompanyService.asmx?WSDL';
const employee_url = 'https://api.nmbrs.nl/soap/v3/EmployeeService.asmx?WSDL';


let options = {};

async function getEmployeeAbsence(id, username, token) {
    return new Promise(function (resolve, reject) {
        soap.createClient(employee_url, options, function (err, client) {
            client.addSoapHeader(
                {
                    'tns:AuthHeaderWithDomain': {
                        "tns:Username": username,
                        "tns:Token": token,
                    }
                }
            )
            let requestArgs = { EmployeeId: id };
            client['Absence_GetList'](requestArgs, function (err, results, envelope, soapHeader) {
                if (err) {
                    reject("Something failed in getEmployeeAbsence()");
                } else {
                    if (results.Absence_GetListResult != null) {
                        resolve(results.Absence_GetListResult.Absence);    
                    } else {
                        resolve([]);
                    }
                }
            });
        });
    });
};

async function getEmployees(id, username, token) {
    return new Promise(function (resolve, reject) {
        soap.createClient(employee_url, options, function (err, client) {
            client.addSoapHeader(
                {
                    'tns:AuthHeaderWithDomain': {
                        "tns:Username": username,
                        "tns:Token": token,
                    }
                }
            )
            let requestArgs = { CompanyId: id };
            client['List_GetByCompany'](requestArgs, function (err, results, envelope, soapHeader) {
                if (err) {
                    reject("Something failed in getEmployees()");
                } else {
                    resolve(results.List_GetByCompanyResult.Employee);
                }
            });
        });
    });
};

async function getCompanies(username, token) {
    return new Promise(function (resolve, reject) {
        soap.createClient(company_url, options, function (err, client) {
            client.addSoapHeader(
                {
                    'tns:AuthHeaderWithDomain': {
                        "tns:Username": username,
                        "tns:Token": token,
                    }
                }
            )
            let requestArgs;
            client['List_GetAll'](requestArgs, function (err, results, envelope, soapHeader) {
                if (err) {
                    reject("Something failed in getCompanies()");
                } else {
                    resolve(results.List_GetAllResult.Company);
                }
            });
        });
    });
};

async function getEmployeeLeave(id, username, token) {
    return new Promise(function (resolve, reject) {
        soap.createClient(employee_url, options, function (err, client) {
            client.addSoapHeader(
                {
                    'tns:AuthHeaderWithDomain': {
                        "tns:Username": username,
                        "tns:Token": token,
                    }
                }
            )
            let requestArgs = { EmployeeId: id, Year: '2020'};
            client['Leave_GetList'](requestArgs, function (err, results, envelope, soapHeader) {
                if (err) {
                    reject("Something failed in getEmployeeLeave()");
                } else {
                    resolve(results.Leave_GetListResult);
                }
            });
        });
    });
};

module.exports = {
    getCompanies,
    getEmployees,
    getEmployeeAbsence,
    getEmployeeLeave
}