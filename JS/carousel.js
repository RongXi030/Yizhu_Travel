const imageSection = document.getElementById('imageSection');
const videoSection = document.getElementById('videoSection');
const myVideo = document.getElementById('introVideo');
const btnImage = document.getElementById('btnImage');
const btnVideo = document.getElementById('btnVideo');

function switchTo(mode) {
    if (mode === 'image') {
        imageSection.classList.remove('d-none');
        videoSection.classList.add('d-none');
        
        myVideo.pause();

        btnImage.classList.add('active');
        btnVideo.classList.remove('active');

    } else if (mode === 'video') {
        imageSection.classList.add('d-none');
        videoSection.classList.remove('d-none');
        
        myVideo.currentTime = 0;
        myVideo.play();

        btnImage.classList.remove('active');
        btnVideo.classList.add('active');
    }
}

myVideo.addEventListener('ended', () => {
    switchTo('image');
});


window.addEventListener('load', () => {
    myVideo.play().catch(error => {
        console.log("自動播放", error);
    });
});