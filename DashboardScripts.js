function GetDashboardData() {
    var ViewMode = document.getElementById("ViewMode").value;
    if(document.getElementById("FakeToday").value == ''){
        document.getElementById("FakeToday").value = isoFormatDMY(new Date());
    }
    var TodayThreshold = document.getElementById("FakeToday").value;
    fetch("https://localhost:44374/api/dashboard/" + ViewMode)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let tr = '';
            data.forEach(function (UnpackedJson) {
                accountCol1 = Object.values(UnpackedJson);
                document.getElementById("Col1Header").innerHTML = "Contracts due for extension";
                if(UnpackedJson.accountCol1 == null){
                    tr = " <tr><td rowspan =\"2\"> No sites could be retrieved!<td><tr>";
                } else{
                    UnpackedJson.accountCol1.forEach(function (Site) {
                        tr += '<tr onclick=\"GoToDetails(' + Site.siteID + ',\'' + Site.siteName + '\')\";><td>' + Site.siteID + '</td><td>' + Site.siteName + '</td></tr>';
                    });
                    document.querySelector('#Col1Table tbody').innerHTML = tr;
                }
                accountCol2 = Object.values(UnpackedJson);
                document.getElementById("Col2Header").innerHTML = "Contracts expiring soon (12 months)";
                tr = '';
                if(UnpackedJson.accountCol2 == null){
                    tr = " <tr><td rowspan =\"2\"> No sites could be retrieved!<td><tr>";
                } else{
                    UnpackedJson.accountCol2.forEach(function (Site) {
                        tr += '<tr onclick=\"GoToDetails(' + Site.siteID + ',\'' + Site.siteName + '\')\";><td>' + Site.siteID + '</td><td>' + Site.siteName + '</td></tr>';
                    });
                    document.querySelector('#Col2Table tbody').innerHTML = tr;
                }
        })
        })
        .catch(error => {
            console.log("Failed to get DashboardData");
        })
}

function GetSites(StartRow, NumberOfRows, PageCount) {
    fetch("https://localhost:44374/api/GetAllSites/" + StartRow + "," + NumberOfRows)
        .then(response => response.json())
        .then(data => {
            let tr = '';
            data.forEach(function (UnpackedJson) {
                MaxNumberOfSites = UnpackedJson.numberOfSites;
                allSites = Object.values(UnpackedJson);
                if(UnpackedJson.allSites == null){
                    tr = " <tr><td rowspan =\"5\"> No sites could be retrieved!<td><tr>";
                } else{
                    UnpackedJson.allSites.forEach(function (Site) {
                        tr += '<tr onclick=\"GoToDetails(' + Site.siteID + ',\'' + Site.siteName + '\')\";><td>' + Site.siteID + '</td><td>' + Site.siteName + '</td><td>' + Site
                            .customer.customerName + '</td><td>' + Site.contractManager.contractManagerName + '</td><td>' + Site.contractManager.department.departmentName + '</td></tr>';
                    });
                }
            });
            document.querySelector('#Overview tbody').innerHTML = tr;
            UpdateViewDetails(StartRow, NumberOfRows, MaxNumberOfSites, PageCount);
            //Append the data
        })
        .catch(error => {
            // handle the error
            console.error(error);
        });
}

function isoFormatDMY(d) {
    function pad(n) {
        return (n < 10 ? '0' : '') + n
    }
    return pad(d.getUTCFullYear()) + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
}