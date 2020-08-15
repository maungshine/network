document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#post-form").addEventListener("submit", create_post);
  document.querySelector("#following").addEventListener("click", following);
  document.querySelector("#profile").addEventListener("click", () => profile(1));
  load_all_posts();
});

function load_all_posts() {
  fetch("all_posts")
    .then((response) => response.json())
    .then((posts) => {
      load_posts(posts, "main_page");
    });
}

function load_posts(posts, id) {
  
      console.log(posts)
      for (let i = 0; i < posts.length; i++) {
        console.log(posts[i]);
        const post = posts[i]
        const postDiv = document.createElement('div');
        postDiv.className = "container";

        const username = document.createElement('h5');
        username.innerHTML = post.username

        const content = document.createElement('p');
        content.innerHTML = post.content

        postDiv.append(username)
        postDiv.append(content)
        postDiv.style.backgroundColor = '#dfdfdf'
        document.querySelector(`#${id}`).append(postDiv)
      }

      if(id === "main_page") {
        document.querySelector("#following_page").style.display = 'none';
        document.querySelector("#main_page").style.display = 'block';
      } else if (id === "following_page") {
        document.querySelector("#following_page").style.display = 'block';
        document.querySelector("#main_page").style.display = 'none';
      };
    
}

function create_post() {
  console.log('hello')
  const post_content = document.querySelector('#post-content').value;
  const csrf_token = Cookies.get('csrftoken');
  fetch("create_post", {
    method: 'POST',
    body : JSON.stringify({
      post_content: post_content
    }),
    headers : {'X-CSRFToken': csrf_token}
  })

  return false;
}

function following() {
  fetch('following')
  .then(response => response.json())
  .then((data) => {
    document.querySelector('#following_page').innerHTML = ""
    load_posts(data, "following_page");
  })
}

function profile(user_id) {
  fetch(`profile/${user_id}`)
  .then(response => response.json())
  .then((data) => {
    console.log(data)
  })
}