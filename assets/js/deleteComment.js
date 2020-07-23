import axios from "axios";

const deleteBtn = document.getElementsByClassName("jsDeleteBtn");
const commentNumUpdate = document.getElementById("jsCommentNumber");

const decreaseNum = () => {
  commentNumUpdate.innerHTML = parseInt(commentNumUpdate.innerHTML) - 1;
  alert("Delete Your Comment!");
};

const removeComment = target => {
  const ul = target.previousSibling.parentNode.parentNode;
  const li = target.previousSibling.parentNode;
  ul.removeChild(li);

  decreaseNum();
};

const getComment = async event => {
  event.preventDefault();
  const videoId = window.location.href.split("/videos/")[1];
  const { target } = event;
  const { commentid } = target.dataset;
  const response = await axios({
    url: `/api/${videoId}/comment/delete`,
    method: "POST",
    data: {
      commentid,
    },
  });
  if (response.status === 200) {
    removeComment(target);
  }
};

const init = () => {
  Array.from(deleteBtn).forEach(clickComment => {
    clickComment.addEventListener("click", getComment);
  });
};

if (deleteBtn) {
  init();
}
