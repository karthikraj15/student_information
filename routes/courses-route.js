const express=require('express');
const router=express.Router();

const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const courses = require('../models/course');

//all courses
router.get('/',isLoggedIn,catchAsync(async(req,res)=>{
    const c=await courses.find({});
   // res.render('courses/view-courses',{c});
    res.send(c);
}))


//add course
router.get('/new',isLoggedIn,catchAsync(async(req,res)=>{
   // res.render('courses/new-course');
}))

//add post
router.post('/',isLoggedIn,catchAsync(async(req,res)=>{
    const c = new courses(req.body.course);
    await c.save();
    //res.redirect('/courses');
    res.send(c);
}))


//show a course
router.get('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const c = await courses.findById(req.params.id);
  //  res.render('courses/show-course',{c});
     res.send(c);
}))

//render edit page
router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res)=>{
    const c = await courses.findById(req.params.id);
   // res.render('courses/edit-course',{c});
}))

//edit 
router.put('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const c = await courses.findByIdAndUpdate(id,{ ...req.body.course  });
    res.send("Updated");
 //  res.redirect('/courses');
}))


//delete
router.delete('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const {id}= req.params;
    await courses.findByIdAndDelete(id);
    res.send("deleted")
    //res.redirect('/courses');
}))

module.exports = router;