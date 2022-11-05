const express=require('express');
const router=express.Router();

const students = require('../models/student');

//all students
router.get('/',async(req,res)=>{
    const stud=await students.find({});
    res.render('students/view-students',{stud});
})


//add student
router.get('/new',async(req,res)=>{
    res.render('students/new-student');
})

//add post
router.post('/',async(req,res)=>{
    const stud = new students(req.body.student);
    await stud.save();
     res.redirect('/students');
})


//show a student
router.get('/:id',async(req,res)=>{
    const s = await students.findById(req.params.id);
    res.render('students/show-student',{s});
})

//render edit page
router.get('/:id/edit',async(req,res)=>{
    const s = await students.findById(req.params.id);
    res.render('students/edit-student',{s});
})

//edit 
router.put('/:id',async(req,res)=>{
    const {id}=req.params;
    const student = await students.findByIdAndUpdate(id,{ ...req.body.student  });
    res.redirect('/students');
});


//delete
router.delete('/:id',async(req,res)=>{
    const {id}= req.params;
    await students.findByIdAndDelete(id);
    res.redirect('/students');
})

module.exports = router;