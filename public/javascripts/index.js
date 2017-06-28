(function () {
    var labels = document.querySelectorAll('.count-selector label');

    labels.forEach(function (label, i) {
        console.log(i);
        label.addEventListener('click', function (e) {
            console.log('come in');
            console.log(e.currentTarget);
        });
    })
}());