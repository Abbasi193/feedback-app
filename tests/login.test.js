const axios = require('axios') 
function login(username,password) {
    return axios.get('http://localhost:3000/login',{
        params: {
            username, 
            password 
        } 
    })
    .then(function (response) { 
        // handle success 
        //console.log(response); 

        return 'Login Succesful' }) 
        .catch(function (error) { 
            // handle error 
            console.log(error); 
            return 'Login Failed' 
        }) 
    }

    test("Login url test", async() => { 
        await expect(login("myname","password")).resolves.toBe("Login Succesful");
    });