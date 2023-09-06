var db = require('./db');
const comicSchema = new db.mongoose.Schema(
    {
        name: {type : String, required: true}, // yêu cầu bát buộc phải nhập chuỗi
        author: {type : String, required: false}, 
        description: {type : String,required: false},
        publish: {type : String, required: false},
        cover: {type : String, required:false},
        comment: [{
            "name": { type: String, required: true }, // Tên người bình luận
            "content": { type: String, required: false }, // Nội dung bình luận
            "userId": { type: String, required: true },
            "comicId": { type: String, required: true },
            "date": { type: Date, default: Date.now },
            "image": { type: String, required: false },
          }],
        images: [{type : String}],
        id_group: {type : db.mongoose.Schema.Types.ObjectId, ref:'groupModel'},
    },
    {
        collection: 'comic' // xác định tên collection trong csdl
    }
);

const groupSchema = db.mongoose.Schema(
    {
        name:{type: String,required: true}
    },
    {collection: 'group'}
);

let comicModel = db.mongoose.model('comicModel', comicSchema);
let groupModel = db.mongoose.model('groupModel', groupSchema);

module.exports = {
    comicModel,groupModel
}