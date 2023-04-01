export function responseMiddleware(req, res, next) {
    res.sendSuccess = function(message, data) {
      res.status(200).json({
        success: true,
        message,
        data
      });
    };

    res.sendCreateSuccess = function(message, data) {
      res.status(201).json({
        success: true,
        message,
        data
      });
    };

    res.sendBadRequestError = function(message) {
      res.status(400).json({
        success: false,
        message
      });
    };

    res.sendNotfoundError = function(message) {
      res.status(404).json({
        success: false,
        message
      });
    };

    res.sendServerError = function(message) {
      res.status(500).json({
        success: false,
        message
      });
    };

    next();
  }
  