const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "NO ORDER FOUND IN DB"
            });
        }
        req.order = order;
        next();
    });
};

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order)
    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                error: "FAILED TO SAVE YOUR ORDER IN DB"
            })
        }
        res.json(order);
    })
}

exports.getAllOrders = (req, res) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "NO ORDERS FOUND IN DB"
            });
        }
        res.json(order);
    });
};

exports.getOrderStatus = (req,res) => {
    res.json(Oder.schema.path("status").enumValues);
};

exports.updateStatus = (req,res) => {
    Order.update(
        {_id: req.body.orderById},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err){
                return res.status(400).json({
                    error: "CANNOT UPDATE ORDER STATUS"
                });
            }
            res.json(order);
        }
    );  
};

