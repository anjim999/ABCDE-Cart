const Item = require('../models/Item');

exports.listItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 100;
    const skip = (page - 1) * pageSize;

    // Build filter object
    const filter = { is_active: true };
    
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const items = await Item.find(filter)
      .skip(skip)
      .limit(pageSize);

    const totalCount = await Item.countDocuments(filter);

    const itemsWithId = items.map(item => {
      const doc = item.toObject();
      doc.id = doc._id;
      return doc;
    });

    res.json({ 
      success: true, 
      data: itemsWithId,
      meta: {
        total: totalCount,
        page,
        page_size: pageSize
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Item.distinct('category', { is_active: true });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    const doc = item.toObject();
    doc.id = doc._id;
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
