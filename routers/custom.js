const express = require('express');
const customRouter = express.Router();

customRouter.route('/widgets')
  .get(function (req, res) {

    res.json([
      { name: 'Widget 1', color: 'blue' },
      { name: 'Widget 2', color: 'blue' },
      { name: 'Widget 3', color: 'blue' },
    ]);

  })
  .post();

customRouter.route('/widgets/:widgetId')
  .get(function (req, res) {
    let findParams = parseInt(req.params.widgetId);
    res.json([
      { name: findParams },
    ]);
  })
  .put(function (req, res) {
    req.body.id = parseInt(req.params.widgetId);
  })
  .delete();

module.exports = customRouter;

/* it is actually same with the above
app.get('/api/widgets', function (req, res) {

  res.json([
    { name: 'Widget 1', color: 'blue' },
    { name: 'Widget 2', color: 'blue' },
    { name: 'Widget 3', color: 'blue' },
  ]);

});
*/
