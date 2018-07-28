var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AlbumSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        require: true
    },

    img: {
        type: String,
        require: true
    },

    Note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
});

var Album = mongoose.model('Album', AlbumSchema);

module.exports = Album; 