const Item = require('../models/Item');

exports.listItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 100;
    const skip = (page - 1) * pageSize;

    const items = await Item.find({ is_active: true })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await Item.countDocuments({ is_active: true });

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
