const { Court } = require("../models/adminModel"); // Adjust the path as needed

exports.getAllCourts = async (req, res) => {
    try {
      const courts = await Court.find({ isVerified: true }).populate("fileName"); // Optional: populate images
  
      res.status(200).json({ courts });
    } catch (error) {
      console.error("Error fetching courts:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  exports.getCourtById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const court = await Court.findById(id).populate("fileName"); // populate image details
  
      if (!court) {
        return res.status(404).json({ message: "Court not found" });
      }
  
      res.status(200).json(court);
    } catch (error) {
      console.error("Error fetching court by ID:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };