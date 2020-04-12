function saveFile() 
        {
         
          
            // Get the data from each element on the form.
            var name = document.getElementById('txtname');
            var mail = document.getElementById('txtmail');
           var number = document.getElementById('txtnum');
            var password = document.getElementById('txtpass');
            

          var nameSize=name.value.length;
          var mailSize=mail.value.length;
          var numberSize=number.value.length;
          var passwordSize=password.value.length;
          
            
            
              if(nameSize>0 && mailSize>0 && numberSize>0 && passwordSize>=8 )
              {
                  // This variable stores all the data.
            let data = 'The Registeration Details of '+ name.value.toUpperCase() + ' are :' + '\r\n '+
                '\r Name: ' + name.value + ' \r\n ' + 
                'Email: ' + mail.value + ' \r\n ' + 
                'Number: ' + number.value + ' \r\n ' + 
                'Password: ' + password.value + '\r\n '+
                'Mystery Number: ' + mysteryNumber.value;
            
            // Convert the text to BLOB.
            const textToBLOB = new Blob([data], { type: 'text/plain' });
            const sFileName = 'BailaUserLoginInfo.txt';	   // The file to save the data.
    
            let newLink = document.createElement("a");
            newLink.download = sFileName;
    
            if (window.webkitURL != null) {
                newLink.href = window.webkitURL.createObjectURL(textToBLOB);
            }
            else {
                newLink.href = window.URL.createObjectURL(textToBLOB);
                newLink.style.display = "none";
                document.body.appendChild(newLink);
            }
    
            newLink.click(); 

            console.log("If executed");
            
          }
          else
          {
             console.log("If never executed");
              saveFile();
          }
        }
          
     