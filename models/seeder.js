const mongoose = require("mongoose");
const faker = require("faker")
const post = require("./models/post");
const user = require("./models/users");
const comment = require("./models/comment");
const answer = require("./models/answer");
const bcrypt = require('bcrypt')

async function createPosts(){
    await user.find({},async (err,user)=>{
        user.forEach(async (user)=>{
            await post.create({
                question : faker.random.words(15)+'?',
            },(err,post)=>{
                post.creater.username = user.username;
                post.creater.id = user.id;
                post.save();
            })
        })
        console.log("Posts created");
    })
}

async function createUser(){
    const random =Math.floor(Math.random()*5+6);
    for(var i=0 ;i<random ; i++){
        const salt = await bcrypt.genSalt(); 
        const hashPassword = await bcrypt.hash('123', salt);
        await user.create({
        username : faker.name.firstName() ,
        password : hashPassword ,
        email : faker.internet.email(),
        image : faker.internet.avatar(),
        isverified : true,
        })
    }
    
}

async function deleteDB(){
    await post.remove({},async (err)=>{
        if(err)
        console.log(err)
        else{
            console.log("all posts deleted");
            await answer.remove({},async (err)=>{
               if(err)
               console.log(err);
               else{
                   console.log("all answers deleted");
                   await comment.remove({},async (err)=>{
                       if(err)
                       console.log(err)
                       else{
                            console.log("all comments deleted");
                        }
                    })
                }
            })
        }
    })
}

async function createAnswers(){
    await post.find({},(err,post)=>{
        post.forEach(async(post)=>{
                       
        
            await user.find({},async(err,user)=>{
                var i = Math.floor(Math.random()*user.length)
                var ans = [{type:"paragraph",data:{text : faker.lorem.paragraph(5) }}]

                await answer.create({},async(err,answer)=>{
                answer.creater.user = user[i]
                answer.creater.username = user[i].username
                answer.content =  JSON.stringify(ans);
                await answer.save(); 
                post.answer.push(answer);
                post.save();
                })
            })

        })
        
    })
    console.log("Answers Created")
}

// async function createComments(){
//     await answer.find({},(err,answer)=>{
//         //  answer.forEach((answer)=>{
//         //     // comment.create({
//         //     //     text : faker.lorem.sentence(6,2),
//         //     // },(err,comment)=>{
//         //     //     user.find({},(err,user)=>{
//         //     //         // const j=Math.floor(Math.random()*3+1);
                    
//         //     //         const k=Math.floor(Math.random()*(user.length-1)+1);
//         //     //         comment.creater.username = user[k].username;
//         //     //         comment.creater.id = user[k].id;
//         //     //         comment.save(); 
//         //     //         answer.comment.push(comment);
//         //     //         answer.save();
//         //     //         console.log(comment);
//         //     //     })
//         //     // })
//         // })
//             console.log(answer);
//     })
// }

async function seeder(){
    await deleteDB();
    // await createUser();
    await createPosts();
    await createAnswers();
    // await createComments();
}

    module.exports = seeder;