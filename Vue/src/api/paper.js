import {
    ROOT,
    PAPER_CREATE,
    PAPER_EDIT,
    PAPER_DELETE,
    PAPER_GETALL,
    PAPER_GET_BY_ID,
    // PAPER_GET_BY_USERID,
  } from '@/api/constant.js'
  import { handleResponse } from '@/api/handle-response'
  import { requestOptions } from '@/api/request-options'
  
  function createPaper(data) {
    return fetch(ROOT + PAPER_CREATE, requestOptions.postBody(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function updatePaper(data) {
    return fetch(ROOT + PAPER_EDIT, requestOptions.put(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function deletePaper(data) {
    return fetch(ROOT + PAPER_DELETE + '?paperID=' + data, requestOptions.delete())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getPaperByID(data) {
    return fetch(ROOT + PAPER_GET_BY_ID + '?paperID=' + data, requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  // function getPaperByUserID(data) {
  //   return fetch(ROOT + PAPER_GET_BY_USERID + '?paper_userID=' + data, requestOptions.get())
  //     .then(handleResponse)
  //     .then(data => {
  //       return data
  //     })
  // }
  function getAllPaper() {
    return fetch(ROOT + PAPER_GETALL , requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  
  export const paper = {
      createPaper,
      updatePaper,
      deletePaper,
      getPaperByID,
      // getPaperByUserID,
      getAllPaper,
  }
  