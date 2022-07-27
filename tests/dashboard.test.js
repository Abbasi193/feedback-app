const axios = require('axios') 

function dashboard() { 
    return axios.get('http://localhost:3000/dashboard' 
     ) 
     
    .then(function (response) { 
        
        // handle success 
        //console.log(response); 
        
        return 'dashboard Page' 
    }) 
    .catch(function (error) { 
        
        // handle error
        console.log(error); 
        return 'Page not found' 
    }) 
} 


test("dashboard Page test", async () => { 
    await expect(dashboard()).resolves.toBe("dashboard Page"); 

});