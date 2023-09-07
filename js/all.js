document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.querySelector('.form-check-input');
    const taskName = document.querySelector('.task-name');

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            taskName.classList.remove('unstriked');
            taskName.classList.add('striked');
        } else {
            taskName.classList.remove('striked');
            taskName.classList.add('unstriked');
        }
    });

    taskName.addEventListener('animationend', function(event) {
        if (event.animationName === "unstrike") {
            taskName.classList.remove('unstriked');
        }
    });
});
