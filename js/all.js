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
            content: "蝦皮電商系統"
        },
        {
            content: "咖啡"
        },
        {
            content: "告訴 seteven 他很臭"
        }
    ];
    function renderData() {
        let str = "";
        data.forEach(function(item,index){
            str += `<li class="list-group-item py-3 px-4 mb-1 d-flex" data-num="${index}">
            <div class="overflow-auto me-auto">
                <span class="task-name px-2 text-nowrap text-break">${item.content}</span>
            </div>
            <div class="actions text-nowrap ms-3">
                <input class="form-check-input me-3" type="checkbox" value="" aria-label="...">
                <a href="#" class="trash">
                    <i class="fas fa-trash"></i>
                </a>
            </div>
            </li>`
        })
        listGroup.innerHTML = str;
    }
    renderData();

    // 新增待辦功能
    addButton.addEventListener("click", function(e){
        if(newitem.value == ""){
            alert("請輸入內容");
            return;
        }
        let obj = {};
        obj.content = newitem.value;
        console.log(obj);
        data.push(obj);
        renderData();
    })

    // 刪除待辦功能
    listGroup.addEventListener("click", function(e) {
        if (e.target.classList.contains('fas') && e.target.classList.contains('fa-trash')) {
            // 使用 closest 方法找到最近的父 li 元素
            let parentLi = e.target.closest('li');

            if (parentLi) {
                let num = parentLi.getAttribute('data-num');
                if (num !== null) {
                    data.splice(num, 1);
                    renderData();
                }
            }
        }
    });



});
