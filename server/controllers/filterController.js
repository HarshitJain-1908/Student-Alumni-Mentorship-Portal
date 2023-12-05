// import alumni from "../models/alumniModel.js";
import { Alumni } from "../models/userModel.js";


const values = async (req, res) => {
  try {
      // Find all distinct alumni branches, batches, roles, companies, and countries in the database
      const branches = await Alumni.distinct('branch');
      const batches = await Alumni.distinct('batch');
      const roles = await Alumni.distinct('work.role');
      const companies = await Alumni.distinct('work.organization');
      const countries = await Alumni.distinct('location.country');
      
      const result = { branches, batches, roles, companies, countries };
      res.status(200).json(result);
      return result;
  
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
  }
};

const prefix = async (req, res) => {
    try {
        //filter alumni based on userName's prefix
        const result = await Alumni.find({ name: { $regex: '^' + req.query.prefix, $options: 'i' } });

        res.status(200).json({result});
        return result;
    
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
    }
};

const filter = async (req, res) => {

  try {
    const { batch, branch, current_role, current_organization ,current_location} = req.query;
    // const { batch, branch, current_role, current_organization } = req.params;
    const filters = {};

    if (branch) {
      filters.branch = branch;
    }
    if (batch) {
      filters.batch = parseInt(batch);
    }

    if (current_role) {
      filters["work.role"] = current_role;
    }
    if (current_organization) {
      filters["work.organization"] = current_organization;

    }

    if (current_location) {
      filters["location.country"] = current_location;
    }
    const result = await Alumni.find(filters);

    res.status(200).json({ result });
    return result;
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while filtering the profiles." });
  }
};

export { values, filter, prefix };

