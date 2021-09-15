const mongoose = require('mongoose');

(async () => {
    await mongoose.connect('mongodb://localhost:27017/pqs',
        { useNewUrlParser: true, useUnifiedTopology: true });
}
)();
