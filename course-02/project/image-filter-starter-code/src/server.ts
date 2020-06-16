import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { request } from 'http';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    
    //Get image URL from query
    let imageURL = req.query.imageURL;
    
    //Make sure imageURL is not empty
    if ( !imageURL ) {
     return res.status(400)
               .send(`URL is required`);
   }

   //Check if the URL format is valid
   try {
    const myURL = new URL(imageURL);
   } catch (e) {
    return res.status(422).send(`URL is not valid`);
}

   //Create filtered image
   let absolutePath = await filterImageFromURL(imageURL);

   //Add a function to clean up image file after its been sent to client
   res.on('finish', async function() {  
    let files: string[] = [absolutePath];

    await deleteLocalFiles(files);
  });
  
    //Return a success code and the filtered image to the client
    return res.status(200).sendFile(absolutePath);
    
} );

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();