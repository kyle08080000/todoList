document.addEventListener('DOMContentLoaded', function() {
    const listGroup = document.querySelector('.list-group');
    const newitem = document.querySelector(".newitem");
    const addButton = document.querySelector(".addButton");
    const sortCheckbox = document.getElementById('flexSwitchCheckDefault');
    const clearButton = document.querySelector('.clear');
    const pendingCountElement = document.getElementById('pending-count');

    let data = [
        { content: "蝦皮電商系統", completed: false, originalIndex: 0 },
        { content: "咖啡", completed: false, originalIndex: 1 },
        { content: "告訴 steven 不要再暈船了", completed: false, originalIndex: 2 },
    ];

    // 渲染数据到 HTML
    function renderData() {
        listGroup.innerHTML = '';
        const sortedData = [...data].sort((a, b) => {
            if (sortCheckbox.checked) {
                return a.completed - b.completed || a.originalIndex - b.originalIndex;
            }
            return a.originalIndex - b.originalIndex;
        });
        sortedData.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item py-3 px-4 mb-1 d-flex';
            listItem.setAttribute('data-original-index', item.originalIndex);
            listItem.innerHTML = `
                <div class="overflow-auto me-auto">
                    <span class="task-name px-2 text-nowrap text-break ${item.completed ? 'striked' : ''}">${item.content}</span>
                </div>
                <div class="actions text-nowrap ms-3">
                    <input class="form-check-input me-3" type="checkbox" aria-label="..." ${item.completed ? 'checked' : ''}>
                    <a href="#" class="trash">
                        <i class="fas fa-trash"></i>
                    </a>
                </div>
            `;
            const checkbox = listItem.querySelector('.form-check-input');
            checkbox.addEventListener('change', function() {
                item.completed = checkbox.checked;
                if (sortCheckbox.checked) {
                    renderData();
                } else {
                    const taskName = listItem.querySelector('.task-name');
                    taskName.classList.toggle('striked', item.completed);
                    updatePendingCount();
                }
            });
            listGroup.appendChild(listItem);
        });
        updatePendingCount();
    }

    // 更新待完成任务数量
    function updatePendingCount() {
        const pendingCount = data.filter(item => !item.completed).length;
        pendingCountElement.textContent = '待完成項目' + pendingCount + '個';
    }

    // 更改完成状态
    listGroup.addEventListener('change', function(e) {
        const target = e.target;
        if (target.matches('.trash, .trash *')) {
            e.preventDefault();
            const listItem = target.closest('li');
            const originalIndex = parseInt(listItem.getAttribute('data-original-index'), 10);
            listItem.classList.add('animate__animated', 'animate__backOutRight');
            listItem.addEventListener('animationend', () => {
                data = data.filter(item => item.originalIndex !== originalIndex);
                renderData();
            });
        }
    });

    // 新增待辦事項
    addButton.addEventListener('click', function(e) {
        if (newitem.value === "") {
            alert("請輸入內容");
            return;
        }
        data.push({ content: newitem.value, completed: false, originalIndex: data.length });
        newitem.value = '';
        renderData();
    });

    // 刪除待辦事項
    listGroup.addEventListener('click', function(e) {
        const target = e.target;
        if (target.matches('.trash, .trash *')) {
            e.preventDefault();
            const listItem = target.closest('li');
            const originalIndex = parseInt(listItem.getAttribute('data-original-index'), 10);
            listItem.classList.add('animate__animated', 'animate__backOutRight');
            listItem.addEventListener('animationend', () => {
                data = data.filter(item => item.originalIndex !== originalIndex);
                renderData();
            });
        }
    });

    // 排序已完成項目
    sortCheckbox.addEventListener('change', function(e) {
        renderData();
    });

    // 清除所有已完成的任務
    clearButton.addEventListener('click', function(e) {
        e.preventDefault();
        data = data.filter(item => !item.completed);
        renderData();
    });

    // 初始化时调用一次，以确保正确显示初始任务数量
    renderData();
});
