export function preloadImages(images) {
    let loadedImages = 0;
    let newImages = [];
    return new Promise(((resolve, reject) => {
        for (let i =0;i<images.length;i++){
            newImages[i] = new Image();
            newImages[i].src = images[i];
            newImages[i].onload = function(){
                loadedImages++;
                if(loadedImages == images.length){
                    resolve();
                }
            }
            newImages[i].onerror = function(){
                reject();
            }
        }
    }))
}