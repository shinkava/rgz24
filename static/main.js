function fillGoodList() {
    fetch('/rgz/api/goods/')
    .then(function(data) {
        return data.json();
    })
    .then(function(goods) {
        let tbody = document.getElementById('good-list');
        tbody.innerHTML = '';
        for(let i = 0; i<goods.length; i++) {
            tr = document.createElement('tr');

            let tdArticul = document.createElement('td');
            tdArticul.innerHTML = goods[i].articul;

            let tdName = document.createElement('td');
            tdName.innerHTML = goods[i].name;

            let tdCount = document.createElement('td');
            tdCount.innerHTML = goods[i].count;

            let editButton = document.createElement('button');
            editButton.innerHTML = 'Edit'
            editButton.onclick = function() {
                editGood(i, goods[i]);
            }

            let delButton = document.createElement('button')
            delButton.innerHTML = 'Delete'
            delButton.onclick = function() {
                deleteGood(i);
            }

            let tdActions = document.createElement('td');
            tdActions.append(editButton);
            tdActions.append(delButton);

            tr.append(tdArticul)
            tr.append(tdName)
            tr.append(tdCount)
            tr.append(tdActions)

            tbody.append(tr)
        }
    })
}

function deleteGood(num) {
    if(! confirm('Вы точно хотите удалить товар?'))
        return;

    fetch(`/rgz/api/goods/${num}`, {method: 'DELETE'})
    .then(function() {
        fillGoodList();
    })
}

function showModal() {
    document.querySelector('div.modal').style.display = 'block';
}

function hideModal() {
    document.querySelector('div.modal').style.display = 'none';
}

function cancel() {
    hideModal();
}

function addGood() {
    document.getElementById('num').value = '';
    document.getElementById('articul').value = '';
    document.getElementById('name').value = '';
    document.getElementById('count').value = '';

    showModal();
}

function sendGood() {
    const num = document.getElementById('num').value;
    const goods = {
        articul: document.getElementById('articul').value,
        name: document.getElementById('name').value,
        count: document.getElementById('count').value
    }

    const url = `/rgz/api/goods/${num}`;
    const method = num ? 'PUT': 'POST';
    fetch(url, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(goods)
    })
    .then(function() {
        fillGoodList();
        hideModal();
    })
}

function editGood(num, good) {
    document.getElementById('num').value = num;
    document.getElementById('articul').value = good.articul;
    document.getElementById('name').value = good.name;
    document.getElementById('count').value = good.count;
    showModal();
}

function fillOrderList() { 
    fetch('/rgz/api/orders/') 
      .then(function (response) { 
        return response.json(); 
      }) 
      .then(function (orders) { 
        let tbody = document.getElementById('order-list'); 
        tbody.innerHTML = ''; 
        for (let i = 0; i < orders.length; i++) { 
          let tr = document.createElement('tr'); 
  
          let tdID = document.createElement('td'); 
          tdID.innerHTML = orders[i].ID; 
  
          let tdProducts = document.createElement('td'); 
          let products = '';
          for (let j = 0; j < orders[i].products.length; j++) {
            products += `${orders[i].products[j].name} (${orders[i].products[j].count})`
          }
          tdProducts.innerHTML = products.slice();
  
          let tdStatus = document.createElement('td'); 
          tdStatus.innerHTML = orders[i].status; 
  
          let editButton = document.createElement('button'); 
          editButton.innerHTML = 'Edit'; 
          editButton.onclick = function () { 
            updateOrder(i, orders[i]); 
          }; 
  
          let tdActions = document.createElement('td'); 
          tdActions.appendChild(editButton); 
  
          tr.appendChild(tdID); 
          tr.appendChild(tdProducts); 
          tr.appendChild(tdStatus); 
          tr.appendChild(tdActions); 
  
          tbody.appendChild(tr); 
      }
    }); 
  } 
  
  function createOrder() {
    document.getElementById('num').value = '';
    document.getElementById('ID').value = '';
    document.getElementById('status').value = '';
  
    sessionStorage.removeItem('products');
  
    showModal();
  }
  
  function addProduct() { 
    const articul = document.getElementById('articul').value; 
    const count = document.getElementById('count').value; 
    const name = document.getElementById('name').value; 
  
    if (!sessionStorage.getItem('products')) { 
      sessionStorage.setItem('products', JSON.stringify([])); 
    } 
  
    const products = JSON.parse(sessionStorage.getItem('products')); 
    products.push({ articul, count, name }); 
    sessionStorage.setItem('products', JSON.stringify(products)); 
  
    document.getElementById('articul').value = ''; 
    document.getElementById('name').value = ''; 
    document.getElementById('count').value = ''; 
  }
  
  function sendOrder() {   
    const num = document.getElementById('num').value;  
    const products = JSON.parse(sessionStorage.getItem('products')); 
    const orders = {   
      ID: document.getElementById('ID').value,   
      products: products,   
      status: document.getElementById('status').value,   
    };   
  
    const method = num ? 'PUT' : 'POST';   
    const url = `/rgz/api/orders/${num || ''}`;   
    fetch(url, {   
      method: method,   
      headers: { 'Content-Type': 'application/json' },   
      body: JSON.stringify(orders),   
    })   
      .then(function () {   
        sessionStorage.removeItem('products');
        fillOrderList();   
        hideModal();   
      });   
  } 
  
  function updateOrder(num, order) { 
    document.getElementById('num').value = num; 
    document.getElementById('ID').value = order.ID; 
    document.getElementById('status').value = order.status; 
  
    sessionStorage.setItem('products', JSON.stringify(order.products));
    showModal(); 
  }
  