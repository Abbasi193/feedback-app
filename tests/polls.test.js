const axios = require('axios')

function polls() { 
    return axios.get('http://localhost:3000/poll'
     ) 
     .then(function (response) { 
         // handle success 
         //console.log(response); 
         
         return 'Polls Page'
    }) 
    
    .catch(function (error) { 
        // handle error 
        console.log(error); 
        return 'Page not found' 
    }) 
 } 
 
 test("Polls Page test", async() => { 
    await expect(polls()).resolves.toBe("Polls Page"); 
    
});
