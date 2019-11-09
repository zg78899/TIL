let todos = [];

const $todos = document.querySelector('.todos');
const $input = document.querySelector('.input');

const render = data => {

  todos = data;
  
  let html = '';
  todos.forEach(({ id, content, completed }) => {
    html += `
   <li id="${id}">
      <label>
        <input type='checkbox' class='cb' ${completed ? 'checked' : ''}>
        <span class='content'>${content}<span>
      </label>
      <button class='remove'>X</button>
  </li>`;
  });
  $todos.innerHTML = html;
};

const get = (url, f) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send();
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      f(JSON.parse(xhr.response));
    } else {
      throw new Error(xhr.staus);
    }
  };
};

const post = (url,payload,f) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('content-type','application/json');
  xhr.send(JSON.stringify(payload));
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      f(JSON.parse(xhr.response));
    } else {
      throw new Error(xhr.staus);
    }
  };
};
const patch = (url,payload,f) => {
  const xhr = new XMLHttpRequest();
  xhr.open('PATCH', url);
  xhr.setRequestHeader('content-type','application/json');
  xhr.send(JSON.stringify(payload));
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      f(JSON.parse(xhr.response));
    } else {
      throw new Error(xhr.staus);
    }
  };
};
const del = (url,f) => {
  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', url);
  xhr.send();
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      f(JSON.parse(xhr.response));
    } else {
      throw new Error(xhr.staus);
    }
  };
};

const getTodos = () => {
  get('./todos', render);
}
window.onload =()=>{
  getTodos();
};

const generateId = () => {
  return todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
};

$input.onkeyup = ({ target, keyCode }) => {
  const content = $input.value.trim();
  if (content === '' || keyCode !== 13) return;
  target.value = '';
  post('./todos',{ id: generateId(), content, completed: false }, render);
};
$todos.onchange=({target})=>{
  const id=target.parentNode.id;
  const completed= !todos.find(todo=>todo.id === +id).completed;
  patch(`./todos/${id}`,{completed},render);

};
$todos.onclick=({target})=>{
if(!target.classList.conatins('remove'))return;
const id = target.parentNode.id;
del(`./todos/${id}`,render);
}
