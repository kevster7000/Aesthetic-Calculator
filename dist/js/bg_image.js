import { createApi } from "unsplash-js";

const api = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY
});

//TODO
//- The bg image will need a default image (unless we automatically call the API)



// unsplash API
// on each new background request, update image and credits

//for each image, check size
//if less than window width or height, you can do one of two things
// 1) set backgroun-size to cover
// 2) search for the next image

// ACTUALLY, I think you can search for a specific widthxhieght in the get req
