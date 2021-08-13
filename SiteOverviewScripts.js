var Hidden = true;

function ToggleSearchVisibility() {
    var items = document.getElementsByClassName("hideable")
    if (Hidden == false) {
        Hidden = true;
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = "block";
        }
    } else {
        Hidden = false;
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = "none";
        }
    }
    if (Hidden) {
        document.getElementById('icon').className = 'fa fa-angle-down open';
    } else {
        document.getElementById('icon').className = 'fa fa-angle-down';
    }
}

var PageCount = 1;
var MaxNumberOfSites = 0;
var NumberOfRows = 20;

function NumberOfRowsReset() {
    NumberOfRows = parseInt(document.getElementById("SitesInView").value);
    PageCount = 1;
    PageControl(0);
}

function PageControl(PageDirection) {
    var StartRow = (NumberOfRows * PageCount) - NumberOfRows;
    if (PageDirection == 1) {
        if ((StartRow + NumberOfRows) < MaxNumberOfSites) {
            PageCount = PageCount + PageDirection;
            var StartRow = (NumberOfRows * PageCount) - NumberOfRows;
        }
    } else if (PageCount > 1) {
        PageCount = PageCount + PageDirection;
        var StartRow = (NumberOfRows * PageCount) - NumberOfRows;
    }
    GetSites(StartRow, NumberOfRows, PageCount)
}

function GetSites(StartRow, NumberOfRows, PageCount) {
    fetch("https://localhost:44374/api/GetAllSites/" + StartRow + "," + NumberOfRows, {
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey')
            }
        })
        .then(response => response.json())
        .then(returndata => {
            if (returndata.success) {
                let tr = '';
                MaxNumberOfSites = returndata.data.numberOfSites;
                allSites = Object.values(returndata.data.allSites);
                allSites.forEach(function (Site) {
                    tr += '<tr onclick=\"GoToDetails(' + Site.siteID + ',\'' + Site.siteName + '\')\";><td>' + Site.siteID + '</td><td>' + Site.siteName + '</td><td>' + Site
                        .customer.customerName + '</td><td>' + Site.contractManager.contractManagerName + '</td><td>' + Site.contractManager.department.departmentName + '</td></tr>';
                });
                document.querySelector('#Overview tbody').innerHTML = tr;
                UpdateViewDetails(StartRow, NumberOfRows, MaxNumberOfSites, PageCount);
            } else {
                ProcessErrors(returndata.errorCodes, returndata.responseMessage);;
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function UpdateViewDetails(StartRow, NumberOfRows, MaxNumberOfSites, PageCount) {
    if ((StartRow + NumberOfRows) > MaxNumberOfSites) {
        var EndRow = MaxNumberOfSites;
    } else {
        var EndRow = StartRow + NumberOfRows;
    }
    document.getElementById("PageNumber").innerHTML = "Page: " + PageCount;
    document.getElementById("ViewDetails").innerHTML = "Currently showing sites " + (StartRow + 1) + " to " + EndRow +
        ", out of " + MaxNumberOfSites + " total";
}

function GetSearchResults() {
    document.getElementById("SitesInView").disabled = true;
    document.getElementById("PageLeftArrow").disabled = true;
    document.getElementById("PageRightArrow").disabled = true;
    var FilterCount = 0;
    var PreviousFilters = 0;
    var APIString = null;
    if (document.getElementById("SiteIDSearch").value != "") {
        APIString = "SiteIDSearch=" + document.getElementById("SiteIDSearch").value
        PreviousFilters = 1;
        FilterCount++;
    }
    if (document.getElementById("SiteNameSearch").value != "") {
        if (PreviousFilters == 0) {
            APIString = "SiteNameSearch=" + document.getElementById("SiteNameSearch").value
            PreviousFilters = 1;
        } else {
            APIString = APIString + "&SiteNameSearch=" + document.getElementById("SiteNameSearch").value
        }
        FilterCount++;
    }
    if (document.getElementById("CustomerNameSearch").value != "") {
        if (PreviousFilters == 0) {
            APIString = "CustomerNameSearch=" + document.getElementById("CustomerNameSearch").value
            PreviousFilters = 1;
        } else {
            APIString = APIString + "&CustomerNameSearch=" + document.getElementById("CustomerNameSearch").value
        }
        FilterCount++;
    }
    if (document.getElementById("ContractManagerNameSearch").value != "") {
        if (PreviousFilters == 0) {
            APIString = "ContractManagerNameSearch=" + document.getElementById("ContractManagerNameSearch").value
            PreviousFilters = 1;
        } else {
            APIString = APIString + "&ContractManagerNameSearch=" + document.getElementById("ContractManagerNameSearch").value
        }
        FilterCount++;
    }
    if (document.getElementById("DepartmentNameSearch").value != "") {
        if (PreviousFilters == 0) {
            APIString = "DepartmentNameSearch=" + document.getElementById("DepartmentNameSearch").value
            PreviousFilters = 1;
        } else {
            APIString = APIString + "&DepartmentNameSearch=" + document.getElementById("DepartmentNameSearch").value
        }
        FilterCount++;
    }
    if (FilterCount == 0) {
        ResetOverview();
        return;
    }
    APIString = FilterCount + "?" + APIString;
    fetch("https://localhost:44374/api/GetAllSites/" + APIString, {
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey')
            }
        })
        .then(response => response.json())
        .then(returndata => {
            if (returndata.success) {
                let tr = '';
                    MaxNumberOfSites = returndata.data.numberOfSites;
                    allSites = returndata.data.allSites;
                    if (MaxNumberOfSites == 0) {
                        tr = " <tr><td colspan =\"4\"> No sites match the search filter<td><tr>";
                    } else {
                        allSites.forEach(function (Site) {
                            tr += '<tr onclick=\"GoToDetails(' + Site.siteID + ',\'' + Site.siteName + '\')\";><td>' + Site.siteID + '</td><td>' + Site.siteName + '</td><td>' + Site
                                .customer.customerName + '</td><td>' + Site.contractManager.contractManagerName + '</td><td>' + Site.contractManager.department.departmentName + '</td></tr>';
                        });
                    }
                document.querySelector('#Overview tbody').innerHTML = tr;
                UpdateViewDetails(0, MaxNumberOfSites, MaxNumberOfSites, 1);
            } else {
                ProcessErrors(returndata.errorCodes, returndata.responseMessage);;
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function ResetOverview() {
    document.getElementById("SitesInView").disabled = false;
    document.getElementById("PageLeftArrow").disabled = false;
    document.getElementById("PageRightArrow").disabled = false;
    document.getElementById("SiteNameSearch").value = null;
    document.getElementById("SiteIDSearch").value = null;
    document.getElementById("CustomerNameSearch").value = null;
    document.getElementById("ContractManagerNameSearch").value = null;
    document.getElementById("DepartmentNameSearch").value = null;
    PageControl(0);
}