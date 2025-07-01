const cloudinary = require("../helpers/cloudinary");
const categorySchema = require("../models/categorySchema");
const fs = require('fs');

const createNewCategory = async (req, res) => {
    const {name} = req.body;

    try {
        if(!name) return res.status(400).send({message: "Category name is required!"});
        if(!req?.file?.path) return res.status(400).send({message: "Category image is required!"});

        const existingCategory = await categorySchema.findOne({ name: { $regex: `${name}`, $options: 'i' } });

        if(existingCategory) return res.status(400).send({message: "Category is already exist"});   
        
        // Upload Category Image
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "categories"});
        fs.unlinkSync(req.file.path);

        const category = new categorySchema({
            name,
            image: result.url
        });

        await category.save();
        res.status(201).send({message: "Category created", category});
    } catch (error) {
        res.status(500).send({message: "Server error!"});
    }
};

const retrieveAllCategories = async (req, res) => {
    try {
        const categories = await categorySchema.find();
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send({message: "Server error!"});
    }
};

module.exports = {createNewCategory, retrieveAllCategories};