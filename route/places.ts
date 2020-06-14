export {};
const Places = require('../model/place_model');
const router = require('express').Router();
const config = require("config");
const axios = require('axios');


router.post('/search', async (req: any, res: any) : Promise<any> => {
    let type: string;
   
    const { query, latitude, longitude, distance, userId } = req.body;

    console.log(query, latitude, longitude, distance);
    
    const accepted = [
    "medical", "hospital", "clinic", "medical office", "clinics", "medical offices",
    "pharmacy", "pharmacies", "hospitals", "medicals"];
    const check = accepted.includes(query.toLowerCase());
    
    if(!check) return res.status(400).json({ error: "Incorrect Keyword! Use any of the search keyword suggested" });
    
    if(query === 'pharmacy' || query === 'pharmacies') {
        type = 'pharmacy'
    } else {
        type = 'hospital'
    }

    try {
        const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${distance}&type=${type}&keyword=${query}&key=${config.get("API_KEY")}`;
        const response : any = await axios.get(URL, {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });

        //Todo - Handle case in front end
        if(response.data.results.length == 0) {
            return res.status(404).json({ error: "No Result Found" });
        } else {
            var bulk = Places.collection.initializeUnorderedBulkOp();
        
            response.data.results.map((response: any) => {
             const details = {
                 placeId: response.place_id,
                 name: response.name,
                 vicinity: response.vicinity,
                 lat: response.geometry.location.lat,
                 lng: response.geometry.location.lng,
                 rating: response.rating,
                 userRating: response.user_ratings_total,
                 icon: response.icon
                }
                bulk.insert(details);
                bulk.find( { placeId: response.place_id } ).updateOne( { $set: {  
                    createdAt: new Date().toISOString(),
                    userId: userId 
                } } );
            });
     
            bulk.execute((err: any, result: any) => {
                if(err) console.log(err);
                return res.status(200).json({ data: response.data.results, result });
            })
        }    
       
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            error: "Oops! Something went wrong.."
        })
    }
});


module.exports = router;



