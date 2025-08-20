import axios from "@/utils/axios";

export const getComment = () => {
  return axios({
    url: "comment",
    method: "GET",
  });
};

export const createComment = (data:any) => {
  return axios({
    url: "comment/create",
    method: "POST",
    data,
  });
};

export const updateComment = (data:any) => {
  return axios({
    url: "comment/update",
    method: "POST",
    data,
  });
};

export const deleteComment = (data:any) => {
  return axios({
    url: "comment/delete",
    method: "POST",
    data,
  });
};



export default {
  getComment,
  createComment,
  updateComment,
  deleteComment,
};
