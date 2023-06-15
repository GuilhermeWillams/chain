import express, { json } from "express";
import multer from "multer";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import GetProfile from "./services/Get/getProfile";
import CreateUser from "./services/Post/createUser";
import Login from "./services/Post/login";
import UpdateProfilePhoto from "./services/Put/updateProfilePhoto";
import CreatePost from "./services/Post/createPost";
import CreateReply from "./services/Post/createReply";
import UpdateUser from "./services/Put/updateUser";
import DeleteScript from "./services/Delete/deleteScript";
import DeletePost from "./services/Delete/deletePost";
import DeleteReply from "./services/Delete/deleteReply";
import EditPost from "./services/Put/editPost";
import GetPost from "./services/Get/getPost";
import ReportedPosts from "./services/Get/reportedPosts";
import ReportedReplys from "./services/Get/reportedReplys";
import GetTopics from "./services/Get/getTopics";
import ListTopics from "./services/Get/listTopics";
import CreateTopic from "./services/Post/createTopic";
import UpdateTopic from "./services/Patch/updateTopic";
import DeleteTopic from "./services/Delete/deleteTopic";
import UserScripts from "./services/Get/userScripts";
import UserPosts from "./services/Get/userPosts";
import UserReplys from "./services/Get/userReplys";
import ReportPost from "./services/Patch/reportPost";
import ReportReply from "./services/Patch/reportReply";
import RemoveReportPost from "./services/Patch/removeReportPost";
import RemoveReportReply from "./services/Patch/removeReportReply";
import FilterForum from "./services/Get/filterForum";
import CreateScript from "./services/Post/createScript";

const app = express();
const port = process.env.PORT;
export const TOKEN_KEY = process.env.TOKEN_KEY || "";
export const CRYPTO_KEY = process.env.CRYPTO_KEY || "";

const upload = multer();

app.use(
  cors({
    origin: process.env.FRONT_URL,
  })
);

export const prisma = new PrismaClient({
  log: ["error"],
});

app.get("/profile/:nickname", async (request, response) => {
  const nickname = await GetProfile(request.params.nickname);
  return response.json(nickname);
});

app.get("/post/:id", upload.none(), async (request, response) => {
  const post = await GetPost(request.params.id);
  return response.json(post);
});

app.get("/reportedPosts", upload.none(), async (request, response) => {
  const reportedPosts = await ReportedPosts(request.query.pageNumber as string);
  return response.json(reportedPosts);
});

app.get("/reportedReplys", upload.none(), async (request, response) => {
  const reportedReplys = await ReportedReplys(
    request.query.pageNumber as string
  );
  return response.json(reportedReplys);
});

app.get("/topics", upload.none(), async (request, response) => {
  const topics = await GetTopics(request.query.pageNumber as string);
  return response.json(topics);
});

app.get("/listTopics", upload.none(), async (request, response) => {
  const topics = await ListTopics();
  return response.json(topics);
});

app.get("/userScripts/:userId", upload.none(), async (request, response) => {
  const userScripts = await UserScripts(
    request.params.userId,
    request.query.pageNumber as string
  );
  return response.json(userScripts);
});

app.get("/userPosts/:userId", upload.none(), async (request, response) => {
  const userPosts = await UserPosts(
    request.params.userId,
    request.query.pageNumber as string
  );
  return response.json(userPosts);
});

app.get("/userReplys/:userId", upload.none(), async (request, response) => {
  const userReplys = await UserReplys(
    request.params.userId,
    request.query.pageNumber as string
  );
  return response.json(userReplys);
});

app.get("/forum/:topic", upload.none(), async (request, response) => {
  const filterForum = await FilterForum(
    request.params.topic,
    request.query.pageNumber as string,
    request.query.searchTitle as string
  );
  return response.json(filterForum);
});

app.post("/createUser", upload.any(), async (request, response) => {
  const createUser = await CreateUser(request.body);
  return response.json(createUser);
});

app.post("/login", upload.none(), async (request, response) => {
  const login = await Login(request.body);
  return response.json(login);
});

app.post("/createPost", upload.none(), async (request, response) => {
  const post = await CreatePost(request.body);
  return response.json(post);
});

app.post("/reply", upload.none(), async (request, response) => {
  const reply = await CreateReply(request.body);
  return response.json(reply);
});

app.post("/createTopic/:userId", upload.none(), async (request, response) => {
  const createTopic = await CreateTopic(
    request.params.userId,
    request.body.topic
  );
  return response.json(createTopic);
});

app.post("/createScript/:userId", upload.none(), async (request, response) => {
  console.log(request.params.userId);
  const createScript = await CreateScript(request.body, request.params.userId);
  return response.json(createScript);
});

app.put(
  "/profilePhoto/:id",
  upload.single("photo"),
  async (request, response) => {
    const photo = await UpdateProfilePhoto(
      request.body.token,
      request.params.id,
      request.file
    );
    return response.send(photo);
  }
);

app.put("/updateUser", upload.none(), async (request, response) => {
  const user = await UpdateUser(request.body);
  return response.json(user);
});

app.put("/editPost/:id", upload.none(), async (request, response) => {
  const editPost = await EditPost(request.body, request.params.id);
  return response.json(editPost);
});

app.delete("/deleteScript/:id", upload.none(), async (request, response) => {
  const deleteScript = await DeleteScript(request.params.id);
  return response.json(deleteScript);
});

app.delete("/deletePost/:id", upload.none(), async (request, response) => {
  const deletePost = await DeletePost(request.params.id);
  return response.json(deletePost);
});

app.delete("/deleteReply/:id", upload.none(), async (request, response) => {
  const deleteReply = await DeleteReply(request.params.id);
  return response.json(deleteReply);
});

app.delete("/deleteTopic/:id", upload.none(), async (request, response) => {
  const deleteTopic = await DeleteTopic(request.params.id);
  return response.json(deleteTopic);
});

app.patch("/updateTopic/:id", upload.none(), async (request, response) => {
  const updateTopic = await UpdateTopic(request.params.id, request.body.topic);
  return response.json(updateTopic);
});

app.patch("/reportPost/:id", upload.none(), async (request, response) => {
  const reportPost = await ReportPost(request.params.id);
  return response.json(reportPost);
});

app.patch("/reportReply/:id", upload.none(), async (request, response) => {
  const reportReply = await ReportReply(request.params.id);
  return response.json(reportReply);
});
app.patch("/removeReportPost/:id", upload.none(), async (request, response) => {
  const removedReport = await RemoveReportPost(request.params.id);
  return response.json(removedReport);
});
app.patch(
  "/removeReportReply/:id",
  upload.none(),
  async (request, response) => {
    const removedReport = await RemoveReportReply(request.params.id);
    return response.json(removedReport);
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
