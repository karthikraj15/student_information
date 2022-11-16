const express=require('express');
const router=express.Router();
const User = require('../models/users');

const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

const students = require('../models/student');
const { json } = require('express');

//all students
router.get('/',catchAsync(async(req,res)=>{
    const email= res.locals.user;
    if(email==process.env.ADMIN){
        const stud=await students.find({});
        res.status(200).json(stud)
       // res.render('students/view-students',{stud});
    }
    else{
        const stud=await students.findOne({email});
         res.status(200).json(stud)
     //  res.redirect(`/students/${stud.id}`)
    }
}))


//add student
router.get('/new',isLoggedIn,catchAsync(async(req,res)=>{
  //  res.render('students/new-student');
}))

//add post
router.post('/',isLoggedIn,catchAsync(async(req,res)=>{
        const stud = new students(req.body.student);
        await stud.save();
        const {email,usn}=req.body.student;
        const user = new User({ email,username:email });
        await User.register(user, usn);
        res.status(200).json(stud)
      //  res.redirect('/students');
}))


//show a student
router.get('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const stud = await students.findById(req.params.id);
    res.status(200).json(stud)
   // res.render('students/show-student',{s});
}))

//render edit page
router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res)=>{
    const stud = await students.findById(req.params.id);
   // res.status(200).json(stud)
   // res.render('students/edit-student',{s});
}))

//edit 
router.put('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const stud=await students.findByIdAndUpdate(id,{ ...req.body.student  });
    res.status(200).json(stud)
   // res.redirect('/students');
}))


//delete
router.delete('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const {id}= req.params;
    const s = await students.findById(id);
    const email=s.email;
    await User.findOneAndDelete({email})
    await students.findByIdAndDelete(id);
    res.status(200).json("Student record deleted")
  //  res.redirect('/students');
}))

module.exports = router;