
document.querySelector('#button').addEventListener('click',(e)=>{

    document.querySelector("#myCard").classList.remove("unflip")
    document.querySelector("#myCard").classList.add("flip")

    document.querySelectorAll('.fa').forEach((element)=>{
        element.classList.add('icon');

    setTimeout(()=>{
        element.classList.remove('icon');
    },1500)

    })
    
})

document.querySelector('#button2').addEventListener('click',()=>{

    document.querySelector("#myCard").classList.remove("flip")
    document.querySelector("#myCard").classList.add("unflip")
    // document.querySelector('.fa').classList.remove('icon')
    // document.querySelector('.fa').classList.add('icon2')

    document.querySelectorAll('.fa').forEach((element)=>{
        element.classList.add('icon');

    setTimeout(()=>{
        element.classList.remove('icon');
    },1500)

    })
    
})


// var allIcons = document.querySelectorAll('.fa');
// var val;
// allIcons.forEach((icon,index)=>{
//     var length = allIcons.length;;
//     if(index<=length/4){
        
//     val = Math.random()*(90-15) + 15;
//     icon.style.top = val + 'px';

//     val = Math.random()*(2.4-1.7) + 1.7;
//     icon.style.fontSize = val + 'em';

//     val = Math.random()*(90 + 9) - 9;
//     icon.style.left = val + '%';
//     }
    
//     if(index>length/4 && index<=(2*(length/4))){
//         val = Math.random()*(525-155) + 155;
//         icon.style.top = val + 'px';
    
//         val = Math.random()*(2.4-1.7) + 1.7;
//         icon.style.fontSize = val + 'em';
    
//         val = Math.random()*(4 + 9) - 9;
//         icon.style.left = val + '%';
//     }

//     if(index>(2*(length/4))&& index<=(3*(length/4))){
//         val = Math.random()*(608-570) + 570;
//         icon.style.top = val + 'px';
    
//         val = Math.random()*(2.4-1.7) + 1.7;
//         icon.style.fontSize = val + 'em';
    
//         val = Math.random()*(90 + 9) - 9;
//         icon.style.left = val + '%';
//     }

//     if(index>(3*(length/4)) && index<=length){
//         val = Math.random()*(525-155) + 155;
//         icon.style.top = val + 'px';
    
//         val = Math.random()*(2.4-1.7) + 1.7;
//         icon.style.fontSize = val + 'em';
    
//         val = Math.random()*(90 - 70) + 70;
//         icon.style.left = val + '%';
//     }

//     // top = 36px - 585px
//     // font-size = 1.7em - 2.4em
//     // left= -13% - 77%
// })