import { createApi } from "unsplash-js";

const api = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY
});

//TODO
//- The bg image will need a default image (unless we automatically call the API)