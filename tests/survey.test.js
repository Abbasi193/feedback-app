const axios = require('axios') 

function survey() { 
    return axios.get('http://localhost:3000/survey' 
    ) 
    
    .then(function (response) { 
        // handle success
        //console.log(response); 
        
        return 'Survey Page' 
    }) 
    
    .catch(function (error) { 
        
        // handle error 
        console.log(error); 
        
        return 'Page not found' 
    }) 
} 

test("Survey Page test", async() => { 
    await expect(survey()).resolves.toBe("Survey Page"); 

});