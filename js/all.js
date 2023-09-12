document.addEventListener('DOMContentLoaded', function() {
    const listGroup = document.querySelector('.list-group');
    const newitem = document.querySelector(".newitem");
    const addButton = document.querySelector(".addButton");
    const sortCheckbox = document.getElementById('flexSwitchCheckDefault');
    const clearButton = document.querySelector('.clear');
    const pendingCountElement = document.querySelector('.pending-count');
    const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    const toastBody = document.querySelector('.toast-body');

    let data = [
        { 
            category: "全部",
            todos: [
                { content: "Learn VueJs", completed: false, originalIndex: 0 },
                { content: "Code a todo list", completed: false, originalIndex: 1 },
                { content: "Learn something else", completed: false, originalIndex: 2 }
            ]
        }
    ];


    let isAnimating = false;

    // 新增代辦類別 分類模組
    $(document).ready(function(){
        document.getElementById('liveToastBtn').addEventListener('click', function() {
            const category = document.querySelector('.new-category').value;
            if (category !== "") {
                const newLi = document.createElement("li");
                newLi.className = "nav-item";
                newLi.innerHTML = `<a class="nav-link fw-bold" href="#">•${category}</a>`; //新增至漢堡選單
                document.querySelector('.navbar-nav').appendChild(newLi);

                // 更新下拉選單
                const newOption = document.createElement("li");
                newOption.innerHTML = `<a class="dropdown-item" href="#">${category}</a>`;
                document.querySelector('.category-menu').appendChild(newOption);

                // 將新類別加入到 data 陣列
                data.push({ category: category, todos: [] });

                toastBody.textContent = `「${category}」 已新增至右上角選單！`;
                toast.show();
                myModal.hide();
            }
        });


        document.querySelectorAll('.btn-close, .btn-secondary').forEach(function(element){
            element.addEventListener('click', function(){
                myModal.hide();
            });
        });
    });


    // 卡片導航欄
    function onNavLinkClick(event) { 
        event.preventDefault();
        const clickedNavLink = event.target;
        document.querySelectorAll('.nav-link').forEach(function(navLink) {
            navLink.classList.remove('active');
        });
        clickedNavLink.classList.add('active');
        const allCategoryTab = document.querySelector('.nav-link[data-category="all"]');
        if (clickedNavLink !== allCategoryTab) {
            allCategoryTab.textContent = clickedNavLink.textContent.trim();
        } else {
            allCategoryTab.textContent = '所有的分類';
        }
        renderData();
    }
    document.querySelectorAll('.nav-link').forEach(function(navLink) {
        navLink.addEventListener('click', onNavLinkClick);
    });


    // 渲染数据到 HTML
    function renderData() {
        if (isAnimating) return;
        listGroup.innerHTML = '';
        const selectedCategory = document.querySelector('.nav-link.active').textContent.trim();
        let sortedData = [];
        if (selectedCategory === '已完成' || selectedCategory === '未完成') {
            const completed = selectedCategory === '已完成';
            data.forEach(categoryObj => {
                sortedData = sortedData.concat(categoryObj.todos.filter(item => item.completed === completed));
            });
        } else {
            data.forEach(categoryObj => {
                sortedData = sortedData.concat([...categoryObj.todos]);
            });
        }
        sortedData.sort((a, b) => {
            if (sortCheckbox.checked) {
                return a.completed - b.completed;
            }
            return sortedData.indexOf(a) - sortedData.indexOf(b);
        });
        sortedData.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item py-3 px-4 mb-1 d-flex';
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
        const selectedCategory = document.querySelector('.nav-link.active').textContent.trim();
        let todos = [];
        if (selectedCategory === '已完成' || selectedCategory === '未完成') {
            const completed = selectedCategory === '已完成';
            data.forEach(categoryObj => {
                todos = todos.concat(categoryObj.todos.filter(item => item.completed === completed));
            });
        } else {
            data.forEach(categoryObj => {
                todos = todos.concat(categoryObj.todos);
            });
        }
        const pendingCount = todos.filter(item => !item.completed).length;
        pendingCountElement.textContent = '待完成項目' + pendingCount + '個';
    }


    
    

    // 新增待辦事項
    addButton.addEventListener('click', function(e) {
        if (newitem.value === "") {
            alert("請輸入內容");
            return;
        }
        const selectedCategory = document.querySelector('.nav-link.active').textContent.trim();
        const categoryObj = data.find(item => item.category === selectedCategory);
        categoryObj.todos.push({ content: newitem.value, completed: false });
        newitem.value = '';
        renderData();
    });
    

    // 刪除待辦事項
    listGroup.addEventListener('click', function(e) {
        const target = e.target;
        if (target.matches('.trash, .trash *')) {
            e.preventDefault();
            const listItem = target.closest('li');
            const index = [...listGroup.children].indexOf(listItem);
            const selectedCategory = document.querySelector('.nav-link.active').textContent.trim();
            const categoryObj = data.find(item => item.category === selectedCategory);
            listItem.classList.add('animate__animated', 'animate__backOutRight');
            isAnimating = true;
            toggleButtons(true);
            listItem.addEventListener('animationend', () => {
                isAnimating = false;
                toggleButtons(false);
                categoryObj.todos.splice(index, 1);
                renderData();
            });
        }
    });
    

    // 排序已完成項目
    sortCheckbox.addEventListener('change', function(e) {
        renderData();
    });

    // 初始化clearButton的顏色
    clearButton.style.color = "gray";

    // 更新clearButton的顏色
    listGroup.addEventListener('click', function() {
        const completedItems = Array.from(listGroup.children).filter(listItem =>
            listItem.querySelector('input').checked
        );
        clearButton.style.color = completedItems.length === 0 ? "gray" : "red";
    });



    // 清除所有已完成的任務
    clearButton.addEventListener('click', function(e) {
        e.preventDefault();
        const completedItems = Array.from(listGroup.children).filter(listItem =>
            listItem.querySelector('.form-check-input').checked
        );
        if (completedItems.length === 0) return;
        completedItems.forEach(listItem => {
            listItem.classList.add('animate__animated', 'animate__hinge');
        });
        isAnimating = true;
        toggleButtons(true);
        completedItems[completedItems.length - 1].addEventListener('animationend', () => {
            isAnimating = false;
            toggleButtons(false);
            data.forEach(category => {
                category.todos = category.todos.filter(todo => !todo.completed);
            });
            renderData();
        });
    });
    

    

    // 檢查畫面是否有動畫正在執行
    function toggleButtons(disabled) {
        addButton.disabled = disabled;
        sortCheckbox.disabled = disabled;
        clearButton.disabled = disabled;
        document.querySelectorAll('.form-check-input').forEach(function(checkbox) {
            checkbox.disabled = disabled;
        });
        document.querySelectorAll('.trash').forEach(function(trash) {
            trash.style.pointerEvents = disabled ? 'none' : 'auto';
        });
    }

    // 初始化时调用一次，以确保正确显示初始任务数量
    renderData();
});