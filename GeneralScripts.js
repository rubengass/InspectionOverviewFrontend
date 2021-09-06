function GoToHome() {
    window.location.href = 'index.html';
}

function GoToCustomReportsCreation() {
    window.location.href = 'CustomReportsCreation.html';
}

function GoToCustomReportsOverview() {
    window.location.href = 'CustomReportsOverview.html';
}

function GoToCustomReportPreview(TableName, ReportName) {
    localStorage.setItem('TableName', TableName);
    localStorage.setItem('ReportName', ReportName);
    window.location.href = 'CustomReportPreview.html';
}

function GoToOverview() {
    window.location.href = 'SiteOverview.html';
}

function GoToLogin() {
    window.location.href = 'LoginPage.html';
}

function GoToDashboard() {
    window.location.href = 'Dashboard.html';
}

function GoToDetails(siteID, siteName) {
    localStorage.setItem('SiteID', siteID)
    localStorage.setItem('SiteName',siteName)
    window.location.href = 'SiteDetails.html';
}

function Login() {
    let dataReceived = "";
    var myJSON = "{\"username\": \"" + document.getElementById("Username").value + "\",\"password\":\""+ document.getElementById("Password").value +"\"}"
    fetch("https://localhost:44374/api/login", {
            method: "post",
            headers: {
                "accept" : "text/plain",
                "Content-Type": "application/json"
            },
            body: myJSON
        })
        .then(response => response.json())
        .then(json => {
            if(json.success){
                localStorage.setItem('AuthenticationKey', json.data);
                GoToHome();
            } else {
                document.getElementById("LoginErrorMessage").innerHTML = json.responseMessage + " ("+json.errorCodes+")";
            }
        })        
        .catch(error => {
            document.getElementById("LoginErrorMessage").innerHTML = "Failed to connect";
        });
}

function ProcessErrors(errorCodes, responseMessage) {
    if(errorCodes != null){
        var AlertMessage = responseMessage +" (" + errorCodes +")";
        alert(AlertMessage)
    }
    Logout();
}

function Logout(){
    DeleteAuthenticationKey();
    localStorage.clear();
    GoToLogin();
}

function DeleteAuthenticationKey() {
    fetch("https://localhost:44374/api/login/"+localStorage.getItem('AuthenticationKey'), {
            method: "delete",
            headers: {
                "accept" : "text/plain",
                "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(json => {
            if(json.success == false){
                ProcessErrors(json.errorCodes, json.responseMessage);
            }
        })        
        .catch(error => {
            console.log("Failed to send request");
        });
}
