document.addEventListener("DOMContentLoaded", function () {
  const my_id = JSON.parse(document.querySelector("#user_id").textContent);
  document.querySelector("#post-form").addEventListener("submit", create_post);
});


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
  })
}

function profile(user_id) {
    
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
  text_area.className = 'form-control save-text-field'
  
  text_area.value = document.querySelector(`#content-${post_id}`).innerHTML;
  document.querySelector(`#post-${post_id}`).innerHTML = "";
  document.querySelector(`#post-${post_id}`).append(text_area);
  document.querySelector(`#edit-post-${post_id}`).innerHTML = 'Save';
  document.querySelector(`#edit-post-${post_id}`).style.bottom = '20px'
  document.querySelector(`#edit-post-${post_id}`).addEventListener('click', () => save_post(post_id))
}

function save_post (post_id) {
  const content = document.querySelector(`#edit-content-${post_id}`).value;
  console.log(content)
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
  document.querySelector(`#edit-post-${post_id}`).style.bottom = '95px'
  document.querySelector(`#edit-post-${post_id}`).addEventListener('click', () => edit_post(post_id))


  return false;
  
}

function like_post (post_id) {
  fetch(`like_post/${post_id}`)
  .then(response => response.json())
  .then((data) => {
    if(data.like_or_unlike === 'like') {
      document.querySelector(`#like-icon-${post_id}`).className = 'bi bi-heart-fill';
      document.querySelector(`#like-icon-${post_id}`).innerHTML = '';
      document.querySelector(`#like-icon-${post_id}`).innerHTML = '<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>'
      document.querySelector(`#like-icon-${post_id}`).style.fill = '#ff0000'
    } else {
      document.querySelector(`#like-icon-${post_id}`).className = 'bi bi-heart';
      document.querySelector(`#like-icon-${post_id}`).innerHTML = '';
      document.querySelector(`#like-icon-${post_id}`).innerHTML = '<path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>'
      document.querySelector(`#like-icon-${post_id}`).style.fill = 'currentColor'
    }
    
    document.querySelector(`#post-${post_id}-like`).innerHTML = data.like_count;
  })
}