const express=require('express');
const router=express.Router();

const { isLoggedIn } = require('../middleware');
const enroll = require('../models/enroll');
const students = require('../models/student');
const courses = require('../models/course');
const course = require('../models/course');


router.post('/courses/:id/enroll',async(req,res)=>{
    const courseId=req.params.id;
    const studemail = res.locals.user;
    const stud= await students.findOne({email:studemail});
    const studId=stud.id;
    const c=await courses.findById(courseId);
    const courseName = c.name;
    const exist = await enroll.findOne({studentId:studId})
    if(!exist)
    {
        const e= new enroll({studentId:studId});
        e.courses.push({_id:courseId,name:courseName});
        await e.save();
        res.send(e);
    }
    else{
        exist.courses.push({_id:courseId,name:courseName});
        await exist.save();
        res.send(exist);
    }
    //res.redirect('/courses/);
})

//all enrollments
router.get('/enrolls',async(req,res)=>{
    if(res.locals.user!=process.env.ADMIN){
       // res.redirect('/courses')
       res.send("U must be admin")
    }
    else{
        const e=await enroll.find({});
        // res.render('enrolls/view-enrolls',{e});
        res.send(e);
    }
    
})

router.get('/enrolls/:id',async(req,res)=>{
    if(res.locals.user!=process.env.ADMIN){
       // res.redirect('/courses')
       res.send("U must be admin")
    }
    else{
        const e = await enroll.findById(req.params.id);
        const enrollId=req.params.id;
        const studId= e.studentId.valueOf();
        const stud=await students.findById(studId);
        const studName=stud.name;
        const courses = e.courses;
        res.render('enrolls/show-enroll',{studName,courses,enrollId});
    }
})

router.put('/enrolls/:enrollId/:courseId',async(req,res)=>{
    if(res.locals.user!=process.env.ADMIN){
        // res.redirect('/courses')
        res.send("U must be admin")
     }
    else{
        const {enrollId,courseId}=req.params;
        const c = await enroll.findById(enrollId);
        c.courses.pull({_id:courseId});
        await c.save();
        const course=await courses.findById(courseId);
        const courseName = course.name;
        c.courses.push({_id:courseId,name:courseName,status:true});
        await c.save();
        res.redirect(`/enrolls/${enrollId}`);
    }
})

module.exports = router;