import mongoose from 'mongoose'

const clothSchema = mongoose.Schema(
  {
    BrandName: {
      type: String,
      required: false,
    },
    Category: {
      type: String,
      required: false,
    },
    Product_id: {
      type: String,
      required: false,
    },
    Description: {
      type: String,
      required: false,
    },
    URL: {
      type: String,
      required: false,
    },
    SizeOption: {
      type: String,
      required: false,
    },
    Ratings: {
      type: Number,
      required: false,
    },
    Reviews: {
      type: Number,
      required: false,
    },
    DiscountOffer: {
      type: String,
      required: false,
    },
    CategoryByGender: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

const Cloth = mongoose.model('Cloth', clothSchema)

export default Cloth
