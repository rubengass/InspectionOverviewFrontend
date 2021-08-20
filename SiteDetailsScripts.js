function GetSiteID() {
    var siteID = localStorage.getItem('SiteID');
    var siteName = localStorage.getItem('SiteName');
    document.getElementById("SiteID").value = siteID;
    document.getElementById("PageHeader").innerHTML = siteName;
    document.getElementById("SiteName").value = siteName;

}
var HiddenSite = false;
var HiddenInternal = false;

function EnableEditingSiteDetails() {
    var items = document.getElementsByClassName("SiteDetails")
    if (HiddenSite == false) {
        GetSiteDetails();
        document.getElementById("siteNameError").style.display = "none";
        document.getElementById("ContractActiveFromError").style.display = "none";
        document.getElementById("ContractActiveTillError").style.display = "none";
        document.getElementById("SiteCountryError").style.display = "none";
        document.getElementById("SiteCityError").style.display = "none";
        document.getElementById("SiteLine1Error").style.display = "none";
        document.getElementById("SiteLine2Error").style.display = "none";
        document.getElementById("SiteContactError").style.display = "none";
        document.getElementById("SiteContactEmailError").style.display = "none";
        document.getElementById("SaveButtonSiteDetails").style.display = "none";
        document.getElementById("EditButtonSiteDetailsIcon").classList.add('fa-edit');
        document.getElementById("EditButtonSiteDetailsIcon").classList.remove('fa-window-close');
        document.getElementById("EditButtonSiteDetailsText").innerText = "Edit";
        HiddenSite = true;
        for (var i = 0; i < items.length; i++) {
            items[i].disabled = true;
        }
    } else {
        document.getElementById("SaveButtonSiteDetails").style.display = "block";
        document.getElementById("EditButtonSiteDetailsIcon").classList.remove('fa-edit');
        document.getElementById("EditButtonSiteDetailsIcon").classList.add('fa-window-close');
        document.getElementById("EditButtonSiteDetailsText").innerText = "Discard Changes";
        HiddenSite = false;
        for (var i = 0; i < items.length; i++) {
            items[i].disabled = false;
        }
    }
}

function EnableEditingInternalDetails() {
    var items = document.getElementsByClassName("InternalDetails")
    if (HiddenInternal == false) {
        GetSiteDetails();
        document.getElementById("SaveButtonInternalDetails").style.display = "none";
        document.getElementById("EditButtonInternalDetailsIcon").classList.add('fa-edit');
        document.getElementById("EditButtonInternalDetailsIcon").classList.remove('fa-window-close');
        document.getElementById("EditButtonInternalDetailsText").innerText = "Edit";
        HiddenInternal = true;
        for (var i = 0; i < items.length; i++) {
            items[i].disabled = true;
        }
        document.getElementById("ContractManagerEmail").style.display = "block";
        document.getElementById("ContractManagerID").style.display = "block";
        document.getElementById("DepartmentID").style.display = "block";
        document.getElementById("Department").style.display = "block";
    } else {
        document.getElementById("SaveButtonInternalDetails").style.display = "block";
        document.getElementById("EditButtonInternalDetailsIcon").classList.remove('fa-edit');
        document.getElementById("EditButtonInternalDetailsIcon").classList.add('fa-window-close');
        document.getElementById("EditButtonInternalDetailsText").innerText = "Discard Changes";
        HiddenInternal = false;
        for (var i = 0; i < items.length; i++) {
            items[i].disabled = false;
        }
        document.getElementById("ContractManagerEmail").style.display = "none";
        document.getElementById("ContractManagerID").style.display = "none";
        document.getElementById("DepartmentID").style.display = "none";
        document.getElementById("Department").style.display = "none";
    }
}

