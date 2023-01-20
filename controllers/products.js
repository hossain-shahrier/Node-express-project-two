const Product = require('../models/product')
const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({ price: { $gt: 30 } })
        .sort('price')
        .select('name price')
    res.status(200).json({ products, nbHits: products.length })
}
const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query

    const queryObject = {}
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        // Searching
        queryObject.name = { $regex: name, $options: 'i' }
    }
    // numericFilters
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        const options = ['price', 'rating']
        filters = filters.split(',').forEach(item => {
            const [fields, operator, value] = item.split('-')
            if (options.includes(fields)) {
                queryObject[fields] = { [operator]: Number(value) }
            }
        });
    }
    let result = Product.find(queryObject)

    // Sorting
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
        // products = products.sort()
    }
    else {
        result = result.sort('createdAt')
    }
    // Select
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList)
    }
    // Page and Skip
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)
    // 23
    const products = await result
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}