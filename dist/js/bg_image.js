import { createApi } from "unsplash-js";

const api = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY
});

const unsplashImage = document.getElementById('unsplash-image');
const changeImageButton = document.getElementById('change-image-btn');

const fetchImage = async () => {
    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: process.env.REACT_APP_UNSPLASH_ACCESS_KEY
            }
        });

        unsplashImage.src = response.data.urls.regular;
    } catch (error) {
        console.error('Error fetching image:', error);
    }
};

changeImageButton.addEventListener('click', fetchImage);

fetchImage();