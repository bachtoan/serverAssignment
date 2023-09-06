var md = require('../models/user.model');
const fs = require('fs');

const myModel = require('../models/comic.model');
const bcrypt = require('bcrypt');
const { log } = require('console');
exports.listUser = async (req, res, next)=>{
    try {
        let list = await md.userModel.find();
        if(list){
            return  res.status(200).json({data: list, msg: 'Lấy dữ liệu thành công'});
        }else{
            return res.status(204).json({msg: 'Không có dữ liệu'});
        }
 
 
    } catch (error) {
        return res.status(500).json({msg:  error.message });
    }
 
 }
 
 
 exports.login = async (req, res, next)=>{
   
    console.log(req.body);
    
    try {
        const user = await md.userModel.findOne({name: req.body.name});
        console.log(user);
        if (!user) {
            console.log("Không tồn tại tài khoản");
            return res.status(500).json({msg: "sai thông tin đăng nhập"})
        }else{
            const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isPasswordMatch) {
                console.log("sai mật khẩu");
                return res.status(500).json({msg: "sai mật khẩu"})
            }else{
                console.log('Đăng nhập thành công');
                return res.status(201).json(user)
            }
        }        
 
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Sai tài khoản hoặc mật khẩu"})
        
    }
 
  }
 
 
 exports.reg = async (req, res, next)=>{
  try {
    const salt = await bcrypt.genSalt(10);
    let objUser = new md.userModel();
    objUser.name = req.body.userName;
    objUser.email = req.body.userEmail;
    objUser.password = req.body.userPassword;
    objUser.group = req.body.userGroup;


    objUser.password = await bcrypt.hash(req.body.userPassword, salt);
    const token = await objUser.generateAuthToken();

    let new_u = await objUser.save()


    return res.json({new_u});


} catch (error) {
    console.log(error)
    return res.status(204);
}
 }
 
 
 exports.profile = (req, res, next)=>{
  
 
 
    res.json( {status: 1, msg: 'Trang thông tin'});
 }

 
 
 exports.logout = async (req, res, next)=>{
   res.json( {status: 1, msg: 'Trang đăng xuất'});
 }
 
 exports.getComics = async (req, res, next) => {
  try {
    // Lấy danh sách bản ghi từ cơ sở dữ liệu và điền thông tin group bằng phương thức .populate()
    let list = await myModel.comicModel.find().populate("id_group").populate("comment");

    if (list) {
      let modifiedList = list.map(item => {
        return {
          _id: item._id,
          name: item.name,
          author: item.author,
          description: item.description,
          publish: item.publish,
          cover: item.cover,
          images: item.images,
          groupName: item.id_group.name,
          comment: item.comment
        }
      });

      return res.status(200).json(modifiedList);
    } else {
      return res.status(204).json({ msg: 'Không có dữ liệu' });
    }
  } catch (error) {
    // Nếu có lỗi, xử lý lỗi tại đây
    console.log(error);
    return res.status(500).json({ msg: 'Có lỗi khi lấy dữ liệu' });
  }
};
exports.fillter = async (req, res, next)=>{
  try {
    const groupId = req.body.groupId;

    const filteredComics = await myModel.comicModel.find({ id_group: groupId });

    if (filteredComics.length > 0) {
      return res.status(200).json({ data: filteredComics, msg: 'Lấy dữ liệu thành công' });
    } else {
      return res.status(204).json({ msg: 'Không có truyện nào thuộc group này' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Có lỗi khi lấy dữ liệu' });
  }
  
}
  exports.search = async (req, res, next)=>{
    
    let regex = new RegExp(req.body.searchText, "i"); 
    let listComics = await myModel.comicModel.find({ name: regex }).populate("id_group");  
    

    if (listComics) {
        let modifiedList = listComics.map(item => {
          return {
            _id: item._id,
            name: item.name,
            author: item.author,
            description: item.description,
            publish: item.publish,
            cover: item.cover,
            images: item.images,
            groupName: item.id_group.name
          }
        });
        return  res.status(201).json({data: modifiedList, msg: 'Lấy dữ liệu thành công'});
      } else {
        return res.status(204).json({msg: 'Không có dữ liệu'});
      }
    
  }
  exports.delete = async(req, res, next)=>{
    console.log(req.body._id);
    try {
      await myModel.comicModel.deleteOne({ _id: req.body._id });
      let list = await myModel.comicModel.find().populate("id_group");
      if (list) {
        let modifiedList = list.map(item => {
          return {
            _id: item._id,
            name: item.name,
            author: item.author,
            description: item.description,
            publish: item.publish,
            cover: item.cover,
            images: item.images,   
            groupName: item.id_group.name // thông tin bạn cần lấy
          }
        });
        return res.status(200).json({data: modifiedList, msg: 'Xoá thành công, Lấy dữ liệu thành công'});
      } else {
        return res.status(204).json({msg: 'Không có dữ liệu'});
      }
    } catch (error) {
      res.json( {status: 0, msg: 'Xoá thất bại'});
    }
  }

  exports.find = async (req, res, next) => {
    try {
      const id = req.query.id;
      const result = await myModel.comicModel.findById(id);
  
      if (!result) {
        return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
      }
  
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  };

  exports.finduser = async (req, res, next) => {
    try {
      const id = req.query.id;
      console.log(id);
      const result = await md.userModel.findById(id);
  
      if (!result) {
        return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
      }
  
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  };

  
  exports.addImage = async(req,res,next) => {
      
      const originalNames = [];


    const dir = `./public/uploads/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // Lưu các files vào thư mục đã tạo
    try {
        const promises = req.files.map(file => {
        const oldPath = file.path;
        const newPath = `${dir}/${file.originalname}`;
        originalNames.push(file.originalname); 
        return fs.promises.rename(oldPath, newPath);
    });

        await Promise.all(promises);

        console.log("Upload thành công!");
    } catch (error) {
        console.log(error);
    }
    let objComic = new myModel.comicModel();
    objComic.images = originalNames;
    objComic._id = req.body.id;
    try {
        await myModel.comicModel.findByIdAndUpdate({_id: req.body.id},{$set:objComic});
    }catch (error) {
        console.log(error.message);
    }
    res.send('Upload thành công!');
  };

  exports.addCover = async(req,res,next)=>{
    console.log(req.body.id + req.file.originalname);
    try {
      await fs.rename(
        req.file.path,
        "./public/uploads/" + req.file.originalname,
        function (err) {
          if (err) throw err;
          url_image = "/uploads/" + req.file.originalname;
          console.log("upload thanh cong" + url_image);
        }
      );
    } catch (error) {
      // nếu có lỗi thì xảy ra lỗi ở đây
      console.log(error);
    }
    
    id = req.body.id.replace(/"/g, ''); 
    console.log(id); 
    
    let objComic = new myModel.comicModel();
    objComic.cover = req.file.originalname;
    objComic._id = id;
    try {
        await myModel.comicModel.findByIdAndUpdate({_id:id},{$set:objComic});
    }catch (error) {
        console.log(error.message);
    }



  };

  exports.uploadimg = async(req,res,next)=>{
    console.log(req.body.id + req.file.originalname);
    try {
      await fs.rename(
        req.file.path,
        "./public/uploads/" + req.file.originalname,
        function (err) {
          if (err) throw err;
          url_image = "/uploads/" + req.file.originalname;
          console.log("upload thanh cong" + url_image);
        }
      );
    } catch (error) {
      // nếu có lỗi thì xảy ra lỗi ở đây
      console.log(error);
    }
    
    id = req.body.id.replace(/"/g, ''); 
    console.log(id); 
    
    let objUser = new md.userModel();
    objUser.image = req.file.originalname;
    objUser._id = id;
    try {
        await md.userModel.findByIdAndUpdate({_id:id},{$set:objUser});
    }catch (error) {
        console.log(error.message);
    }



  };
  exports.add = async (req, res, next) => {
    var url_image = "";
    console.log(req.body);
    if (req.method == "POST") {


    let objComic = new myModel.comicModel();
            objComic.name = req.body.name;
            objComic.description = req.body.description;
            objComic.author = req.body.author;
            objComic.cover = "";
            objComic.publish = req.body.publish;
            objComic.id_group = req.body.id_group;
            let new_comic = await objComic.save();
            console.log(new_comic);
                
    }
    
    res.json( {status: 1, msg: 'thêm thành công'});
  };

  exports.update = async (req, res, next) => {
    console.log("update", req.body);
    var url_image = "";
    if (req.method == "POST") {
      
        if(req.file != undefined) {
            try {
                await fs.rename(
                  req.file.path,
                  "./public/uploads/" + req.file.originalname,
                  function (err) {
                    if (err) throw err;
                    url_image = "/uploads/" + req.file.originalname;
                    console.log("upload thanh cong" + url_image);
                  }
                );
              } catch (error) {
                console.log("don't have new images");
              }
            let objComic = new myModel.comicModel();
            objComic.name = req.body.name;
            objComic.cover = req.file.originalname;
            objComic.description = req.body.description;
            objComic.author = req.body.author;
            objComic.publish = req.body.publish;
            objComic.id_group = req.body.comicGroup;
            objComic._id = req.body.comicId;
            console.log(req.body.comicId);
            try{
             await myModel.comicModel.findByIdAndUpdate({_id:  req.body.comicId}, { $set: objComic });
             console.log("đã sửa");
             let list = await myModel.comicModel.find().populate("id_group");
             if (list) {
               let modifiedList = list.map(item => {
                 return {
                   _id: item._id,
                   name: item.name,
                   author: item.author,
                   description: item.description,
                   publish: item.publish,
                   cover: item.cover,
                   images: item.images,   
                   groupName: item.id_group.name // thông tin bạn cần lấy
                 }
               });
               return res.status(200).json({data: modifiedList, msg: 'Sửa thành công, Lấy dữ liệu thành công'});
             } else {
               return res.status(204).json({msg: 'Không có dữ liệu'});
             }
            }catch(err){
                console.log(err);
                console.log("Chưa sửa được");
                return res.json( {status: 0, msg: 'Sửa thất bại'});

            }
        }else{
            let objComic = new myModel.comicModel();
            objComic.name = req.body.name;
            objComic.description = req.body.description;
            objComic.author = req.body.author;
            objComic.publish = req.body.publish;
            objComic.id_group = req.body.comicGroup;
            objComic._id = req.body.comicId;
            console.log(req.body.comicId);
            try{
             await myModel.comicModel.findByIdAndUpdate({_id:  req.body.comicId}, { $set: objComic });
             console.log("đã sửa");
             let list = await myModel.comicModel.find().populate("id_group");
             if (list) {
               let modifiedList = list.map(item => {
                 return {
                   _id: item._id,
                   name: item.name,
                   author: item.author,
                   description: item.description,
                   publish: item.publish,
                   cover: item.cover,
                   images: item.images,   
                   groupName: item.id_group.name // thông tin bạn cần lấy
                 }
               });
               return res.status(200).json({data: modifiedList, msg: 'Sửa thành công, Lấy dữ liệu thành công'});
             } else {
               return res.status(204).json({msg: 'Không có dữ liệu'});
             }
            }catch(err){
                console.log(err);
                console.log("Chưa sửa được");
                return res.json( {status: 0, msg: 'Sửa thất bại'});
            }
        }
    }
    res.json( {status: 1, msg: 'Sửa thành công'});
}


exports.addComment = async (req,res,next)=>{
  try {
    const { comicId, userId, name, content, date, image } = req.body;

    console.log(req.body.userId + ' ' + req.body.comicId);

    // Tìm bản ghi có id là comicId trong cơ sở dữ liệu
    const comic = await myModel.comicModel.findById(comicId);

    // Nếu không tìm thấy bản ghi, có thể xử lý tại đây
    if (!comic) {
      throw new Error('Không tìm thấy bản ghi');
    }

    // Thêm comment vào mảng comment của bản ghi
    comic.comment.push({ name, content, userId, comicId, image });

    // Lưu lại bản ghi đã có comment mới vào cơ sở dữ liệu
    const updatedComic = await comic.save();

    return res.status(200).json({ success: true, updatedComic });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Có lỗi khi thêm comment" });
  }
}
exports.deleteComment = async (req, res, next) => {
  console.log("heree");
  try {
    const comicId = req.body.comicId; 
    const commentId = req.body._id; 

    console.log(req.body);

    const comic = await myModel.comicModel.findById(comicId);
    if (!comic) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy comic' });
    }

    const commentIndex = comic.comment.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy comment' });
    }

    comic.comment.splice(commentIndex, 1);

    const updatedComic = await comic.save();

    return res.status(200).json({ success: true, updatedComic });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Có lỗi khi xoá comment" });
  }
};




//============================================================================

exports.getGroup = async (req,res,next)=>{
  let listGroup = await myModel.groupModel.find();

    res.json(listGroup)
}

exports.updategroup = async (req,res,next)=>{
  if (req.method == "POST") {
      
        
    let objGroup = new myModel.groupModel();
    objGroup.name = req.body.groupName;
    objGroup._id = req.body.groupId;
   
    try{
     await myModel.comicModel.findByIdAndUpdate({_id:  req.body.groupId}, { $set: objGroup });
     console.log("đã sửa");
     res.json({msg: "đã sửa"});

    }catch(err){
        console.log(err);
        console.log("Chưa sửa được");
        res.json({msg: "Chưa sửa được"});
    }
}
}


exports.addgroup = async (req,res,next)=>{
  if (req.method == "POST") {      
    let objGroup = new myModel.groupModel();
    objGroup.name = req.body.groupName;
    try{
        let new_group = await objGroup.save();
        
    }catch(err){
        console.log(err);
    }
    let list = await myModel.groupModel.find();
    if (list) {
      let modifiedList = list.map(item => {
        return {
          _id: item._id,
          name: item.name,
        }
      });
      return res.status(200).json({data: modifiedList, msg: 'Lấy dữ liệu thành công'});
    } else {
      return res.status(204).json({msg: 'Không có dữ liệu'});
    }
}
}

exports.deletegroup = async (req,res,next)=>{
  await myModel.groupModel.deleteOne({ _id: req.body.groupId });

  res.status(200).json({msg: 'Xoá thành công'});
};


//================================================================


exports.adduser = async (req,res,next)=>{
  try {
    const salt = await bcrypt.genSalt(10);
    let objUser = new md.userModel();
    objUser.name = req.body.name;
    objUser.email = req.body.email;
    objUser.password = req.body.password;
    objUser.group = "User";


    objUser.password = await bcrypt.hash(req.body.password, salt);
    const token = await objUser.generateAuthToken();

    let new_u = await objUser.save()


    return res.json(new_u);


} catch (error) {
    console.log(error)
    return res.status(204);
}
};

exports.deleteuser = async (req, res, next) => {
  await md.userModel.deleteOne({ _id: req.body.userId });

  res.redirect('/users');
}
