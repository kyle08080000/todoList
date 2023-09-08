document.addEventListener('DOMContentLoaded', function() {
    const listGroup = document.querySelector('.list-group');

    listGroup.addEventListener('change', function(event) {
        if (event.target && event.target.matches('.form-check-input')) {
            const checkbox = event.target;
            const taskName = checkbox.closest('li').querySelector('.task-name');

            if (checkbox.checked) {
                taskName.classList.remove('unstriked');
                taskName.classList.add('striked');
            } else {
                taskName.classList.remove('striked');
                taskName.classList.add('unstriked');
            }
        }
    });

    listGroup.addEventListener('animationend', function(event) {
        if (event.target && event.target.matches('.task-name') && event.animationName === "unstrike") {
            event.target.classList.remove('unstriked');
        }
    });

    // 待辦事項 list 邏輯
    const newitem = document.querySelector(".newitem");
    const addButton = document.querySelector(".addButton");

    let data = [
        {
            content: "蝦皮電商系統",
            completed: false,
        },
        {
            content: "咖啡",
            completed: false,
        },
        {
            content: "告訴 seteven 他很臭",
            completed: false,
        },
    ];

    // 渲染資料到 HTML
    function renderData() {
        let str = "";
        data.forEach(function (item, index) {
            str += `<li class="list-group-item py-3 px-4 mb-1 d-flex" data-num="${index}">
            <div class="overflow-auto me-auto">
                <span class="task-name px-2 text-nowrap text-break ${item.completed ? 'striked' : ''}">${item.content}</span>
            </div>
            <div class="actions text-nowrap ms-3">
                <input class="form-check-input me-3" type="checkbox" value="" aria-label="..." ${item.completed ? 'checked' : ''}>
                <a href="#" class="trash">
                    <i class="fas fa-trash"></i>
                </a>
            </div>
            </li>`;
        });
        listGroup.innerHTML = str;
    }
    renderData();

    // 更改完成狀態
    listGroup.addEventListener("change", function (e) {
        if (e.target.type === "checkbox") {
            const parentLi = e.target.closest('li');
            if (parentLi) {
                const num = parentLi.getAttribute('data-num');
                data[num].completed = e.target.checked;
                updatePendingCount();
            }
        }
    });

    // 新增待辦事項
    addButton.addEventListener("click", function (e) {
        if (newitem.value == "") {
            alert("請輸入內容");
            return;
        }
        let obj = {};
        obj.content = newitem.value;
        obj.completed = false;
        console.log(obj);
        data.push(obj);
        renderData();
        updatePendingCount();
    });

    // 刪除待辦事項和更改完成狀態
    listGroup.addEventListener("click", function (e) {
        const target = e.target;
        const parentLi = target.closest('li');

        if (!parentLi) return;

        const index = parentLi.getAttribute('data-num');

        if (target.classList.contains('form-check-input')) {
            data[index].completed = target.checked;
            updatePendingCount();
        }

        if (target.classList.contains('fas') && target.classList.contains('fa-trash')) {
            data.splice(index, 1);
            renderData();
            updatePendingCount();
        }
    });

    // 更新待完成任務數量
    function updatePendingCount() {
        const pendingCount = data.filter(item => !item.completed).length;
        document.getElementById('pending-count').textContent = '待完成項目' + pendingCount + '個';
    }

    // 初始化時調用一次，以確保正確顯示初始任務數量
    updatePendingCount();

    // 清除所有已完成的任務
    document.querySelector('.clear').addEventListener('click', function (e) {
        e.preventDefault();
        data = data.filter(item => !item.completed);
        renderData();
        updatePendingCount();
    });




});
