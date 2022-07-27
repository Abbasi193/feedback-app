const axios = require('axios') 

function feedback() { 
    return axios.get('http://localhost:3000/feedback' ) 
    
    .then(function (response) { 
        
        // handle success 
        //console.log(response); 
        
        return 'Feedback Page' 
    
    }) 
    
    .catch(function (error) { 
        // handle error 
        console.log(error); 
        return 'Page not found' 
    }) 
} 

test("Feedback Page test", async() => { 
    await expect(feedback()).resolves.toBe("Feedback Page"); 

});