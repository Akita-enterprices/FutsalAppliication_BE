const Review = require("../models/reviewModel");

// Create a new review
exports.createReview = async (req, res) => {
  const review = new Review(req.body);
  try {
    await review.save();
    res.status(201).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).send();
    }
    res.status(200).send(review);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      return res.status(404).send();
    }
    res.status(200).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).send();
    }
    res.status(200).send(review);
  } catch (error) {
    res.status(500).send(error);
  }
};
