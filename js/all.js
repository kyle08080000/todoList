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

    document.querySelector('.nav-tabs .Category').textContent = '全部';
    let isAnimating = false;

    // 新增代辦類別 分類模組
    initializeCategoryModule();

    // 卡片導航欄
    initializeCardNav();

    // 新增待辦事項
    initializeAddTodo();

    // 刪除待辦事項
    initializeDeleteTodo();

    // 排序已完成項目
    initializeSortCompleted();

    // 清除所有已完成的任務
    initializeClearCompleted();

    // 初始化時調用一次，以確保正確顯示初始任務數量
    renderData();




    // 新增代辦類別 分類模組
    function initializeCategoryModule() {
        // ... 這裡的代碼負責處理新增代辦類別的功能
        $(document).ready(function(){
            document.getElementById('liveToastBtn').addEventListener('click', function() {
                const category = document.querySelector('.new-category').value;
                if (category !== "") {
                    const newLi = document.createElement("li");
                    newLi.className = "nav-item";
                    newLi.innerHTML = `<a class="bar-nav-link nav-link fw-bold" href="#">•${category}</a>`; //新增至漢堡選單
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
            // 漢堡選單
            document.querySelectorAll('.navbar-nav .nav-link').forEach(function(navLink) {
                navLink.addEventListener('click', function(event) {
                    const clickedCategory = event.target.textContent.trim(); 
                    const allCategoryTab = document.querySelector('.nav.nav-tabs .Category');
                    allCategoryTab.textContent = clickedCategory;
                    renderData(clickedCategory);
                });
            });
            
        });
    }

    // 卡片導航欄
    function initializeCardNav() {
        // ... 這裡的代碼負責處理卡片導航欄的功能
        function onNavLinkClick(event) { 
            event.preventDefault();
            const clickedNavLink = event.target;
            document.querySelectorAll('.nav-link').forEach(function(navLink) {
                navLink.classList.remove('active');
            });
            clickedNavLink.classList.add('active');
            renderData();
        }
        
        document.querySelectorAll('.nav-link').forEach(function(navLink) {
            navLink.addEventListener('click', onNavLinkClick);
        });
    }

    // 新增待辦事項
    function initializeAddTodo() {
        // ... 這裡的代碼負責處理新增待辦事項的功能
        addButton.addEventListener('click', function(e) {
            if (newitem.value === "") {
                alert("請輸入內容");
                return;
            }

            const activeNavLink = document.querySelector('.nav-link.active');
            const selectedCategory = activeNavLink ? activeNavLink.textContent.trim() : "全部";
            const categoryObj = data.find(item => item.category === selectedCategory);

            categoryObj.todos.push({ content: newitem.value, completed: false });
            newitem.value = '';
            renderData();
        });
    }

    // 刪除待辦事項
    function initializeDeleteTodo() {
        // ... 這裡的代碼負責處理刪除待辦事項的功能
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
    }

    // 排序已完成項目
    function initializeSortCompleted() {
        // ... 這裡的代碼負責處理排序已完成項目的功能
        sortCheckbox.addEventListener('change', function(e) {
            renderData();
        });
    }

    // 清除所有已完成的任務
    function initializeClearCompleted() {
        // ... 這裡的代碼負責處理清除所有已完成的任務的功能
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
    }

    // 渲染数据到 HTML
    function renderData() {
        // ... 這裡的代碼負責處理渲染數據到HTML的功能
        // 檢查是否有動畫正在運行
        if (isAnimating) return;
        // 清除當前列表
        listGroup.innerHTML = '';
        // 獲取當前選定的類別
        const selectedCategory = document.querySelector('.nav-link.active').textContent.trim();
        let sortedData = [];
        // 檢查選定的類別是否為 '已完成' 或 '未完成'
        if (selectedCategory === '已完成' || selectedCategory === '未完成') {
            // 確定項目是否已完成
            const completed = selectedCategory === '已完成';
            // 根據選定的類別過濾數據
            data.forEach(categoryObj => {
                sortedData = sortedData.concat(categoryObj.todos.filter(item => item.completed === completed));
            });
        } else {
            // 找到選定類別的數據
            const categoryObj = data.find(item => item.category === selectedCategory);
            sortedData = sortedData.concat([...categoryObj.todos]);
        }
        // 根據選定的排序方式對數據進行排序
        sortedData.sort((a, b) => {
            if (sortCheckbox.checked) {
                return a.completed - b.completed;
            }
            return sortedData.indexOf(a) - sortedData.indexOf(b);
        });
        // 渲染排序後的數據到 HTML
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
            // 監聽 checkbox 的變化
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
        // ... 這裡的代碼負責處理更新待完成任務數量的功能
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

    // 檢查畫面是否有動畫正在執行
    function toggleButtons(disabled) {
        // ... 這裡的代碼負責處理檢查畫面是否有動畫正在執行的功能
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
});
