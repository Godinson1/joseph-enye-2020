export {};
const Places = require("../model/place_model");
const router = require("express").Router();
const config = require("config");
const axios = require("axios");
import { Auth } from "../middleware/auth";
import { Request, Response } from "express";

//Route for handling search requests
router.post(
  "/search",
  Auth,
  async (req: Request, res: Response): Promise<Response | void> => {
    let type: string;

    //Destructure data from request body
    const { query, latitude, longitude, distance } = req.body;

    //Define accepted keywords to search based on challenge requirements
    const accepted = [
      "medical",
      "hospital",
      "clinic",
      "medical office",
      "clinics",
      "medical offices",
      "pharmacy",
      "pharmacies",
      "hospitals",
      "medicals",
    ];

    //Check if query is among accepted queries
    const check = accepted.includes(query.toLowerCase());

    //If query is not accepted, return error for bad request
    if (!check)
      return res.status(400).json({
        error: "Incorrect Keyword! Use any of the search keyword suggested",
      });

    //Check if query equals pharmacy or pharmaices
    //Then store place type as pharmacy
    //Otherwise place type equals hospital
    if (query === "pharmacy" || query === "pharmacies") {
      type = "pharmacy";
    } else {
      type = "hospital";
    }

    console.log(req.user.firstName);

    //Handle request and trigger api
    try {
      const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${distance}&type=${type}&keyword=${query}&key=${config.get(
        "API_KEY"
      )}`;
      const response: any = await axios.get(URL, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      console.log(response);

      //Check if returned result is an empty array, them return NOT FOUND - Error
      //Otherwise Insert result of places into database
      if (response.data.results.length == 0) {
        return res.status(404).json({ error: "No Result Found" });
      } else {
        //Initialize bulk with places collection
        var bulk = Places.collection.initializeUnorderedBulkOp();

        //Map through results and insert in a bulk opertation
        response.data.results.map((response: any) => {
          const details = {
            placeId: response.place_id,
            name: response.name,
            vicinity: response.vicinity,
            lat: response.geometry.location.lat,
            lng: response.geometry.location.lng,
            rating: response.rating,
            userRating: response.user_ratings_total,
            icon: response.icon,
          };

          //Insert Places
          bulk.insert(details);

          //Update database with userId and time of search
          bulk.find({ placeId: response.place_id }).updateOne({
            $set: {
              createdAt: new Date().toISOString(),
              userId: req.user.userId,
            },
          });
        });

        //Execute bulk operation
        bulk.execute((err: any, result: any) => {
          if (err) console.log(err);
          return res.status(200).json({ data: response.data.results, result });
        });
      }
    } catch (err) {
      //Case of Error, Return Server Error with message
      console.log(err);
      return res.status(500).json({
        error: "Oops! Something went wrong..",
      });
    }
  }
);

module.exports = router;
