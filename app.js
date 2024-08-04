$(function() {
  
  // your code here

  function getUserId(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${id}`,
        type: `GET`,
        success: function(response) {
          resolve(response)
          
        },
        error: function(error) {
          reject(error)
        }
      })
    })
  }

  function getUserPost(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${id}/posts`,
        type: `GET`,
        success: function(response) {
          resolve(response)
          
        },
        error: function(error) {
          reject(error)
        }
      })
    })
  }

  function getUserTodos(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${id}/todos`,
        type: `GET`,
        success: function(response) {
          resolve(response)
          
        },
        error: function(error) {
          reject(error)
        }
      })
    })
  }

  let user

  async function build(id) {
    user = await getUserId(id)
    const posts = await getUserPost(id)
    const todos = await getUserTodos(id)

    const infoImage = $('.info__image')
    const infoContent = $('.info__content')
    const postsContent = $('.posts')
    const toDosContent = $('.todos')

// Clear previous content
    infoContent.empty();
    postsContent.children('h3').children('div').remove();
    postsContent.children('ul').empty();
    toDosContent.children('h3').children('div').remove();
    toDosContent.children('ul').empty();

// info 
    infoImage.find('img').attr('src',`${user.image}`)
    infoContent.append(`<div class='name'>${user.firstName} ${user.lastName}</div>`);
    infoContent.append(`<div class='age'><span>Age</span>:${user.age}</div>`)
    infoContent.append(`<div class='email'><span>Email</span>:${user.email}</div>`)
    infoContent.append(`<div class='phone'><span>Phone</span>:${user.phone}</div>`)

// posts content
    postsContent.children('h3').append(`<div>${user.firstName}'s Posts</div>`)
    if(posts.total > 0){
      for(let i = 0; i < posts.total; i++) {
        postsContent.children('ul').append(`<h4>${posts.posts[i].title}</h4>`)
        postsContent.children('ul').append(`<li>${posts.posts[i].body}</li>`)
        postsContent.children('ul').append(`<li style='display:none'>${posts.posts[i].views}</li>`)
      }
    } else {
      postsContent.children('ul').append(`<li>user has no posts</li>`)
    }

// to dos content
    toDosContent.children('h3').append(`<div>${user.firstName}'s To Dos</div>`)
    if(todos.total > 0){
      for(let i = 0; i < todos.total; i++) {
        toDosContent.children('ul').append(`<li>${todos.todos[i].todo}</li>`)
      }
    } else {
      toDosContent.children('ul').append(`<li>user has no todos</li>`)
    }
  }

   // modal functionality
    $('.posts').on('click', 'h4', function() {
    const postTitle = $(this).text();
    const postBody = $(this).next('li').text();
    const postViews = $(this).next('li').next('li').text()

    const modal = $(`
      <div class='overlay'>
        <div class='modal'>
          <div class='modal-content'>
            <h4 class='modal-title'>${postTitle}</h4>
            <p class='modal-body'>${postBody}</p>
            <p><i>Views: ${postViews}</i></p>
          </div>
          <button class='close-modal'>Close Modal</button>
        </div>
      </div>
    `);

    $('body').append(modal);

    // Close modal event
    $('.close-modal, .overlay').on('click', function(event) {
      if (event.target === this || $(event.target).hasClass('close-modal')) {
        $('.overlay').fadeOut(() => {
          $('.overlay').remove();
        });
      }
    });
  });

  // slider
    $(document).on('click', '.posts h3', function() {
      $(this).siblings('ul').slideToggle()
    })
    $(document).on('click', '.todos h3', function() {
      $(this).siblings('ul').slideToggle()
    })

    // to get limit
  let limitId
  function getCurrentUserId() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users`,
        type: `GET`,
        success: function(response) {
          resolve(response)
          
        },
        error: function(error) {
          reject(error)
        }
      })
    })
  }
  async function getLimitId() {
    limitId = await getCurrentUserId()
    return limitId = limitId.limit
  }
  getLimitId()

// buttons
  const button = $('button')
  const nextBtn = $('button:nth-child(2)')
  const prevBtn = $('button:first-child').last()
  let currentId = 1

  prevBtn.on('click', async function() {
    if(currentId === 1) {
      currentId = limitId
    } else {
      currentId = currentId - 1
    }
    build(currentId)
    console.log('clicked prev')
    console.log(user.firstName)
  })

  nextBtn.on('click', function() {
    if(currentId === limitId) {
      currentId = 1
    } else {
      currentId = currentId + 1
    }
    build(currentId)
    console.log('clicked next')
  })

  build(currentId)
});
