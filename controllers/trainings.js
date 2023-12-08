const Training = require("../models/Training")

// @desc   Get all trainings
// @route  GET /api/trainings
// @access Public
exports.getTrainings = async (req, res, next) => {
    try {
        let query;
        let queryStr = JSON.stringify(req.query)
        // Kicseréljük a query-ben lévő lte sztringet $lte-re
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        query = Training.find(JSON.parse(queryStr));

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ')
            query = query.select(fields)
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt') // Dátum szerint csökkenő rendezés
        }


        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.page) || 2
        const startIndex = (page - 1) * limit
        const endIndex = (page + 1) * limit
        const total = 5
        query = query.skip(startIndex).limit(limit)

        const pagination = {};
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        const trainings = await query;
        res
            .status(200)
            .json({
                success: true,
                count: trainings.length,
                pagination,
                data: trainings,
            });




        // const trainings = await query;





        //const trainings = await Training.find(req.query)
        // res.status(200).json({ success: true, count: trainings.length, data: trainings });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};
// @desc   Get single training
// @route  GET /api/trainings/:id
// @access Public
exports.getTraining = async (req, res, next) => {
    try {
        const training = await Training.findById(req.params.id);
        if (!training) {
            return res.status(400).json({ success: false, msg: 'Not found' });
        }
        res.status(200).json({ success: true, data: training });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};
// @desc   Create new training
// @route  POST /api/trainings
// @access Private
exports.createTraining = async (req, res, next) => {
    try {
        const training = await Training.create(req.body);
        res.status(201).json({ success: true, data: training });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};
// @desc   Update training
// @route  PUT /api/trainings/:id
// @access Private
exports.updateTraining = async (req, res, next) => {
    try {
        const training = await Training.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // A frissített adatokat kapjuk vissza
            runValidators: true, // Ellenőrizze a frissített adatokat a modell
        });
        if (!training) {
            return res.status(400).json({ success: false, msg: "Not found" });
        }
        res.status(200).json({ success: true, data: training });
    } catch (error) {
        res.status(400).json({ success: false });
    }

};
// @desc   Delete training
// @route  DELETE /api/trainings/:id
// @access Private
exports.deleteTraining = async (req, res, next) => {
    try {
        const training = await Training.findByIdAndDelete(req.params.id);
        if (!training) {
            return res.status(400).json({ success: false, msg: "Not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};