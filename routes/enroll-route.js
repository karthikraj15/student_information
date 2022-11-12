const express=require('express');
const router=express.Router();

const { isLoggedIn } = require('../middleware');
const enroll = require('../models/enroll');
const students = require('../models/student');
const courses = require('../models/course');

//student part
//student enrolling to a course
router.post('/courses/:id/enroll',isLoggedIn,async(req,res)=>{
    const courseId=req.params.id;
    const studemail = res.locals.user;
    const stud= await students.findOne({email:studemail});
    const studId=stud.id;
    const c=await courses.findById(courseId);
    const courseName = c.name;
    const enrollexist = await enroll.findOne({studentId:studId})
    if(!enrollexist){
        const e= new enroll({studentId:studId});
        e.courses.push({_id:courseId,name:courseName});
        await e.save();
        res.send(e);
    }
    else{
        enrollexist.courses.push({_id:courseId,name:courseName});
        await enrollexist.save();
        res.send(enrollexist);
    }
    //res.redirect('/courses/);
})

//ADMIN part
//all enrollments
router.get('/enrolls',isLoggedIn,async(req,res)=>{
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

//ADMIN part
//specific requests of a student (admin)
router.get('/enrolls/:id',isLoggedIn,async(req,res)=>{
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

//ADMIN part
//approval of enrollment request of a student
router.put('/enrolls/:enrollId/:courseId',isLoggedIn,async(req,res)=>{
    if(res.locals.user!=process.env.ADMIN){
        // res.redirect('/courses')
        res.send("U must be admin")
     }
    else{
        const {enrollId,courseId}=req.params;
        const c = await enroll.findById(enrollId);
        c.courses.pull({_id:courseId});
        const course=await courses.findById(courseId);
        const courseName = course.name;
        c.courses.push({_id:courseId,name:courseName,status:true});
        await c.save();
        res.redirect(`/enrolls/${enrollId}`);
    }
})



//student part
//view enrolled courses and its status
router.get('/enrolled-courses/:studId',isLoggedIn,async(req,res)=>{
    if(res.locals.user==process.env.ADMIN){
        //res.redirect('/enrolls');
        res.send("Student viewing courses only")
    }
    else{
        const studId=req.params.studId;
        const enrolled = await enroll.findOne({studentId:studId});
        const courses=enrolled.courses;
        res.send(courses);
    }
})


//Admin part
//assign course to a student or selected students - view page
router.get('/courses/:courseId/assign',isLoggedIn,async(req,res)=>{
    if(res.locals.user!=process.env.ADMIN){
        // res.redirect('/courses')
        res.send("U must be admin")
    }
    else{
        const {courseId}=req.params;
        const stud=await students.find({});
        res.send(stud)
      //  res.render('courses/assign-students',{stud,courseId});
    }
})

//Admin part
//assign course to a student or selected students 
router.post('/courses/:courseId/assign/:studId',isLoggedIn,async(req,res)=>{
    if(res.locals.user!=process.env.ADMIN){
        // res.redirect('/courses')
        res.send("U must be admin")
    }
    else{
        const {courseId,studId}=req.params;
        const c=await courses.findById(courseId);
        const courseName = c.name;

        const enrollexist = await enroll.findOne({studentId:studId})
        if(!enrollexist){
            const e= new enroll({studentId:studId});
            e.courses.push({_id:courseId,name:courseName,status:true});
            await e.save();
            res.send(e);
        }
        else{
            enrollexist.courses.push({_id:courseId,name:courseName,status:true});
            await enrollexist.save();
            res.send(enrollexist);
         }
        //res.redirect(`/courses/:courseId/assign`)
    }
})


module.exports = router;