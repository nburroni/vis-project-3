(function () {

    let frameCount = 1;
    const maxFrames = 4;

    const frameBtns = document.getElementById('frame-btns');
    const addBtn = document.getElementById('add-frame');
    const removeBtn = document.getElementById('remove-frame');

    const resizeFrames = () => {
        const mapFrames = document.querySelectorAll('.map-iframe');
        mapFrames.forEach(f => {
            f.style.width = `${frameCount > 1 ? 49.8 : 100}%`;
            f.style.height = `${frameCount > 2 ? 50 : 100}%`
        });
        if (frameCount > 1) {
            frameBtns.classList.remove('right');
            frameBtns.classList.add('center');
        } else {
            frameBtns.classList.remove('center');
            frameBtns.classList.add('right');
        }
    };

    resizeFrames();

    var removeLast = function () {
        let body = document.querySelector('body');
        body.removeChild(body.lastChild);
    };

    addBtn.addEventListener('click', () => {
        if (frameCount >= maxFrames) return;
        frameCount++;
        const newFrame = document.createElement('iframe');
        newFrame.src = 'map.html';
        newFrame.classList.add('map-iframe');
        document.querySelector('body').appendChild(newFrame);
        resizeFrames();
    });
    removeBtn.addEventListener('click', () => {
        if (frameCount <= 1) return;
        frameCount--;
        removeLast();
        resizeFrames();
    });

})();