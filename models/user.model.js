var db = require('./db');
const jwt = require('jsonwebtoken')  ;//  Cần chạy lệnh cài đặt: npm install jsonwebtoken --save
require('dotenv').config(); // su dung thu vien doc file env:   npm install dotenv --save
const chuoi_ky_tu_bi_mat = process.env.TOKEN_SEC_KEY;
const bcrypt = require("bcrypt"); //cài bằng lệnh:  npm install bcrypt  --save 

const userSchema = new db.mongoose.Schema(
    {
        // đối tượng định nghĩa cấu trúc của model
        name: {type : String, required: true}, // yêu cầu bát buộc phải nhập chuỗi
        email: {type : String, required: false},
        image: {type : String, required: false},
        group: {type : String, required: false},
        password: {type : String,required:true},
        token: {  // trường hợp lưu nhiều token thì phải dùng mảng. Trong demo này sẽ dùng 1 token
            type: String,
            required: false
        }
 
    },
    {
        collection: 'user' // xác định tên collection trong csdl
    }
);



/**
* Hàm tạo token để đăng nhập với API
* @returns {Promise<*>}
*/
userSchema.methods.generateAuthToken = async function () {


    const user = this
    console.log(user)
    const token = jwt.sign({_id: user._id, username: user.username}, chuoi_ky_tu_bi_mat)
    // user.tokens = user.tokens.concat({token}) // code này dành cho nhiều token, ở demo này dùng 1 token
    user.token = token;
    await user.save()
    return token
 }
 
 
 /**
 * Hàm tìm kiếm user theo tài khoản
 * @param username
 * @param passwd
 * @returns {Promise<*>}
 */
 userSchema.statics.findByCredentials = async (name, password) => {
 
 
    const user = await userModel.findOne({name})
    if (!user) {
        throw new Error({error: 'Không tồn tại user'})
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({error: 'Sai password'})
    }
    return user
 }
 


let userModel = db.mongoose.model('userModel', userSchema);


module.exports = {
    userModel
}