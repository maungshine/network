document.addEventListener("DOMContentLoaded", function () {
  const my_id = JSON.parse(document.querySelector("#user_id").textContent);
  document.querySelector("#post-form").addEventListener("submit", create_post);
  // document.querySelector("#following").addEventListener("click", following);
  // document.querySelector("#profile").addEventListener("click", () => profile(my_id));
  // load_all_posts();
});

// function load_all_posts() {
//   fetch("all_posts")
//     .then((response) => response.json())
//     .then((posts) => {
//       load_posts(posts, "main_page");
//     });
// }

// function load_posts(posts, id) {
  
//       console.log(posts)
//       for (let i = 0; i < posts.length; i++) {
//         console.log(posts[i]);
//         const post = posts[i]
//         const postDiv = document.createElement('div');
//         postDiv.className = "container";

//         const username = document.createElement('h5');
//         username.innerHTML = post.username
//         username.id = "post-username"
        
//         username.addEventListener('click', () => profile(post.user_id))

//         const content = document.createElement('p');
//         content.innerHTML = post.content

//         postDiv.append(username)
//         postDiv.append(content)
//         postDiv.style.backgroundColor = '#dfdfdf'
//         document.querySelector(`#${id}`).append(postDiv)
//       }

//       if(id === "main_page") {
//         document.querySelector("#following_page").style.display = 'none';
//         document.querySelector("#main_page").style.display = 'block';
//         document.querySelector('#profile-div').style.display = 'none';
//       } else if (id === "following_page") {
//         document.querySelector("#following_page").style.display = 'block';
//         document.querySelector("#main_page").style.display = 'none';
//         document.querySelector('#profile-div').style.display = 'none';
//       }
    
// }

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
    // load_posts(data, "following_page");
  })
}

function profile(user_id) {
  // fetch(`profile/${user_id}`)
  // .then(response => response.json())
  // .then((data) => {
  //   console.log(data)
  //   document.querySelector("#name").innerHTML = data[0][0].name
  //   document.querySelector("#no-of-follower").innerHTML = data[0][0].followers.length + " follower(s)"
  //   document.querySelector("#no-of-following").innerHTML = data[0][0].following.length + " following"
  //   document.querySelector("#email").innerHTML = data[0][0].email
    
    fetch(`is_following/${user_id}`)
    .then(response => response.json())
    .then((is_following) => {
      console.log(is_following.is_following)
      
     
      if(is_following.is_following) {
        document.querySelector("#follow").innerHTML = 'Unfollow';
        document.querySelector("#follow").addEventListener('click', () => follow_or_unfollow('unfollow', user_id))
        
      } else {
        document.querySelector("#follow").innerHTML = 'Follow';
        document.querySelector("#follow").addEventListener('click', () => follow_or_unfollow('follow', user_id))
        
      }

    })

    // load_posts(data[1], "profile-div");

    // document.querySelector("#main_page").style.display = 'none';
    // document.querySelector("#following_page").style.display = 'none';
    // document.querySelector("#profile-div").style.display = 'block';
  
}

function follow_or_unfollow (choice, user_id) {
  fetch(`follow_or_unfollow/${choice}/${user_id}`)
  .then(response => response.json())
  .then((result) => {
    console.log(result)
    if(choice === 'follow') {
      document.querySelector("#follow").style.display = 'none';
      document.querySelector("#unfollow").style.display = 'block';
    } else {
      document.querySelector("#unfollow").style.display = 'none';
      document.querySelector("#follow").style.display = 'block';
    }

  fetch(`follower_following/${user_id}`)
  .then(response => response.json())
  .then((data) => { 
  document.querySelector('#no-of-follower').innerHTML = data.follower + ' follower(s)';
  document.querySelector('#no-of-following').innerHTML = data.following + ' following';
  })
    
    return result.follow_or_unfollow
  })
} 

function edit_post(post_id) {
  const text_area = document.createElement('textarea');
  text_area.id = `edit-content-${post_id}`
  text_area.value = document.querySelector(`#content-${post_id}`).innerHTML;
  document.querySelector(`#post-${post_id}`).innerHTML = "";
  document.querySelector(`#post-${post_id}`).append(text_area);
  document.querySelector(`#edit-post-${post_id}`).innerHTML = 'Save';
  document.querySelector(`#edit-post-${post_id}`).addEventListener('click', () => save_post(post_id))
}

function save_post (post_id) {
  const content = document.querySelector(`#edit-content-${post_id}`).value;
  const csrf_token = Cookies.get('csrftoken');
  fetch(`save_post/${post_id}`, {
    method: 'POST',
    body : JSON.stringify({
      post_content: content
    }),
    headers : {'X-CSRFToken': csrf_token}
  })

  const new_post_content = document.createElement('p');
  new_post_content.innerHTML = content;
  new_post_content.id = `content-${post_id}`
  document.querySelector(`#post-${post_id}`).innerHTML = "";
  document.querySelector(`#post-${post_id}`).append(new_post_content);
  document.querySelector(`#edit-post-${post_id}`).innerHTML = 'Edit';
  document.querySelector(`#edit-post-${post_id}`).addEventListener('click', () => edit_post(post_id))


  return false;
  
}