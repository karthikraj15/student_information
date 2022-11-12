const express=require('express');
const router=express.Router();
const User = require('../models/users');

const { isLoggedIn } = require('../middleware');
const students = require('../models/student');

//all students
router.get('/',isLoggedIn,async(req,res)=>{
    const email= res.locals.user;
    if(email==process.env.ADMIN){
        const stud=await students.find({});
        console.log(stud)
        res.render('students/view-students',{stud});
    }
    else{
        const stud=await students.findOne({email});
        console.log(stud.id)
        res.redirect(`/students/${stud.id}`)
    }
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
        const {email,usn}=req.body.student;
        const user = new User({ email,username:email });
        await User.register(user, usn);
        res.redirect('/students');
    }
    catch(err){
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
    await students.findByIdAndUpdate(id,{ ...req.body.student  });
    res.redirect('/students');
});


//delete
router.delete('/:id',isLoggedIn,async(req,res)=>{
    const {id}= req.params;
    const s = await students.findById(id);
    const email=s.email;
    await User.findOneAndDelete({email})
    await students.findByIdAndDelete(id);
    res.redirect('/students');
})

module.exports = router;