
function checkURL(givenurl){
    if(url === givenurl)
    return true;
    else
    return false;
}

if(currentUser){
    document.getElementById('answer').classList.remove('active')
    document.getElementById('addQuestion').classList.remove('active')
    if(checkURL('/discuss/answer')){
    document.getElementById('answer').classList.add('active')
    }

    if(checkURL('/discuss/question/new')){
        document.getElementById('addQuestion').classList.add('active')
    }
}

document.getElementById('home').classList.remove('active')

if(checkURL('/discuss')){
    document.getElementById('home').classList.add('active')
}



// async function postData(url = '', data = {}) {
//     // Default options are marked with *
//     const response = await fetch(url, {
//       method: 'POST', // *GET, POST, PUT, DELETE, etc.
//       mode: 'cors', // no-cors, *cors, same-origin
//       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//       credentials: 'same-origin', // include, *same-origin, omit
//       headers: {
//         'Content-Type': 'application/json'
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       redirect: 'follow', // manual, *follow, error
//       referrerPolicy: 'no-referrer', // no-referrer, *client
//       body: JSON.stringify(data) // body data type must match "Content-Type" header
//     });
//     return response.json(); // parses JSON response into native JavaScript objects
// }
  
  

// $("#search").keypress(function(event) { 
//     if (event.keyCode === 13) { 
//         var query = document.querySelector('#search').value;

//         // postData('/search', { query : query })
//         // .then((data) => {
//         //     console.log(data); // JSON data parsed by `response.json()` call
//         // });
//         console.log(query) 
//     } 
// }); 