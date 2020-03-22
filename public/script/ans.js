
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
  }

  
});

const saveButton = document.getElementById('save-button');

 saveButton.addEventListener('click', () => {    
     editor.save().then( async savedData => {          
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


