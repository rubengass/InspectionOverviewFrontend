function GetReportElements() {
    fetch("https://localhost:44374/api/CustomReport", {
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
    JSONbody += "], \"kpi\": \"" + document.getElementById("KPI").value + "\"}"
    fetch("https://localhost:44374/api/CustomReport/" + document.getElementById("ActiveElements").rows.length, {
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
                console.log(returndata)
                var ColNum = 0;
                returndata.data.reportRowElements.forEach(function (element) {

                    th += '<th onclick="SortCustomReport(' + ColNum + ', \'string\')">' + element.name + '<i class=\"fa fa-arrows-v rightaligned\" style=\"padding-right:10px;\"></i></th>';
                    ColNum++;
                });
                th += '<th onclick="SortCustomReport(' + ColNum + ', \'int\')"> # ' + returndata.data.kpi + '<i class=\"fa fa-arrows-v rightaligned\" style=\"padding-right:10px;\"></i></th>';
                document.querySelector('#CustomReport thead').innerHTML = th;
                let tr = '';
                returndata.data.tablereference.listOfValues.forEach(function (row) {
                    tr += '<tr>';
                    for (var i = 0; i < row.value.length; i++) {
                        tr += '<td>' + row.value[i] + '</td>';
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
}

function MoveRowRight() {
    var source = document.getElementsByClassName("Selected")[0];
    var target = document.getElementById("InactiveElements");
    target.append(source);
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

var Hidden = true;

function ToggleReportElementsVisibility() {
    var items = document.getElementsByClassName("ToggleAvailability")
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
}