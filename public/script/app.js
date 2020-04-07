
function checkURL(givenurl){
    if(url === givenurl)
    return true;
    else
    return false;
}
document.getElementById('home').classList.remove('active')
document.getElementById('answer').classList.remove('active')
document.getElementById('addQuestion').classList.remove('active')


if(checkURL('/discuss')){
    document.getElementById('home').classList.add('active')
}

if(checkURL('/discuss/answer')){
    document.getElementById('answer').classList.add('active')
}

if(checkURL('/discuss/question/new')){
    document.getElementById('addQuestion').classList.add('active')
}