            function calculateAge() {
                let birthdateStr = document.getElementById("birthdate").value;
                let checkdateStr = document.getElementById("checkdate").value;
    
                let birthdateParts = birthdateStr.split("-");
                let checkdateParts = checkdateStr.split("-");
    
                if (birthdateParts.length !== 3 || checkdateParts.length !== 3) {
                    document.getElementById("result").innerText = "Was toen nog niet geboren.";
                    return;
                }
    
                let birthdate = new Date(birthdateParts[2], birthdateParts[1] - 1, birthdateParts[0]);
                let checkdate = new Date(checkdateParts[2], checkdateParts[1] - 1, checkdateParts[0]);
    
                if (isNaN(birthdate.getTime()) || isNaN(checkdate.getTime()) || birthdate >= checkdate) {
                    document.getElementById("result").innerText = "Was toen nog niet geboren.";
                    return;
                }
    
                let age = checkdate.getFullYear() - birthdate.getFullYear();
                let monthDiff = checkdate.getMonth() - birthdate.getMonth();
                let dayDiff = checkdate.getDate() - birthdate.getDate();
    
                if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                    age--;
                }
    
                document.getElementById("result").innerText = `Op ${checkdateStr} was de persoon ${age} jaar oud.`;
            }