function GetReportElements() {
    fetch("https://localhost:44374/api/CustomReportEditor", {
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey')
            }
        })
        .then(response => response.json())
        .then(returndata => {
            if (returndata.success) {
                let tr = '';
                returndata.data.reportRowElements.forEach(function (element) {
                    tr += '<tr onclick=\"SelectRow(' + element.id + ')\" id="' + element.id + '";><td>' + element.name + '</td></tr>';
                });
                document.querySelector('#InactiveElements tbody').innerHTML = tr;
                select = document.getElementById('KPI');
                returndata.data.kpiOptions.forEach(function (option) {
                    ins = document.createElement('option');
                    ins.value = option;
                    ins.innerHTML = option;
                    select.appendChild(ins);
                });
            } else {
                ProcessErrors(returndata.errorCodes, returndata.responseMessage);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function RunReport() {
    JSONbody = "{ \"reportRowElements\":["
    for (var i = 0, row; row = document.getElementById("ActiveElements").rows[i]; i++) {
        JSONbody += '{\"id\":\"' + row.id + '\",\"name\":\"' + row.cells[0].innerHTML + '\"}'
        if (i < (document.getElementById("ActiveElements").rows.length - 1)) {
            JSONbody += ','
        }
    }
    JSONbody += "]}"
    fetch("https://localhost:44374/api/CustomReportEditor/" + document.getElementById("KPI").value, {
            method: "put",
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey'),
                "Content-Type": "application/json"
            },
            body: JSONbody
        })
        .then(response => response.json())
        .then(returndata => {
            if (returndata.success) {
                let th = '';
                var ColNum = 0;
                returndata.data.reportRowElements.forEach(function (element) {

                    th += '<th onclick="SortCustomReport(' + ColNum + ', \'string\')">' + element.name + '<i class=\"fa fa-arrows-v rightaligned\" style=\"padding-right:10px;\"></i></th>';
                    ColNum++;
                });
                document.querySelector('#CustomReport thead').innerHTML = th;
                let tr = '';
                returndata.data.tablereference.rows.forEach(function (row) {
                    tr += '<tr>';
                    for (var i = 0; i < row.row.length; i++) {
                        tr += '<td>' + row.row[i] + '</td>';
                    };
                    tr += '</tr>';
                });
                document.querySelector('#CustomReport tbody').innerHTML = tr;
            } else {
                ProcessErrors(returndata.errorCodes, returndata.responseMessage);;
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function SortCustomReport(ColNum, Coltype) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("CustomReport");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[ColNum];
            y = rows[i + 1].getElementsByTagName("TD")[ColNum];
            if (Coltype == "string") {
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            } else {
                if (dir == "asc") {
                    if (Number(x.innerHTML) > Number(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (Number(x.innerHTML) < Number(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function SelectRow(RowId) {
    var items = document.getElementsByClassName("Selected");
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('Selected');
    }
    document.getElementsByClassName("Selected");
    document.getElementById(RowId).classList.add('Selected');
}

function MoveRowLeft() {
    var source = document.getElementsByClassName("Selected")[0];
    var target = document.getElementById("ActiveElements").firstElementChild;
    target.append(source);
    AddFilterElement(source.id);
}

function MoveRowRight() {
    var source = document.getElementsByClassName("Selected")[0];
    var target = document.getElementById("InactiveElements");
    target.append(source);
    RemoveFilterElement();
}

function AddFilterElement(FieldId){
    fetch("https://localhost:44374/api/CustomReportFilter/" + FieldId, {
        headers: {
            "Authorization": localStorage.getItem('AuthenticationKey')
        }
    })
    .then(response => response.json())
    .then(returndata => {
        if (returndata.success) {
            if(returndata.data.fieldDataType =="Text"){
                let tr1 = '';
                let tr2 = '<tr>';
                tr1 = '<tr>'+returndata.data.fieldName+'<i class="fa fa-angle-down rightaligned" onclick=\"OpenCloseFilter(\''+returndata.data.internalFieldName+'\')\"></i></tr>';
                returndata.data.filterOptions.forEach(function(element){
                    tr2 += '<input type="checkbox" id="'+ returndata.data.fieldID +'" value="'+ element +'" name="'+ element +'" checked><label for="'+ returndata.data.fieldID +'">' + element + '</label><br>';
                })
                tr2 += '</tr>'
                var row1 = document.getElementById("FilterTableBody").insertRow(0);
                var row2 = document.getElementById("FilterTableBody").insertRow(0);
                row1.innerHTML = tr2;
                row1.setAttribute("id",returndata.data.internalFieldName);
                row2.innerHTML = tr1;
                row2.style.fontweight = "bold";
                row1.style.display ="none";
            } else if(returndata.data.fieldDataType == "Number") {
                let tr1 = '<tr>'+returndata.data.fieldName+'<i class="fa fa-angle-down rightaligned" onclick=\"OpenCloseFilter(\''+returndata.data.internalFieldName+'\')\"></i></tr>';
                let tr2 = '<tr><input type="Number" value='+returndata.data.filterOptions[0] +' min='+returndata.data.filterOptions[0] +'><input type="checkbox" id="'+ returndata.data.fieldID + "Min" + '"><label for="'+ returndata.data.fieldID + "Min" +'">Ignore min value </label><input type="Number" value='+returndata.data.filterOptions[1] +' max='+returndata.data.filterOptions[1] +'><input type="checkbox" id="'+ returndata.data.fieldID + "Max" + '"><label for="'+ returndata.data.fieldID + "Min" +'">Ignore max value </label></tr>';
                var row1 = document.getElementById("FilterTableBody").insertRow(0);
                var row2 = document.getElementById("FilterTableBody").insertRow(0);
                row1.innerHTML = tr2;
                row1.setAttribute("id",returndata.data.internalFieldName);
                row2.innerHTML = tr1;
                row2.style.fontweight = "bold";
                row1.style.display ="none";
            } else if(returndata.data.fieldDataType == "DateTime"){
                let tr1 = '<tr>'+returndata.data.fieldName+'<i class="fa fa-angle-down rightaligned" onclick=\"OpenCloseFilter(\''+returndata.data.internalFieldName+'\')\"></i></tr>';
                let tr2 = '<tr><input type="datetime-local" value='+returndata.data.filterOptions[0] +'><input type="checkbox" id="'+ returndata.data.fieldID + "Min" + '"><label for="'+ returndata.data.fieldID + "Min" +'">Ignore min value </label><input type="datetime-local" value='+returndata.data.filterOptions[1] +'><input type="checkbox" id="'+ returndata.data.fieldID + "Max" + '"><label for="'+ returndata.data.fieldID + "Min" +'">Ignore max value </label></tr>';
                var row1 = document.getElementById("FilterTableBody").insertRow(0);
                var row2 = document.getElementById("FilterTableBody").insertRow(0);
                row1.innerHTML = tr2;
                row1.setAttribute("id",returndata.data.internalFieldName);
                row2.innerHTML = tr1;
                row2.style.fontweight = "bold";
                row1.style.display ="none";
            } else if(returndata.data.fieldDataType == "Boolean"){
                let tr1 = '<tr>'+returndata.data.fieldName+'<i class="fa fa-angle-down rightaligned" onclick=\"OpenCloseFilter(\''+returndata.data.internalFieldName+'\')\"></i></tr>';
                let tr2 = '<tr><input type="checkbox" id="'+ returndata.data.fieldID + "Min" + '" checked><label for="'+ returndata.data.fieldID + "Min" +'">True</label><br><input type="checkbox" id="'+ returndata.data.fieldID + "Max" + '" checked><label for="'+ returndata.data.fieldID + "Min" +'">False</label></tr>';
                var row1 = document.getElementById("FilterTableBody").insertRow(0);
                var row2 = document.getElementById("FilterTableBody").insertRow(0);
                row1.innerHTML = tr2;
                row1.setAttribute("id",returndata.data.internalFieldName);
                row2.innerHTML = tr1;
                row2.style.fontweight = "bold";
                row1.style.display ="none";
            }
        } else {
            ProcessErrors(returndata.errorCodes, returndata.responseMessage);
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function MoveRowUp() {
    var table = document.getElementsByClassName("Selected")[0].parentElement.parentElement;
    var row = document.getElementsByClassName("Selected")[0];
    var rowIndex = document.getElementsByClassName("Selected")[0].rowIndex;
    var tablebody = table.firstElementChild;
    if (rowIndex > 0) {
        tablebody.insertBefore(row, tablebody.childNodes[rowIndex - 1])
    }
    // if rowindex is last index
}

function MoveRowDown() {
    var table = document.getElementsByClassName("Selected")[0].parentElement.parentElement;
    var row = document.getElementsByClassName("Selected")[0];
    var rowIndex = document.getElementsByClassName("Selected")[0].rowIndex;
    var tablebody = table.firstElementChild;
    tablebody.insertBefore(row, tablebody.childNodes[rowIndex].nextSibling.nextSibling)
}

var HiddenElements = true;
var HiddenManagement = true;
var HiddenFilters = true;

function ToggleReportElementsVisibility() {
    var items = document.getElementsByClassName("ToggleAvailabilityElements")
    if (HiddenElements == false) {
        if (HiddenManagement) {
            ToggleReportManagementVisibility();
        }
        if (HiddenFilters) {
            ToggleFiltersVisibility();
        }
        HiddenElements = true;
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = "block";
        }
    } else {
        HiddenElements = false;
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = "none";
        }
    }
}

function ToggleReportManagementVisibility() {
    var items = document.getElementsByClassName("ToggleAvailabilityManagement")
    if (HiddenManagement == false) {
        if (HiddenElements) {
            ToggleReportElementsVisibility();
        }
        if (HiddenFilters) {
            ToggleFiltersVisibility();
        }
        HiddenManagement = true;
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = "block";
        }
    } else {
        HiddenManagement = false;
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = "none";
        }
    }
}

function ToggleFiltersVisibility() {
    var items = document.getElementsByClassName("ToggleAvailabilityFilters")
    if (HiddenFilters == false) {
        if (HiddenManagement) {
            ToggleReportManagementVisibility();
        }
        if (HiddenElements) {
            ToggleReportElementsVisibility();
        }
        HiddenFilters = true;
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = "block";
        }
    } else {
        HiddenFilters = false;
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = "none";
        }
    }
}

function SubmitNewReport() {
    JSONbody = "{ \"reportRowElements\":["
    for (var i = 0, row; row = document.getElementById("ActiveElements").rows[i]; i++) {
        JSONbody += '{\"id\":\"' + row.id + '\",\"name\":\"' + row.cells[0].innerHTML + '\"}'
        if (i < (document.getElementById("ActiveElements").rows.length - 1)) {
            JSONbody += ','
        }
    }
    JSONbody += "]}"

    fetch("https://localhost:44374/api/CustomReportEditor/" + document.getElementById("KPI").value + "?ReportType=" + document.getElementById("ReportType").value + "&ReportName=" + document.getElementById("ReportName").value, {
            method: "post",
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey'),
                "Content-Type": "application/json"
            },
            body: JSONbody
        })
        .then(response => response.json())
        .then(returndata => {
            if (returndata.success) {
                GoToCustomReportsOverview();
            } else {
                ProcessErrors(returndata.errorCodes, returndata.responseMessage);;
            }
        })
}

function GetAllReports() {
    fetch("https://localhost:44374/api/CustomReport/", {
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey')
            }
        })
        .then(response => response.json())
        .then(returndata => {
            if (returndata.success) {
                let tr = '';
                allReports = Object.values(returndata.data);
                allReports.forEach(function (Report) {
                    if(Report.nextUpdate == null){
                        NextUpdate = "n/a";
                    } else {
                        NextUpdate = Report.nextUpdate;
                    }
                    tr += '<tr><td><button class="btn" onclick="DeleteReport(\''+Report.tableName+'\')"><i class="fa fa-trash"></i> Delete</button><button class="btn" onclick="CopyLink(\''+Report.tableName+'\')"><i class="fa fa-link"></i> API link</button><button class="btn" onclick="GoToCustomReportPreview(\''+Report.tableName+'\', \''+Report.reportName+'\')"><i class="fa fa-folder-open"></i> Preview</button></td><td>' + Report.reportName + '</td><td>' + Report.tableSize + '</td><td>' + Report.lastAccessed + '</td><td>' + Report.lastUpdated + '</td><td>' + Report.reportType + '</td><td>' + NextUpdate + '</td></tr>';
                });
                document.querySelector('#CustomReports tbody').innerHTML = tr;
            } else {
                ProcessErrors(returndata.errorCodes, returndata.responseMessage);;
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function DeleteReport(TableName){
    fetch("https://localhost:44374/api/CustomReport/"+TableName, {
        method: "delete",
        headers: {
            "accept" : "text/plain",
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('AuthenticationKey')
        },
    })
    .then(response => response.json())
    .then(json => {
        if(json.success == false){
            ProcessErrors(json.errorCodes, json.responseMessage);
        }
        GetAllReports();
    })        
    .catch(error => {
        console.log("Failed to send request");
    });
}

function CopyLink(TableName) {
    var copyText = "https://localhost:44374/api/CustomReport/" + TableName;
    navigator.clipboard.writeText(copyText);
    alert("Copied the text: " + copyText);
  }

function LoadReportPreview(){
    document.getElementById("PreviewHeader").innerHTML = "Custom Report - " + localStorage.getItem('ReportName');
    fetch("https://localhost:44374/api/CustomReport/" + localStorage.getItem('TableName'), {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(response => response.json())
    .then(returndata => {
        if (returndata.success) {
            let th = '';
            var ColNum = 0;
            for (var i =0; i<1;i++){
                for(var y = 0; y< returndata.data.rows[0].row.length; y++){
                    th += '<th>' + returndata.data.rows[i].row[y] + '</th>';
                    ColNum++;
                }
            }
            document.querySelector('#CustomReportPreview thead').innerHTML = th;
            let tr = '';
            for (var i=1; i< returndata.data.rows.length; i++)
            {
                tr += '<tr>';
                for (var y = 0; y < returndata.data.rows[0].row.length; y++) {
                    tr += '<td>' + returndata.data.rows[i].row[y] + '</td>';
                };
                tr += '</tr>';
            }
            document.querySelector('#CustomReportPreview tbody').innerHTML = tr;
        } else {
            ProcessErrors(returndata.errorCodes, returndata.responseMessage);;
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function OpenCloseFilter(fieldID){
    var FilterStatus = document.getElementById(fieldID).style.display
    if(FilterStatus == "block"){
        document.getElementById(fieldID).style.display = "none";
    } else {
        document.getElementById(fieldID).style.display = "block";
    }
}