function SaveChangesSiteDetails() {
    ValidateFieldInput();
    if (Validated) {
        document.getElementById("siteNameError").style.display = "none";
        document.getElementById("ContractActiveFromError").style.display = "none";
        document.getElementById("ContractActiveTillError").style.display = "none";
        document.getElementById("SiteCountryError").style.display = "none";
        document.getElementById("SiteCityError").style.display = "none";
        document.getElementById("SiteLine1Error").style.display = "none";
        document.getElementById("SiteLine2Error").style.display = "none";
        document.getElementById("SiteContactError").style.display = "none";
        document.getElementById("SiteContactEmailError").style.display = "none";
        let dataReceived = "";
        var myJSON = "{\"siteName\": \"" + document.getElementById("SiteName").value + "\",\"siteContractStart\": \"" + document.getElementById("ContractActiveFrom").value + "\",\"siteContractEnd\": \"" + document.getElementById("ContractActiveTill").value + "\",\"siteAddressCountry\": \"" + document.getElementById("SiteCountry").value + "\",\"siteAddressCity\": \"" + document.getElementById("SiteCity").value + "\",\"siteAddressPostal\": \"" + document.getElementById("SiteLine1").value + "\",\"siteAddressStreet\": \"" + document.getElementById("SiteLine2").value + "\",\"siteContactName\": \"" + document.getElementById("SiteContact").value + "\",\"siteContactEmail\": \"" + document.getElementById("SiteContactEmail").value + "\"}"
        console.log(myJSON);
        fetch("https://localhost:44374/api/SiteData/" + document.getElementById("SiteID").value, {
                method: "put",
                headers: {
                    "Content-Type": "application/json"
                },
                body: myJSON
            })
            .then(response => {
                GetSiteDetails();
                EnableEditingSiteDetails();
            });
    } else {
        //alert("Failed to update site details due to incorrect input. Please check the highlighted input fields.")
    }
}

function ValidateFieldInput() {
    Validated = true;
    siteName = document.getElementById("SiteName").value;
    if (typeof siteName != 'string' || siteName.length < 4) {
        document.getElementById("siteNameError").style.display = "block";
        Validated = false;
    }
    ActiveDate = new Date(document.getElementById("SiteActiveSince").value);
    StartDate = new Date(document.getElementById("ContractActiveFrom").value);
    if (typeof StartDate != 'object' || StartDate < ActiveDate) {
        document.getElementById("ContractActiveFromError").style.display = "block";
        Validated = false;
    }
    EndDate = new Date(document.getElementById("ContractActiveTill").value);
    var DifferenceInTime = EndDate.getTime() - StartDate.getTime();
    var DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24)
    if (typeof EndDate != 'object' || DifferenceInDays < 365) {
        document.getElementById("ContractActiveTillError").style.display = "block";
        Validated = false;
    }
    Country = document.getElementById("SiteCountry").value;
    if (typeof Country != 'string' || Country.length < 4) {
        document.getElementById("SiteCountryError").style.display = "block";
        Validated = false;
    }
    City = document.getElementById("SiteCity").value;
    if (typeof City != 'string' || City.length < 4) {
        document.getElementById("SiteCityError").style.display = "block";
        Validated = false;
    }
    PostalCode = document.getElementById("SiteLine1").value;
    if (typeof PostalCode != 'string' || /(^[0-9]{4})(\s{1})([A-Z]{2})$/.test(PostalCode) == false) {
        document.getElementById("SiteLine1Error").style.display = "block";
        Validated = false;
    }
    StreetName = document.getElementById("SiteLine2").value;
    if (typeof StreetName != 'string' || /((?:[A-z]{4})(.{0,})([0-9]{1,}))|((?:[0-9]{1,})(.{0,})([A-z]{4,}))/.test(StreetName) == false) {
        document.getElementById("SiteLine2Error").style.display = "block";
        Validated = false;
    }
    ContactName = document.getElementById("SiteContact").value;
    if (typeof PostalCode != 'string' || ContactName.length < 4) {
        document.getElementById("SiteContactError").style.display = "block";
        Validated = false;
    }
    ContactEmail = document.getElementById("SiteContactEmail").value;
    if (typeof StreetName != 'string' || /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(ContactEmail) == false) {
        document.getElementById("SiteContactEmailError").style.display = "block";
        Validated = false;
    }
    return Validated;
}

