const input = document.getElementById('input');
const listcontainer = document.getElementById('listcontainer');

function AddTask() {
    if (input.value == "" || input.value == null) {
        alert("Please, Input Something");
    } else {
        let list = document.createElement('li');
        list.innerText = input.value;
        listcontainer.appendChild(list);

        let SPAN = document.createElement("span");
        SPAN.innerHTML = "\u00d7"; // สัญลักษณ์ '×' สำหรับการลบ
        list.appendChild(SPAN); 

        input.value = "";  // เคลียร์ช่องกรอกข้อมูล
    }
}

listcontainer.addEventListener('click', function(x) {
    if (x.target.tagName === "LI") {  // ใช้ tagName (ตัว T ตัวใหญ่)
        x.target.classList.toggle('check');
    } else if (x.target.tagName === 'SPAN') {  // ใช้ tagName (ตัว T ตัวใหญ่)
        x.target.parentElement.remove();
    }
});
