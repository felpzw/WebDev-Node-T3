const mongoose = require('../config/db');
const Schema = mongoose.Schema;


const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is necessary.'],
      unique: true,
      trim: true,
    },
    context: {
      type: String,
      enum: ['tecnologia', 'saude', 'negocios', 'natureza', 'politica'],
      required: [true, 'Context is necessary.'],
    },
    content: {
      type: String,
      required: [true, 'Data is necessary'],
    }
  },
  { timestamps: true }
);

const News = mongoose.model('News', NewsSchema);

module.exports = News;