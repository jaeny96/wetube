import axios from "axios";
import moment from "moment";

const commentContainer = document.getElementById("jsComment");
const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNum = document.getElementById("jsCommentNumber");

const getDate = () => {
  const curDate = new Date();
  return moment(curDate, "YYYYMMDD").fromNow();
};

const increaseNum = () => {
  commentNum.innerHTML = parseInt(commentNum.innerHTML) + 1;
};

const addCommentFake = (comment, userName) => {
  const li = document.createElement("li");
  const commentSpan = document.createElement("span");
  const userSpan = document.createElement("span");
  const dateSpan = document.createElement("span");
  commentSpan.innerHTML = comment;
  userSpan.innerHTML = userName;
  dateSpan.innerHTML = getDate();
  li.appendChild(commentSpan);
  li.appendChild(userSpan);
  li.appendChild(dateSpan);
  commentList.prepend(li);
  increaseNum();
};

const sendComment = async (comment, userName) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    addCommentFake(comment, userName);
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const commentUser = commentContainer.querySelector("span");

  const comment = commentInput.value;
  const userName = commentUser.textContent;

  sendComment(comment, userName);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
