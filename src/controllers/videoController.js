import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

// HOME

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    if (typeof req.user == "undefined") {
      res.render("home", { pageTitle: "Home", LoginUser: "", videos });
    } else {
      const {
        user: { name },
      } = req;
      res.render("home", {
        pageTitle: "Home",
        LoginUser: name,
        videos,
      });
    }
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

// SEARCH

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
    console.log(videos);
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

// Upload

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id,
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

// Video Detail

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id)
      .populate({
        path: "comments",
        populate: { path: "creator", model: "User" },
      })
      .populate({ path: "creator" });
    res.render("videoDetail", {
      pageTitle: video.title,
      video,
    });
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Edit Video

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator == req.user.id) {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    } else {
      throw Error();
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Delete Video

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

//Register View

export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
    res.end();
  } finally {
    res.end();
  }
};

//Add Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  console.log(req.body);
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

//delete Comment

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    body: { commentid },
  } = req;
  console.log(commentid);
  try {
    await Video.findById(id);
    await Comment.findByIdAndRemove({ _id: commentid });
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
