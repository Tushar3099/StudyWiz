
var editor = new EditorJS({ 
  holder: 'editorjs'
  ,
  tools : {
    image: {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: 'http://localhost:3000/uploadFile', // Your backend file uploader endpoint
          byUrl: 'http://localhost:3000/fetchUrl', // Your endpoint that provides uploading by Url
        }
      }
    },

    header: Header,

    list: {
      class: List,
      inlineToolbar: true,
    },


  }

  
});



console.log('I m in ans.js')
 
  const saveButton = document.getElementById('save-button');

  saveButton.addEventListener('click',async () => {    
      await editor.save().then( async savedData => {          
      console.log(savedData)                                                   
       await fetch( url ,{                               
           method : 'POST',                       
           headers : {                            
               'Content-Type': 'application/json' 
               },                                 
           body: JSON.stringify(savedData),
           redirect : "follow"      
           })
         window.location.replace(url2)
 
       })                                         
  })                                              
 
 
  var element = document.querySelector('.codex-editor__redactor');
 
  element.style.padding = "0px 0px 0px 0px";
 