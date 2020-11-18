let list = $('.task-list');
let btn = $('.btn');
let inp = $('.task-input');
let inp1 = $('.edit-inp1')
let inp2 = $('.edit-inp2')
let inp3 = $('.edit-inp3')
let name = $('#name');
let surname = $('#surname');
let phone = $('#phone');
let page = 1;
let pageCount = 1;
let searchValue = '';


$('.search-inp').on('input', function (e) {
    searchValue = e.target.value
    render()
})


function getPagination() {
    fetch('http://localhost:8003/contacts')
        .then(res => res.json())
        .then(data => {
            pageCount = Math.ceil(data.length / 2)
            $('.pagination-page').remove()
            for (let i = pageCount; i >= 1; i--) {
                $('.previous-btn').after(`                 
        <span class="pagination-page">
        <a href="#" alt="...">
        ${i}
        </a>
        </span>
        `)
            }
        })
}

$('body').on('click', '.pagination-page', function (event) {
    page = event.target.innerText
    render()
})


btn.on('click', function () {
    if (!name.val().trim() || !surname.val().trim() || !phone.val().trim()) {
        alert('Fill in the field')
        return
    }
    let newTask = {
        inpName: name.val(),
        inpSurname: surname.val(),
        inpPhone: phone.val()
    }
    postNewTask(newTask)
    name.val('');
    surname.val('');
    phone.val('')
})

function postNewTask(newTask) {
    fetch('http://localhost:8003/contacts', {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(() => render())
}

function render() {
     fetch(`http://localhost:8003/contacts?_page=${page}&_limit=2&q=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            list.html('')
            getPagination()
            data.forEach(item => {
                list.append(`<li id="${item.id}">
        ${item.inpName} ${item.inpSurname} ${item.inpPhone}
        <button class="btn-delete">Delete</button>
        <button class="btn-edit">Edit</button>
        </li>`)
            })
        })
}

$('body').on('click', '.btn-delete', function (event) {
    let id = event.target.parentNode.id
    fetch(`http://localhost:8003/contacts/${id}`, {
        method: 'DELETE'
    })
        .then(() => render())
})

$('body').on('click', '.btn-edit', function (event) {
    let id = event.target.parentNode.id
    fetch(`http://localhost:8003/contacts/${id}`)
        .then(res => res.json())
        .then(data => {
            inp1.val(data.inpName)
            inp2.val(data.inpSurname)
            inp3.val(data.inpPhone)
            $('.btn-save').attr('id', id)
            $('.main-modal').css('display', 'block')
        })
})

$('.btn-save').on('click', function (event) {
    let id = event.target.id
    let obj = {
        inpName: inp1.val(),
        inpSurname: inp2.val(),
        inpPhone: inp3.val()
    }
    // let editValue = $('.edit-inp').val()
    fetch(`http://localhost:8003/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(obj),
        headers: { 'Content-type': 'application/json' }
    })
        .then(() => {
            render()
            $('.main-modal').css('display', 'none')
        })
})

$('.next-btn').on('click', function () {
    if (page >= pageCount) return
    page++
    render()
})
render()

$('.previous-btn').on('click', function () {
    if (page <= 1) return
    page--
    render()
})

render()