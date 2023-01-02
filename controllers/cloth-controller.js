import asyncHandler from 'express-async-handler'
import fs from 'fs'
import Cloth from '../models/cloth.js'
import csvParser from 'csv-parser'


// @desc    Populate data with csv file
// @route   POST /api/cloth/populate
// @access  Private
const populateClothes = asyncHandler(async (req, res, next) => {
    const filepath = './data/myntra.csv'

    fs.createReadStream(filepath)
        .on('error', (error) => {
            // handle error
            console.log('Some error in reading file ', error)
        })

        .pipe(csvParser())
        .on('data', (row) => {
            // use row data
            let document = new Cloth({
                BrandName: row['BrandName'],
                Ratings: row['Ratings'],
                URL: row['URL'],
                Category: row['Category'],
                CategoryByGender: row['category_by_Gender'],
                Description: row['Description'],
                Product_id: row['Product_id'],
                SizeOption: row['SizeOption'],
                Reviews: row['Reviews'],
                DiscountOffer: row['DiscountOffer']
            });
            document.save();
            console.log('ROw ', row)
        })

        .on('end', () => {
            // handle end of CSV
            res.json({ message: "Success" });
        })
    
})

// @desc    GET all clothes
// @route   GET /api/cloth
// @access  Public
const getClothes = asyncHandler(async (req, res, next) => {
  const itemsPerPage = 5;
  const startPage = req.query.page || 1;

  let searchFilters = {}
  
  await Cloth.find(searchFilters)
    .skip(itemsPerPage * startPage - itemsPerPage)
    .limit(itemsPerPage)
    .exec(function (err, clothes) {
      Cloth.countDocuments(searchFilters).exec(function (err, count) {
        if (err) return next(err);
        res.status(200).json({
          data: clothes,
          total: count,
          success: true,
          itemsPerPage,
          startPage,
          lastPage: Math.ceil(count / itemsPerPage),
        });
      });
    });
})

// @desc    Get a single cloth item
// @route   GET /api/cloth/:id
// @access  Public
const getSingleCloth = asyncHandler(async (req, res) => {

    const cloth = await Cloth.findOne({ Product_id: req.params.id })

    if (cloth) {
        res.json(cloth)
    } else {
        res.status(404)
        throw new Error('Cloth not found')
    }
})

export {
  populateClothes,
  getClothes,
  getSingleCloth,
}

