var express = require('express');
var router = express.Router();
const multer = require('multer');
var uploader = multer({dest:'./tmp'});
var apiU = require('../controllers/api.user.controller');

router.get('/users',apiU.listUser);
router.post('/users/login', apiU.login);
router.post('/users/reg', apiU.reg); 
router.get('/users/profile',apiU.profile); 
router.get('/users/logout', apiU.logout); 

//================================================================

router.get('/comics', apiU.getComics); 
router.post('/comics/search', apiU.search);
router.post('/comics/delete', apiU.delete); 
router.post('/comics/add', apiU.add); 
router.post('/comics/uploadComics',uploader.array('images') , apiU.addImage); 
router.post('/comics/uploadCover',uploader.single('image') , apiU.addCover); 

router.post('/comics/update', apiU.update);
router.post('/comics/fillter', apiU.fillter);


//================================================================
router.post('/comics/addComment', apiU.addComment);
router.post('/comics/deleteComment', apiU.deleteComment);
router.get('/comics/find', apiU.find); 


//================================================================

router.get('/groups', apiU.getGroup); 
router.post('/groups/addgroup', apiU.addgroup); 
router.post('/groups/updategroup', apiU.updategroup); 
router.post('/groups/deletegroup', apiU.deletegroup); 

//================================================================

router.post('/user/adduser', apiU.adduser); 
router.get('/users/finduser', apiU.finduser); 
router.post('/user/uploadimg',uploader.single('image'), apiU.uploadimg);  
router.post('/user/deleteuser', apiU.deleteuser); 

module.exports = router;