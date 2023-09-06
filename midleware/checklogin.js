exports.yeu_cau_dang_nhap = (req,res,next) => {

    if(req.session.userLogin){
        next();
    }else{
        return res.render('home/home',{message:'Bạn phải đăng nhập để sử dụng chức năng này',req:req});
    }
}

exports.yeu_cau_dang_nhap_admin = (req,res,next) => {

    if(req.session.userLogin && req.session.userLogin.group === 'Admin'){
        next();
    }else{
        return res.render('home/home',{message:'Bạn phải đăng nhập tài khoản Admin để sử dụng chức năng này',req:req});
    }
}

exports.khong_yc_dang_nhap = (req,res,next)=>{
    if(!req.session.userLogin){
        next();
    }else{
        return res.redirect("/users");
    }
}