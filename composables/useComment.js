export default function useComment(aid, editApi) {
  const addCommentId = async (cid) => {
    await editApi({ _id: aid.value, $push: { comments: cid } })
  }
  
  const deleteCommentId =  async (cid) => {
    await editApi({ _id: aid.value, $pull: { comments: cid } })
  }
  
  return {
    addCommentId,
    deleteCommentId
  }
}