var editor = new EditorJS({
    
  holder: 'editorjs'
  ,
  
  image: { 
    class: SimpleImage,
    inlineToolbar: ['link'],
  },
});

const saveButton = document.getElementById('save-button');

 saveButton.addEventListener('click', () => {    
     editor.save().then( savedData => {          
     console.log(savedData)                                                   
      fetch( url ,{                               
          method : 'POST',                       
          headers : {                            
              'Content-Type': 'application/json' 
              },                                 
          body: JSON.stringify(savedData),
          redirect : "follow"      
          })                                     
      })                                         
 })                                              


