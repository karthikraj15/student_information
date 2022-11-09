const express=require('express');
const router=express.Router();
const passport = require('passport');
const User = require('../models/users');

const { isLoggedIn } = require('../middleware');
const students = require('../models/student');

//all students
router.get('/',isLoggedIn,async(req,res)=>{
    const email= res.locals.user;
    let stud=[{}]
    if(email==process.env.ADMIN){
        stud=await students.find({});
    }
    else{
        stud=await students.findOne({email:email});
        if(!stud){
            res.send("Your email does not exist in the database")
        }
        console.log(stud.id)
        return res.redirect(`/students/${stud.id}`)
    }
    console.log(stud)
    res.render('students/view-students',{stud});
})


//add student
router.get('/new',isLoggedIn,async(req,res)=>{
    res.render('students/new-student');
})

//add post
router.post('/',isLoggedIn,async(req,res)=>{
    try{
        const stud = new students(req.body.student);
        await stud.save();
        const email=req.body.student.email;
        const password=req.body.student.usn;
        const username = email;
        const user = new User({ email,username });
        await User.register(user, password);
        res.redirect('/students');
    }
    catch(err)
    {
        console.log(err.message)
    }
})


//show a student
router.get('/:id',isLoggedIn,async(req,res)=>{
    const s = await students.findById(req.params.id);
    res.render('students/show-student',{s});
})

//render edit page
router.get('/:id/edit',isLoggedIn,async(req,res)=>{
    const s = await students.findById(req.params.id);
    res.render('students/edit-student',{s});
})

//edit 
router.put('/:id',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    const student = await students.findByIdAndUpdate(id,{ ...req.body.student  });
    res.redirect('/students');
});


//delete
router.delete('/:id',isLoggedIn,async(req,res)=>{
    const {id}= req.params;
    await students.findByIdAndDelete(id);
    res.redirect('/students');
})

module.exports = router;