function GetSiteDetails() {
    fetch("https://localhost:44374/api/SiteData/" + document.getElementById("SiteID").value, {
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey')
            }
        })
        .then(response => response.json())
        .then(returndata => {
            if (returndata.success) {
                document.getElementById("SiteName").value = returndata.data.siteName;
                document.getElementById("PageHeader").innerHTML = returndata.data.siteName;
                document.getElementById("SiteActiveSince").value = isoFormatDMY(new Date(returndata.data.siteActiveSince));
                document.getElementById("ContractActiveFrom").value = isoFormatDMY(new Date(returndata.data.siteContractStart));
                document.getElementById("ContractActiveTill").value = isoFormatDMY(new Date(returndata.data.siteContractEnd));
                document.getElementById("SiteCity").value = returndata.data.siteAddressCity;
                document.getElementById("SiteCountry").value = returndata.data.siteAddressCountry;
                document.getElementById("SiteLine1").value = returndata.data.siteAddressPostal;
                document.getElementById("SiteLine2").value = returndata.data.siteAddressStreet;
                document.getElementById("SiteContact").value = returndata.data.siteContactName;
                document.getElementById("SiteContactEmail").value = returndata.data.siteContactEmail;
                document.getElementById("ContractManagerName").value = returndata.data.contractManager.contractManagerName;
                document.getElementById("ContractManagerEmail").value = returndata.data.contractManager.contractManagerEmail;
                document.getElementById("ContractManagerID").value = returndata.data.contractManager.contractManagerID;
                document.getElementById("DepartmentID").value = returndata.data.contractManager.department.departmentID;
                document.getElementById("Department").value = returndata.data.contractManager.department.departmentName;
                document.getElementById("CustomerName").value = returndata.data.customer.customerName;
                document.getElementById("CustomerID").value = returndata.data.customer.customerID;
                document.getElementById("CustomerContact").value = returndata.data.customer.customerContactName;
                document.getElementById("CustomerContactEmail").value = returndata.data.customer.customerContactEmail;
                document.getElementById("CustomerAddressCountry").value = returndata.data.customer.customerAddressCountry;
                document.getElementById("CustomerAddressCity").value = returndata.data.customer.customerAddressCity;
                document.getElementById("CustomerAddressLine1").value = returndata.data.customer.customerAddressPostal;
                document.getElementById("CustomerAddressLine2").value = returndata.data.customer.customerAddressStreet;
            } else {
                ProcessErrors(returndata.errorCodes, returndata.responseMessage);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function isoFormatDMY(d) {
    function pad(n) {
        return (n < 10 ? '0' : '') + n
    }
    return pad(d.getUTCFullYear()) + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate() + 1);
}

function FetchDropdownData() {
    fetch("https://localhost:44374/api/FormData", {
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey')
            }
        })
        .then(response => response.json())
        .then(returndata => {
            let option = '';
            select = document.getElementById('ContractManagerName');
            returndata.data.departments.forEach(function (Department) {
                OptGroup = document.createElement('optgroup');
                OptGroup.label = Department.departmentName;
                Department.contractManagers.forEach(function (ContractManager) {
                    ins = document.createElement('option');
                    ins.value = ContractManager.contractManagerName;
                    ins.innerHTML = ContractManager.contractManagerName;
                    OptGroup.appendChild(ins);
                });
                select.appendChild(OptGroup);
            });
            GetSiteDetails();
        })
        .catch(error => {
            console.error(error);
        });
}

function SaveChangesInternalDetails() {
    let dataReceived = "";
    var myJSON = "{\"contractManager\": {\"contractManagerName\": \"" + document.getElementById("ContractManagerName").value + "\"}}"
    fetch("https://localhost:44374/api/SiteData/" + document.getElementById("SiteID").value, {
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            body: myJSON
        })
        .then(response => {
            GetSiteDetails();
            EnableEditingInternalDetails();
        });
}